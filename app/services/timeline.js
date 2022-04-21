import Service from '@ember/service';
import { htmlSafe } from '@ember/template';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';

export default class TimelineService extends Service {
  @tracked minPixelsPerFrame = 10;

  // Get the scroll service
  @service('scroll') scroll;

  // Set the base width + height
  @tracked width = 1920;
  @tracked height = 1080;

  // Segments
  @tracked content = [];

  @tracked segments = [];
  @tracked calculatedWidth = -1;
  @tracked calculatedHeight = -1;

  @tracked timeline = [];
  @tracked current = null;
  @tracked next = null;

  // Constructor
  constructor() {
    super(...arguments);
  }

  get frame() {
    let documentHeight = Math.floor(
      Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      )
    );

    if (
      this.calculatedWidth != window.innerWidth ||
      this.calculatedHeight != documentHeight ||
      this.segments.length < 1
    ) {
      next(() => {
        // calculate the segments
        this.calculateSegments();
      });
    }
    let y = this.scroll.get('scrollY');
    for (let i = 0; i < this.timeline.length; i++) {
      let item = this.timeline[i];
      let next = undefined;
      if (i + 1 < this.timeline.length) {
        next = this.timeline[i + 1];
      }
      if (y >= item.scrollY && next && y < next.scrollY) {
        // Current
        let percentage = Math.min(
          1.0,
          Math.max(0.0, (y - item.scrollY) / (next.scrollY - item.scrollY))
        );
        let fr = item.frame + (next.frame - item.frame) * percentage;
        // Set the next and current items
        // eslint-disable-next-line ember/no-side-effects
        this.next = next;
        // eslint-disable-next-line ember/no-side-effects
        this.current = item;
        return Math.round(fr);
      } else if (y >= item.scrollY && !next) {
        return Math.round(item.frame);
      }
    }
    return -1;
  }

  get progress() {
    return Math.min(
      100,
      Math.max(
        0,
        (this.scroll.scrollY /
          (document.body.clientHeight - window.innerHeight * 0.5)) *
          100
      )
    );
  }

  get visible() {
    return this.frame > -1;
  }

  get top() {
    if (window.innerWidth <= 768) {
      return 74;
    }
    return 94;
  }

  get progressStyle() {
    return htmlSafe('top:' + this.progress + '%;');
  }

  get baseRatio() {
    if (this.scroll.get('innerWidth') < 0 || this.scroll.get('innerHeight') < 0)
      return 1;
    return Math.max(
      this.scroll.get('innerWidth') / this.width,
      (this.scroll.get('innerHeight') - this.top) / this.height
    );
  }

  get baseWidth() {
    return Math.ceil(this.width * this.baseRatio);
  }

  get baseHeight() {
    return Math.ceil(this.height * this.baseRatio);
  }

  getCurrentContent() {
    if (this.content.length > 0) {
      for (let i = 0; i < this.content.length; i++) {
        let coords = this.scroll.getCoords(this.content[i]);
        let top = Math.floor(
          coords.top - (window.innerHeight - coords.height) * 0.5
        );
        if (i == 0 && top > this.scroll.scrollY) {
          return null;
        } else if (top >= this.scroll.scrollY) {
          return this.content[i];
        }
      }
    }
    return null;
  }

  getNextContent() {
    if (this.content.length > 0) {
      let current = this.getCurrentContent();
      if (!current) {
        return this.content[0];
      }
      for (let i = 0; i < this.content.length; i++) {
        if (current == this.content[i]) {
          if (this.content.length > i + 1) {
            return this.content[i + 1];
          }
        }
      }
    }
    return null;
  }

  calculateSegments() {
    // Set the calculatedWidth and calculatedHeight
    this.calculatedWidth = window.innerWidth;
    this.calculatedHeight = Math.floor(
      Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      )
    );

    // Get all the segments
    if (this.segments.length < 1) {
      this.segments = [];
      [...document.getElementsByClassName('chapter-header')].forEach((item) => {
        // this.segments.push(item);
      });
      [...document.getElementsByClassName('chapter-part')].forEach((item) => {
        this.segments.push(item);
        if (!item.classList.contains('filler')) {
          this.content.push(item);
        }
      });
      [...document.getElementsByClassName('timeline-segment')].forEach(
        (item) => {
          this.segments.push(item);
        }
      );
    }
    this.timeline = [];
    this.segments.forEach((elem) => {
      let coords = this.scroll.getCoords(elem);
      if (elem.getAttribute('data-start')) {
        this.timeline.push({
          scrollY: coords.top,
          frame: parseFloat(elem.getAttribute('data-start')),
        });
      }
      if (elem.getAttribute('data-end')) {
        this.timeline.push({
          scrollY: coords.bottom,
          frame: parseFloat(elem.getAttribute('data-end')),
        });
      }
    });
    this.timeline.sort(function (item1, item2) {
      if (item1.scrollY >= item2.scrollY) {
        return 1;
      } else {
        return -1;
      }
    });
  }
}

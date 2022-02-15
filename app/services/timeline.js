import Service from '@ember/service';
import {
  htmlSafe
} from '@ember/template';
import {
  service
} from '@ember/service';
import {
  tracked
} from '@glimmer/tracking';
import {
  next
} from '@ember/runloop';

export default class TimelineService extends Service {

  // Get the scroll service
  @service('scroll') scroll;

  // Set the base width + height
  @tracked width = 960;
  @tracked height = 540;

  // Segments
  @tracked segments = [];
  @tracked segmentPositions = [];
  @tracked calculatedWidth = -1;

  // Constructor
  constructor() {
    super(...arguments);
  }

  get frame() {
    if (this.calculatedWidth != window.innerWidth || this.segments.length < 1) {
      next(() => {
        this.calculateSegments();
        this.calculatedWidth = window.innerWidth;
      });
    }
    let y = this.scroll.get('scrollY');
    // TODO: Create a calculation where I base the frame on the current active content
    let percentage = 0;
    let timeline = undefined;
    let minY = window.innerHeight;
    let maxY = 0;

    for (let i = 0; i < this.segmentPositions.length; i++) {
      let item = this.segmentPositions[i];
      if (item.timeline.start != undefined && item.timeline.end != undefined) {
        let next = undefined;
        for (let j = i + 1; j < this.segmentPositions.length; j++) {
          if (this.segmentPositions[j].timeline.start != undefined && this.segmentPositions[j].timeline.end != undefined) {
            next = this.segmentPositions[j];
            j = this.segmentPositions.length + 1;
          }
        }
        if (item.coords.top < minY) minY = item.coords.top;
        if (item.coords.bottom > maxY) maxY = item.coords.bottom;
        if (y >= item.coords.top && y <= item.coords.bottom) {
          i = this.segmentPositions + 1;
          percentage = (y - item.coords.top) / (item.coords.bottom - item.coords.top);
          timeline = item.timeline;
        } else if (next && y >= item.coords.bottom && y < next.coords.top) {
          percentage = (y - item.coords.bottom) / (next.coords.top - item.coords.bottom);
          timeline = {
            start: item.timeline.end,
            end: next.timeline.start,
          };
          i = this.segmentPositions + 1;
        }
      }
    }
    let fr = undefined;
    if (timeline != undefined) {
      fr = timeline.start + (timeline.end - timeline.start) * percentage;
    } else if (y <= minY || y >= maxY) {
      fr = -1;
    }
    return Math.round(fr);
  }

  get progress() {
    return Math.min(100, Math.max(0, (this.scroll.scrollY / (document.body.clientHeight - (window.innerHeight * 0.5))) * 100));
  }

  get progressStyle() {
    return htmlSafe('top:' + this.progress + '%;');
  }

  get baseRatio() {
    if (this.scroll.get('innerWidth') < 0 || this.scroll.get('innerHeight') < 0)
      return 1;
    return Math.max(
      this.scroll.get('innerWidth') / this.width,
      this.scroll.get('innerHeight') / this.height
    );
  }

  get baseWidth() {
    return this.width * this.baseRatio;
  }

  get baseHeight() {
    return this.height * this.baseRatio;
  }

  calculateSegments() {
    // Get all the segments
    if (this.segments.length < 1) {
      this.segments = [];
      [...document.getElementsByClassName('chapter-header')].forEach((item) => {
        this.segments.push(item);
      });
      [...document.getElementsByClassName('timeline-segment')].forEach((item) => {
        this.segments.push(item);
      });
    }
    this.segmentPositions = [];
    this.segments.forEach((elem) => {
      this.segmentPositions.push({
        elem: elem,
        timeline: {
          start: elem.getAttribute('data-start') ? parseFloat(elem.getAttribute('data-start')) : undefined,
          end: elem.getAttribute('data-end') ? parseFloat(elem.getAttribute('data-end')) : undefined,
        },
        coords: this.scroll.getCoords(elem),
      });
    });
  }

}

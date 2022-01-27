import Component from '@glimmer/component';
import {
  htmlSafe
} from '@ember/template';
import {
  tracked
} from '@glimmer/tracking';
import {
  action
} from '@ember/object';

export default class TimelineComponent extends Component {

  // Store some variables
  @tracked length = 0;
  @tracked pixelPerFrame = 12;

  // Store the scroll position + document size
  @tracked scrollY = -1;
  @tracked innerHeight = -1;
  @tracked innerWidth = -1;

  // Set the base width + height
  @tracked width = 960;
  @tracked height = 540;

  // Constructor
  constructor() {
    super(...arguments);
    this.length = this.calulateLength(this.args.segments);
  }

  // Create an requestAnimationFrame loop
  @action
  didInsert(element) {
    // Setup the request for syncing frames
    this.raf = window.requestAnimationFrame(() => {
      this.setScrollY(this);
    });
  }

  // Destroy the requestAnimationFrame loop
  @action
  willDestroy(element) {
    super.willDestroy(...arguments);
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
    }
  }

  setScrollY(context) {
    // Return when removed
    if (context.isDestroying || context.isDestroyed) return;

    // Look for a new scroll position
    if (
      window.scrollY != context.scrollY ||
      window.innerHeight != context.innerHeight ||
      window.innerWidth != context.innerWidth
    ) {
      // Store the new found position + document size
      context.scrollY = window.scrollY;
      context.innerWidth = window.innerWidth;
      context.innerHeight = window.innerHeight;
    }

    // Add a new requestAnimationFrame
    this.raf = window.requestAnimationFrame(() => {
      context.setScrollY(context);
    });
  }

  get frame() {
    return Math.floor(
      (this.length / (this.scrollHeight - this.innerHeight)) * this.scrollY
    );
  }

  get progress() {
    return Math.min(100, Math.max(0, (this.frame / this.length) * 100));
  }

  get scrollHeight() {
    return parseFloat(this.length) * parseFloat(this.pixelPerFrame);
  }

  get scrollHeightStyle() {
    return htmlSafe('height:' + this.scrollHeight + 'px;');
  }

  get progressStyle() {
    return htmlSafe('top:' + this.progress + '%;');
  }

  get baseRatio() {
    if (this.innerWidth < 0 || this.innerHeight < 0) return 1;
    return Math.max(
      this.innerWidth / this.width,
      this.innerHeight / this.height
    );
  }

  get baseWidth() {
    return this.width * this.baseRatio;
  }

  get baseHeight() {
    return this.height * this.baseRatio;
  }

  calulateLength(segments) {
    console.log('calulateLength', segments);
    let length = 0;
    for (let i = 0; i < segments.length; i++) {
      length = Math.max(
        length,
        parseFloat(segments[i]['start']) + parseFloat(segments[i]['length'])
      );
    }
    console.log('length', length);
    return length;
  }
}

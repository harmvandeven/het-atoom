import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TimelineComponent extends Component {
  // Store some variables
  @tracked length = 0;
  @tracked pixelPerFrame = 12;

  // Get the scroll service
  @service('scroll') scroll;

  // Set the base width + height
  @tracked width = 960;
  @tracked height = 540;

  // Constructor
  constructor() {
    super(...arguments);
    this.length = this.calulateLength(this.args.segments);
  }

  get frame() {
    let fr = Math.floor(
      (this.length / (this.scrollHeight - this.scroll.get('innerHeight'))) *
        this.scroll.get('scrollY')
    );
    return fr;
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

  calulateLength(segments) {
    let length = 0;
    for (let i = 0; i < segments.length; i++) {
      length = Math.max(
        length,
        parseFloat(segments[i]['start']) + parseFloat(segments[i]['length'])
      );
    }
    return length;
  }
}

import Component from '@glimmer/component';

export default class TimelineSegmentComponent extends Component {
  get visible() {
    let start = 0;
    let end = -1;
    if (this.args.start) start = parseFloat(this.args.start);
    if (this.args.end) end = parseFloat(this.args.end) - start;
    if (this.args.length) end = parseFloat(this.args.length);
    let currentFrame = parseFloat(this.args.frame) - start;
    if (currentFrame < 0) return false;
    if (end > -1 && currentFrame > end) return false;
    return true;
  }

  get computedFrame() {
    let start = 0;
    if (this.args.start) {
      start = parseFloat(this.args.start);
    }
    return parseFloat(this.args.frame) - start;
  }
}

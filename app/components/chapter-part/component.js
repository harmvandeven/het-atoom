import Component from '@glimmer/component';
import {
  htmlSafe
} from '@ember/template';
import {
  service
} from '@ember/service';

export default class ChapterPartComponent extends Component {
  @service('timeline') timeline;

  get style() {
    let frames = 0;
    if (
      this.args.model.timeline &&
      this.args.model.timeline.start != undefined &&
      this.args.model.timeline.end != undefined
    ) {
      frames = Math.abs(
        this.args.model.timeline.end - this.args.model.timeline.start
      );
    }
    let min = frames * this.timeline.minPixelsPerFrame;
    return htmlSafe('min-height:' + min + 'px;');
  }
}

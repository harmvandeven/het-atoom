import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';

export default class IntroComponent extends Component {
  @service('scroll') scroll;
  @service('timeline') timeline;

  get illustrationStyle() {
    let width = Math.min(window.innerHeight, window.innerWidth) - 200;
    return htmlSafe('max-width:' + width + 'px;');
  }

  @action userStarted() {
    this.scroll.startByUser();
    let elem = this.timeline.getNextContent();
    let coords = this.scroll.getCoords(elem);
    let top = coords.top - (window.innerHeight - coords.height) * 0.5;
    if (coords.height > window.innerHeight - 200) {
      top = coords.top - 110;
    }
    this.scroll.to({
      position: top,
    });
  }
}

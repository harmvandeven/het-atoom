import Component from '@glimmer/component';
import {
  htmlSafe
} from '@ember/template';

export default class IntroComponent extends Component {

  get illustrationStyle() {
    let width = Math.min(window.innerHeight, window.innerWidth) - 200;
    return htmlSafe('max-width:' + width + 'px;');
  }

}

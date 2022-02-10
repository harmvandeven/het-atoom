import Component from '@glimmer/component';
import {
  action
} from '@ember/object';
import {
  tracked
} from '@glimmer/tracking';
import {
  service
} from '@ember/service';

export default class HeaderComponent extends Component {

  @service('scroll') scroll;
  @tracked menuOpen = false;


  @action toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  get scrollY() {
    return 'a + ' + this.scroll.get('scrollY');
  }

  get menuClass() {
    if (this.menuOpen) return 'menu-open';
    return 'menu-closed';
  }
}

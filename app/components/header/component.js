import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class HeaderComponent extends Component {
  @tracked menuOpen = false;

  @action toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  get menuClass() {
    if (this.menuOpen) return 'menu-open';
    return 'menu-closed';
  }
}

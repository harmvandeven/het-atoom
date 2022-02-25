import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MenuService extends Service {
  @tracked isOpen = false;

  open() {
    this.isOpen = true;
    document.body.classList.add('menu-open');
  }

  close() {
    this.isOpen = false;
    document.body.classList.remove('menu-open');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MenuService extends Service {
  @tracked isOpen = false;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

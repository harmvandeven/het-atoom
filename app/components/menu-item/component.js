import Component from '@glimmer/component';
import {
  dasherize
} from '@ember/string';

export default class MenuItemComponent extends Component {

  get route() {
    if (this.args.index == 0) {
      return 'index';
    }
    if (this.args.model.parts) {
      return 'chapter';
    }
    return false;
  }

  get link() {
    if (this.args.index == 0) {
      return false;
    }
    if (this.args.model.parts) {
      return dasherize(this.args.model.id + '-' + this.args.model.title);
    }
    return false;
  }

}

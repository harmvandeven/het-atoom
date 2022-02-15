import Component from '@glimmer/component';
import { dasherize } from '@ember/string';

export default class MenuItemComponent extends Component {
  get route() {
    if (this.args.index == 0 || this.args.model.parts) {
      return 'chapter';
    }
    return false;
  }

  get link() {
    if (this.args.index == 0) {
      // return false;
    }
    if (this.args.model.parts || this.args.index == 0) {
      let dashed = dasherize(this.args.model.title);
      if (this.args.model.id != '-') {
        dashed = this.args.model.id + '-' + dashed;
      }
      return dashed;
    }
    return false;
  }
}

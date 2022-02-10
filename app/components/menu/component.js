import Component from '@glimmer/component';
import { dasherize } from '@ember/string';

export default class MenuComponent extends Component {
  get menuClass() {
    if (this.args.isOpen) return 'opened';
    return 'closed';
  }
}

import Component from '@glimmer/component';

export default class MenuComponent extends Component {
  get menuClass() {
    if (this.args.isOpen) return 'opened';
    return 'closed';
  }
}

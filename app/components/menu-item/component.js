import Component from '@glimmer/component';

export default class MenuItemComponent extends Component {
  get route() {
    if (this.args.index == 0 || this.args.model.parts) {
      return 'chapter';
    }
    return false;
  }
}

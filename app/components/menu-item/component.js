import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class MenuItemComponent extends Component {
  @service('content') content;
  @service('menu') menu;
  @service('scroll') scroll;

  get route() {
    if (this.args.index == 0 || this.args.model.parts) {
      return 'chapter';
    }
    return false;
  }

  @action
  clickButton() {
    if (this.args.model.hash) {
      // Get the chapter
      let chapter = this.content.getChapterById(this.args.model.hash);

      // Close the menu
      this.menu.close();

      if (chapter.index != undefined) {
        let elem = document.getElementById('chapter-header-' + chapter.index);
        if (chapter.index == 0) {
          this.scroll.to({
            position: 0,
          });
        } else {
          this.scroll.to({
            element: elem,
            offset: 32,
          });
        }
      }
    }
  }
}

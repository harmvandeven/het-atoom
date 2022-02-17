import Route from '@ember/routing/route';
import {
  service
} from '@ember/service';

export default class ChapterRoute extends Route {

  @service('content') content;
  @service('menu') menu;
  @service('scroll') scroll;

  model({
    chapter_id
  }) {

    let chapter = this.content.getChapterById(chapter_id);

    // Close the menu
    this.menu.close();

    if (chapter.index != undefined) {
      let elem = document.getElementById('chapter-header-' + chapter.index);
      if (chapter.index == 0) {
        this.scroll.to(undefined, 0);
      } else {
        this.scroll.to(elem);
      }
    }

    return {
      pageTitle: name,
    };
  }
}

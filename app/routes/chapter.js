import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { next } from '@ember/runloop';

export default class ChapterRoute extends Route {
  @service('content') content;
  @service('menu') menu;
  @service('scroll') scroll;

  model({ chapter_id }) {
    let chapter = this.content.getChapterById(chapter_id);

    // Close the menu
    this.menu.close();

    // Only scroll to the element when it is not a replacedState
    next(() => {
      if (!this.scroll.isReplacedState) {
        if (chapter.index != undefined) {
          let elem = document.getElementById('chapter-header-' + chapter.index);
          if (chapter.index == 0) {
            this.scroll.to({ position: 0 });
          } else {
            this.scroll.to({ element: elem });
          }
        }
      }
    });

    return {
      pageTitle: chapter.pageTitle,
    };
  }
}

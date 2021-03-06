import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { next } from '@ember/runloop';

export default class ChapterRoute extends Route {
  @service('content') content;
  @service('menu') menu;
  @service('scroll') scroll;
  @service('splash') splash;

  model({ chapter_id }) {
    // This is all old code.
    // It is decided not to use direct links any more
    // let chapter = this.content.getChapterById(chapter_id);
    // // Close the menu
    // this.menu.close();
    // // Only scroll to the element when it is not a replacedState
    // next(() => {
    //   if (!this.scroll.isReplacedState) {
    //     if (chapter.index != undefined) {
    //       let elem = document.getElementById('chapter-header-' + chapter.index);
    //       if (chapter.index == 0) {
    //         this.scroll.to({
    //           position: 0,
    //         });
    //       } else {
    //         if (chapter.index > 0 && !this.scroll.isUserStarted) {
    //           // Show the splash
    //           this.splash.show();
    //         }
    //         this.scroll.to({
    //           element: elem,
    //           offset: 100,
    //         });
    //       }
    //     }
    //   }
    // });
    // return {
    //   pageTitle: chapter.pageTitle,
    // };
    return;
  }
}

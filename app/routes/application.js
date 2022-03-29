import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service('content') content;
  @service('environment') environment;
  @service('timeline') timeline;
  @service('scroll') scroll;

  async model() {
    if (window.location.hash) {
      later(() => {
        let chapter = this.content.getChapterById(
          window.location.hash.substring(1)
        );
        if (chapter && chapter.index != undefined) {
          let elem = document.getElementById('chapter-header-' + chapter.index);
          this.scroll.to({ element: elem });
          this.scroll.active = true;
        }
      }, 1000);
    }

    return {
      chaptersContent: this.content.getChapters(),
      splash: this.content.getSplash(),
      timelineContent: this.content.getTimeline(),
      scroll: this.scroll,
      timeline: this.timeline,
      environment: this.environment,
    };
  }
}

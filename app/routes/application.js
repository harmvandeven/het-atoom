import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service('content') content;
  @service('environment') environment;
  @service('timeline') timeline;
  @service('scroll') scroll;

  async model() {
    if (history && history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }
    window.onbeforeunload = function () {
      if (window.scrollTo) {
        window.scrollTo(0, 0);
      }
    };

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

import Route from '@ember/routing/route';
import showdown from 'showdown';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service('content') content;

  async model() {
    return {
      chapters: this.content.getChapters(),
      timeline: this.content.getTimeline(),
    };
  }
}

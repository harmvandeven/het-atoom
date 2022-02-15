import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service('content') content;
  @service('timeline') timeline;

  async model() {
    return {
      chapters: this.content.getChapters(),
      timeline: this.timeline,
    };
  }
}

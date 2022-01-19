import Route from '@ember/routing/route';
import showdown from 'showdown';
import {
  service
} from '@ember/service';

export default class IndexRoute extends Route {

  @service('content') content;

  async model() {
    return {
      catalogue: this.content.getCatalogue(),
      stories: this.content.getStories(),
      frames: this.content.getFrames(),
    };
  }
}

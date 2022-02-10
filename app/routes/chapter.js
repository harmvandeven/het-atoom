import Route from '@ember/routing/route';
import showdown from 'showdown';
import { service } from '@ember/service';

export default class ChapterRoute extends Route {
  @service('content') content;

  model() {
    return 'ha';
  }
}

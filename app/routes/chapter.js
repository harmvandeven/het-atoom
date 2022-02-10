import Route from '@ember/routing/route';
import { dasherize } from '@ember/string';
import { service } from '@ember/service';

export default class ChapterRoute extends Route {
  @service('content') content;

  model({ chapter_id }) {
    let id = chapter_id.split('-')[0].toUpperCase();
    let name = chapter_id;

    this.content.getChapters().every((item) => {
      let dashed = dasherize(item.title);
      if (item.id != '-') {
        dashed = item.id + '-' + dashed;
      }
      if (dashed == chapter_id) {
        id = item.id.toUpperCase();
        name = item.title;
        return false;
      }
      return true;
    });

    if (id && id != '-') {
      name = id + ': ' + name;
    }

    return {
      pageTitle: name,
    };
  }
}

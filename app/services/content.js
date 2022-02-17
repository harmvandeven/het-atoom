import Service from '@ember/service';
import {
  A
} from '@ember/array';
import {
  dasherize
} from '@ember/string';
import chapters from 'het-atoom/content/data/chapters';

export default class ContentService extends Service {
  getChapters() {
    let items = A();
    chapters.forEach((item, index) => {
      item.index = index;
      item.hash = dasherize(item.title);
      item.pageTitle = item.title;
      if (item.id != '-') {
        item.hash = item.id + '-' + item.hash;
        item.pageTitle = item.id.toUpperCase() + ': ' + item.pageTitle;
      }
      if (index == 0) {
        item.pageTitle = undefined;
      }
      items.push(item);
    });
    return items;
  }

  getChapterById(chapter_id = undefined) {
    let chapters = this.getChapters();
    for (let i = 0; i < chapters.length; i++) {
      if (chapters[i].hash == chapter_id) {
        return chapters[i];
      }
    }
    return null;
  }

}

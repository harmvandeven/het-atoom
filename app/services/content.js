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

    // TODO: Calculate the pageName here

    return chapters;
  }

  getChapterById(chapter_id = undefined) {
    console.log(chapter_id);

    let id = chapter_id.split('-')[0].toUpperCase();
    let name = chapter_id;

    let chapters = this.getChapters();
    let index = undefined;
    let item = {};

    for (let i = 0; i < chapters.length; i++) {
      item = chapters[i];
      let dashed = dasherize(item.title);
      if (item.id != '-') {
        dashed = item.id + '-' + dashed;
      }
      if (dashed == chapter_id) {
        index = i;
        id = item.id.toUpperCase();
        name = item.title;
        i = chapters.length + 1;
      }
    }

    if (id && id != '-') {
      name = id + ': ' + name;
    }

    item.pageName = name;
    item.index = index;
    return item;


  }

}

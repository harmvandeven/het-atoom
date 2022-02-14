import Service from '@ember/service';
import {
  A
} from '@ember/array';
import chapters from 'het-atoom/content/data/chapters';

export default class ContentService extends Service {
  getChapters() {
    return chapters;
  }


}

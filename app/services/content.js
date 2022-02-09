import Service from '@ember/service';
import { A } from '@ember/array';
import chapters from 'het-atoom/content/data/chapters';
import timeline from 'het-atoom/content/development/timeline';

export default class ContentService extends Service {
  getChapters() {
    return chapters;
  }

  getTimeline() {
    return timeline;
  }
}

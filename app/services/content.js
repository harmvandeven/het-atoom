import Service from '@ember/service';
import {
  A
} from '@ember/array';
import catalogue from 'het-atoom/content/data/catalogue';
import story0 from 'het-atoom/content/stories/0-introduction';
import storyA from 'het-atoom/content/stories/a-entrance';

export default class ContentService extends Service {

  getCatalogue() {
    return catalogue;
  }

  getStories() {
    return A([story0, storyA]);
  }


  getFrames() {
    let array = A([]);
    this.getCatalogue().forEach((item) => {
      if (item.frame != null) {
        array.push(item.frame);
      }
    });
    return array;
  }

}

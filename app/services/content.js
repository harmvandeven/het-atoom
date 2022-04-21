import Service from '@ember/service';
import { A } from '@ember/array';
import { dasherize } from '@ember/string';
import chapters from 'het-atoom/content/data/chapters';
import splash from 'het-atoom/content/data/splash';
import timeline from 'het-atoom/content/data/timeline';

export default class ContentService extends Service {

  getSplash() {
    return splash;
  }

  getTimeline() {
    let parts = A();
    for (let i = 0; i < timeline.parts.length; i++) {
      let item = timeline.parts[i];
      parts.push(item);
    }
    timeline.parts = parts;
    return timeline;
  }

  getChapters() {
    let items = A();

    let end = -1;
    let fillerIndex = 0;

    for (let c = 0; c < chapters.length; c++) {
      let item = this.parseChapter(chapters[c], c);
      if (item.parts) {
        let parts = A();
        for (let i = 0; i < item.parts.length; i++) {
          let part = item.parts[i];
          if (part.timeline.start > end) {
            parts.push({
              id: 'Filler ' + fillerIndex,
              class: 'filler',
              timeline: {
                start: end,
                end: part.timeline.start,
              },
            });
            end = part.timeline.start;
            fillerIndex++;
          }
          parts.push(part);
        }
        if (c < chapters.length - 1) {
          if (
            chapters[c + 1].timeline &&
            chapters[c + 1].timeline.start &&
            chapters[c + 1].timeline.start > end
          ) {
            parts.push({
              id: 'Filler ' + fillerIndex,
              class: 'filler',
              timeline: {
                start: end,
                end: chapters[c + 1].timeline.start,
              },
            });
            end = chapters[c + 1].timeline.start;
            fillerIndex++;
          } else if (
            (!chapters[c + 1].timeline || !chapters[c + 1].timeline.start) &&
            chapters[c + 1].parts &&
            chapters[c + 1].parts.length > 0
          ) {
            if (chapters[c + 1].parts[0].timeline.start > end) {
              parts.push({
                id: 'Filler ' + fillerIndex,
                class: 'filler',
                timeline: {
                  start: end,
                  end: chapters[c + 1].parts[0].timeline.start,
                },
              });
              end = chapters[c + 1].parts[0].timeline.start;
              fillerIndex++;
            }
          }
        }
        item.parts = parts;
      }
      items.push(item);
    }
    return items;
  }

  getChapterById(chapter_id = undefined) {
    for (let c = 0; c < chapters.length; c++) {
      let item = this.parseChapter(chapters[c], c);
      if (item.hash == chapter_id || (c == 0 && chapter_id == '/het-atoom/')) {
        return item;
      }
    }
    return null;
  }

  parseChapter(item, index = 0) {
    item.index = index;
    item.hash = dasherize(item.title.replace(/['"]+/g, ''));
    item.pageTitle = item.title;
    if (item.id != '-') {
      item.hash = item.id + '-' + item.hash;
      item.pageTitle = item.id.toUpperCase() + ': ' + item.pageTitle;
    }
    if (index == 0) {
      item.pageTitle = undefined;
    }
    return item;
  }
}

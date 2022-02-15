import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ScrollService extends Service {
  // Store the scroll position + document size
  @tracked scrollY = -1;
  @tracked innerHeight = -1;
  @tracked innerWidth = -1;

  // Constructor
  constructor() {
    super(...arguments);

    this.raf = window.requestAnimationFrame(() => {
      this.setScrollY(this);
    });
  }

  setScrollY(context) {
    // Return when removed
    if (context.isDestroying || context.isDestroyed) return;

    // Look for a new scroll position
    if (
      window.scrollY != context.scrollY ||
      window.innerHeight != context.innerHeight ||
      window.innerWidth != context.innerWidth
    ) {
      // Store the new found position + document size
      context.scrollY = window.scrollY;
      context.innerWidth = window.innerWidth;
      context.innerHeight = window.innerHeight;
    }

    // Add a new requestAnimationFrame
    this.raf = window.requestAnimationFrame(() => {
      context.setScrollY(context);
    });
  }

  getCoords(elem) {
    // crossbrowser version
    let box = elem.getBoundingClientRect();

    let body = document.body;
    let docEl = document.documentElement;

    let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    let clientTop = docEl.clientTop || body.clientTop || 0;
    let clientLeft = docEl.clientLeft || body.clientLeft || 0;

    let top = box.top + scrollTop - clientTop;
    let left = box.left + scrollLeft - clientLeft;
    let bottom = top + box.height;
    let right = left + box.width;

    return {
      top: Math.round(top),
      left: Math.round(left),
      bottom: Math.round(bottom),
      right: Math.round(right),
    };
  }
}

import Service from '@ember/service';
import {
  service
} from '@ember/service';
import {
  tracked
} from '@glimmer/tracking';
import {
  later,
  next
} from '@ember/runloop';

export default class ScrollService extends Service {
  @service('environment') environment;
  @service('router') router;

  // Store the scroll position + document size
  @tracked scrollY = -1;
  @tracked innerHeight = -1;
  @tracked innerWidth = -1;

  @tracked active = false;
  @tracked isReplacedState = false;

  @tracked transitionTop = 0;
  @tracked tranisitonInitialTop = 0;
  @tracked tranistionRuntime = 0;
  @tracked transitionDuration = 0;

  autoScrollSpeed = 5000000;

  // Constructor
  constructor() {
    super(...arguments);

    this.raf = window.requestAnimationFrame(() => {
      this.setScrollY(this);
    });

    if (this.environment.config.environment === 'pi') {
      later(() => {
        console.log('autscroll');
        this.to(undefined, -1, this.autoScrollSpeed);
      }, 1000);
    }

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
      if (context.tranistionRuntime < context.transitionDuration) {
        context.setTransition(context);
      }
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

  to(elem = undefined, top = undefined, duration = undefined) {
    if (top !== undefined && top < 0) {
      elem = document.querySelectorAll('li.chapter:nth-last-of-type(1)');
      top = this.getCoords(elem[0]).bottom;
    } else if (elem != undefined) {
      top = this.getCoords(elem).top;
    }
    if (top != undefined) {
      this.tranistionRuntime = 0;
      this.transitionTop = top;
      this.tranisitonInitialTop = this.scrollY;
      this.transitionStartTime = new Date().getTime();
      if (duration == undefined) {
        duration = Math.min(5000, Math.abs(this.transitionTop - this.tranisitonInitialTop) * 0.33);
      }
      this.transitionDuration = duration;
    }
  }

  easeOutCubic(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
  }

  easeLinear(t, b, c, d) {
    return c * (t / d) + b;
  }

  setTransition(context) {
    let currentTime = new Date().getTime();
    this.tranistionRuntime = currentTime - context.transitionStartTime;

    let val = this.easeLinear(
      this.tranistionRuntime,
      context.tranisitonInitialTop,
      context.transitionTop - context.tranisitonInitialTop,
      context.transitionDuration
    );
    window.scroll(0, val);
  }

  replaceState(chapter = {}) {
    if (window.location.hash != '#/' + chapter.hash && !this.isReplacedState) {
      if (chapter.hash != '/het-atoom/' || window.location.hash) {
        next(() => {
          this.isReplacedState = true;
          this.router.transitionTo('chapter', chapter.hash);
          later(() => {
            this.isReplacedState = false;
          }, 250);
        });
      }
    }
  }
}

import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { cancel, later, next } from '@ember/runloop';

export default class ScrollService extends Service {
  @service('environment') environment;
  @service('router') router;

  // Store the scroll position + document size
  @tracked scrollY = -1;
  @tracked innerHeight = -1;
  @tracked innerWidth = -1;

  @tracked active = false;
  @tracked isReplacedState = false;

  @tracked inTransition = false;
  @tracked inAutoTransition = false;
  @tracked transitionTargetTop = 0;
  @tracked tranisitonInitialTop = 0;
  @tracked tranistionRuntime = 0;
  @tracked transitionDuration = 0;

  // TODO: Scroll between content. not at a fixed speed
  idleTimer = null;
  autoScrollSpeed = 500000;
  autoScrollDelay = 1000;

  // Constructor
  constructor() {
    super(...arguments);

    this.raf = window.requestAnimationFrame(() => {
      this.setScrollY(this);
    });

    if (this.environment.config.environment === 'pi') {
      document.addEventListener('mousedown', () => {
        this.clearIdleTimer(this);
        this.cancelTransition(this);
      });
      document.addEventListener('mousemove', () => {
        this.clearIdleTimer(this);
      });
      document.addEventListener('keypress', () => {
        this.clearIdleTimer(this);
        this.cancelTransition(this);
      });
      document.addEventListener('touchstart', () => {
        this.clearIdleTimer(this);
        this.cancelTransition(this);
      });
      document.addEventListener('touchmove', () => {
        this.clearIdleTimer(this);
        this.cancelTransition(this);
      });
      document.addEventListener('wheel', () => {
        this.clearIdleTimer(this);
        this.cancelTransition(this);
      });
      document.addEventListener('scroll', () => {
        this.clearIdleTimer(this, true);
      });
      this.clearIdleTimer(this);
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
      if (context.inTransition || context.inAutoTransition) {
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

  to(
    elem = undefined,
    top = undefined,
    duration = undefined,
    autoplay = false
  ) {
    if (top !== undefined && top < 0) {
      elem = document.querySelectorAll('li.chapter:nth-last-of-type(1)');
      top = this.getCoords(elem[0]).bottom;
    } else if (elem != undefined) {
      top = this.getCoords(elem).top;
    }
    if (top != undefined) {
      this.tranistionRuntime = 0;
      this.tranisitonInitialTop = this.scrollY;
      this.transitionTargetTop = top;
      this.transitionStartTime = new Date().getTime();
      if (duration == undefined) {
        duration = Math.min(
          5000,
          Math.abs(this.transitionTargetTop - this.tranisitonInitialTop) * 0.33
        );
      }
      this.transitionDuration = duration;
      if (autoplay) {
        this.inTransition = false;
        this.inAutoTransition = true;
      } else {
        this.inTransition = true;
        this.inAutoTransition = false;
      }
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
    context.tranistionRuntime = currentTime - context.transitionStartTime;
    if (context.tranistionRuntime >= context.transitionDuration) {
      context.inTransition = false;
      context.inAutoTransition = false;
      context.clearIdleTimer(context);
    }
    let val = this.easeLinear(
      this.tranistionRuntime,
      context.tranisitonInitialTop,
      context.transitionTargetTop - context.tranisitonInitialTop,
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

  cancelTransition(context) {
    context.inTransition = false;
  }

  clearIdleTimer(context, isScrollEvent = false) {
    if (!isScrollEvent) {
      context.inAutoTransition = false;
    }
    if (context.idleTimer) {
      cancel(context.idleTimer);
    }
    context.idleTimer = later(() => {
      if (context.inTransition) {
        context.clearIdleTimer(context);
      } else {
        context.to(undefined, -1, context.autoScrollSpeed, true);
      }
    }, context.autoScrollDelay);
  }
}

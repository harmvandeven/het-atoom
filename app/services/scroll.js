import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { cancel, later, next } from '@ember/runloop';

export default class ScrollService extends Service {
  @service('environment') environment;
  @service('router') router;
  @service('timeline') timeline;

  // Store the scroll position + document size
  @tracked scrollY = -1;
  @tracked innerHeight = -1;
  @tracked innerWidth = -1;

  @tracked active = false;
  @tracked isReplacedState = false;

  @tracked inTransition = false;
  @tracked inAutoTransition = false;
  @tracked tranistionLater = null;
  @tracked transitionTargetTop = 0;
  @tracked tranisitonInitialTop = 0;
  @tracked tranistionRuntime = 0;
  @tracked transitionDuration = 0;
  @tracked transitionEase = 'easeOutSine';

  idleTimer = null;
  autoScrollDelay = 10000;

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
      height: box.height,
      width: box.width,
    };
  }

  to(params = {}) {
    let currParams = params;
    if (Array.isArray(params)) {
      currParams = params.shift();
    }

    let top = undefined;
    if (currParams.position !== undefined && currParams.position < 0) {
      top = document.body.clientHeight - window.innerHeight * 0.5;
    } else if (currParams.element != undefined) {
      top = this.getCoords(currParams.element).top;
    } else if (currParams.position !== undefined) {
      top = currParams.position;
    }
    if (params.offset) {
      top += params.offset;
    }

    let duration = undefined;
    if (currParams.duration) duration = currParams.duration;
    let autoplay = false;
    if (currParams.autoplay) autoplay = currParams.autoplay;

    if (top != undefined) {
      this.tranistionRuntime = 0;
      this.tranisitonInitialTop = this.scrollY;
      this.transitionStartTime = new Date().getTime();
      this.transitionTargetTop = top;
      this.transitionEase = currParams.ease ? currParams.ease : 'easeOutSine';
      if (duration == undefined) {
        duration = Math.min(
          5000,
          Math.abs(this.transitionTargetTop - this.tranisitonInitialTop) * 0.33
        );
        if (autoplay) {
          duration =
            Math.abs(this.transitionTargetTop - this.tranisitonInitialTop) *
            (this.transitionEase == 'easeLinear' ? 15.0 : 6.0);
        }
      }
      this.transitionDuration = duration;
      if (autoplay) {
        this.inTransition = false;
        this.inAutoTransition = true;
      } else {
        this.inTransition = true;
        this.inAutoTransition = false;
      }
      if (Array.isArray(params) && params.length > 0) {
        this.tranistionLater = later(() => {
          this.to(params);
        }, duration + this.autoScrollDelay * 0.5);
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

  easeOutSine(t, b, c, d) {
    // t = runtime
    // b = intial pos
    // c = distance
    // d = duration
    let x = Math.max(0, Math.min(1, t / d));
    let progress = Math.sin((x * Math.PI) / 2);
    if (x == 0 || x == 1) {
      progress = x;
    }
    return b + c * progress;
  }

  setTransition(context) {
    let currentTime = new Date().getTime();
    context.tranistionRuntime = currentTime - context.transitionStartTime;
    if (context.tranistionRuntime >= context.transitionDuration) {
      context.inTransition = false;
      context.inAutoTransition = false;
      context.clearIdleTimer(context);
    }
    let val = undefined;
    if (context.transitionEase == 'easeOutSine') {
      val = this.easeOutSine(
        this.tranistionRuntime,
        context.tranisitonInitialTop,
        context.transitionTargetTop - context.tranisitonInitialTop,
        context.transitionDuration
      );
    } else if (context.transitionEase == 'easeOutCubic') {
      val = this.easeOutCubic(
        this.tranistionRuntime,
        context.tranisitonInitialTop,
        context.transitionTargetTop - context.tranisitonInitialTop,
        context.transitionDuration
      );
    } else {
      val = this.easeLinear(
        this.tranistionRuntime,
        context.tranisitonInitialTop,
        context.transitionTargetTop - context.tranisitonInitialTop,
        context.transitionDuration
      );
    }
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
    if (context.tranistionLater) {
      cancel(context.tranistionLater);
    }
  }

  clearIdleTimer(context, isScrollEvent = false) {
    if (!isScrollEvent) {
      context.inAutoTransition = false;
    }
    if (context.idleTimer) {
      cancel(context.idleTimer);
    }
    if (this.environment.config.environment === 'pi') {
      context.idleTimer = later(() => {
        if (context.inTransition) {
          context.clearIdleTimer(context);
        } else {
          let elem = this.timeline.getNextContent();
          if (elem) {
            // console.log(elem.getAttribute('data-id'));
            let coords = this.getCoords(elem);
            let top = coords.top - (window.innerHeight - coords.height) * 0.5;
            if (coords.height > window.innerHeight - 200) {
              context.to([
                {
                  position: coords.top - 110,
                  autoplay: true,
                },
                {
                  position: coords.bottom - window.innerHeight + 20,
                  autoplay: true,
                  ease: 'easeLinear',
                },
              ]);
            } else {
              context.to({
                position: top,
                autoplay: true,
              });
            }
          } else {
            // context.to({ position: 0, autoplay: true });
            document.documentElement.scrollTop = 0;
          }
        }
      }, context.autoScrollDelay);
    }
  }
}

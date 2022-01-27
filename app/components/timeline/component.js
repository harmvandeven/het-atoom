import Component from '@glimmer/component';
import {
  tracked
} from '@glimmer/tracking';
import {
  action
} from '@ember/object';

export default class TimelineComponent extends Component {

  // Store the current frame
  @tracked length = 400;
  @tracked pixelPerFrame = 12;

  // Store the scroll position + document size
  @tracked scrollY = -1;
  @tracked innerHeight = -1;
  @tracked documentHeight = -1;

  @action
  didInsert(element) {
    // Setup the request for syncing frames
    this.raf = window.requestAnimationFrame(() => {
      this.setScrollY(this);
    });
  }

  @action
  willDestroy(element) {
    super.willDestroy(...arguments);
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
    }
  }

  setScrollY(context) {

    // Return when removed
    if (context.isDestroying || context.isDestroyed) return;

    // Look for a new scroll position
    if (
      window.scrollY != context.scrollY ||
      window.innerHeight != context.innerHeight ||
      document.body.clientHeight != context.documentHeight
    ) {
      // Store the new found position + document size
      context.scrollY = window.scrollY;
      context.innerHeight = window.innerHeight;
      context.documentHeight = document.body.clientHeight;
    }

    // Add a new requestAnimationFrame
    this.raf = window.requestAnimationFrame(() => {
      context.setScrollY(context);
    });
  }

  get height() {
    return this.length * this.pixelPerFrame;
  }

  get frame() {
    return Math.floor(
      (this.length / (this.height - this.innerHeight)) *
      this.scrollY
    );
  }

  get progress() {
    return Math.min(100, Math.max(0, (this.frame / this.length) * 100));
  }

}

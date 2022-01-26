import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TimelineComponent extends Component {
  // Store the current frame
  @tracked frame = 0;
  @tracked length = 400;

  // Store the scroll position + document size
  @tracked scrollY = -1;
  @tracked innerHeight = -1;
  @tracked documentHeight = -1;

  @action
  didInsert(element) {
    // Setup the request for syncing frames
    this.raf = window.requestAnimationFrame(() => {
      this.setFrame(this);
    });
  }

  @action
  willDestroy(element) {
    super.willDestroy(...arguments);
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
    }
  }

  setFrame(context) {
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

      // Calculate the current frame
      let frame = Math.floor(
        (context.length / (context.documentHeight - context.innerHeight)) *
          context.scrollY
      );
      if (frame != context.frame) {
        context.frame = frame;
      }
    }

    // Add a new requestAnimationFrame
    this.raf = window.requestAnimationFrame(() => {
      context.setFrame(context);
    });
  }
}

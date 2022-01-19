import Component from '@glimmer/component';
import {
  tracked
} from '@glimmer/tracking';
import {
  action
} from '@ember/object';

export default class VideoPlayerComponent extends Component {

  @tracked time = "00:00";
  @tracked duration = -1;
  @tracked isPlaying = false;
  @tracked scrollY = -1;
  @tracked innerHeight = -1;
  @tracked documentHeight = -1;
  @tracked frame = 0;

  @tracked player = null;
  @tracked readyForUpdate = true;

  @action
  didInsert(element) {
    // Setup the video player
    this.player = element;
    this.player.removeAttribute('controls');
    this.player.muted = "muted";

    // Setup the request for syncing frames
    this.raf = window.requestAnimationFrame(() => {
      this.setFrame(this.player, this);
    });
  }

  @action
  willDestroy(element) {
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
    }
  }

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }

  @action
  setTime(evt) {

    let minutes = Math.floor(evt.target.currentTime / 60);
    let seconds = Math.floor(evt.target.currentTime - minutes * 60);
    let minuteValue;
    let secondValue;

    if (minutes < 10) {
      minuteValue = '0' + minutes;
    } else {
      minuteValue = minutes;
    }

    if (seconds < 10) {
      secondValue = '0' + seconds;
    } else {
      secondValue = seconds;
    }
    this.duration = evt.target.duration;
    this.time = minuteValue + ':' + secondValue;

    // Set can update
    this.readyForUpdate = true;

    // let barLength = timerWrapper.clientWidth * (evt.target.currentTime / evt.target.duration);
    // timerBar.style.width = barLength + 'px';

  }

  setFrame(player, context) {
    if (context.isDestroying || context.isDestroyed) return;

    if (context.readyForUpdate) {
      if (window.scrollY != this.scrollY || window.innerHeight != this.innerHeight || document.body.clientHeight != this.documentHeight) {
        this.scrollY = window.scrollY;
        this.innerHeight = window.innerHeight;
        this.documentHeight = document.body.clientHeight;

        if (context.duration > -1) {
          let frames = Math.floor(context.duration * 30.0);
          let frame = Math.floor((frames / (this.documentHeight - this.innerHeight)) * this.scrollY);
          if (frame != this.frame) {
            context.readyForUpdate = false;
            this.frame = frame;
            player.pause();
            player.currentTime = this.frame / 30.0;
          }
        }
      }
    }

    // Add a new requestAnimationFrame
    this.raf = window.requestAnimationFrame(() => {
      context.setFrame(player, context);
    });
  }

}

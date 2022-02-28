import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { htmlSafe } from '@ember/template';

export default class VideoPlayerComponent extends Component {
  @tracked isPlaying = false;

  @tracked defaultLength = 100;
  @tracked defautlFps = 25;

  @tracked player = null;
  @tracked isReady = false;
  @tracked readyForUpdate = true;

  @service('environment') environment;

  get src() {
    if (this.args.localSrc && this.environment.config.environment === 'pi') {
      return this.args.localSrc;
    }
    return this.args.src;
  }

  // Get and update the current time based on the frame coming in
  get currentTime() {
    // Set the currentTime on the player if it exists
    let time = this.args.frame / this.fps;

    // Run it on the next frame to make sure we don't do a double take
    next(this, () => {
      if (this.player) {
        if (
          this.player.currentTime != time &&
          this.readyForUpdate &&
          this.isReady
        ) {
          if (time && time != NaN) {
            this.readyForUpdate = false;
            this.player.currentTime = time;
          }
          if (this.isPlaying) this.player.pause();
        }
      }
    });
    return time;
  }

  get fps() {
    if (this.args.fps) return this.args.fps;
    return this.defautlFps;
  }

  get length() {
    if (this.args.length) return this.args.length;
    return this.defaultLength;
  }

  get style() {
    if (!this.args.visible) {
      return htmlSafe('opacity:0;');
    }
    return htmlSafe('');
  }

  @action
  didInsert(element) {
    // Setup the video player
    this.player = element;
    this.player.muted = 'muted';
    this.player.preload = 'auto';

    this.player.playsinline = true;
    this.player.disableRemotePlayback = true;
    this.player.setAttribute('playsinline', true);
    this.player.setAttribute('disableRemotePlayback', true);
    next(() => {
      this.playOnce();
    });
  }

  playOnce = function () {
    console.log('playOnce');
    let playPromise = this.player.play();
    console.log(playPromise);
    if (playPromise === null) {
      this.isReady = false;
      this.player.removeAttribute('controls');
      this.player.pause();
    } else {
      playPromise
        .then(() => {
          this.isReady = true;
          this.player.removeAttribute('controls');
          this.player.pause();
        })
        .catch(() => {
          next(() => {
            this.playOnce();
          });
        });
    }
  };

  @action
  onPlay() {
    this.isPlaying = true;
  }

  @action
  onPause() {
    this.isPlaying = false;
  }

  @action
  setReadyForUpdate(evt) {
    // Set can update
    this.readyForUpdate = true;
  }
}

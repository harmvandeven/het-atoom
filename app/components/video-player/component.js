import Component from '@glimmer/component';
import {
  tracked
} from '@glimmer/tracking';
import {
  action
} from '@ember/object';

export default class VideoPlayerComponent extends Component {

  @tracked time = "00:00";
  @tracked isPlaying = false;

  @action
  didInsert(element) {
    element.removeAttribute('controls');
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

    this.time = minuteValue + ':' + secondValue;

    // let barLength = timerWrapper.clientWidth * (evt.target.currentTime / evt.target.duration);
    // timerBar.style.width = barLength + 'px';

  }

}

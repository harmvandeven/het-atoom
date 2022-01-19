import { modifier } from 'ember-modifier';

export default modifier((element, [isPlaying]) => {
  if (isPlaying) {
    element.play();
  } else {
    element.pause();
  }
});

import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { service } from '@ember/service';

export default class TimelineSegmentComponent extends Component {
  keyframes = null;
  @service('environment') environment;

  constructor() {
    super(...arguments);

    // When we have keyframes, create a timeline from all those keyframes only once
    if (this.args.keyframes) {
      // create the keyframes array
      this.keyframes = [];

      // Get the properties and intialValues for those properties
      let props = [];
      let initialValue = [];
      let perStepValue = [];
      for (let k = 0; k < this.args.keyframes.length; k++) {
        Object.keys(this.args.keyframes[k]).forEach((prop) => {
          if (prop == 'frame') return;
          if (initialValue[prop] == undefined) {
            initialValue[prop] = this.args.keyframes[k][prop];
            perStepValue[prop] = 0;
          }
          if (props.indexOf(prop) < 0) {
            props.push(prop);
          }
        });
      }

      // Run through the length of the segment + create keyframes for all
      let currentKey = 0;
      let length = this.args.length;
      if (this.args.end) {
        length = this.args.end - this.args.start;
      }

      for (let i = 0; i < length; i++) {
        if (i > this.args.keyframes[currentKey].frame) {
          if (this.args.keyframes.length > currentKey + 1) {
            // per prop look for the next keyframe containing the prop and interpolate current value to then next target
            props.forEach((prop) => {
              let currentValue = this.keyframes[i - 1][prop];
              let targetValue = currentValue;
              let targetFrames = 0;
              for (
                let k = currentKey + 1;
                k < this.args.keyframes.length;
                k++
              ) {
                if (this.args.keyframes[k][prop] != undefined) {
                  targetValue = this.args.keyframes[k][prop];
                  targetFrames = this.args.keyframes[k]['frame'] - i;
                  // end the loop
                  k = this.args.keyframes.length + 1;
                }
              }
              if (targetFrames < 1) {
                perStepValue[prop] = 0;
              } else {
                perStepValue[prop] =
                  (targetValue - currentValue) / targetFrames;
              }
            });
            currentKey++;
          } else {
            // End of the keyframes, maintain all keyframes
            props.forEach((prop) => {
              perStepValue[prop] = 0;
            });
          }
        }
        this.keyframes[i] = [];
        props.forEach((prop) => {
          if (i > 0) {
            this.keyframes[i][prop] =
              this.keyframes[i - 1][prop] + perStepValue[prop];
          } else {
            this.keyframes[i][prop] = initialValue[prop];
          }
        });
      }
    }
  }

  get src() {
    if (this.args.localSrc && this.environment.config.environment === 'pi') {
      return this.args.localSrc;
    }
    return this.args.src;
  }

  get type() {
    if (this.args.src) {
      let period = this.args.src.lastIndexOf('.');
      let ext = this.args.src.substring(period + 1).toLowerCase();
      if (ext == 'jpg' || ext == 'gif' || ext == 'jpeg' || ext == 'png') {
        return 'image';
      } else if (ext == 'mp4') {
        return 'video/' + ext;
      }
    }
    return '';
  }

  get visible() {
    let start = 0;
    let end = -1;
    if (this.args.start != undefined) {
      start = parseFloat(this.args.start);
      end = start;
    }
    if (this.args.end != undefined) {
      end = parseFloat(this.args.end) - start;
    }
    if (this.args.length != undefined) {
      end = parseFloat(this.args.length);
    }
    let currentFrame = parseFloat(this.args.frame) - start;
    if (currentFrame < 0) return false;
    if (currentFrame > end) return false;
    return true;
  }

  get frame() {
    let start = 0;
    if (this.args.start) {
      start = parseFloat(this.args.start);
    }
    return parseFloat(this.args.frame) - start;
  }

  get style() {
    let styles = [];

    // Push the default style
    if (this.args.style) {
      styles.push(this.args.style.replace(/^;+|;+$/g, ''));
    }

    // Add a transition to the face when necessary
    if (this.args.fade != 'none' && !this.args.keyframes) {
      let fade = this.args.fade ? this.args.fade : 0.33;
      styles.push('transition: opacity ' + fade + 's');
    }

    // Check for the opacity based on the args or the visibility
    let opacity = null;
    if (this.args.opacity != null) {
      opacity = this.args.opacity;
    }
    if (!this.visible) {
      opacity = 0;
    }

    // Do a placement calculation
    let w = null;
    let h = null;
    let t = null;
    let l = null;
    let leftOffset = 0;
    let topOffset = 0;
    let rotate = null;

    if (this.args.width != null || this.args.height != null) {
      if (this.args.width != null) {
        w = parseFloat(this.args.width) * this.args.baseWidth;
        h = (w / this.args.originWidth) * this.args.originHeight;
      } else if (this.args.height != null) {
        h = parseFloat(this.args.height) * this.args.baseHeight;
        w = (h / this.args.originHeight) * this.args.originWidth;
      }
    } else if (this.args.left != null || this.args.top != null) {
      let wa = this.args.baseWidth;
      let ha = (wa / this.args.originWidth) * this.args.originHeight;
      let hb = this.args.baseHeight;
      let wb = (hb / this.args.originHeight) * this.args.originWidth;
      if (hb < ha && wb < wa) {
        w = wb;
        h = hb;
      } else {
        w = wa;
        h = ha;
      }
    }

    if (this.keyframes != null && this.keyframes[this.frame] != null) {
      if (this.keyframes[this.frame]['scale'] != null) {
        w = w * this.keyframes[this.frame]['scale'];
        h = h * this.keyframes[this.frame]['scale'];
      }
    }

    if (w != null && h != null) {
      t = (window.innerHeight - h) * 0.5;
      l = (window.innerWidth - w) * 0.5;

      if (this.args.left) {
        leftOffset = parseFloat(this.args.left);
      }
      if (this.args.top) {
        topOffset = parseFloat(this.args.top);
      }
    }

    // Check for keyframes
    if (this.keyframes != null && this.keyframes[this.frame] != null) {
      if (this.keyframes[this.frame]['opacity'] != null) {
        opacity = this.keyframes[this.frame]['opacity'];
      }
      if (this.keyframes[this.frame]['top'] != null) {
        topOffset = this.keyframes[this.frame]['top'];
      }
      if (this.keyframes[this.frame]['left'] != null) {
        leftOffset = this.keyframes[this.frame]['left'];
      }
      if (this.keyframes[this.frame]['rotate'] != null) {
        rotate = this.keyframes[this.frame]['rotate'];
      }
    }

    if (t != null && l != null) {
      l += this.args.baseWidth * leftOffset;
      t += this.args.baseHeight * topOffset;
      styles.push('left:' + l + 'px');
      styles.push('top:' + t + 'px');
    }

    if (w !== null) {
      styles.push('width:' + w + 'px');
    }
    if (h !== null) {
      styles.push('height:' + h + 'px');
    }

    // Push the rotation
    if (rotate !== null) {
      styles.push('transform:rotate(' + rotate + 'deg)');
    }

    // Push the opacity
    if (opacity !== null) {
      styles.push('opacity:' + opacity);
    }

    // Return the joined style
    return htmlSafe(styles.join(';'));
  }
}

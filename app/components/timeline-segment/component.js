import Component from '@glimmer/component';
import {
  htmlSafe
} from '@ember/template';

export default class TimelineSegmentComponent extends Component {

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
    if (this.args.start) start = parseFloat(this.args.start);
    if (this.args.end) end = parseFloat(this.args.end) - start;
    if (this.args.length) end = parseFloat(this.args.length);
    let currentFrame = parseFloat(this.args.frame) - start;
    if (currentFrame < 0) return false;
    if (end > -1 && currentFrame > end) return false;
    return true;
  }

  get computedFrame() {
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
    // Add a transition to the facde when necessary
    if (this.args.fade) {
      styles.push('transition: opacity ' + this.args.fade + 's');
    }

    // Check for the opacity based on the args or the visibility
    let opacity = null;
    if (this.args.opacity != null) {
      opacity = this.args.opacity;
    }
    if (!this.visible) {
      opacity = 0;
    }
    if (opacity !== null) {
      styles.push('opacity:' + opacity);
    }

    // Do a placement calculation
    let w = null;
    let h = null;
    if (this.args.width != null || this.args.height != null) {
      if (this.args.width != null) {
        w = parseFloat(this.args.width) * this.args.baseWidth;
        h = (w / this.args.baseWidth) * this.args.baseHeight;
      } else if (this.args.height != null) {
        h = parseFloat(this.args.height) * this.args.baseHeight;
        w = (h / this.args.baseHeight) * this.args.baseWidth;
      }
    } else if (this.args.left != null || this.args.top != null) {
      w = this.args.baseWidth;
      h = this.args.baseHeight;
    }

    if (w != null && h != null) {
      let t = (window.innerHeight - h) * 0.5;
      let l = (window.innerWidth - w) * 0.5;
      if (this.args.left) {
        l += this.args.baseWidth * parseFloat(this.args.left);
      }
      if (this.args.top) {
        t += this.args.baseHeight * parseFloat(this.args.top);
      }
      styles.push('left:' + l + 'px');
      styles.push('top:' + t + 'px');

      if (w !== null) {
        styles.push('width:' + w + 'px');
      }
      if (h !== null) {
        styles.push('height:' + h + 'px');
      }
    }

    // Return the joined style
    return htmlSafe(styles.join(';'));
  }

}

import Component from '@glimmer/component';
import {
  action
} from '@ember/object';
import {
  tracked
} from '@glimmer/tracking';
import {
  service
} from '@ember/service';
import {
  next
} from '@ember/runloop';

export default class HeaderComponent extends Component {

  @service('scroll') scroll;
  @tracked menuOpen = false;
  @tracked positions = [];
  @tracked positionWidth = -1;

  @action toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  get chapter() {
    let chap = this.args.model.firstObject;
    if (this.positionWidth != window.innerWidth || this.positions.length < 1) {
      next(() => {
        this.calculatePositions();
        this.positionWidth = window.innerWidth;
      });
    }
    let found = false;
    for (let i = 0; i < this.positions.length; i++) {
      if (this.positions[i].scrollY > this.scrollY) {
        if (i > 0) {
          chap = this.positions[i - 1];
        }
        found = true;
        i = this.positions.length + 1;
      }
    }
    if (!found && this.positions.length > 0) {
      chap = this.positions[this.positions.length - 1];
    }
    return chap;
  }

  get scrollY() {
    return parseFloat(this.scroll.get('scrollY'));
  }

  get menuClass() {
    if (this.menuOpen) return 'menu-open';
    return 'menu-closed';
  }

  calculatePositions() {
    this.positions = [];
    this.args.model.forEach((item, index) => {
      let elem = document.getElementById('chapter-header-' + index);
      if (elem) {
        this.positions.push({
          scrollY: parseFloat(this.getCoords(elem).top),
          id: item.id,
          title: item.title,
        });
      }
    });
  }

  getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return {
      top: Math.round(top),
      left: Math.round(left)
    };
  }

}

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { next } from '@ember/runloop';

export default class HeaderComponent extends Component {
  @service('scroll') scroll;
  @service('menu') menu;

  @tracked positions = [];
  @tracked positionWidth = -1;
  @tracked positionHeight = -1;

  @action toggleMenu() {
    this.scroll.startByUser();
    this.menu.toggle();
  }

  @action scrollTop() {
    this.scroll.startByUser();
    this.menu.close();
    this.scroll.to({
      position: 0,
    });
  }

  get chapter() {
    let chap = this.args.model.firstObject;

    let documentHeight = Math.floor(
      Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      )
    );

    if (
      this.positionWidth != window.innerWidth ||
      this.positionHeight != documentHeight ||
      this.positions.length < 1
    ) {
      next(() => {
        this.calculatePositions();
      });
    }
    let found = false;
    if (this.positions.length > 0) {
      chap = this.positions[0];
    }
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

    // Replace the hash of het window.location
    if (chap && chap.hash) {
      this.scroll.replaceState(chap);
    }
    return chap;
  }

  get scrollY() {
    return parseFloat(this.scroll.get('scrollY'));
  }

  get menuClass() {
    let cls = 'menu-closed';
    if (this.menu.isOpen) {
      cls = 'menu-open';
    }
    if (this.scroll.scrollY >= window.innerHeight) {
      cls += ' logo-visible';
    }
    return cls;
  }

  calculatePositions() {
    this.positionWidth = window.innerWidth;
    this.positionHeight = Math.floor(
      Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      )
    );
    this.positions = [];
    this.args.model.forEach((item, index) => {
      let elem = document.getElementById('chapter-header-' + index);
      if (elem) {
        this.positions.push({
          scrollY: parseFloat(this.scroll.getCoords(elem).top) - 200,
          id: item.id,
          title: item.title,
          hash: item.hash,
        });
      }
    });
  }
}

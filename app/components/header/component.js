import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { next } from '@ember/runloop';
import { dasherize } from '@ember/string';

export default class HeaderComponent extends Component {
  @service('scroll') scroll;
  @service('menu') menu;
  @tracked positions = [];
  @tracked positionWidth = -1;

  @action toggleMenu() {
    this.menu.toggle();
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
    if (window.location.hash != chap.hash && this.scroll.active) {
      if (chap.hash != '/het-atoom/' || window.location.hash) {
        let title = 'Het Atoom';
        if (chap.hash != '/het-atoom/') {
          title = chap.id.toUpperCase() + ': ' + chap.title + ' | ' + title;
        }
        // TODO: Find an alternative for this
        // window.history.replaceState(null, null, chap.hash);
        document.title = title;
      }
    }
    return chap;
  }

  get scrollY() {
    return parseFloat(this.scroll.get('scrollY'));
  }

  get menuClass() {
    if (this.menu.isOpen) return 'menu-open';
    return 'menu-closed';
  }

  calculatePositions() {
    this.positions = [];
    this.args.model.forEach((item, index) => {
      let elem = document.getElementById('chapter-header-' + index);
      if (elem) {
        let link = '/het-atoom/';
        if (index > 0) {
          link = dasherize(item.title);
          if (item.id != '-') {
            link = item.id + '-' + link;
          }
          link = '#' + link;
        }
        this.positions.push({
          scrollY: parseFloat(this.scroll.getCoords(elem).top),
          id: item.id,
          title: item.title,
          hash: link,
        });
      }
    });
  }
}

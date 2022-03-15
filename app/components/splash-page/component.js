import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class SplashPageComponent extends Component {
  @service('environment') environment;
  @service('splash') splash;
  @service('scroll') scroll;

  get class() {
    if (this.environment.config.environment === 'pi') return 'hidden';
    if (this.splash.isVisible) return 'visible';
    return 'hidden';
  }

  @action close() {
    this.scroll.startByUser();
    this.splash.hide();
  }
}

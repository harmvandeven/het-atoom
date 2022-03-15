import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class SplashService extends Service {
  @service('environment') environment;
  @tracked isVisible = false;

  // Constructor
  constructor() {
    super(...arguments);
    if (this.environment.config.environment === 'pi') {
      this.hide();
    }
  }

  show() {
    this.isVisible = true;
  }

  hide() {
    console.log('hide');
    this.isVisible = false;
  }
}

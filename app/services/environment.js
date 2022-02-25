import Service from '@ember/service';
import ENV from '../config/environment';

export default class EnvironmentService extends Service {
  get config() {
    return ENV;
  }
}

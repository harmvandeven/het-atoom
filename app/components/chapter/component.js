import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class ChapterComponent extends Component {
  @service('timeline') timeline;
}

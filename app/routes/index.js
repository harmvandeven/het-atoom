import Route from '@ember/routing/route';
import showdown from 'showdown';
import {
  Promise
} from 'rsvp';

export default class IndexRoute extends Route {
  async model() {

    let response = await fetch('api/kanaal-gent-terneuzen.md');
    let reader = response.body.getReader();

    return new Promise((res) => {
      reader.read().then(({
        done,
        value
      }) => {
        let mdString = new TextDecoder().decode(value);
        let conv = new showdown.Converter({
          metadata: true,
        });
        let html = conv.makeHtml(mdString);
        let metadata = conv.getMetadata();
        let metadataRaw = conv.getMetadata(true);
        // console.log(metadataRaw);

        let title = '';
        if (metadata.allmaps && metadata.allmaps.title) {
          title = metadata.allmaps.title;
        } else if (metadata.title) {
          title = metadata.title;
        }
        // console.log(metadata);
        console.log('title: ' + title);
        // console.log(metadata);

        res({
          title: title,
          md: mdString,
        });
      });
    });

  }
}

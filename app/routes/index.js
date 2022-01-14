import Route from '@ember/routing/route';
import showdown from 'showdown';
import { Promise, resolve } from 'rsvp';

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/kanaal-gent-terneuzen.md');
    let reader = response.body.getReader();

    return new Promise((res) => {
      reader.read().then(({ done, value }) => {
        let mdString = new TextDecoder().decode(value);
        let conv = new showdown.Converter({
          metadata: true,
        });
        let html = conv.makeHtml(mdString);
        let metadata = conv.getMetadata();
        let metadataRaw = conv.getMetadata(true);
        console.log(metadataRaw);

        let title = '';
        if (metadata.allmaps && metadata.allmaps.title) {
          title = metadata.allmaps.title;
        } else if (metadata.title) {
          title = metadata.title;
        }
        // console.log(metadata);
        console.log('title: ' + title);
        console.log(metadata);

        res({
          title: title,
          md: mdString,
        });
      });
    });
    // console.log(parsed.body.toString());
    // return parsed;

    // return {
    //   title: 'Grand Old Mansion',
    //   owner: 'Veruca Salt',
    //   city: 'San Francisco',
    //   location: {
    //     lat: 37.7749,
    //     lng: -122.4194,
    //   },
    //   category: 'Estate',
    //   type: 'Standalone',
    //   bedrooms: 15,
    //   image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
    //   description: 'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
    // };
  }
}

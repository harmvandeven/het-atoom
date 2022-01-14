import showdown from 'showdown';

export function initialize() {
  showdown.extension("showdownCaption", function () {

    var fig = '<figure>' + '<img src="%1" alt="%2" title="%3">' + '<figcaption>%3</figcaption>' + '</figure>';
    var imgRegex = /(?:<p>)?<img.*?src="(.+?)".*?alt="(.*?)".*?title="(.*?)"(.*?)\/?>(?:<\/p>)?/gi;

    return [{
      type: 'output',
      filter: function (text, converter, options) {
        var tag = fig;
        return text.replace(imgRegex, function (match, url, alt, title, rest) {
          return tag.replaceAll('%1', url).replaceAll('%2', alt).replaceAll('%3', title).replaceAll('%4', rest);
        });
      },
    }];
  });
}

export default {
  name: 'register-showdown-extensions',
  initialize,
};

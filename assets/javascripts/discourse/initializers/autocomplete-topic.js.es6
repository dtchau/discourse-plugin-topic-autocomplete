import {getSavedTopics} from './remember-topic';
import {addToolbarCallback} from 'discourse/components/d-editor';
import autocomplete from 'discourse/lib/autocomplete';


export default {
  name: 'autocomplete-topic',
  initialize: function () {
    $.fn.autocomplete = autocomplete;
    console.log('autocomplete');
    addToolbarCallback(function () {
      console.log("callbacked")
      //const container = this.get('container'),
      let $editorInput = Ember.$('.d-editor-input');
      $editorInput.autocomplete({

        key: "|",

        transformComplete(v) {
          if (v.code) {
            return `${v.code}:`;
          } else {
            showSelector({
              appendTo: self.$(),
              container,
              onSelect: title => {
                // Remove the previously type characters when a new emoji is selected from the selector.
                let selected = self._getSelected();
                let newPre = selected.pre.replace(/:[^:]+$/, ":");
                let numOfRemovedChars = selected.pre.length - newPre.length;
                selected.pre = newPre;
                selected.start -= numOfRemovedChars;
                selected.end -= numOfRemovedChars;
                self._addText(selected, `${title}:`);
              }
            });
            return "";
          }
        },

        dataSource(term) {
          console.log('dataSource')
          return new Ember.RSVP.Promise(resolve => {
            const full = `:${term}`;
            term = term.toLowerCase();

            if (term === "") {
              return resolve(["slightly_smiling", "smile", "wink", "sunny", "blush"]);
            }

            if (Discourse.Emoji.translations[full]) {
              return resolve([Discourse.Emoji.translations[full]]);
            }

            const options = Discourse.Emoji.search(term, {maxResults: 5});

            return resolve(options);
          }).then(list => list.map(code => {
            return {code, src: Discourse.Emoji.urlFor(code)};
          })).then(list => {
            if (list.length) {
              list.push({label: I18n.t("composer.more_emoji")});
            }
            return list;
          });
        }
        //template: Discourse.__container__.lookup('template:category-group-autocomplete.raw'),
        //key: '.',
        //transformComplete() {
        //  return 'MyResult';
        //},
        ////dataSource() {
        ////  return getSavedTopics().map(function (topic) {
        ////    return topic.title;
        ////  });
        ////}
        //
        //
        //dataSource(term) {
        //  return new Ember.RSVP.Promise(resolve => {
        //    const full = `:${term}`;
        //    term = term.toLowerCase();
        //
        //    if (term === "") {
        //      return resolve(["slightly_smiling", "smile", "wink", "sunny", "blush"]);
        //    }
        //
        //    if (Discourse.Emoji.translations[full]) {
        //      return resolve([Discourse.Emoji.translations[full]]);
        //    }
        //
        //    const options = Discourse.Emoji.search(term, {maxResults: 5});
        //
        //    return resolve(options);
        //  }).then(list => list.map(code => {
        //    return {code, src: Discourse.Emoji.urlFor(code)};
        //  })).then(list => {
        //    if (list.length) {
        //      list.push({label: I18n.t("composer.more_emoji")});
        //    }
        //    return list;
        //  });
        //}
      });
      console.log($);
      console.log($editorInput);
    });
  }
};

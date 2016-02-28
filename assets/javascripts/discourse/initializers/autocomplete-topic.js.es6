import {getSavedTopics} from './remember-topic';

export default {
  name: 'autocomplete-topic',
  initialize: function () {
    // Doing topic auto complete here.
  },
  @on('didInsertElement')
  autocomplete() {
    console.log('I am trying to autocomplete now')
  }
};

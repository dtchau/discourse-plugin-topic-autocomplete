import RouteTopic from 'discourse/routes/topic';

const TOPIC_STORAGE_KEY = 'TopicAutoComplete_Topics';
let isLocalStorageAvailable = typeof(Storage) !== "undefined";

function rememberTopic(event) {
  if (isLocalStorageAvailable) {
    Discourse.Topic.find(event.currentModel.id, '').then(saveTopic);
  }
}

function saveTopic(topic) {
  let simpleTopic = extractTopicObject(topic);
  let topicsToBeSaved = getSavedTopics().filter(function (t) {
    return simpleTopic.id != t.id;
  });
  topicsToBeSaved.unshift(simpleTopic);
  saveTopics(topicsToBeSaved);
}

function saveTopics(topics) {
  if (isLocalStorageAvailable) {
    localStorage.setItem(TOPIC_STORAGE_KEY, JSON.stringify(topics));
  }
}

function getSavedTopics() {
  if (!isLocalStorageAvailable) {
    return [];
  }

  let topicsInString = localStorage.getItem(TOPIC_STORAGE_KEY);
  if (topicsInString == null) {
    return [];
  } else {
    return JSON.parse(topicsInString);
  }
}

function extractTopicObject(topic) {
  return {id: topic.id, title: topic.title};
}

export default {
  name: 'remember-topic',
  initialize: function () {
    RouteTopic.on('setupTopicController', rememberTopic);
  }
};

export {getSavedTopics};

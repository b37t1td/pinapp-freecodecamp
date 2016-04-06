import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),

  myPins : function() {
    return this.get('model').filterBy('userId', Number.parseInt(this.get('application.user.id')));
  }.property('model.[]'),

  actions : {
    removePin(item) {
      item.destroyRecord();
    }
  }
});

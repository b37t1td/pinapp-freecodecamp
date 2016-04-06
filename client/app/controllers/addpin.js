import Ember from 'ember';
import isURI from '../utils/URI';


export default Ember.Controller.extend({
  application : Ember.inject.controller(),
  pinTitle : '',
  pinURL : '',

  isFormValid : function() {
    return isURI(this.get('pinURL'));
  }.property('pinTitle', 'pinURL'),

  actions : {
    createPin() {
      if (!this.get('isFormValid')) {
        return ;
      }

      this.set('isLoading', true);

      this.store.createRecord('pin', {
        title : this.get('pinTitle'),
        image : this.get('pinURL'),
        userId : Number.parseInt(this.get('application.user.id'), 10)
      }).save().then( () => {
          this.set('isLoading', false);
          this.set('pinTitle', '');
          this.set('pinURL', '');
      });
    }
  }

});

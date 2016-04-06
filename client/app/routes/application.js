import Ember from 'ember';

let fetchUserInfo = () => {
  return $.get('/api/user/me');
};


export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      user : fetchUserInfo()
    });
  },


  setupController(controller, model) {
    controller.set('user', model.user);
  }

});

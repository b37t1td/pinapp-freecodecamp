import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home', {path : '/'});
  this.route('mypins', {path : '/mypins'});
  this.route('addpin', {path : '/addpin'});
});

export default Router;

import DS from 'ember-data';
import LingoLinqAAC from '../app';
import { computed } from '@ember/object';

LingoLinqAAC.Userversion = DS.Model.extend({
  modifier: DS.attr('raw'),
  created: DS.attr('date'),
  stats: DS.attr('raw'),
  action: DS.attr('string'),
  summary: DS.attr('string'),
  recent: computed('app_state.refresh_stamp', 'created', function() {
    var past = window.moment().add(-7, 'day');
    return this.get('created') && this.get('created') > past;
  })
});

export default LingoLinqAAC.Userversion;

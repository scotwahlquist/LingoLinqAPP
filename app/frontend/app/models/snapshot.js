import DS from 'ember-data';
import LingoLinqAAC from '../app';
import i18n from '../utils/i18n';
import Utils from '../utils/misc';

LingoLinqAAC.Snapshot = DS.Model.extend({
  user_id: DS.attr('string'),
  name: DS.attr('string'),
  start: DS.attr('string'),
  end: DS.attr('string'),
  device_id: DS.attr('string'),
  location_id: DS.attr('string')
});

export default LingoLinqAAC.Snapshot;

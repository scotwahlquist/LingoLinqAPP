import DS from 'ember-data';
import LingoLinqAAC from '../app';
import speecher from '../utils/speecher';
import persistence from '../utils/persistence';
import Utils from '../utils/misc';

LingoLinqAAC.Tag = DS.Model.extend({
  button: DS.attr('raw'),
  tag_id: DS.attr('string'),
  label: DS.attr('string'),
  public: DS.attr('boolean'),
});

export default LingoLinqAAC.Tag;

import modal from '../utils/modal';
import { computed } from '@ember/object';

export default modal.ModalController.extend({
  version: computed(function() {
    return (window.LingoLinqAAC && window.LingoLinqAAC.update_version) || 'unknown';
  }),
  actions: {
    restart: function() {
      if(window.LingoLinqAAC && window.LingoLinqAAC.install_update) {
        window.LingoLinqAAC.install_update();
      } else {
        this.set('error', true);
      }
    }
  }
});

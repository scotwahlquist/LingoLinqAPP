import modal from '../../utils/modal';
import i18n from '../../utils/i18n';
import editManager from '../../utils/edit_manager';
import LingoLinqAAC from '../../app';
import { computed } from '@ember/object';

export default modal.ModalController.extend({
  opening: function() {
  },
  paint_types: [
    {name: i18n.t('choose_type', "[ Choose Type ]"), id: ''},
    {name: i18n.t('reveal_button', "Un-Hide the Button"), id: 'hidden'},
    {name: i18n.t('enable_link', "Enable the Link for the Button"), id: 'link_disabled'},
    {name: i18n.t('remove_settings', "Clear All Level Settings"), id: 'clear'},
  ],
  level_select: computed('paint_type', function() {
    return this.get('paint_type') == 'hidden' || this.get('paint_type') == 'link_disabled';
  }),
  paint_levels: LingoLinqAAC.board_levels,
  actions: {
    paint: function() {
      if(this.get('paint_type') && (!this.get('level_select') || this.get('paint_level'))) {
        editManager.set_paint_mode('level', this.get('paint_type'), parseInt(this.get('paint_level'), 10),);
        modal.close();
      }
    }
  }
});

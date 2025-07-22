import modal from '../utils/modal';
import capabilities from '../utils/capabilities';
import app_state from '../utils/app_state';
import $ from 'jquery';
import utterance from '../utils/utterance';
import LingoLinqAAC from '../app';
import { later as runLater } from '@ember/runloop';
import { htmlSafe } from '@ember/string';
import { set as emberSet } from '@ember/object';
import persistence from '../utils/persistence';
import { computed, observer } from '@ember/object';
import stashes from '../utils/_stashes';

export default modal.ModalController.extend({
  opening: function() {
    this.set('copy_result', null);
    var controller = this;
    controller.set('model', {});
    var settings = modal.settings_for['share-utterance'];
    controller.set('utterance', settings.utterance);
    var u = LingoLinqAAC.store.createRecord('utterance', {
      button_list: settings.utterance, 
      timestamp: (new Date()).getTime() / 1000,
      sentence: utterance.sentence(settings.utterance),
      user_id: app_state.get('referenced_user.id')
    });
    this.set('text_only', !!app_state.get('text_only_shares') || !!stashes.get('text_only_shares'));
    u.assert_remote_urls();
    u.save().then(function(u) {
      controller.set('utterance_record', u);
    }, function() {
      controller.set('utterance_record_error', true);
    });
    this.check_native_shares();
  },
  contacts: computed(
    'app_state.referenced_user.supervisors',
    'app_state.referenced_user.known_supervisees',
    'app_state.referenced_user.supporter_role',
    'app_state.referenced_user.contacts',
    'app_state.reply_note',
    function() {
      var res = [];
      (app_state.get('referenced_user.contacts') || []).forEach(function(contact) {
        res.push({
          user_name: contact.name,
          avatar_url: contact.image_url,
          id: app_state.get('referenced_user.id') + 'x' + contact.hash
        });
      });
      if(app_state.get('referenced_user.supporter_role')) {
        res = res.concat(app_state.get('referenced_user.known_supervisees') || []);
      } else {
        res = res.concat(app_state.get('referenced_user.supervisors') || []);
      }
      if(app_state.get('reply_note.author')) {
        res.unshift({
          user_name: app_state.get('reply_note.author.name'),
          id: app_state.get('reply_note.author.id'),
          avatar_url: app_state.get('reply_note.author.image_url'),
          reply: app_state.get('reply_note')
        })
      }
      res.forEach(function(contact) {
        if(LingoLinqAAC.remote_url(contact.avatar_url)) {
          persistence.find_url(contact.avatar_url, 'image').then(function(uri) {
            emberSet(contact, 'avatar_url', uri);
          }, function() { });
        }
      });
      return res;
    }
  ),
  sentence: computed('utterance', function() {
    if(this.get('utterance')) {
      return utterance.sentence(this.get('utterance'));
    } else {
      return "";
    }
  }),
  update_text_only_shares: observer('text_only', function() {
    app_state.set('text_only_shares', !!this.get('text_only'));
    if(app_state.get('referenced_user.id') == app_state.get('sessionUser.id')) {
      stashes.persist('text_only_shares', !!this.get('text_only'));
    }
  }),
  escaped_sentence: computed('sentence', function() {
    return encodeURIComponent(this.get('sentence'));
  }),
  check_native_shares: function() {
    var _this = this;
    _this.set('native', {});
    if(app_state.get('referenced_user.preferences.sharing') !== false) {
      capabilities.sharing.available().then(function(list) {
        if(list.indexOf('facebook') != -1) { _this.set('native.facebook', true); }
        if(list.indexOf('twitter') != -1) { _this.set('native.twitter', true); }
        if(list.indexOf('instagram') != -1) { _this.set('native.instagram', true); }
        if(list.indexOf('email') != -1) { _this.set('native.email', true); }
        if(list.indexOf('clipboard') != -1) { _this.set('native.clipboard', true); }
        if(list.indexOf('generic') != -1) { _this.set('native.generic', true); }
      });
    }
  },
  shares: computed(
    'utterance_record.link',
    'text_only',
    'native',
    'native.generic',
    'native.facebook',
    'native.twitter',
    'native.instagram',
    'native.clipboard',
    function() {
      var res = {};
      if(this.get('utterance_record.link')) {
        res.facebook = true;
        res.twitter = true;
      }
      var native = this.get('native');
      for(var key in native) {
        if(native[key] && this.get('utterance_record.link')) {
          res[key] = true;
        }
      }
      if(!this.get('utterance.best_image_url') || this.get('text_only')) {
        res.instagram = false;
      }
      if(document.queryCommandSupported && document.queryCommandSupported('copy')) {
        res.clipboard = true;
      }
      return res;
    }
  ),
  facebook_url: computed('utterance_record.link', function() {
    return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.get('utterance_record.link'));
  }),
  twitter_url: computed('utterance_record.link', 'sentence', function() {
    var res = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(this.get('utterance_record.link')) + '&text=' + encodeURIComponent(this.get('sentence'));
    if(app_state.get('domain_settings.twitter_handle')) {
      res = res + '&related=' + encodeURIComponent(app_state.get('domain_settings.twitter_handle'));
    } 
    return res;
  }),
  clipboard_class: computed('copy_result', function() {
    if(this.get('copy_result.succeeded')) {
      return htmlSafe('btn btn-success');
    } else if(this.get('copy_result.failed')) {
      return htmlSafe('btn btn-danger');
    } else {
      return htmlSafe('btn btn-default');
    }
  }),
  actions: {
    copy_event(res) {
      if(res) {
        this.set('copy_result', {succeeded: true});
        runLater(function() {
          modal.close();
        }, 3000);
      } else {
        this.set('copy_result', {failed: true});
      }
    },
    message: function(user) {
      modal.open('confirm-notify-user', {user: user, reply: user.reply, raw: this.get('utterance'), sentence: this.get('sentence'), utterance: this.get('utterance_record')});
    },
    share_via: function(medium) {
      var image_url = this.get('text_only') ? null : this.get('utterance_record.best_image_url');
      if(this.get('native.' + medium)) {
        // TODO: download the image locally first??
        capabilities.sharing.share(medium, this.get('sentence'), this.get('utterance_record.link'), image_url);
        modal.close();
      } else if(medium == 'facebook') {
        capabilities.window_open(this.get('facebook_url'));
        modal.close();
      } else if(medium == 'twitter') {
        capabilities.window_open(this.get('twitter_url'));
        modal.close();
      } else if(medium == 'link') {
        capabilities.window_open(this.get('utterance_record.link'));
        modal.close();
      } else if(medium == 'email') {
        modal.open('share-email', {url: this.get('utterance_record.link'), text: this.get('sentence'), utterance_id: this.get('utterance_record.id') });
      } else if(medium == 'big_text') {
        modal.open('modals/big-button', {text: this.get('sentence'), text_only: app_state.get('referenced_user.preferences.device.button_text_position') == 'text_only'});
      } else if(medium == 'clipboard' && this.get('shares.clipboard')) {
        var $elem = $("#utterance_sentence");
        window.getSelection().removeAllRanges();
        var text = $elem[0].innerText;
        if($elem[0].tagName == 'INPUT') {
          $elem.focus().select();
          text = $elem.val();
        } else {
          var range = document.createRange();
          range.selectNode($elem[0]);
          window.getSelection().addRange(range);
        }
        var res = document.execCommand('copy');
        if(!res) {
          var textArea = document.createElement('textArea');
          textArea.value = text;
          document.body.appendChild(textArea);
          var range = document.createRange();
          range.selectNodeContents(textArea);
          var selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          textArea.setSelectionRange(0, 999999);        
          res = document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        window.getSelection().removeAllRanges();
        this.send('copy_event', !!res);
      }
    }
  }
});

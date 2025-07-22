import Controller from '@ember/controller';
import i18n from '../../utils/i18n';
import persistence from '../../utils/persistence';
import modal from '../../utils/modal';
import { observer } from '@ember/object';
import { computed } from '@ember/object';
import { set as emberSet } from '@ember/object';
import LingoLinqAAC from '../../app';

export default Controller.extend({
  queryParams: ['current_report'],
  available_reports: computed('model.permissions.edit', 'model.admin', function() {
    if(this.get('model.permissions.edit')) {
      var list = [{id: 'select', name: i18n.t('select_report_prompt', "[ Select a Report ]")}];
      list.push({id: 'all_users', name: i18n.t('all_org_communicators', "All organization communicators") });
      list.push({id: 'all_supervisors', name: i18n.t('all_supervisors', "All organization supervisors") });
      if(this.get('model.permissions.manage')) {
        list.push({id: 'recent_sessions', name: i18n.t('recent_user_sessions', "Recent user sessions") });
      }
      if(this.get('model.admin')) {
        list.push({id: 'new_users', name: i18n.t('new_users', "Signed up in the last 2 weeks") });
        list.push({id: 'logged_2', name: i18n.t('logged_2', "Generated usage logs in the last 2 weeks")});
//        list.push({id: 'setup_but_expired', name: i18n.t('setup_but_expired', "Used initially but now expired")});
        list.push({id: 'active_free_supervisor_without_supervisees_or_org', name: i18n.t('active_free_supervisor_without_supervisees_or_org', "Active free supervisors without any supervisees or org")});
//        list.push({id: 'free_supervisor_with_supervisors', name: i18n.t('free_supervisor_with_supervisors', "Free supervisors with their own supervisors")});
//        list.push({id: 'multiple_emails', name: i18n.t('multiple_emails', "Emails with multiple signups")});
        list.push({id: 'home_boards', name: i18n.t('most_common_home_boards', "Most common home boards")});
        list.push({id: 'recent_home_boards', name: i18n.t('recent_home_boards', "Most common home boards in the last 3 months")});
        list.push({id: 'current_but_expired', name: i18n.t('current_but_expired', "Used currently but now expired")});
        list.push({id: 'subscriptions', name: i18n.t('subscriptions', "Subscriptions over time") });
        list.push({id: 'missing_words', name: i18n.t('missing_pos_words', "Button labels that don't have matching parts of speech")});
        list.push({id: 'overridden_parts_of_speech', name: i18n.t('overridden_parts_of_speech', "Manually-set parts of speech")});
        list.push({id: 'missing_symbols', name: i18n.t('missing_symbols', "Search terms that don't return any matching symbols")});
        list.push({id: 'premium_voices', name: i18n.t('premium_voice_downloads', "Premium Voice Downloads")});
        // list.push({id: 'extras', name: i18n.t('extras_enabled', "Premium Symbol Purchases")});
        list.push({id: 'protected_sources', name: i18n.t('protected_sources', "Premium Symbol Activations")});
        list.push({id: 'feature_flags', name: i18n.t('feature_flags', "Beta/Feature Flags")});
        list.push({id: 'org_sizes', name: i18n.t('org_sizes', "Organizations by Size")});
        list.push({id: 'totals', name: i18n.t('record_totals', "Total counts")});
      } else {
        list.push({id: 'logged_2', name: i18n.t('logged_2', "Generated usage logs in the last 2 weeks")});
        list.push({id: 'not_logged_2', name: i18n.t('not_logged_2', "Not generated usage logs in the last 2 weeks")});
        list.push({id: 'unused_3', name: i18n.t('unused_3', "Not used for the last 3 months")});
        list.push({id: 'unused_6', name: i18n.t('unused_6', "Not used for the last 6 months")});
      }
      return list;
    } else {
      return [];
    }
  }),
  custom_report_all: computed('current_report', function() {
    return this.get('current_report') == 'vocab-Other';
  }),
  custom_report: computed('current_report', function() {
    var rep = this.get('current_report');
    var parts = (this.get('current_report') || '').split(/-/);
    parts.shift();
    var str = parts.join('-');
    if(!rep) { return "N/A"; }
    if(rep.match(/^status-/)) {
      var code = rep.replace(/^status-/, '');
      var status = LingoLinqAAC.user_statuses.find(function(r) { return r.id == code; });
      return i18n.t('status_colon', "Status: ") + status.label;
    } else if(rep.match(/^access-/)) {
      return i18n.t('access_method_colon', "Access Method: ") + str;
    } else if(rep.match(/^device-/)) {
      if(str == 'Other') { str = "All Results"; }
      return i18n.t('device_type_colon', "Device Type: ") + str;
    } else if(rep.match(/^vocab-/)) {
      if(str == 'Other') { str = "All Results"; }
      return i18n.t('vocab_colon', "Vocabulary: ") + str;
    } else if(rep.match(/^grid-/)) {
      var size = parseInt(str, 10);
      var lower = size - (size % 30);
      return i18n.t('grid_sizes_colon', "Grid Sizes: ") + lower + "-" + (lower + 29) + " cells";
    }
  }),
  get_report: observer('current_report', 'model.id', function() {
    if(this.get('current_report') && this.get('current_report') != 'select' && this.get('model.id')) {
      var _this = this;
      _this.set('results', {loading: true});
      var list = [];
      var next_page = function(url, limit) {
        persistence.ajax(url, {type: 'GET'}).then(function(data) {
          _this.set('results.loading', false);
          if(data.user) {
            list = list.concat(data.user);
          } else if(data.users) {
            list = list.concat(data.users);
          } else if(data.log) {
            list = list.concat(data.log);
          }
          if(data.meta && data.meta.next_url && (!limit || list.length < limit)) {
            next_page(data.meta.next_url, limit);
            _this.set('results.more', true);
          } else {
            _this.set('results.more', false);
          }
          if(data.stats) {
            list = [];
            var max = 1;
            for(var key in data.stats) {
              max = Math.max(max, data.stats[key]);
            }
            for(var key in data.stats) {
              var obj = {key: key, value: parseInt(data.stats[key], 10), label_class: 'label label-default'};
              if((obj.value / max) > 0.67) {
                obj.label_class = 'label label-danger';
              } else if((obj.value / max) > 0.33) {
                obj.label_class = 'label label-warning';
              }
              list.push(obj);
            }
            var sort_by_key = _this.get('sort_by_key');
            list.sort(function(a, b) { 
              if(sort_by_key && a.key != b.key) {
                return a.key.localeCompare(b.key);
              }
              return b.value - a.value; 
            });
            _this.set('results.count', list.length);
            _this.set('results.stats', list);
          } else {
            _this.set('results.count', list.length);
            var two_weeks_ago = window.moment().add(-14, 'day').toISOString();
            list.forEach(function(u) {
              if(u && u.goal && u.goal.last_tracked) {
                emberSet(u.goal, 'recently_tracked', u.goal.last_tracked > two_weeks_ago);
              }
              if(u.org_status) {
                emberSet(u, 'org_status_class', 'glyphicon glyphicon-' + u.org_status.state);
              }
            });
            _this.set('results.list', list);
          }
        }, function(err) {
          _this.set('results.loading', false);
          _this.set('results.error', {error: err.error || i18n.t('unexpected_error', "Unexpected error")});
        });
      };
      _this.set('sort_by_key', false);
      if(this.get('current_report') == 'recent_sessions') {
        next_page('/api/v1/organizations/' + _this.get('model.id') + '/logs', 100);
      } else if(this.get('current_report') == 'all_users') {
        next_page('/api/v1/organizations/' + _this.get('model.id') + '/users');
      } else if(this.get('current_report') == 'all_supervisors') {
        next_page('/api/v1/organizations/' + _this.get('model.id') + '/supervisors');
      } else if(this.get('current_report') == 'all_evals') {
        next_page('/api/v1/organizations/' + _this.get('model.id') + '/evals');
      } else {
        _this.set('sort_by_key', ['premium_voices', 'extras', 'protected_sources', 'subscriptions'].indexOf(_this.get('current_report')) != -1);
        next_page('/api/v1/organizations/' + _this.get('model.id') + '/admin_reports?report=' + _this.get('current_report'));
      }
    } else {
      this.set('results', null);
    }
  }),
  removable_report: computed('current_report', function() {
    return ['all_users', 'all_supervisors'].indexOf(this.get('current_report')) >= 0;
  }),
  user_report: computed(function() {
    return true;
  }),
  actions: {
    download_list: function() {
      var element = document.createElement('a');
      var rows = [];
      if(this.get('results.list')) {
        this.get('results.list').forEach(function(user) {
          var columns = [];
          columns.push(user.name);
          columns.push(user.user_name);
          columns.push(user.email);
          columns.push(user.joined);
          columns.push(user.registration_type);
          columns.push(user.referrer);
          columns.push(user.ad_referrer);
          rows.push(columns.join(','));
        });
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join("\n")));
        element.setAttribute('download', 'users.csv');
      } else if(this.get('results.stats')) {
        var stats = this.get('results.stats').forEach(function(stat) {
          var columns = [];
          columns.push(stat.key);
          columns.push(stat.value);
          rows.push(columns.join(','));
        });
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join("\n")));
        element.setAttribute('download', 'stats.csv');
      } else {
        modal.error(i18n.t('no_results_to_download', "No results to download"));
      }

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    set_status: function(user) {
      var _this = this;
      modal.open('modals/user-status', {user: user, type: 'communicator', organization: this.get('model')}).then(function(res) {
        if(res) {
          var ref_user = _this.get('results.list').find(function(u) { return u && u.id == user.id;});
          if(ref_user) {
            emberSet(ref_user, 'org_status', res.status);
            emberSet(ref_user, 'org_status_class', 'glyphicon glyphicon-' + res.status.state);
          }

        }
      });
    },
    remove_report_user: function(user) {
      var action = null;
      var user_name = user.user_name;
      if(this.get('current_report') == 'all_users') {
        action = 'remove_user';
      } else if(this.get('current_report') == 'all_supervisors') {
        action = 'remove_supervisor';
      }

      var model = this.get('model');
      var _this = this;
      if(!user_name || !action) { return; }
      model.set('management_action', action + '-' + user_name);
      model.save().then(function() {
        modal.success(i18n.t('user_removed', "The user %{user_name} was successfully removed.", {user_name: user.user_name}));
        _this.get_report();
      }, function(err) {
        modal.error(i18n.t('error_removing_user_name', "There was an error removing the user %{user_name}", {user_name: user.user_name}));
      });
    }
  }
});

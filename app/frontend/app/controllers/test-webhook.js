import modal from '../utils/modal';
import LingoLinqAAC from '../app';
import progress_tracker from '../utils/progress_tracker';
import persistence from '../utils/persistence';

export default modal.ModalController.extend({
  opening: function() {
    this.test();
  },
  test: function() {
    var webhook = this.get('model.webhook');
    webhook.set('testing', {waiting: true});
    persistence.ajax('/api/v1/webhooks/' + webhook.get('id') + '/test', {
      type: 'POST'
    }).then(function(data) {
      if(data.progress) {
        progress_tracker.track(data.progress, function(event) {
          if(event.status == 'errored') {
            webhook.set('testing', {error: true});
          } else if(event.status == 'finished') {
            webhook.set('testing', {done: true, result: event.result});
          }
        });
      } else {
        webhook.set('testing', {error: true});
      }
    }, function(err) {
      webhook.set('testing', {error: true});
    });
  },
  actions: {
    test: function() {
      this.test();
    }
  }
});

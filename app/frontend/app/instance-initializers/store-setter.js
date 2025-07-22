export default {
  name: 'store-setter',
  initialize: function(instance) {
    window.LingoLinqAAC.store = instance.lookup('service:store');
  }
};

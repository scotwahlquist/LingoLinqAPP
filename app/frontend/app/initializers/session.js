import persistence from '../utils/persistence';
import stashes from '../utils/_stashes';
import sweetSuiteExtras from '../utils/extras';
import app_state from '../utils/app_state';
import session from '../utils/session';
import capabilities from '../utils/capabilities';

export default {
  name: 'session',
  initialize: function(app) {
    window.LingoLinqAAC.app = app;
    session.setup(app);
    persistence.setup(app);
    stashes.connect(app);
    sweetSuiteExtras.setup(app);
    app_state.setup(app);
  }
};

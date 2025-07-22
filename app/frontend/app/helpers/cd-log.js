import LingoLinqAAC from '../app';

import { helper } from '@ember/component/helper';

export default helper(function(params, hash) {
  if(LingoLinqAAC.log.started) {
    LingoLinqAAC.log.track(params[0]);
  } else {
    console.log(params[0]);
  }
  return "";
});

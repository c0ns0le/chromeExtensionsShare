'use strict';

function _i18n(e, f) {
  if (!e) {
    console.log('_i18n:empty', e);
    return;
  }
  var str = chrome.i18n.getMessage(e);

  if (str == undefined || str == '') {
    console.log('"' + e + '": { "message": "' + e + '" },');
    return;
  }
  //console.log('i18n[' + e + ']:' + str);
  return str;
}

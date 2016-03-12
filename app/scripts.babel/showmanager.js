'use strict';
var extensionsShare = new ExtensionsShare();

$(document).ready(function () {
  initUI();
});

function initUI() {
  var bkg = chrome.extension.getBackgroundPage();
  _gaq.push(['_trackPageview', '/extensions/show/']);

  doI18n();

  $('#title').html('asfsfsdfsd');
  $('.no-extensions').hide();
  var $template = $('#template');

  extensionsShare.setTemplate($template.clone());
  $template.hide();

  chrome.management.getAll(function (extensionInfo) {
    console.log('extensionInfo', extensionInfo);
    
    var counter = extensionsShare.populateExtensions(extensionInfo);

    if (counter === 0) {
      $('#developer_tools').hide();
      $('.extension-name').show();
      $('#try_gallery').html('<a href="#">...</a>');
    }
    $('#extensions_length').html(counter);

    addListeners();

  });

  $('.label_select').click(function () {
    console.log('select', $(this).data('select'));
    selectExtensions($(this).data('select'));
  });


  $('.label_export a').click(function () {
    console.log('exportTo', $(this).data('exportto'));
    extensionsShare.exportTo($(this).data('exportto'));
  });

  $('#label_send_via_gmail').click(function () {
    console.log('sendTo', $(this).data('sendto'));
    sendTo($(this).data('sendto'));
  })
}
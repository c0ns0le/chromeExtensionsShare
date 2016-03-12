'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

console.log('\'Allo \'Allo! Event Page');


// Global accessor that the popup uses.
var selectedTabId = null;
var selectedWindowId = null;

console.log('background.html');

chrome.browserAction.onClicked.addListener(function (tab) {

  if (selectedTabId !== null) {
    chrome.tabs.remove(selectedTabId);
    selectedTabId = null;
  }

  if (selectedTabId === null) {
    chrome.tabs.create({
      'url': 'showmanager.html'
    }, openExtensionManager);
  } else {
    chrome.tabs.update(selectedTabId, {
      selected: true
    }, refreshExtensionManager);
  }

});

function refreshExtensionManager(tab) {
  selectedTabId = tab.id;
  console.log('openExtensionManager');
  console.log(tab);

}
function openExtensionManager(tab) {
  selectedTabId = tab.id;
  console.log('openExtensionManager');
  console.log(tab);

}
import { requestPermissionForOrigin, registerContentScriptsForOrigin, removeFromOrigin, isRegisteredForOrigin } from './util/contentscripts.js';

console.log('Hello, popup!');

// sacrificing readability for better intellisense :P
const [addButton, removeButton] = document.querySelectorAll('button');

let currentSite;

addButton.onclick = async () => {
  if (await requestPermissionForOrigin(currentSite)) {
    await registerContentScriptsForOrigin(currentSite);
    console.log(`Content script registered for ${currentSite}!`);
    await reloadCurrentTab();
    // reinit to set up buttons correctly
    await init();
  }
}
removeButton.onclick = async () => {
  await removeFromOrigin(currentSite)
  console.log(`Content script removed from ${currentSite}!`);
  await reloadCurrentTab();
  // reinit to set up buttons correctly
  await init();
}

async function init() {
  currentSite = await getCurrentSite();
  const isCurrentSiteRegistered = await isRegisteredForOrigin(currentSite);
  addButton.innerText = isCurrentSiteRegistered ? 'Re-add site' : 'Add site';
  removeButton.style.display = isCurrentSiteRegistered ? '' : 'none';
}
init();

async function getCurrentSite() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const url = tab?.url;
  if (!url) {
    console.warn('No tab URL', { tab });
    return null;
  }
  return new URL(url).origin;
}

async function reloadCurrentTab() {
  await chrome.tabs.reload();
}

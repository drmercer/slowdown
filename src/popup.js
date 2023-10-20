import { requestPermissionForOrigin, registerContentScriptsForOrigin } from './util/contentscripts.js';

console.log('Hello, popup!');

const addButton = document.querySelector('button#add');

addButton.onclick = async () => {
  const currentSite = await getCurrentSite();
  if (await requestPermissionForOrigin(currentSite)) {
    await registerContentScriptsForOrigin(currentSite);
    console.log('Content script registered!');
  }
}

export async function getCurrentSite() {
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

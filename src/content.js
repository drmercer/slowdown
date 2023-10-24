console.log('[Slowdown] injected script!');

const LocalStorageKeys = {
  CancelAt: 'slowdown/cancel-at',
}

const SuppressDurationAfterCancel = 500; // ms

function init() {
  console.log('[Slowdown] init called!');

  // DOM setup

  const root = document.createElement('div');
  root.innerHTML = `
  <style>
    .slowdown_dialog::backdrop {
      backdrop-filter: blur(20px);
      background: rgba(15, 72, 87, 0.05);
    }
    .slowdown_dialog {
      width: 600px;
      max-width: 80vw;
      max-height: 80vh;
      overflow-y: auto;
      font-family: sans-serif;
      font-size: 1rem;
      color: #000;
      background: #fff8;
      border: none;
      border-radius: 1rem;
    }
    .slowdown_dialog button {
      font-size: 1rem;
      border: 2px solid currentcolor;
      padding: 5px;
      border-radius: 5px;
      margin: 5px 0;
      background: none;
    }
  </style>
  <dialog class="slowdown_dialog">
    <h1>Loading...</h1>
    <div>
      <button>Go back</button>
    </div>
  </dialog>
  `
  document.body.appendChild(root);

  const dialog = root.querySelector('dialog');
  // I do it like this to get better intellisense
  const [cancel] = root.querySelectorAll('button');

  // monkeypatching

  monkeypatchHistoryApi();
  console.log(`[Slowdown] monkeypatched APIs`);

  // The core logic

  let timeout = null;

  function showLoading(why = 'unknown', allowCancel = true) {
    // Only show it if the user didn't recently click "Cancel"
    const lastCanceledAt = Number(window.localStorage.getItem(LocalStorageKeys.CancelAt));
    if (lastCanceledAt > Date.now() - SuppressDurationAfterCancel) {
      console.log(`[Slowdown] suppressed because canceled recently (${why})`);
      return;
    }
    console.log(`[Slowdown] showing loading modal (${why})`);
    try {
      dialog.showModal();
    } catch (e) {
      console.warn(`[Slowdown] failed to show modal`, e);
    }
    cancel.disabled = !allowCancel;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      dialog.close();
    }, 4000);
  }

  cancel.onclick = () => {
    window.localStorage.setItem(LocalStorageKeys.CancelAt, Date.now());
    window.history.back();
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      dialog.close();
    }, 300);
  }

  window.onbeforeunload = () => showLoading('beforeunload', false);
  window.onhashchange = () => showLoading('onhashchange');
  window.onpopstate = () => showLoading('onpopstate');
  window.addEventListener('slowdown_pushstate', () => showLoading('locationchange'));

  // Let's go!

  console.log('[Slowdown] init finished!');
  showLoading('load');
}

function monkeypatchHistoryApi() {
  // based on https://stackoverflow.com/a/52809105/1124748
  const _pushState = window.history.pushState;
  window.history.pushState = function pushState() {
    const result = _pushState.apply(this, arguments);
    window.dispatchEvent(new Event('slowdown_pushstate'));
    return result;
  };
}

// because we use runAt: document_start
document.addEventListener('DOMContentLoaded', init);

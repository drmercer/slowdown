console.log('[Slowdown] injected script!');

function init() {

  const root = document.createElement('div');
  root.innerHTML = `
  <style>
    .slowdown_dialog::backdrop {
      backdrop-filter: blur(20px);
      background: rgba(15, 72, 87, 0.05);
    }
  </style>
  <dialog class="slowdown_dialog">
    <p>Loading...</p>
    <button>Cancel</button>
  </dialog>
  `
  document.body.appendChild(root);

  const dialog = root.querySelector('dialog');
  // I do it like this to get better intellisense
  const [cancel] = root.querySelectorAll('button');

  let timeout = null;

  function showLoading(why = 'unknown') {
    console.log(`[Slowdown] showing loading modal (${why})`);
    dialog.showModal();
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      dialog.close();
    }, 4000);
  }

  cancel.onclick = () => {
    window.history.back();
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      dialog.close();
    }, 300);
  }

  window.onbeforeunload = () => showLoading('beforeunload');
  window.onhashchange = () => showLoading('onhashchange');
  window.onpopstate = () => showLoading('onpopstate');

  showLoading('load');

}

// because we use runAt: document_start
document.addEventListener('DOMContentLoaded', init);

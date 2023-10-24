function originPermission(origin) {
  return new URL(origin).origin + "/*";
}

function permissionsForOrigin(origin) {
  return {
    permissions: ["scripting"],
    origins: [originPermission(origin)],
  };
}

export async function requestPermissionForOrigin(origin) {
  try {
    await chrome.permissions.request(
      permissionsForOrigin(origin),
    );
    return true;
  } catch (err) {
    console.warn(
      "Failed to request permission for " + origin,
      err,
    );
    return false;
  }
}

export async function registerContentScriptsForOrigin(origin) {
  const id = scriptIdForOrigin(origin);
  try {
    await chrome.scripting.unregisterContentScripts({
      ids: [id]
    });
  } catch {
    // do nothing, not a problem
  }
  await chrome.scripting.registerContentScripts([
    {
      id,
      matches: [originPermission(origin)],
      js: ["src/content.js"],
      runAt: "document_start", // gives us the most flexibility - we can use DOMContentLoaded to defer stuff if needed
      world: "MAIN", // in order to monkeypatch browser APIs to listen for navigations
      persistAcrossSessions: true,
    },
  ]);
}

function scriptIdForOrigin(origin) {
  return "notificationintercept_" + encodeURIComponent(new URL(origin).origin);
}

export async function removeFromOrigin(origin) {
  const id = scriptIdForOrigin(origin);
  try {
    await chrome.scripting.unregisterContentScripts({
      ids: [id]
    });
  } catch (err) {
    console.warn('Failed to unregister content scripts', err);
  }
  try {
    await chrome.permissions.remove(
      permissionsForOrigin(origin),
    );
  } catch (err) {
    console.warn('Failed to self-revoke permissions', err);
  }
}

export async function isRegisteredForOrigin(origin) {
  const id = scriptIdForOrigin(origin);
  try {
    const scripts = await chrome.scripting.getRegisteredContentScripts({
      ids: [id]
    });
    return scripts.length > 0;
  } catch (err) {
    console.warn(`Failed to check if script is registered for '${origin}'`, err);
    return false;
  }
}

function originPermission(origin) {
  return new URL(origin).origin + "/*";
}

export async function requestPermissionForOrigin(origin) {
  try {
    await chrome.permissions.request(
      {
        permissions: ["scripting"],
        origins: [originPermission(origin)],
      },
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
  const id = "notificationintercept_" + encodeURIComponent(new URL(origin).origin);
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
      runAt: "document_start",
      persistAcrossSessions: true,
    },
  ]);
}

// Keep inactive tabs from repeatedly downloading the shared lead workspace.
// Manual refreshes and saving a call remain immediate in the calling code.
export function createBackgroundPoller(task, {
  intervalMs = 120000,
  retryMs = 300000,
  documentRef = globalThis.document,
  navigatorRef = globalThis.navigator,
  windowRef = globalThis.window,
} = {}) {
  let timer;
  let stopped = false;
  let running = false;
  let failed = false;

  function schedule(delay) {
    windowRef.clearTimeout(timer);
    if (!stopped) timer = windowRef.setTimeout(run, delay);
  }

  async function run() {
    if (stopped || running) return;
    if (documentRef.visibilityState !== 'visible' || navigatorRef.onLine === false) {
      schedule(intervalMs);
      return;
    }
    running = true;
    try { failed = (await task()) === false; }
    catch { failed = true; }
    finally { running = false; schedule(failed ? retryMs : intervalMs); }
  }

  function resume() {
    // A quota or service failure must not cause retries on every tab switch.
    if (!failed) return run();
  }
  documentRef.addEventListener('visibilitychange', resume);
  windowRef.addEventListener('online', resume);
  schedule(intervalMs);

  return () => {
    stopped = true;
    windowRef.clearTimeout(timer);
    documentRef.removeEventListener('visibilitychange', resume);
    windowRef.removeEventListener('online', resume);
  };
}

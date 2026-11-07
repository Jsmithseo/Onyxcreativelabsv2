import test from 'node:test';
import assert from 'node:assert/strict';
import { createBackgroundPoller } from '../public/dialer/backgroundPolling.mjs';

function browser() {
  let id = 0;
  const timers = new Map();
  const events = new Map();
  const target = (prefix) => ({
    addEventListener: (name, listener) => events.set(prefix + name, listener),
    removeEventListener: (name) => events.delete(prefix + name),
  });
  const documentRef = {...target('document:'), visibilityState:'visible'};
  const navigatorRef = {onLine:true};
  const windowRef = {...target('window:'),
    setTimeout: (fn, delay) => { timers.set(++id, {fn,delay}); return id; },
    clearTimeout: (key) => timers.delete(key),
  };
  return {documentRef,navigatorRef,windowRef,timers,events,
    async fire() { const [key,value] = timers.entries().next().value; timers.delete(key); await value.fn(); },
    async emit(name) { await events.get(name)?.(); },
    delay() { return timers.values().next().value?.delay; },
  };
}

test('background and offline tabs do not request data; visible tabs resume and clean up', async () => {
  const b = browser();
  let calls = 0;
  const stop = createBackgroundPoller(async()=>{ calls++; return true; }, b);
  assert.equal(b.delay(),120000);
  b.documentRef.visibilityState = 'hidden';
  await b.fire();
  assert.equal(calls,0);
  b.documentRef.visibilityState = 'visible';
  b.navigatorRef.onLine = false;
  await b.fire();
  assert.equal(calls,0);
  b.navigatorRef.onLine = true;
  await b.emit('window:online');
  assert.equal(calls,1);
  stop();
  assert.equal(b.timers.size,0);
  assert.equal(b.events.size,0);
});

test('failed requests back off and tab changes cannot cause overlapping or repeated retries', async () => {
  const b = browser();
  let calls = 0;
  let successful = false;
  const stop = createBackgroundPoller(async()=>{ calls++; return successful; }, b);
  await b.fire();
  assert.equal(calls,1);
  assert.equal(b.delay(),300000);
  await b.emit('document:visibilitychange');
  await b.emit('window:online');
  assert.equal(calls,1);
  successful = true;
  await b.fire();
  assert.equal(calls,2);
  assert.equal(b.delay(),120000);
  stop();

  const other = browser();
  let finish;
  let requests = 0;
  const dispose = createBackgroundPoller(()=>{requests++;return new Promise(resolve=>{finish=resolve;});},other);
  const pending = other.fire();
  await other.emit('document:visibilitychange');
  assert.equal(requests,1);
  dispose();
  finish(true);
  await pending;
  assert.equal(other.timers.size,0,'an unmounted dashboard must not restart its timer');
});

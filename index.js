'use strict';

const ownEnumerableKeys = require('own-enumerable-keys');

// exports

function registerToggle(userOptions) {

  // private variables

  let enabled = false;
  const originalValues = {};

  const ctx = Object.assign({
    extend: {},
    enable() {
      if (enabled) {
        throw new Error(`${ctx.id} is already enabled`);
      }
      for (const prop of ownEnumerableKeys(ctx.properties)) {
        originalValues[prop] = ctx.extend[prop];
        ctx.extend[prop] = ctx.properties[prop];
      }
      enabled = true;
    },
    enableImmediately: true,
    disable() {
      if (!enabled) {
        throw new Error(`${ctx.id} is not enabled`);
      }
      for (const prop of ownEnumerableKeys(ctx.properties)) {
        ctx.extend[prop] = originalValues[prop];
        originalValues[prop] = undefined;
      }
      enabled = false;
    },
    id: 'toggle',
    properties: {},
  }, userOptions);

  // exposed

  function enable() {
    ctx.enable();
    return disable;
  }

  function disable() {
    ctx.disable();
    return enable;
  }

  Object.assign(enable, { enable, disable });
  Object.assign(disable, { enable, disable });

  if (ctx.enableImmediately) {
    return enable();
  }

  return enable;
}

module.exports = registerToggle;

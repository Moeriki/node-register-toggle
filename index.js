'use strict';

const NOOP = () => {}; // eslint-disable-line no-empty-function

const DEFAULT_OPTIONS = {
  check: NOOP,
  enable: NOOP,
  enableImmediately: true,
  disable: NOOP,
};

function registerToggle(userOptions) {
  const options = Object.assign({}, DEFAULT_OPTIONS, userOptions);

  function enable() {
    options.check();
    options.enable();
    return disable;
  }

  function disable() {
    options.disable();
    return enable;
  }

  Object.assign(enable, { enable, disable });
  Object.assign(disable, { enable, disable });

  if (options.enableImmediately) {
    return enable();
  }

  return enable;
}

module.exports = registerToggle;

/* eslint no-magic-numbers:0 */

'use strict';

// modules

const registerToggle = require('../index');

// constants

const INITIAL = 0;
const ENABLED = 1;
const DISABLED = 2;

// tests

describe('registerToggle', () => {

  let status;
  let enable, disable;

  beforeEach(() => {
    status = INITIAL;
    enable = () => {
      status += ENABLED;
    };
    disable = () => {
      status += DISABLED;
    };
  });

  it('should not enable', () => {
    registerToggle({ enableImmediately: false, enable, disable });
    expect(status).toBe(INITIAL);
  });

  it('should enable', () => {
    registerToggle({ enableImmediately: true, enable, disable });
    expect(status).toBe(ENABLED);
  });

  it('should enable by default', () => {
    registerToggle({ enable, disable });
    expect(status).toBe(ENABLED);
  });

  it('should return enable function', () => {
    const enabler = registerToggle({ enableImmediately: false, enable, disable });
    enabler();
    expect(status).toBe(ENABLED);
  });

  it('should return disable function', () => {
    const disabler = registerToggle({ enableImmediately: true, enable, disable });
    disabler();
    expect(status).toBe(ENABLED + DISABLED);
  });

  it('should chain enable / diable functions', () => {
    const disabler = registerToggle({ enableImmediately: true, enable, disable });
    const enabler = disabler();
    expect(enabler()).toBe(disabler);
  });

  it('should infinitely chain enable / disable functions', () => {
    registerToggle()()()()()()()()()()()()()()()();
  });

  it('should return object on which you can enable / disable', () => {
    const toggle = registerToggle({ enable, enableImmediately: false, disable });
    expect(toggle.enable).toBeInstanceOf(Function);
    expect(toggle.disable).toBeInstanceOf(Function);
    toggle.enable();
    toggle.disable();
    expect(status).toBe(ENABLED + DISABLED);
  });

  it('should infinitely chain object enable / disable', () => {
    const toggle = registerToggle({ enable, enableImmediately: false, disable });
    toggle.enable().disable().enable().disable();
    expect(status).toBe((2 * ENABLED) + (2 * DISABLED));
  });

  it('should throw when enabling twice', () => {
    const toggle = registerToggle({ enableImmediately: true });
    expect(toggle.enable).toThrow();
  });

  it('should throw when disabling twice', () => {
    const toggle = registerToggle({ enableImmediately: true });
    toggle.disable();
    expect(toggle.disable).toThrow();
  });

  it('should extend with properties when enabled', () => {
    const extend = {};
    const properties = { key: 'value' };
    registerToggle({ extend, properties });
    expect(extend).toHaveProperty('key', 'value');
  });

  it('should restore original properties when disabled', () => {
    const extend = { key: 'value 1' };
    const properties = { key: 'value 2' };
    expect(extend).toHaveProperty('key', 'value 1');
    const deregister = registerToggle({ extend, properties });
    expect(extend).toHaveProperty('key', 'value 2');
    deregister();
    expect(extend).toHaveProperty('key', 'value 1');
  });

  it('should allow custom enable / disable', () => {
    const toggle = registerToggle({
      enable() {
        Number.prototype.toUNIXTime = function toUNIXTime() {
          return this / 1000;
        };
      },
      disable() {
        delete Number.prototype.toUNIXTime;
      },
    });
    expect((5000).toUNIXTime).toBeDefined();
    expect((5000).toUNIXTime).toBeInstanceOf(Function);
    expect((5000).toUNIXTime()).toBe(5);
    toggle.disable();
    expect((5000).toUNIXTime).not.toBeDefined();
  });

});

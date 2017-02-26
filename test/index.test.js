/* eslint no-magic-numbers:0 */

'use strict';

// modules

const registerToggle = require('../index');

// constants

const INITIAL = 0;
const CHECKED = 1;
const ENABLED = 2;
const DISABLED = 4;

// tests

describe('registerToggle', () => {

  let status;
  let check, enable, disable;

  beforeEach(() => {
    status = INITIAL;
    check = () => {
      status += CHECKED;
    };
    enable = () => {
      status += ENABLED;
    };
    disable = () => {
      status += DISABLED;
    };
  });

  it('should enable by default', () => {
    registerToggle({ enable, disable });
    expect(status).toBe(ENABLED);
  });

  it('should enable', () => {
    registerToggle({ enableImmediately: true, enable, disable });
    expect(status).toBe(ENABLED);
  });

  it('should not enable', () => {
    registerToggle({ enableImmediately: false, enable, disable });
    expect(status).toBe(INITIAL);
  });

  it('should check before enable', () => {
    registerToggle({ check, enableImmediately: true, enable, disable });
    expect(status).toBe(CHECKED + ENABLED);
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

});

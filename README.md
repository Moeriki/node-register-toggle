<p align="center">
  <h3 align="center">register-toggle</h3>
  <p align="center">Create a chainable toggle for registering hooks.<p>
  <p align="center">
    <a href="https://www.npmjs.com/package/register-toggle">
      <img src="https://img.shields.io/npm/v/register-toggle.svg" alt="npm version">
    </a>
    <a href="https://travis-ci.org/Moeriki/node-register-toggle">
      <img src="https://travis-ci.org/Moeriki/node-register-toggle.svg?branch=master" alt="Build Status"></img>
    </a>
    <a href="https://coveralls.io/github/Moeriki/node-register-toggle?branch=master">
      <img src="https://coveralls.io/repos/github/Moeriki/node-register-toggle/badge.svg?branch=master" alt="Coverage Status"></img>
    </a>
    <a href="https://david-dm.org/moeriki/node-register-toggle">
      <img src="https://david-dm.org/moeriki/node-register-toggle/status.svg" alt="dependencies Status"></img>
    </a>
    <a href="https://snyk.io/test/github/moeriki/node-register-toggle">
      <img src="https://snyk.io/test/github/moeriki/node-register-toggle/badge.svg" alt="Known Vulnerabilities"></img>
    </a>
  </p>
</p>

## Usage

*register.js*

```js
const registerToggle = require('register-toggle');

module.exports = registerToggle({
  check() {
    if (Number.prototype.toUNIXTime) {
      throw new Error('toUNIXTime already exists on Number.prototype');
    }
  },
  enable() {
    Number.prototype.toUNIXTime = function toUNIXTime() {
      return this / 1000;
    };
  },
  disable() {
    delete Number.prototype.toUNIXTime;
  },
});
```

*usage-1.js*

```js
const disable = require('./register');

(5000).toUNIXTime(); // 5
disable();
(5000).toUNIXTime(); // TypeError
```

*usage-2.js*

```js
const toggle = require('./register');

(5000).toUNIXTime(); // 5

toggle.disable();
(5000).toUNIXTime(); // TypeError

toggle.enable();
(5000).toUNIXTime(); // 5
```

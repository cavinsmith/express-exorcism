# Express Exorcism
[![Build Status](https://travis-ci.org/cavinsmith/express-exorcism.svg?branch=master)](https://travis-ci.org/cavinsmith/express-exorcism)
[![Coverage Status](https://coveralls.io/repos/github/cavinsmith/express-exorcism/badge.svg?branch=master)](https://coveralls.io/github/cavinsmith/express-exorcism?branch=master)
[![NPM Downloads](https://img.shields.io/npm/dm/express-exorcism.svg)](https://npmjs.org/package/express-exorcism)

[![dependencies Status](https://david-dm.org/cavinsmith/express-exorcism/status.svg)](https://david-dm.org/cavinsmith/express-exorcism)
[![devDependencies Status](https://david-dm.org/cavinsmith/express-exorcism/dev-status.svg)](https://david-dm.org/cavinsmith/express-exorcism?type=dev)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ae36f260c02340888af7949fd15a5f93)](https://www.codacy.com/app/cavinsmith/express-exorcism)

express-exorcism is an `Express.js` `Router` wrapper that helps to handle async routes.

NB: Minimal `Node` version is `7.5.0` with `--harmony` or `7.6.0`.

Installation
--------------

```sh
npm install express-exorcism --save
```

or

```sh
yarn add express-exorcism
```

Usage
--------------

Run `espress-exorcism` once before first router usage to wrap entire `express`.
e.g. right after fist `express` require:

```javascript
var express = require('express');
require('express-exorcism')(express);
var router = express.Router();
...
```

or es6

```javascript
import express from 'express'
import exorcism from 'express-exorcism'
exorcism(express)
const router = express.Router();
...
```

Singleton wrapper
--------------
By default you can wrap `express` only once with one configuration.

If you need different configurations for different routers or other strange stuff -
consider to use `singletonRouter` option to create router instance wrappers:

```javascript
var express = require('express');
var router = require('express-exorcism')(express, {singletonRouter: true});
...
```

or es6

```javascript
import express from 'express'
import exorcism from 'express-exorcism'

const router = exorcism(express, {singletonRouter: true})
...
```

NB: `router` will represent wrapped `express.Router()` instance, instead of
modifying original `express.Router` methods.


Problems?
--------------

Please [file an issue](https://github.com/cavinsmith/express-exorcism/issues) on github!

'use strict';

var methods = require('methods').concat('all');
var PREFIX = '__exorcism__';

var defaultConfig = {
  // Replace router methods (get, post, all ...) with new ones
  // replaceOriginalMethods: true,
  // Group by response variants: (send, json, jsonp, end)
  // groupByResponseMethods: false,
  // Default response method e.g. res.json(...)
  defaultResponseMethod: 'json',
  // Do not invoke any response method if result is empty string , false or null,
  ignoreEmptyResolvedData: true,
  // Replace following methods (default: all possible methods plus specific "all")
  methodList: methods,
  // When singletonRouter = true, exorcism will spawn wrapped instance of router
  // instead of wrapping entire router
  singletonRouter: false,
};

module.exports = function (express, userConfig) {
  // Mergin default and user configs
  var config = Object.assign({}, defaultConfig, userConfig || {});

  // Using client's router
  var Router = config.singletonRouter ? express.Router() : express.Router;

  // Wraps Router's method with async resolver
  function methodWrapper(routerMethod, responseMethod) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var handler = args.pop();
      var otherArguments = args;

      if (!handler || !handler.constructor || handler.constructor.name !== 'AsyncFunction') {
        return Router[PREFIX + routerMethod].apply(this, arguments);
      }

      return Router[PREFIX + routerMethod].apply(this, otherArguments.concat(function (req, res, next) {
        handler.apply(null, arguments)
          .then(function (result) {
            if (
              (config.ignoreEmptyResolvedData &&
                (result === null || result === undefined || result === false)
              ) ||
              responseMethod === 'none' ||
              !res[responseMethod]
            ) {
              return;
            } else if (responseMethod === 'end') {
              res.end();
            } else {
              res[responseMethod](result);
            }
          })
          .catch(function (error) {
            next(error);
          });
      }));
    };
  }

  config.methodList
    .map(function (methodName) {
      // Saving original method
      Router[PREFIX + methodName] = Router[methodName];
      return methodName;
    })
    // Making wrapped method
    .map(function (methodName) {
      return {
        name: methodName,
        wrapped: methodWrapper(methodName, config.defaultResponseMethod)
      };
    })
    .map(function (method) {
      // Replacing original methods
      // if (config.replaceOriginalMethods) {
      Router[method.name] = method.wrapped;
      // }
    });
  return Router;
};

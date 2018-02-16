const methods = require('methods').concat('all');

const PREFIX = '__exorcism__';

const defaultConfig = {
  // Replace router methods (get, post, all ...) with new ones
  replaceOriginalMethods: true,
  // Method group name:
  methodGroupName: 'async',
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
  // Handle async functions
  // handleAsync: true,
  // Handle sync functions and check if they return promise or not
  // handlePromises: true
  // Catch synchronous function errors and returns to use them instead of res.send and next
  // handleSync: false
};

module.exports =  (express, userConfig)=> {
  // Mergin default and user configs
  const config = Object.assign({}, defaultConfig, userConfig || {});

  // Using client's router
  const Router = config.singletonRouter ? express.Router() : express.Router;

  // Wraps Router's method with async resolver
  function methodWrapper(routerMethod, responseMethod) {
    return function (...args) {
      const args2 = Array.prototype.slice.call(args);
      const handler = args2.pop();
      const otherArguments = args2;

      if (!handler || !handler.constructor || handler.constructor.name !== 'AsyncFunction') {
        return Router[PREFIX + routerMethod].apply(this, args);
      }

      return Router[PREFIX + routerMethod].apply(this, otherArguments.concat(function (req, res, next) {
        handler(...arguments)
          .then((result) => {
            if (
              (config.ignoreEmptyResolvedData &&
                (result === null || result === undefined || result === false)
              ) ||
              responseMethod === 'none' ||
              !res[responseMethod]
            ) {

            } else if (responseMethod === 'end') {
              res.end();
            } else {
              res[responseMethod](result);
            }
          })
          .catch((error) => {
            next(error);
          });
      }));
    };
  }

  config.methodList
    .map((methodName) => {
      // Saving original method
      Router[PREFIX + methodName] = Router[methodName];
      return methodName;
    })
    // Making wrapped method
    .map((methodName) => {
      return {
        name: methodName,
        wrapped: methodWrapper(methodName, config.defaultResponseMethod),
      };
    })
    .forEach((method) => {
      // Replacing original methods
      if (config.replaceOriginalMethods) {
        Router[method.name] = method.wrapped;
      }
      // Filling group method
      Router[config.methodGroupName + method.name.charAt(0).toUpperCase() + method.name.slice(1)] = method.wrapped;
    });
  return Router;
};

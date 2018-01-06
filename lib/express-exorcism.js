const methods = require('methods').concat('all')

const PREFIX = '__exorcism__'

const defaultConfig = {
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
}

module.exports = (express, userConfig) => {
  // Mergin default and user configs
  const config = Object.assign({}, defaultConfig, userConfig || {})

  // Using client's router
  const Router = config.singletonRouter ? express.Router() : express.Router

  // Wraps Router's method with async resolver
  function methodWrapper(routerMethod, responseMethod) {
    return (...args) => {
      const handler = args.pop()
      const otherArguments = args

      if (!handler || !handler.constructor || handler.constructor.name !== 'AsyncFunction') {
        return Router[PREFIX + routerMethod].apply(this, args)
      }

      return Router[PREFIX + routerMethod].apply(this, otherArguments.concat((req, res, next) => {
        handler(...args)
          .then((result) => {
            if (
              (config.ignoreEmptyResolvedData &&
                (result === null || result === undefined || result === false)
              ) ||
              responseMethod === 'none' ||
              !res[responseMethod]
            ) {
              return false
            } else if (responseMethod === 'end') {
              return res.end()
            }
            return res[responseMethod](result)
          })
          .catch(error => next(error))
      }))
    }
  }

  config.methodList
    .map((methodName) => {
      // Saving original method
      Router[PREFIX + methodName] = Router[methodName]
      return methodName
    })
    // Making wrapped method
    .map((methodName) => ({
      name: methodName,
      wrapped: methodWrapper(methodName, config.defaultResponseMethod),
    }))
    .forEach((method) => {
      // Replacing original methods
      // if (config.replaceOriginalMethods) {
      Router[method.name] = method.wrapped
      // }
    })
  return Router
}

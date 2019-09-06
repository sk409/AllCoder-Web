/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);
  config.method = config.method ? config.method.toLowerCase() : 'get';

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var isAbsoluteURL = __webpack_require__(/*! ./../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ./../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach([
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
    'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
    'socketPath'
  ], function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/DevelopmentView.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/DevelopmentView.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _file_tree_FileCreationView_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./file-tree/FileCreationView.vue */ "./resources/js/components/development/file-tree/FileCreationView.vue");
/* harmony import */ var _file_tree_FileTree_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./file-tree/FileTree.vue */ "./resources/js/components/development/file-tree/FileTree.vue");
/* harmony import */ var _file_tree_FileTreeContextMenu_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./file-tree/FileTreeContextMenu.vue */ "./resources/js/components/development/file-tree/FileTreeContextMenu.vue");
/* harmony import */ var _editor_SourceCodeEditor_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./editor/SourceCodeEditor.vue */ "./resources/js/components/development/editor/SourceCodeEditor.vue");
/* harmony import */ var _editor_SourceCodeEditorContextMenu_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor/SourceCodeEditorContextMenu.vue */ "./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue");
/* harmony import */ var _file_tree_FileTreeItemDeletable_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./file-tree/FileTreeItemDeletable.js */ "./resources/js/components/development/file-tree/FileTreeItemDeletable.js");
/* harmony import */ var _file_tree_FileTreeItemFetchable_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./file-tree/FileTreeItemFetchable.js */ "./resources/js/components/development/file-tree/FileTreeItemFetchable.js");
/* harmony import */ var _file_tree_FileUpdatable_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./file-tree/FileUpdatable.js */ "./resources/js/components/development/file-tree/FileUpdatable.js");
/* harmony import */ var _question_QuestionItem_vue__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./question/QuestionItem.vue */ "./resources/js/components/development/question/QuestionItem.vue");
/* harmony import */ var _question_QuestionAddable_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./question/QuestionAddable.js */ "./resources/js/components/development/question/QuestionAddable.js");
/* harmony import */ var _question_QuestionFetchable_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./question/QuestionFetchable.js */ "./resources/js/components/development/question/QuestionFetchable.js");
/* harmony import */ var _question_QuestionUpdatable_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./question/QuestionUpdatable.js */ "./resources/js/components/development/question/QuestionUpdatable.js");
/* harmony import */ var _description_Description_vue__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./description/Description.vue */ "./resources/js/components/development/description/Description.vue");
/* harmony import */ var _description_DescriptionFetchable_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./description/DescriptionFetchable.js */ "./resources/js/components/development/description/DescriptionFetchable.js");
/* harmony import */ var _description_PostDescriptionTarget_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./description/PostDescriptionTarget.js */ "./resources/js/components/development/description/PostDescriptionTarget.js");
/* harmony import */ var _description_FetchDescriptionTargets_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./description/FetchDescriptionTargets.js */ "./resources/js/components/development/description/FetchDescriptionTargets.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
















/* harmony default export */ __webpack_exports__["default"] = ({
  name: "development-view",
  props: {
    lessonId: Number,
    lessonTitle: String,
    plusButtonUrl: String,
    prevButtonUrl: String,
    nextButtonUrl: String,
    crossButtonUrl: String
  },
  data: function data() {
    return {
      file: null,
      fileCreationView: {
        isShown: false
      },
      fileTree: {
        rootItem: {
          id: null,
          isFile: false,
          children: []
        },
        contextMenu: {
          isFile: false,
          isShown: false,
          left: 0,
          top: 0,
          itemId: null,
          itemChildren: null
        }
      },
      sourceCodeEditor: {
        disabled: true,
        contextMenu: {
          isShown: false,
          left: 0,
          top: 0,
          target: null
        }
      },
      questions: [],
      isFetchingQuestions: false,
      description: {
        selectedDescription: null,
        descriptions: null,
        targets: []
      }
    };
  },
  mixins: [_file_tree_FileTreeItemDeletable_js__WEBPACK_IMPORTED_MODULE_5__["default"], _file_tree_FileTreeItemFetchable_js__WEBPACK_IMPORTED_MODULE_6__["default"], _file_tree_FileUpdatable_js__WEBPACK_IMPORTED_MODULE_7__["default"], _question_QuestionAddable_js__WEBPACK_IMPORTED_MODULE_9__["default"], _question_QuestionFetchable_js__WEBPACK_IMPORTED_MODULE_10__["default"], _question_QuestionUpdatable_js__WEBPACK_IMPORTED_MODULE_11__["default"], _description_DescriptionFetchable_js__WEBPACK_IMPORTED_MODULE_13__["default"]],
  components: {
    FileTreeContextMenu: _file_tree_FileTreeContextMenu_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    FileTree: _file_tree_FileTree_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    FileCreationView: _file_tree_FileCreationView_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    SourceCodeEditorContextMenu: _editor_SourceCodeEditorContextMenu_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    QuestionItem: _question_QuestionItem_vue__WEBPACK_IMPORTED_MODULE_8__["default"],
    SourceCodeEditor: _editor_SourceCodeEditor_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    Description: _description_Description_vue__WEBPACK_IMPORTED_MODULE_12__["default"]
  },
  created: function created() {
    this.buildFileTree(this.lessonId, this.fileTree.rootItem);
  },
  methods: {
    onclick: function onclick() {
      //console.log("ONCLICK");
      this.fileTree.contextMenu.isShown = false;
      this.sourceCodeEditor.contextMenu.isShown = false;
      this.sourceCodeEditor.isClicked = true;
    },
    onundo: function onundo() {
      alert("ごめんなさい!UNDO機能はまだ実装していません。");
    },
    onFlieCreationViewCancelButtonClick: function onFlieCreationViewCancelButtonClick() {
      this.fileCreationView.isShown = false;
    },
    onShowFileCreationView: function onShowFileCreationView() {
      this.fileCreationView.isShown = true;
    },
    onUpdateFileText: function onUpdateFileText(text) {
      if (this.isFetchingQuestions) {
        console.log("---------ERROR---------");
        console.log("QuestionをFetch中です。");
        console.log("---------ERROR---------");
      }

      this.file.text = text;
      this.updateFileText(this.file.id, this.file.text);
    },
    onAddQuestion: function onAddQuestion() {
      var _this = this;

      var selectionStart = this.sourceCodeEditor.contextMenu.target.selectionStart;
      var selectionEnd = this.sourceCodeEditor.contextMenu.target.selectionEnd;
      var answer = this.sourceCodeEditor.contextMenu.target.value.substring(selectionStart, selectionEnd);
      this.addQuestion(selectionStart, selectionEnd, this.file.id, function (id) {
        _this.questions.push({
          id: id,
          hasUpdated: false,
          hasDeleted: false,
          startIndex: selectionStart,
          endIndex: selectionEnd,
          answer: answer
        });
      });
    },
    onAddDescriptionTarget: function onAddDescriptionTarget() {
      var selectionStart = this.sourceCodeEditor.contextMenu.target.selectionStart;
      var selectionEnd = this.sourceCodeEditor.contextMenu.target.selectionEnd;
      var that = this;
      Object(_description_PostDescriptionTarget_js__WEBPACK_IMPORTED_MODULE_14__["postDescriptionTarget"])(selectionStart, selectionEnd, this.description.selectedDescription.id, function (description) {
        that.description.targets.push(description);
      });
    },
    onUpdateQuestion: function onUpdateQuestion(id, startIndex, endIndex) {
      var question = null;

      if (question = this.questions.find(function (question) {
        return question.id === id;
      })) {
        question.hasUpdated = true;
        question.startIndex = startIndex;
        question.endIndex = endIndex;
        question.answer = this.file.text.substring(question.startIndex, question.endIndex);
        this.questions = this.questions;
      }
    },
    onUpdateDescriptionTarget: function onUpdateDescriptionTarget(id, startIndex, endIndex) {
      var descriptionTarget = null;

      if (descriptionTarget = this.description.targets.find(function (descriptionTarget) {
        return descriptionTarget.id === id;
      })) {
        descriptionTarget.hasUpdated = true;
        descriptionTarget.startIndex = startIndex;
        descriptionTarget.endIndex = endIndex;
        console.log("DescriptionTarget: " + this.file.text.substring(startIndex, endIndex));
        this.description.targets = this.description.targets;
      }
    },
    onRemoveFileTreeItem: function onRemoveFileTreeItem(id, isFile) {
      //console.log(id);
      var that = this;

      var deleter = function deleter(item) {
        if (item.isFile) {
          if (that.file.id === item.id) {
            that.file = null;
            that.sourceCodeEditor.disabled = true;
          }

          that.deleteFile(item.id);
        } else {
          that.deleteFolder(item.id);
        }

        item.children.forEach(function (child) {
          deleter(child);
        });
      };

      var remover = function remover(item) {
        var found = false;

        for (var index = 0; index < item.children.length; ++index) {
          if (item.children[index].id === id && item.children[index].isFile === isFile) {
            found = true;
            deleter(item.children[index]);
            item.children.splice(index, 1);
            break;
          }
        }

        if (found) {
          return true;
        } else {
          for (var _index = 0; _index < item.children.length; ++_index) {
            if (remover(item.children[_index])) {
              return true;
            }
          }
        }

        return false;
      };

      remover(this.fileTree.rootItem);
    },
    onSetDescription: function onSetDescription(selectedDescription) {
      this.description.selectedDescription = selectedDescription;
    },
    onSetQuestions: function onSetQuestions(questions) {
      this.questions = questions; //console.log(this.questions);
    },
    onSetDescriptionTargets: function onSetDescriptionTargets(descriptionTargets) {
      this.description.targets = descriptionTargets;
    },
    showFileTreeContextMenu: function showFileTreeContextMenu(isFile, originX, originY, itemId, itemChildren) {
      this.fileTree.contextMenu.isFile = isFile;
      this.fileTree.contextMenu.isShown = true;
      this.fileTree.contextMenu.left = originX;
      this.fileTree.contextMenu.top = originY;
      this.fileTree.contextMenu.itemId = itemId;
      this.fileTree.contextMenu.itemChildren = itemChildren;
    },
    showSourceCodeEditorContextMenu: function showSourceCodeEditorContextMenu(e) {
      this.sourceCodeEditor.contextMenu.isShown = true;
      this.sourceCodeEditor.contextMenu.left = e.pageX;
      this.sourceCodeEditor.contextMenu.top = e.pageY;
      this.sourceCodeEditor.contextMenu.target = e.target;
    },
    setFile: function setFile(file) {
      this.file = file;
      this.questions = [];
      this.isFetchingQuestions = true;
      var that = this;
      this.fetchQuestions(file.id, function (response) {
        var _that$questions;

        //console.log(response);
        (_that$questions = that.questions).push.apply(_that$questions, _toConsumableArray(response.data.map(function (question) {
          return {
            id: question.id,
            hasUpdated: false,
            hasDeleted: false,
            startIndex: question.start_index,
            endIndex: question.end_index,
            answer: that.file.text.substring(question.start_index, question.end_index)
          };
        })));

        that.isFetchingQuestions = false;
      });
      this.fetchDescriptions(file.id, function (descriptions) {
        that.description.descriptions = descriptions;
        that.description.targets = [];
        descriptions.forEach(function (description) {
          Object(_description_FetchDescriptionTargets_js__WEBPACK_IMPORTED_MODULE_15__["fetchDescriptionTargets"])(description.id, function (descriptionTargets) {
            var _that$description$tar;

            (_that$description$tar = that.description.targets).push.apply(_that$description$tar, _toConsumableArray(descriptionTargets));
          });
        });
      });
      this.sourceCodeEditor.disabled = false;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/description/Description.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/description/Description.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DescriptionCreatable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DescriptionCreatable.js */ "./resources/js/components/development/description/DescriptionCreatable.js");
/* harmony import */ var _UpdateDescription_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UpdateDescription.js */ "./resources/js/components/development/description/UpdateDescription.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  name: "description",
  props: {
    fileId: Number,
    descriptions: Array,
    plusButtonUrl: String,
    prevButtonUrl: String,
    nextButtonUrl: String,
    crossButtonUrl: String
  },
  mixins: [_DescriptionCreatable_js__WEBPACK_IMPORTED_MODULE_0__["default"]],
  data: function data() {
    return {
      descriptionList: {
        isShown: true
      },
      editingView: {
        isShown: false,
        description: Object
      },
      delayedUpdate: _.debounce(this.updateDescription, 500)
    };
  },
  methods: {
    onAppendDescription: function onAppendDescription() {
      var that = this;
      var index = this.descriptions.length ? Math.max.apply(Math, _toConsumableArray(this.descriptions.map(function (description) {
        return description.index;
      }))) + 1 : 0;
      this.createDescription(index, "", this.fileId, function (description) {
        that.descriptions.push(description);
      });
    },
    onSlideDownDescriptionList: function onSlideDownDescriptionList(descriptionId) {
      this.descriptionList.isShown = false;
      this.editingView.description = this.descriptions.find(function (description) {
        return description.id === descriptionId;
      });
      this.$emit("set-description", this.editingView.description);
    },
    onInputDescription: function onInputDescription(e) {
      this.editingView.description.text = e.target.value;
      this.delayedUpdate();
    },
    onCloseEditingView: function onCloseEditingView() {
      this.editingView.isShown = false;
    },
    onAfterLeaveSlideUpEditingView: function onAfterLeaveSlideUpEditingView() {
      this.descriptionList.isShown = true;
    },
    onAfterLeaveSlideDownDescriptionList: function onAfterLeaveSlideDownDescriptionList() {
      this.editingView.isShown = true;
    },
    updateDescription: function updateDescription() {
      Object(_UpdateDescription_js__WEBPACK_IMPORTED_MODULE_1__["updateDescription"])(this.editingView.description.id, this.editingView.description.index, this.editingView.description.text, this.fileId);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/editor/SourceCodeEditor.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/editor/SourceCodeEditor.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _question_QuestionUpdatable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../question/QuestionUpdatable.js */ "./resources/js/components/development/question/QuestionUpdatable.js");
/* harmony import */ var q__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! q */ "./node_modules/q/q.js");
/* harmony import */ var q__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(q__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _question_DeleteQuestions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../question/DeleteQuestions.js */ "./resources/js/components/development/question/DeleteQuestions.js");
/* harmony import */ var _description_UpdateDescriptionTarget_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../description/UpdateDescriptionTarget.js */ "./resources/js/components/development/description/UpdateDescriptionTarget.js");
/* harmony import */ var _description_DeleteDescriptionTargets_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../description/DeleteDescriptionTargets.js */ "./resources/js/components/development/description/DeleteDescriptionTargets.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
 //import QuestionDeletable from "../question/QuestionDeletable.js";





/* harmony default export */ __webpack_exports__["default"] = ({
  name: "source-code-editor",
  props: {
    text: String,
    questions: Array,
    descriptionTargets: Array,
    disabled: Boolean
  },
  mixins: [_question_QuestionUpdatable_js__WEBPACK_IMPORTED_MODULE_0__["default"]],
  data: function data() {
    return {
      textarea: null,
      textBeforeInput: null,
      selectedRangeBeforeInput: null,
      pastedText: null,
      inputQueue: q__WEBPACK_IMPORTED_MODULE_1__["Promise"].resolve(),
      delayedUpdate: _.debounce(this.update, 500)
    };
  },
  methods: {
    oninput: function oninput(e) {
      var that = this;
      var selectionStart = e.target.selectionStart;
      var selectionEnd = e.target.selectionEnd;
      var selectedRangeBeforeInput = this.selectedRangeBeforeInput ? {
        start: this.selectedRangeBeforeInput.start,
        end: this.selectedRangeBeforeInput.end
      } : null;

      if (e.inputType === "insertText" || e.inputType === "insertLineBreak") {
        this.inputQueue.then(function () {
          that.insertText(selectedRangeBeforeInput, selectionStart, selectionEnd);
        });
      } else if (e.inputType === "deleteContentBackward") {
        this.inputQueue.then(function () {
          that.deleteContentBackward(selectedRangeBeforeInput, selectionStart, selectionEnd);
        });
      } else if (e.inputType === "insertFromPaste") {
        //console.log(e);
        this.inputQueue.then(function () {
          that.insertFromPaste(selectedRangeBeforeInput, selectionStart, selectionEnd);
        });
      } else if (e.inputType === "deleteByCut") {
        this.inputQueue.then(function () {
          that.deleteByCut(selectedRangeBeforeInput, selectionStart, selectionEnd);
        });
      } //else if (e.inputType === "historyUndo") {
      //     this.queue.then(this.historyUndo(e));
      // } else if (e.inputType === "historyRedo") {
      //     this.queue.then(this.historyRedo(e));
      // }


      this.textarea = e.target;
      this.selectedRangeBeforeInput = null;
    },
    onclick: function onclick(e) {
      this.selectedRangeBeforeInput = null;
    },
    onselect: function onselect(e) {
      //console.log("ONSELECT: " + e.target.selectionStart + ", " + e.target.selectionEnd);
      this.selectedRangeBeforeInput = {
        start: e.target.selectionStart,
        end: e.target.selectionEnd
      };
    },
    onfocus: function onfocus(e) {
      //console.log("FOCUS");
      this.selectedRangeBeforeInput = null;
    },
    onpaste: function onpaste(e) {
      this.pastedText = e.clipboardData.getData("text");
    },
    onArrowKeyDown: function onArrowKeyDown(e) {
      this.selectedRangeBeforeInput = null;
    },
    oncontextmenu: function oncontextmenu(e) {
      this.$emit("show-context-menu", e);
    },
    insertText: function insertText(selectedRangeBeforeInput, selectionStart, selectionEnd) {
      var _this = this;

      //console.log("(" + selectionStart + ", " + selectionEnd + ")");
      // console.log(selectedRangeBeforeInput);
      // console.log(getSelection().toString());
      //console.log(this.questions);
      //const deletedQuestionIds = [];
      var that = this;

      if (selectedRangeBeforeInput === null || selectedRangeBeforeInput.start === selectedRangeBeforeInput.end) {
        var caretPosition = selectionStart - 1;
        this.questions.concat(this.descriptionTargets).forEach(function (item) {
          //console.log(item.startIndex);
          var updated = false;

          if (caretPosition <= item.startIndex) {
            //console.log("START");
            ++item.startIndex;
            updated = true;
          }

          if (caretPosition < item.endIndex) {
            //console.log("END");
            ++item.endIndex;
            updated = true;
          }

          if (updated) {
            item.hasUpdated = true;
            that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
          }
        });
      } else {
        this.questions.concat(this.descriptionTargets).forEach(function (item) {
          if (selectedRangeBeforeInput.start <= item.startIndex && item.endIndex <= selectedRangeBeforeInput.end //  |---[---]---|
          ) {
              item.hasDeleted = true;

              _this.delayedUpdate();
            } else {
            if (selectedRangeBeforeInput.start <= item.startIndex && item.startIndex <= selectedRangeBeforeInput.end && selectedRangeBeforeInput.end < item.endIndex //  |---[---|---)
            ) {
                item.startIndex = selectedRangeBeforeInput.start + 1;
                item.endIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start - 1;
              } else if (item.startIndex < selectedRangeBeforeInput.start && selectedRangeBeforeInput.start <= item.endIndex && item.endIndex <= selectedRangeBeforeInput.end // (---|---]---|
            ) {
                item.endIndex = selectedRangeBeforeInput.start;
              } else if (item.startIndex < selectedRangeBeforeInput.start && selectedRangeBeforeInput.end < item.endIndex // (---|---|---)
            ) {
                item.endIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start - 1;
              } else if (selectedRangeBeforeInput.end < item.startIndex) {
              // |---|---(---)
              item.startIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start - 1;
              item.endIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start - 1;
            }

            item.hasUpdated = !(item.endIndex < selectedRangeBeforeInput.start); //  (---)---[---]

            that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
          }
        });
      } // if (deletedQuestionIds.length) {
      //     this.$emit("remove-questions", deletedQuestionIds);
      // }

    },
    deleteContentBackward: function deleteContentBackward(selectedRangeBeforeInput, selectionStart, selectionEnd) {
      var _this2 = this;

      //console.log("(" + selectionStart + ", " + selectionEnd + ")");
      //console.log(selectedRangeBeforeInput);
      var that = this;

      if (selectedRangeBeforeInput === null || selectedRangeBeforeInput.start === selectedRangeBeforeInput.end) {
        var caretPosition = selectionStart + 1; //console.log(caretPosition);

        this.questions.concat(this.descriptionTargets).forEach(function (item) {
          var updated = false; // console.log(question.startIndex);
          // console.log(question.endIndex);

          if (caretPosition <= item.startIndex) {
            //console.log("START");
            --item.startIndex;
            updated = true;
          }

          if (caretPosition <= item.endIndex) {
            //console.log("END");
            --item.endIndex;
            updated = true;
          }

          if (updated) {
            if (item.endIndex - item.startIndex == 0) {
              item.hasDeleted = true;
            } else {
              item.hasUpdated = true;
              that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
            }
          }
        });
      } else {
        this.questions.concat(this.descriptionTargets).forEach(function (item) {
          if (selectedRangeBeforeInput.start <= item.startIndex && item.endIndex <= selectedRangeBeforeInput.end //  |---[---]---|
          ) {
              item.hasDeleted = true;

              _this2.delayedUpdate();
            } else {
            if (selectedRangeBeforeInput.start <= item.startIndex && item.startIndex <= selectedRangeBeforeInput.end && selectedRangeBeforeInput.end < item.endIndex //  |---[---|---)
            ) {
                item.startIndex = selectedRangeBeforeInput.start;
                item.endIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
              } else if (item.startIndex < selectedRangeBeforeInput.start && selectedRangeBeforeInput.start <= item.endIndex && item.endIndex <= selectedRangeBeforeInput.end // (---|---]---|
            ) {
                item.endIndex = selectedRangeBeforeInput.start;
              } else if (item.startIndex < selectedRangeBeforeInput.start && selectedRangeBeforeInput.end < item.endIndex // (---|---|---)
            ) {
                item.endIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
              } else if (selectedRangeBeforeInput.end < item.startIndex) {
              // |---|---(---)
              item.startIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
              item.endIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
            }

            item.hasUpdated = !(item.endIndex < selectedRangeBeforeInput.start); //  (---)---[---]

            that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
          }
        });
      }
    },
    insertFromPaste: function insertFromPaste(selectedRangeBeforeInput, selectionStart, selectionEnd) {
      var _this3 = this;

      var that = this;

      if (selectedRangeBeforeInput === null || selectedRangeBeforeInput.start === selectedRangeBeforeInput.end) {
        var caretPosition = selectionStart - this.pastedText.length;
        this.questions.concat(this.descriptionTargets).forEach(function (item) {
          var updated = false; // console.log(question.startIndex);
          // console.log(question.endIndex);

          if (caretPosition <= item.startIndex) {
            //console.log("START");
            item.startIndex += _this3.pastedText.length;
            updated = true;
          }

          if (caretPosition < item.endIndex) {
            //console.log("END");
            item.endIndex += _this3.pastedText.length;
            updated = true;
          }

          if (updated) {
            item.hasUpdated = true;
            that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
          }
        });
      } else {
        this.questions.concat(this.descriptionTargets).forEach(function (item) {
          if (selectedRangeBeforeInput.start <= item.startIndex && item.endIndex <= selectedRangeBeforeInput.end //  |---[---]---|
          ) {
              item.hasDeleted = true;

              _this3.delayedUpdate();
            } else {
            if (selectedRangeBeforeInput.start <= item.startIndex && item.startIndex <= selectedRangeBeforeInput.end && selectedRangeBeforeInput.end < item.endIndex //  |---[---|---)
            ) {
                item.startIndex = selectedRangeBeforeInput.start + _this3.pastedText.length;
                item.endIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
                item.endIndex += _this3.pastedText.length;
              } else if (item.startIndex < selectedRangeBeforeInput.start && selectedRangeBeforeInput.start <= item.endIndex && item.endIndex <= selectedRangeBeforeInput.end // (---|---]---|
            ) {
                item.endIndex = selectedRangeBeforeInput.start;
              } else if (item.startIndex < selectedRangeBeforeInput.start && selectedRangeBeforeInput.end < item.endIndex // (---|---|---)
            ) {
                item.endIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
                item.endIndex += _this3.pastedText.length;
              } else if (selectedRangeBeforeInput.end < item.startIndex) {
              // |---|---(---)
              item.startIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
              item.startIndex += _this3.pastedText.length;
              item.endIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
              item.endIndex += _this3.pastedText.length;
            }

            item.hasUpdated = !(item.endIndex < selectedRangeBeforeInput.start); //  (---)---[---]

            that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
          }
        });
      }
    },
    deleteByCut: function deleteByCut(selectedRangeBeforeInput, selectionStart, selectionEnd) {
      var _this4 = this;

      //console.log("(" + selectionStart + ", " + selectionEnd + ")");
      //console.log(selectedRangeBeforeInput);
      var that = this;
      this.questions.concat(this.descriptionTargets).forEach(function (item) {
        if (selectedRangeBeforeInput.start <= item.startIndex && item.endIndex <= selectedRangeBeforeInput.end //  |---[---]---|
        ) {
            item.hasDeleted = true;

            _this4.delayedUpdate();
          } else {
          if (selectedRangeBeforeInput.start <= item.startIndex && item.startIndex <= selectedRangeBeforeInput.end && selectedRangeBeforeInput.end < item.endIndex //  |---[---|---)
          ) {
              item.startIndex = selectedRangeBeforeInput.start;
              item.endIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
            } else if (item.startIndex < selectedRangeBeforeInput.start && selectedRangeBeforeInput.start <= item.endIndex && item.endIndex <= selectedRangeBeforeInput.end // (---|---]---|
          ) {
              item.endIndex = selectedRangeBeforeInput.start;
            } else if (item.startIndex < selectedRangeBeforeInput.start && selectedRangeBeforeInput.end < item.endIndex // (---|---|---)
          ) {
              item.endIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
            } else if (selectedRangeBeforeInput.end < item.startIndex) {
            // |---|---(---)
            item.startIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
            item.endIndex -= selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
          }

          item.hasUpdated = !(item.endIndex < selectedRangeBeforeInput.start); //  (---)---[---]

          that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
        }
      });
    },
    // historyUndo(e) {
    // },
    // historyRedo(e) {
    // },
    appendUpdatingTask: function appendUpdatingTask(id, startIndex, endIndex) {
      this.delayedUpdate();
    },
    // appendDeletingTask(id) {
    //     console.log("DELETE");
    //     const that = this;
    //     this.apiQueue.then(function() {
    //         that.deleteQuestion(id);
    //     });
    // },
    update: function update() {
      console.log("UPDATE");
      this.$emit("update-file-text", this.textarea.value);
      var that = this;

      var deleter = function deleter(items, isQuestion) {
        var deletedItemIds = items.filter(function (item) {
          return item.hasDeleted;
        }).map(function (item) {
          return item.id;
        });

        if (deletedItemIds.length) {
          if (isQuestion) {
            console.log("Delete Question.");
            Object(_question_DeleteQuestions_js__WEBPACK_IMPORTED_MODULE_2__["deleteQuestions"])(deletedItemIds);
          } else {
            console.log("Delete DescriptionTargets.");
            Object(_description_DeleteDescriptionTargets_js__WEBPACK_IMPORTED_MODULE_4__["deleteDescriptionTargets"])(deletedItemIds);
          }
        }
      };

      deleter(this.questions, true);
      deleter(this.descriptionTargets, false);
      this.$emit("set-questions", this.questions.filter(function (question) {
        return !question.hasDeleted;
      }));
      this.$emit("set-description-targets", this.descriptionTargets.filter(function (descriptionTarget) {
        return !descriptionTarget.hasDeleted;
      }));
      Vue.nextTick(function () {
        var updater = function updater(items, isQuestion) {
          items.forEach(function (item) {
            if (item.hasUpdated) {
              if (isQuestion) {
                that.updateQuestion(item.id, {
                  start_index: item.startIndex,
                  end_index: item.endIndex
                });
                that.$emit("update-question", item.id, item.startIndex, item.endIndex);
              } else {
                Object(_description_UpdateDescriptionTarget_js__WEBPACK_IMPORTED_MODULE_3__["updateDescriptionTarget"])(item.id, item.startIndex, item.endIndex, item.descriptionId);
                that.$emit("update-description-target", item.id, item.startIndex, item.endIndex);
              }

              item.hasUpdated = false;
            }
          });
        };

        updater(that.questions, true); //console.log(that.descriptionTargets);

        updater(that.descriptionTargets, false);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  name: "source-code-editor-context-menu",
  props: {
    left: Number,
    top: Number,
    isDescriptionSelected: Boolean
  },
  methods: {
    onAddQuestion: function onAddQuestion() {
      this.$emit("add-question");
    },
    onAddDescriptionTarget: function onAddDescriptionTarget() {
      this.$emit("add-description-target");
    },
    isTextSelected: function isTextSelected() {
      return getSelection().toString().length;
    }
  },
  computed: {
    style: function style() {
      return {
        left: this.left + "px",
        top: this.top + "px"
      };
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileCreationView.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/file-tree/FileCreationView.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileTreeItemAppendable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileTreeItemAppendable.js */ "./resources/js/components/development/file-tree/FileTreeItemAppendable.js");
/* harmony import */ var _FilecreationViewFileItem_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FilecreationViewFileItem.vue */ "./resources/js/components/development/file-tree/FilecreationViewFileItem.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  name: "file-creation-view",
  props: {
    lessonId: Number,
    itemId: Number,
    itemChildren: Array
  },
  components: {
    FilecCreationViewFileItem: _FilecreationViewFileItem_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  mixins: [_FileTreeItemAppendable_js__WEBPACK_IMPORTED_MODULE_0__["default"]],
  data: function data() {
    return {
      fileName: "test.html",
      fileItems: [{
        imageUrl: "",
        name: "HTML"
      }, {
        imageUrl: "",
        name: "CSS"
      }, {
        imageUrl: "",
        name: "JavaScript"
      }, {
        imageUrl: "",
        name: "PHP"
      }, {
        imageUrl: "",
        name: "Perl"
      }]
    };
  },
  methods: {
    onCancelButtonClick: function onCancelButtonClick() {
      this.$emit("cancel");
    },
    onCreateFile: function onCreateFile() {
      this.appendFile(this.lessonId, this.itemId, this.itemChildren, this.fileName);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileTree.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/file-tree/FileTree.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileTreeItem_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileTreeItem.vue */ "./resources/js/components/development/file-tree/FileTreeItem.vue");
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: "file-tree",
  props: {
    rootItem: Object
  },
  components: {
    FileTreeItem: _FileTreeItem_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  methods: {
    oncontextmenu: function oncontextmenu(e) {
      this.showContextMenu(false, e, this.rootItem.id, this.rootItem.children);
    },
    showContextMenu: function showContextMenu(isFile, e, id, children) {
      this.$emit("show-context-menu", isFile, e.pageX, e.pageY, id, children);
    },
    setFile: function setFile(file) {
      this.$emit("set-file", file);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileTreeContextMenu.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/file-tree/FileTreeContextMenu.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileTreeItemAppendable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileTreeItemAppendable.js */ "./resources/js/components/development/file-tree/FileTreeItemAppendable.js");
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: "file-tree-context-menu",
  props: {
    isFile: Boolean,
    left: Number,
    top: Number,
    lessonId: Number,
    itemId: Number,
    itemChildren: Array
  },
  mixins: [_FileTreeItemAppendable_js__WEBPACK_IMPORTED_MODULE_0__["default"]],
  methods: {
    onAppendFolder: function onAppendFolder() {
      this.appendFolder(this.lessonId, this.itemId, this.itemChildren);
    },
    onShowFileCreationView: function onShowFileCreationView() {
      this.$emit("show-file-creation-view");
    },
    onRemove: function onRemove() {
      this.$emit("remove-file-tree-item", this.itemId, this.isFile);
    }
  },
  computed: {
    style: function style() {
      return {
        left: this.left + "px",
        top: this.top + "px"
      };
    },
    isFolder: function isFolder() {
      return !this.isFile;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileTreeItem.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/file-tree/FileTreeItem.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  name: "file-tree-item",
  props: {
    item: Object
  },
  data: function data() {
    return {
      isExpanded: true
    };
  },
  computed: {
    doesHaveItemName: function doesHaveItemName() {
      return this.item && this.item.hasOwnProperty("name");
    },
    doesHaveItemChildren: function doesHaveItemChildren() {
      return this.item && this.item.hasOwnProperty("children") && this.item.children.length;
    }
  },
  methods: {
    onclick: function onclick() {
      if (this.item.isFile) {
        this.$emit("set-file", this.item);
      } else {
        this.isExpanded = !this.isExpanded;
      }
    },
    oncontextmenu: function oncontextmenu(e) {
      this.showContextMenu(this.item.isFile, e, this.item.id, this.item.children);
    },
    showContextMenu: function showContextMenu(isFile, e, id, children) {
      this.$emit('show-context-menu', isFile, e, id, children);
    },
    setFile: function setFile(file) {
      this.$emit("set-file", file);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FilecreationViewFileItem.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/file-tree/FilecreationViewFileItem.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  name: "file-creation-view-file-item",
  props: {
    imageUrl: String,
    name: String
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/question/QuestionItem.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/question/QuestionItem.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  name: "question-item",
  props: {
    answer: String
  },
  methods: {
    onclick: function onclick() {
      console.log(this.answer);
    } // escape(text) {
    //     if (!text) {
    //         return;
    //     }
    //     return text.replace(/[<>&"'`]/g, function(match) {
    //         const escape = {
    //             '<': '&lt;',
    //             '>': '&gt;',
    //             '&': '&amp;',
    //             '"': '&quot;',
    //             "'": '&#39;',
    //             '`': '&#x60;'
    //         };
    //         return escape[match];
    //     });
    // },
    // nl2br(text) {
    //     if (!text) {
    //         return;
    //     }
    //     return text.replace(/\r?\n/g, "<br>");
    // }

  }
});

/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/q/q.js":
/*!*****************************!*\
  !*** ./node_modules/q/q.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2017 Kris Kowal under the terms of the MIT
 * license found at https://github.com/kriskowal/q/blob/v1/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    "use strict";

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (true) {
        module.exports = definition();

    // RequireJS
    } else { var previousQ, global; }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;
    // queue for late tasks, used by unhandled rejection tracking
    var laterQueue = [];

    function flush() {
        /* jshint loopfunc: true */
        var task, domain;

        while (head.next) {
            head = head.next;
            task = head.task;
            head.task = void 0;
            domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }
            runSingle(task, domain);

        }
        while (laterQueue.length) {
            task = laterQueue.pop();
            runSingle(task);
        }
        flushing = false;
    }
    // runs a single function in the async queue
    function runSingle(task, domain) {
        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process === "object" &&
        process.toString() === "[object process]" && process.nextTick) {
        // Ensure Q is in a real Node environment, with a `process.nextTick`.
        // To see through fake Node environments:
        // * Mocha test runner - exposes a `process` global without a `nextTick`
        // * Browserify - exposes a `process.nexTick` function that uses
        //   `setTimeout`. In this case `setImmediate` is preferred because
        //    it is faster. Browserify's `process.toString()` yields
        //   "[object Object]", while in a real Node environment
        //   `process.toString()` yields "[object process]".
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
    // runs a task after all other tasks have been run
    // this is useful for unhandled rejection tracking that needs to happen
    // after all `then`d tasks have been run.
    nextTick.runAfter = function (task) {
        laterQueue.push(task);
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };
    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_defineProperty = Object.defineProperty || function (obj, prop, descriptor) {
    obj[prop] = descriptor.value;
    return obj;
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack && (!error.__minimumStackCounter__ || error.__minimumStackCounter__ > p.stackCounter)) {
                object_defineProperty(error, "__minimumStackCounter__", {value: p.stackCounter, configurable: true});
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        var stack = filterStackString(concatedStacks);
        object_defineProperty(error, "stack", {value: stack, configurable: true});
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (value instanceof Promise) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

/**
 * The counter is used to determine the stopping point for building
 * long stack traces. In makeStackTraceLong we walk backwards through
 * the linked list of promises, only stacks which were created before
 * the rejection are concatenated.
 */
var longStackCounter = 1;

// enable long stacks if Q_DEBUG is set
if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
    Q.longStackSupport = true;
}

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            Q.nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
            promise.stackCounter = longStackCounter++;
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;

        if (Q.longStackSupport && hasStacks) {
            // Only hold a reference to the new promise if long stacks
            // are enabled to reduce memory usage
            promise.source = newPromise;
        }

        array_reduce(messages, function (undefined, message) {
            Q.nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            Q.nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Q can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become settled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be settled
 */
Q.race = race;
function race(answerPs) {
    return promise(function (resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function (answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    Q.nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

Q.tap = function (promise, callback) {
    return Q(promise).tap(callback);
};

/**
 * Works almost like "finally", but not called for rejections.
 * Original resolution value is passed through callback unaffected.
 * Callback may return a promise that will be awaited for.
 * @param {Function} callback
 * @returns {Q.Promise}
 * @example
 * doSomething()
 *   .then(...)
 *   .tap(console.log)
 *   .then(...);
 */
Promise.prototype.tap = function (callback) {
    callback = Q(callback);

    return this.then(function (value) {
        return callback.fcall(value).thenResolve(value);
    });
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return object instanceof Promise;
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var reportedUnhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }
    if (typeof process === "object" && typeof process.emit === "function") {
        Q.nextTick.runAfter(function () {
            if (array_indexOf(unhandledRejections, promise) !== -1) {
                process.emit("unhandledRejection", reason, promise);
                reportedUnhandledRejections.push(promise);
            }
        });
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        if (typeof process === "object" && typeof process.emit === "function") {
            Q.nextTick.runAfter(function () {
                var atReport = array_indexOf(reportedUnhandledRejections, promise);
                if (atReport !== -1) {
                    process.emit("rejectionHandled", unhandledReasons[at], promise);
                    reportedUnhandledRejections.splice(atReport, 1);
                }
            });
        }
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    Q.nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return Q(result.value);
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return Q(exception.value);
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    Q.nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var pendingCount = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++pendingCount;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--pendingCount === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (pendingCount === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Returns the first resolved promise of an array. Prior rejected promises are
 * ignored.  Rejects only if all promises are rejected.
 * @param {Array*} an array containing values or promises for values
 * @returns a promise fulfilled with the value of the first resolved promise,
 * or a rejected promise if all promises are rejected.
 */
Q.any = any;

function any(promises) {
    if (promises.length === 0) {
        return Q.resolve();
    }

    var deferred = Q.defer();
    var pendingCount = 0;
    array_reduce(promises, function (prev, current, index) {
        var promise = promises[index];

        pendingCount++;

        when(promise, onFulfilled, onRejected, onProgress);
        function onFulfilled(result) {
            deferred.resolve(result);
        }
        function onRejected(err) {
            pendingCount--;
            if (pendingCount === 0) {
                var rejection = err || new Error("" + err);

                rejection.message = ("Q can't get fulfillment value from any promise, all " +
                    "promises were rejected. Last error message: " + rejection.message);

                deferred.reject(rejection);
            }
        }
        function onProgress(progress) {
            deferred.notify({
                index: index,
                value: progress
            });
        }
    }, undefined);

    return deferred.promise;
}

Promise.prototype.any = function () {
    return any(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    if (!callback || typeof callback.apply !== "function") {
        throw new Error("Q can't apply finally callback");
    }
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        Q.nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {Any*} custom error message or Error object (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, error) {
    return Q(object).timeout(ms, error);
};

Promise.prototype.timeout = function (ms, error) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        if (!error || "string" === typeof error) {
            error = new Error(error || "Timed out after " + ms + " ms");
            error.code = "ETIMEDOUT";
        }
        deferred.reject(error);
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    if (callback === undefined) {
        throw new Error("Q can't wrap an undefined function");
    }
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            Q.nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            Q.nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

Q.noConflict = function() {
    throw new Error("Q.noConflict only works when Q is used as a global");
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js"), __webpack_require__(/*! ./../timers-browserify/main.js */ "./node_modules/timers-browserify/main.js").setImmediate))

/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js");
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/DevelopmentView.vue?vue&type=template&id=b5b8d6de&":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/DevelopmentView.vue?vue&type=template&id=b5b8d6de& ***!
  \******************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "container-fluid vh-100",
      attrs: { id: "development" },
      on: {
        click: _vm.onclick,
        keydown: function($event) {
          if (!$event.type.indexOf("key") && $event.keyCode !== 90) {
            return null
          }
          if (!$event.metaKey) {
            return null
          }
          $event.stopPropagation()
          $event.preventDefault()
          return _vm.onundo($event)
        }
      }
    },
    [
      _c(
        "div",
        {
          staticClass: "d-flex bg-light border-bottom border-dark row",
          attrs: { id: "development-header" }
        },
        [
          _c(
            "div",
            {
              staticClass: "d-flex align-items-center",
              attrs: { contenteditable: "true" }
            },
            [_vm._v("\n            " + _vm._s(_vm.lessonTitle) + "\n        ")]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "ml-3 d-flex align-items-center" })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "row", attrs: { id: "development-body" } }, [
        _c("div", { staticClass: "col-9 h-100 p-0" }, [
          _c(
            "div",
            { staticClass: "d-flex", attrs: { id: "development-body-top" } },
            [
              _c(
                "div",
                {
                  staticClass:
                    "w-25 h-100 border-right border-bottom border-dark"
                },
                [
                  _c(
                    "ul",
                    { staticClass: "w-100 h-100" },
                    [
                      _c("file-tree", {
                        staticClass: "w-100 h-100",
                        attrs: {
                          id: "file-tree",
                          "root-item": _vm.fileTree.rootItem
                        },
                        on: {
                          "show-context-menu": _vm.showFileTreeContextMenu,
                          "set-file": _vm.setFile
                        }
                      })
                    ],
                    1
                  )
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "w-75 h-100 border-bottom border-dark" },
                [
                  _c("source-code-editor", {
                    staticClass: "w-100 h-100",
                    attrs: {
                      id: "source-code-editor",
                      text: _vm.file ? _vm.file.text : "",
                      questions: _vm.questions,
                      "description-targets": _vm.description.targets,
                      disabled: _vm.sourceCodeEditor.disabled
                    },
                    on: {
                      "update-file-text": _vm.onUpdateFileText,
                      "show-context-menu": function($event) {
                        $event.stopPropagation()
                        $event.preventDefault()
                        return _vm.showSourceCodeEditorContextMenu($event)
                      },
                      "update-question": _vm.onUpdateQuestion,
                      "update-description-target":
                        _vm.onUpdateDescriptionTarget,
                      "set-questions": _vm.onSetQuestions,
                      "set-description-targets": _vm.onSetDescriptionTargets
                    }
                  })
                ],
                1
              )
            ]
          ),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "d-flex", attrs: { id: "development-body-bottom" } },
            [
              _c(
                "div",
                {
                  staticClass: "w-25 border-right border-dark",
                  attrs: { id: "questions-view" }
                },
                _vm._l(_vm.questions, function(question) {
                  return _c("question-item", {
                    key: question.id,
                    attrs: { answer: question.answer }
                  })
                }),
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "w-75" },
                [
                  _c("description", {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: _vm.file,
                        expression: "file"
                      }
                    ],
                    attrs: {
                      "file-id": _vm.file ? _vm.file.id : null,
                      descriptions: _vm.description.descriptions,
                      plusButtonUrl: _vm.plusButtonUrl,
                      prevButtonUrl: _vm.prevButtonUrl,
                      nextButtonUrl: _vm.nextButtonUrl,
                      "cross-button-url": _vm.crossButtonUrl
                    },
                    on: { "set-description": _vm.onSetDescription }
                  })
                ],
                1
              )
            ]
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col p-0 h-100 bg-dark" })
      ]),
      _vm._v(" "),
      _c(
        "transition",
        { attrs: { name: "fade" } },
        [
          _c("file-creation-view", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.fileCreationView.isShown,
                expression: "fileCreationView.isShown"
              }
            ],
            attrs: {
              "lesson-id": _vm.lessonId,
              "item-id": _vm.fileTree.contextMenu.itemId,
              "item-children": _vm.fileTree.contextMenu.itemChildren
            },
            on: { cancel: _vm.onFlieCreationViewCancelButtonClick }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c("file-tree-context-menu", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.fileTree.contextMenu.isShown,
            expression: "fileTree.contextMenu.isShown"
          }
        ],
        attrs: {
          "is-file": _vm.fileTree.contextMenu.isFile,
          left: _vm.fileTree.contextMenu.left,
          top: _vm.fileTree.contextMenu.top,
          "lesson-id": _vm.lessonId,
          "item-id": _vm.fileTree.contextMenu.itemId,
          "item-children": _vm.fileTree.contextMenu.itemChildren
        },
        on: {
          "show-file-creation-view": _vm.onShowFileCreationView,
          "remove-file-tree-item": _vm.onRemoveFileTreeItem
        }
      }),
      _vm._v(" "),
      _c("source-code-editor-context-menu", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.sourceCodeEditor.contextMenu.isShown,
            expression: "sourceCodeEditor.contextMenu.isShown"
          }
        ],
        attrs: {
          left: _vm.sourceCodeEditor.contextMenu.left,
          top: _vm.sourceCodeEditor.contextMenu.top,
          "is-description-selected":
            _vm.description.selectedDescription !== null
        },
        on: {
          "add-question": _vm.onAddQuestion,
          "add-description-target": _vm.onAddDescriptionTarget
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/description/Description.vue?vue&type=template&id=adda5a0c&":
/*!**************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/description/Description.vue?vue&type=template&id=adda5a0c& ***!
  \**************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "w-100 h-100", attrs: { id: "description" } },
    [
      _c(
        "transition",
        {
          attrs: { name: "slide-up" },
          on: { "after-leave": _vm.onAfterLeaveSlideUpEditingView }
        },
        [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.editingView.isShown,
                  expression: "editingView.isShown"
                }
              ],
              staticClass: "w-100 h-100",
              attrs: { id: "description-editing-view" }
            },
            [
              _c(
                "div",
                {
                  staticClass:
                    "d-flex align-items-center border-bottom border-dark",
                  attrs: { id: "description-editing-header" }
                },
                [
                  _c("div", [
                    _vm._v(_vm._s(_vm.editingView.description.index))
                  ]),
                  _vm._v(" "),
                  _c("button", { staticClass: "ml-auto" }, [
                    _c("img", { attrs: { src: _vm.prevButtonUrl, alt: "前" } })
                  ]),
                  _vm._v(" "),
                  _c("button", { staticClass: "ml-3" }, [
                    _c("img", { attrs: { src: _vm.nextButtonUrl, alt: "次" } })
                  ]),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "ml-3 mr-2",
                      on: { click: _vm.onCloseEditingView }
                    },
                    [
                      _c("img", {
                        attrs: { src: _vm.crossButtonUrl, alt: "閉じる" }
                      })
                    ]
                  )
                ]
              ),
              _vm._v(" "),
              _c("div", { attrs: { id: "description-editing-body" } }, [
                _c("textarea", {
                  staticClass: "w-100 h-100",
                  attrs: { id: "description-editor" },
                  domProps: { value: _vm.editingView.description.text },
                  on: { input: _vm.onInputDescription }
                })
              ])
            ]
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "transition",
        {
          attrs: { name: "slide-down" },
          on: { "after-leave": _vm.onAfterLeaveSlideDownDescriptionList }
        },
        [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.descriptionList.isShown,
                  expression: "descriptionList.isShown"
                }
              ],
              staticClass: "w-100 h-100"
            },
            [
              _c(
                "div",
                {
                  staticClass:
                    "d-flex align-items-center border-bottom border-dark",
                  attrs: { id: "description-list-header" }
                },
                [
                  _c(
                    "button",
                    {
                      staticClass: "ml-auto mr-2",
                      on: { click: _vm.onAppendDescription }
                    },
                    [
                      _c("img", {
                        attrs: { src: _vm.plusButtonUrl, alt: "追加" }
                      })
                    ]
                  )
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                { attrs: { id: "description-list-body" } },
                _vm._l(_vm.descriptions, function(description) {
                  return _c(
                    "div",
                    {
                      key: description.id,
                      staticClass: "border-bottom",
                      on: {
                        click: function($event) {
                          return _vm.onSlideDownDescriptionList(description.id)
                        }
                      }
                    },
                    [
                      _vm._v(
                        "\n                   " +
                          _vm._s(description.index) +
                          ": "
                      ),
                      _c("pre", [_vm._v(_vm._s(description.text))])
                    ]
                  )
                }),
                0
              )
            ]
          )
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/editor/SourceCodeEditor.vue?vue&type=template&id=d0b98b30&":
/*!**************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/editor/SourceCodeEditor.vue?vue&type=template&id=d0b98b30& ***!
  \**************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("textarea", {
    staticClass: "w-100 h-100",
    attrs: { id: "source-code-editor", disabled: _vm.disabled },
    domProps: { value: _vm.text },
    on: {
      input: _vm.oninput,
      click: _vm.onclick,
      select: _vm.onselect,
      focus: _vm.onfocus,
      paste: _vm.onpaste,
      keydown: [
        function($event) {
          if (
            !$event.type.indexOf("key") &&
            _vm._k($event.keyCode, "left", 37, $event.key, [
              "Left",
              "ArrowLeft"
            ])
          ) {
            return null
          }
          if ("button" in $event && $event.button !== 0) {
            return null
          }
          return _vm.onArrowKeyDown($event)
        },
        function($event) {
          if (
            !$event.type.indexOf("key") &&
            _vm._k($event.keyCode, "right", 39, $event.key, [
              "Right",
              "ArrowRight"
            ])
          ) {
            return null
          }
          if ("button" in $event && $event.button !== 2) {
            return null
          }
          return _vm.onArrowKeyDown($event)
        },
        function($event) {
          if (
            !$event.type.indexOf("key") &&
            _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])
          ) {
            return null
          }
          return _vm.onArrowKeyDown($event)
        },
        function($event) {
          if (
            !$event.type.indexOf("key") &&
            _vm._k($event.keyCode, "down", 40, $event.key, [
              "Down",
              "ArrowDown"
            ])
          ) {
            return null
          }
          return _vm.onArrowKeyDown($event)
        }
      ],
      contextmenu: function($event) {
        $event.stopPropagation()
        $event.preventDefault()
        return _vm.oncontextmenu($event)
      }
    }
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue?vue&type=template&id=2358a956&":
/*!*************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue?vue&type=template&id=2358a956& ***!
  \*************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "btn-group-vertical border bg-white",
      style: _vm.style,
      attrs: { id: "source-code-editor-context-menu" }
    },
    [
      _c(
        "button",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.isTextSelected,
              expression: "isTextSelected"
            }
          ],
          staticClass: "btn btn-light",
          attrs: { type: "button" },
          on: { click: _vm.onAddQuestion }
        },
        [_vm._v("問題に追加")]
      ),
      _vm._v(" "),
      _c(
        "button",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.isDescriptionSelected,
              expression: "isDescriptionSelected"
            }
          ],
          staticClass: "btn btn-light",
          attrs: { type: "button" },
          on: { click: _vm.onAddDescriptionTarget }
        },
        [_vm._v("説明対象に追加")]
      ),
      _vm._v(" "),
      _c(
        "button",
        { staticClass: "btn btn-light", attrs: { type: "button" } },
        [_vm._v("テストボタン")]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileCreationView.vue?vue&type=template&id=94010802&":
/*!*****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/file-tree/FileCreationView.vue?vue&type=template&id=94010802& ***!
  \*****************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "border shadow bg-white",
      attrs: { id: "file-creation-view" }
    },
    [
      _c(
        "div",
        {
          staticClass: "form-inline py-2 border-bottom",
          attrs: { id: "file-creation-view-header" }
        },
        [
          _c("div", { staticClass: "w-100 text-center" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.fileName,
                  expression: "fileName"
                }
              ],
              staticClass: "form-control",
              attrs: { id: "file-creation-view-file-name" },
              domProps: { value: _vm.fileName },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.fileName = $event.target.value
                }
              }
            }),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "btn btn-primary file-creation-view-button",
                attrs: { id: "file-creation-view-cancel", type: "button" },
                on: { click: _vm.onCancelButtonClick }
              },
              [_vm._v("キャンセル")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "btn btn-primary file-creation-view-button",
                attrs: { id: "file-creaetion-view-create", type: "button" },
                on: { click: _vm.onCreateFile }
              },
              [_vm._v("作成")]
            )
          ])
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "text-center",
          attrs: { id: "file-creation-view-body" }
        },
        _vm._l(_vm.fileItems, function(fileItem) {
          return _c("filec-creation-view-file-item", {
            key: fileItem.name,
            attrs: { "image-url": _vm.fileItems.imageUrl, name: fileItem.name }
          })
        }),
        1
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileTree.vue?vue&type=template&id=241bff79&":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/file-tree/FileTree.vue?vue&type=template&id=241bff79& ***!
  \*********************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      on: {
        contextmenu: function($event) {
          $event.stopPropagation()
          $event.preventDefault()
          return _vm.oncontextmenu($event)
        }
      }
    },
    [
      _c(
        "ul",
        [
          _c("file-tree-item", {
            attrs: { item: _vm.rootItem },
            on: {
              "show-context-menu": _vm.showContextMenu,
              "set-file": _vm.setFile
            }
          })
        ],
        1
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileTreeContextMenu.vue?vue&type=template&id=5a2280b6&":
/*!********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/file-tree/FileTreeContextMenu.vue?vue&type=template&id=5a2280b6& ***!
  \********************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "btn-group-vertical border bg-white",
      style: _vm.style,
      attrs: { id: "file-tree-context-menu" }
    },
    [
      _c(
        "button",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.isFolder,
              expression: "isFolder"
            }
          ],
          staticClass: "btn btn-light",
          attrs: { type: "button" },
          on: { click: _vm.onAppendFolder }
        },
        [_vm._v("フォルダを追加")]
      ),
      _vm._v(" "),
      _c(
        "button",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.isFolder,
              expression: "isFolder"
            }
          ],
          staticClass: "btn btn-light",
          attrs: { type: "button" },
          on: { click: _vm.onShowFileCreationView }
        },
        [_vm._v("ファイルを追加")]
      ),
      _vm._v(" "),
      _c(
        "button",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.itemId,
              expression: "itemId"
            }
          ],
          staticClass: "btn btn-light",
          attrs: { type: "button" }
        },
        [_vm._v("名前を変更")]
      ),
      _vm._v(" "),
      _c(
        "button",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.itemId,
              expression: "itemId"
            }
          ],
          staticClass: "btn btn-light",
          attrs: { type: "button" },
          on: { click: _vm.onRemove }
        },
        [_vm._v("削除")]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileTreeItem.vue?vue&type=template&id=1edac4ac&":
/*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/file-tree/FileTreeItem.vue?vue&type=template&id=1edac4ac& ***!
  \*************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("li", [
    _vm.doesHaveItemName
      ? _c(
          "div",
          {
            on: {
              click: _vm.onclick,
              contextmenu: function($event) {
                $event.stopPropagation()
                $event.preventDefault()
                return _vm.oncontextmenu($event)
              }
            }
          },
          [_vm._v(_vm._s(_vm.item.name))]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.doesHaveItemChildren
      ? _c(
          "ul",
          { staticClass: "file-tree-item" },
          _vm._l(_vm.item.children, function(child) {
            return _c("file-tree-item", {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.isExpanded,
                  expression: "isExpanded"
                }
              ],
              key: child.id,
              attrs: { item: child },
              on: {
                "show-context-menu": _vm.showContextMenu,
                "set-file": _vm.setFile
              }
            })
          }),
          1
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FilecreationViewFileItem.vue?vue&type=template&id=351f2c2e&":
/*!*************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/file-tree/FilecreationViewFileItem.vue?vue&type=template&id=351f2c2e& ***!
  \*************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "file-creation-view-file-item text-center border d-inline-block m-2"
    },
    [
      _c("div", { staticClass: "w-100 h-75 bg-primary" }),
      _vm._v(" "),
      _c("div", [_vm._v(_vm._s(_vm.name))])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/question/QuestionItem.vue?vue&type=template&id=624c6633&":
/*!************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/development/question/QuestionItem.vue?vue&type=template&id=624c6633& ***!
  \************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "border-bottom" }, [
    _c("pre", { on: { click: _vm.onclick } }, [_vm._v(_vm._s(_vm.answer))])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./resources/js/components/development/DevelopmentView.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/components/development/DevelopmentView.vue ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DevelopmentView_vue_vue_type_template_id_b5b8d6de___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DevelopmentView.vue?vue&type=template&id=b5b8d6de& */ "./resources/js/components/development/DevelopmentView.vue?vue&type=template&id=b5b8d6de&");
/* harmony import */ var _DevelopmentView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DevelopmentView.vue?vue&type=script&lang=js& */ "./resources/js/components/development/DevelopmentView.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _DevelopmentView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _DevelopmentView_vue_vue_type_template_id_b5b8d6de___WEBPACK_IMPORTED_MODULE_0__["render"],
  _DevelopmentView_vue_vue_type_template_id_b5b8d6de___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/development/DevelopmentView.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/development/DevelopmentView.vue?vue&type=script&lang=js&":
/*!******************************************************************************************!*\
  !*** ./resources/js/components/development/DevelopmentView.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DevelopmentView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./DevelopmentView.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/DevelopmentView.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DevelopmentView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/development/DevelopmentView.vue?vue&type=template&id=b5b8d6de&":
/*!************************************************************************************************!*\
  !*** ./resources/js/components/development/DevelopmentView.vue?vue&type=template&id=b5b8d6de& ***!
  \************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DevelopmentView_vue_vue_type_template_id_b5b8d6de___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./DevelopmentView.vue?vue&type=template&id=b5b8d6de& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/DevelopmentView.vue?vue&type=template&id=b5b8d6de&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DevelopmentView_vue_vue_type_template_id_b5b8d6de___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DevelopmentView_vue_vue_type_template_id_b5b8d6de___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/development/description/CreateDescription.js":
/*!******************************************************************************!*\
  !*** ./resources/js/components/development/description/CreateDescription.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function createDescription(id, index, text, fileId) {
  return {
    id: id,
    index: index,
    text: text,
    file_id: fileId
  };
}

/* harmony default export */ __webpack_exports__["default"] = (createDescription);

/***/ }),

/***/ "./resources/js/components/development/description/CreateDescriptionTarget.js":
/*!************************************************************************************!*\
  !*** ./resources/js/components/development/description/CreateDescriptionTarget.js ***!
  \************************************************************************************/
/*! exports provided: createDescriptionTarget */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDescriptionTarget", function() { return createDescriptionTarget; });
function createDescriptionTarget(id, startIndex, endIndex, descriptionId) {
  return {
    id: id,
    startIndex: startIndex,
    endIndex: endIndex,
    descriptionId: descriptionId,
    hasUpdated: false,
    hasDeleted: false
  };
}

/***/ }),

/***/ "./resources/js/components/development/description/DeleteDescriptionTargets.js":
/*!*************************************************************************************!*\
  !*** ./resources/js/components/development/description/DeleteDescriptionTargets.js ***!
  \*************************************************************************************/
/*! exports provided: deleteDescriptionTargets */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteDescriptionTargets", function() { return deleteDescriptionTargets; });
var deleteDescriptionTargets = function deleteDescriptionTargets(ids) {
  var queryParameters = ids.map(function (id, index) {
    return "ids[" + index + "]=" + id;
  }).join("&");
  axios["delete"]("/description_targets?" + queryParameters).then(function (response) {//console.log(response.data);
  });
};

/***/ }),

/***/ "./resources/js/components/development/description/Description.vue":
/*!*************************************************************************!*\
  !*** ./resources/js/components/development/description/Description.vue ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Description_vue_vue_type_template_id_adda5a0c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Description.vue?vue&type=template&id=adda5a0c& */ "./resources/js/components/development/description/Description.vue?vue&type=template&id=adda5a0c&");
/* harmony import */ var _Description_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Description.vue?vue&type=script&lang=js& */ "./resources/js/components/development/description/Description.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Description_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Description_vue_vue_type_template_id_adda5a0c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Description_vue_vue_type_template_id_adda5a0c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/development/description/Description.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/development/description/Description.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************!*\
  !*** ./resources/js/components/development/description/Description.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Description_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./Description.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/description/Description.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Description_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/development/description/Description.vue?vue&type=template&id=adda5a0c&":
/*!********************************************************************************************************!*\
  !*** ./resources/js/components/development/description/Description.vue?vue&type=template&id=adda5a0c& ***!
  \********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Description_vue_vue_type_template_id_adda5a0c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./Description.vue?vue&type=template&id=adda5a0c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/description/Description.vue?vue&type=template&id=adda5a0c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Description_vue_vue_type_template_id_adda5a0c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Description_vue_vue_type_template_id_adda5a0c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/development/description/DescriptionCreatable.js":
/*!*********************************************************************************!*\
  !*** ./resources/js/components/development/description/DescriptionCreatable.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CreateDescription_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateDescription.js */ "./resources/js/components/development/description/CreateDescription.js");

var descriptionCreatable = {
  methods: {
    createDescription: function createDescription(index, text, fileId, completion) {
      console.log(index);
      console.log(text);
      console.log(fileId);
      axios.post("/descriptions", {
        index: index,
        text: text,
        file_id: fileId
      }).then(function (response) {
        var id = response.data;
        var description = Object(_CreateDescription_js__WEBPACK_IMPORTED_MODULE_0__["default"])(id, index, text, fileId);
        completion(description);
      });
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (descriptionCreatable);

/***/ }),

/***/ "./resources/js/components/development/description/DescriptionFetchable.js":
/*!*********************************************************************************!*\
  !*** ./resources/js/components/development/description/DescriptionFetchable.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CreateDescription_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateDescription.js */ "./resources/js/components/development/description/CreateDescription.js");

var descriptionFetchable = {
  methods: {
    fetchDescriptions: function fetchDescriptions(fileId, completion) {
      axios.get("/descriptions/fetch?file_id=" + fileId).then(function (response) {
        var descriptions = response.data.map(function (description) {
          return Object(_CreateDescription_js__WEBPACK_IMPORTED_MODULE_0__["default"])(description.id, description.index, description.text, description.file_id);
        });
        completion(descriptions);
      });
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (descriptionFetchable);

/***/ }),

/***/ "./resources/js/components/development/description/FetchDescriptionTargets.js":
/*!************************************************************************************!*\
  !*** ./resources/js/components/development/description/FetchDescriptionTargets.js ***!
  \************************************************************************************/
/*! exports provided: fetchDescriptionTargets */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchDescriptionTargets", function() { return fetchDescriptionTargets; });
/* harmony import */ var _CreateDescriptionTarget_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateDescriptionTarget.js */ "./resources/js/components/development/description/CreateDescriptionTarget.js");

function fetchDescriptionTargets(descriptionId, completion) {
  axios.get("/description_targets/fetch?description_id=" + descriptionId).then(function (response) {
    var descriptionTargets = response.data.map(function (descriptionTarget) {
      return Object(_CreateDescriptionTarget_js__WEBPACK_IMPORTED_MODULE_0__["createDescriptionTarget"])(descriptionTarget.id, descriptionTarget.start_index, descriptionTarget.end_index, descriptionId);
    });
    completion(descriptionTargets);
  });
}

/***/ }),

/***/ "./resources/js/components/development/description/PostDescriptionTarget.js":
/*!**********************************************************************************!*\
  !*** ./resources/js/components/development/description/PostDescriptionTarget.js ***!
  \**********************************************************************************/
/*! exports provided: postDescriptionTarget */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "postDescriptionTarget", function() { return postDescriptionTarget; });
/* harmony import */ var _CreateDescriptionTarget_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateDescriptionTarget.js */ "./resources/js/components/development/description/CreateDescriptionTarget.js");

function postDescriptionTarget(startIndex, endIndex, descriptionId, completion) {
  axios.post("/description_targets", {
    start_index: startIndex,
    end_index: endIndex,
    description_id: descriptionId
  }).then(function (response) {
    var id = response.data;
    var descriptionTarget = Object(_CreateDescriptionTarget_js__WEBPACK_IMPORTED_MODULE_0__["createDescriptionTarget"])(id, startIndex, endIndex, descriptionId);
    completion(descriptionTarget);
  });
}

/***/ }),

/***/ "./resources/js/components/development/description/UpdateDescription.js":
/*!******************************************************************************!*\
  !*** ./resources/js/components/development/description/UpdateDescription.js ***!
  \******************************************************************************/
/*! exports provided: updateDescription */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateDescription", function() { return updateDescription; });
function updateDescription(id, index, text, fileId) {
  console.log(index);
  console.log(text);
  console.log(fileId);
  axios.put("/descriptions/" + id, {
    index: index,
    text: text,
    file_id: fileId
  }).then(function (response) {//console.log(response.data);
  });
}

/***/ }),

/***/ "./resources/js/components/development/description/UpdateDescriptionTarget.js":
/*!************************************************************************************!*\
  !*** ./resources/js/components/development/description/UpdateDescriptionTarget.js ***!
  \************************************************************************************/
/*! exports provided: updateDescriptionTarget */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateDescriptionTarget", function() { return updateDescriptionTarget; });
function updateDescriptionTarget(id, startIndex, endIndex, descriptionId) {
  axios.put("/description_targets/" + id, {
    start_index: startIndex,
    end_index: endIndex,
    description_id: descriptionId
  }).then(function (response) {//console.log(response.data);
  });
}
;

/***/ }),

/***/ "./resources/js/components/development/editor/SourceCodeEditor.vue":
/*!*************************************************************************!*\
  !*** ./resources/js/components/development/editor/SourceCodeEditor.vue ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SourceCodeEditor_vue_vue_type_template_id_d0b98b30___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SourceCodeEditor.vue?vue&type=template&id=d0b98b30& */ "./resources/js/components/development/editor/SourceCodeEditor.vue?vue&type=template&id=d0b98b30&");
/* harmony import */ var _SourceCodeEditor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SourceCodeEditor.vue?vue&type=script&lang=js& */ "./resources/js/components/development/editor/SourceCodeEditor.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SourceCodeEditor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SourceCodeEditor_vue_vue_type_template_id_d0b98b30___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SourceCodeEditor_vue_vue_type_template_id_d0b98b30___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/development/editor/SourceCodeEditor.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/development/editor/SourceCodeEditor.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************!*\
  !*** ./resources/js/components/development/editor/SourceCodeEditor.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SourceCodeEditor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SourceCodeEditor.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/editor/SourceCodeEditor.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SourceCodeEditor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/development/editor/SourceCodeEditor.vue?vue&type=template&id=d0b98b30&":
/*!********************************************************************************************************!*\
  !*** ./resources/js/components/development/editor/SourceCodeEditor.vue?vue&type=template&id=d0b98b30& ***!
  \********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SourceCodeEditor_vue_vue_type_template_id_d0b98b30___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SourceCodeEditor.vue?vue&type=template&id=d0b98b30& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/editor/SourceCodeEditor.vue?vue&type=template&id=d0b98b30&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SourceCodeEditor_vue_vue_type_template_id_d0b98b30___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SourceCodeEditor_vue_vue_type_template_id_d0b98b30___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue":
/*!************************************************************************************!*\
  !*** ./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SourceCodeEditorContextMenu_vue_vue_type_template_id_2358a956___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SourceCodeEditorContextMenu.vue?vue&type=template&id=2358a956& */ "./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue?vue&type=template&id=2358a956&");
/* harmony import */ var _SourceCodeEditorContextMenu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SourceCodeEditorContextMenu.vue?vue&type=script&lang=js& */ "./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SourceCodeEditorContextMenu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SourceCodeEditorContextMenu_vue_vue_type_template_id_2358a956___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SourceCodeEditorContextMenu_vue_vue_type_template_id_2358a956___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/development/editor/SourceCodeEditorContextMenu.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************!*\
  !*** ./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SourceCodeEditorContextMenu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SourceCodeEditorContextMenu.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SourceCodeEditorContextMenu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue?vue&type=template&id=2358a956&":
/*!*******************************************************************************************************************!*\
  !*** ./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue?vue&type=template&id=2358a956& ***!
  \*******************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SourceCodeEditorContextMenu_vue_vue_type_template_id_2358a956___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SourceCodeEditorContextMenu.vue?vue&type=template&id=2358a956& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/editor/SourceCodeEditorContextMenu.vue?vue&type=template&id=2358a956&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SourceCodeEditorContextMenu_vue_vue_type_template_id_2358a956___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SourceCodeEditorContextMenu_vue_vue_type_template_id_2358a956___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/development/file-tree/FileCreationView.vue":
/*!****************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileCreationView.vue ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileCreationView_vue_vue_type_template_id_94010802___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileCreationView.vue?vue&type=template&id=94010802& */ "./resources/js/components/development/file-tree/FileCreationView.vue?vue&type=template&id=94010802&");
/* harmony import */ var _FileCreationView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileCreationView.vue?vue&type=script&lang=js& */ "./resources/js/components/development/file-tree/FileCreationView.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FileCreationView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FileCreationView_vue_vue_type_template_id_94010802___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FileCreationView_vue_vue_type_template_id_94010802___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/development/file-tree/FileCreationView.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/development/file-tree/FileCreationView.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileCreationView.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileCreationView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileCreationView.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileCreationView.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileCreationView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/development/file-tree/FileCreationView.vue?vue&type=template&id=94010802&":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileCreationView.vue?vue&type=template&id=94010802& ***!
  \***********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileCreationView_vue_vue_type_template_id_94010802___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileCreationView.vue?vue&type=template&id=94010802& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileCreationView.vue?vue&type=template&id=94010802&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileCreationView_vue_vue_type_template_id_94010802___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileCreationView_vue_vue_type_template_id_94010802___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/development/file-tree/FileTree.vue":
/*!********************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileTree.vue ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileTree_vue_vue_type_template_id_241bff79___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileTree.vue?vue&type=template&id=241bff79& */ "./resources/js/components/development/file-tree/FileTree.vue?vue&type=template&id=241bff79&");
/* harmony import */ var _FileTree_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileTree.vue?vue&type=script&lang=js& */ "./resources/js/components/development/file-tree/FileTree.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FileTree_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FileTree_vue_vue_type_template_id_241bff79___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FileTree_vue_vue_type_template_id_241bff79___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/development/file-tree/FileTree.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/development/file-tree/FileTree.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileTree.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTree_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileTree.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileTree.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTree_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/development/file-tree/FileTree.vue?vue&type=template&id=241bff79&":
/*!***************************************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileTree.vue?vue&type=template&id=241bff79& ***!
  \***************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTree_vue_vue_type_template_id_241bff79___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileTree.vue?vue&type=template&id=241bff79& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileTree.vue?vue&type=template&id=241bff79&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTree_vue_vue_type_template_id_241bff79___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTree_vue_vue_type_template_id_241bff79___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/development/file-tree/FileTreeContextMenu.vue":
/*!*******************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileTreeContextMenu.vue ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileTreeContextMenu_vue_vue_type_template_id_5a2280b6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileTreeContextMenu.vue?vue&type=template&id=5a2280b6& */ "./resources/js/components/development/file-tree/FileTreeContextMenu.vue?vue&type=template&id=5a2280b6&");
/* harmony import */ var _FileTreeContextMenu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileTreeContextMenu.vue?vue&type=script&lang=js& */ "./resources/js/components/development/file-tree/FileTreeContextMenu.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FileTreeContextMenu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FileTreeContextMenu_vue_vue_type_template_id_5a2280b6___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FileTreeContextMenu_vue_vue_type_template_id_5a2280b6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/development/file-tree/FileTreeContextMenu.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/development/file-tree/FileTreeContextMenu.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileTreeContextMenu.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTreeContextMenu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileTreeContextMenu.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileTreeContextMenu.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTreeContextMenu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/development/file-tree/FileTreeContextMenu.vue?vue&type=template&id=5a2280b6&":
/*!**************************************************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileTreeContextMenu.vue?vue&type=template&id=5a2280b6& ***!
  \**************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTreeContextMenu_vue_vue_type_template_id_5a2280b6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileTreeContextMenu.vue?vue&type=template&id=5a2280b6& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileTreeContextMenu.vue?vue&type=template&id=5a2280b6&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTreeContextMenu_vue_vue_type_template_id_5a2280b6___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTreeContextMenu_vue_vue_type_template_id_5a2280b6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/development/file-tree/FileTreeItem.vue":
/*!************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileTreeItem.vue ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileTreeItem_vue_vue_type_template_id_1edac4ac___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileTreeItem.vue?vue&type=template&id=1edac4ac& */ "./resources/js/components/development/file-tree/FileTreeItem.vue?vue&type=template&id=1edac4ac&");
/* harmony import */ var _FileTreeItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileTreeItem.vue?vue&type=script&lang=js& */ "./resources/js/components/development/file-tree/FileTreeItem.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FileTreeItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FileTreeItem_vue_vue_type_template_id_1edac4ac___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FileTreeItem_vue_vue_type_template_id_1edac4ac___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/development/file-tree/FileTreeItem.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/development/file-tree/FileTreeItem.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileTreeItem.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTreeItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileTreeItem.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileTreeItem.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTreeItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/development/file-tree/FileTreeItem.vue?vue&type=template&id=1edac4ac&":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileTreeItem.vue?vue&type=template&id=1edac4ac& ***!
  \*******************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTreeItem_vue_vue_type_template_id_1edac4ac___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileTreeItem.vue?vue&type=template&id=1edac4ac& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FileTreeItem.vue?vue&type=template&id=1edac4ac&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTreeItem_vue_vue_type_template_id_1edac4ac___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTreeItem_vue_vue_type_template_id_1edac4ac___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/development/file-tree/FileTreeItemAppendable.js":
/*!*********************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileTreeItemAppendable.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function isUniqueFolderName(children, itemName) {
  return children.filter(function (child) {
    return child.name === itemName;
  }).length === 0;
}

function appendFileTreeItem(lessonId, parentFolderId, children, itemName, url, isFile) {
  var queryParameters = {
    parent_folder_id: parentFolderId === null ? "" : parentFolderId,
    lesson_id: lessonId
  };

  var completion = function completion(id, name) {
    var child = {
      isFile: isFile,
      id: id,
      name: name,
      parentFolderId: parentFolderId,
      children: []
    };

    if (isFile) {
      child.text = "";
    }

    children.push(child);
  };

  if (!isUniqueFolderName(children, itemName)) {
    var suffix = 2;

    while (!isUniqueFolderName(children, itemName + suffix)) {
      ++suffix;
    }

    itemName += suffix;
  }

  queryParameters.name = itemName;

  if (isFile) {
    queryParameters.text = "";
  }

  axios.post(url, queryParameters).then(function (response) {
    //console.log(response);
    var id = response.data;
    completion(id, itemName);
  });
}

var fileTreeItemAppendable = {
  methods: {
    appendFolder: function appendFolder(lessonId, parentFolderId, children) {
      appendFileTreeItem(lessonId, parentFolderId, children, "New Folder", "/folders", false);
    },
    appendFile: function appendFile(lessonId, parentFolderId, children, fileName) {
      appendFileTreeItem(lessonId, parentFolderId, children, fileName, "/files", true);
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (fileTreeItemAppendable);

/***/ }),

/***/ "./resources/js/components/development/file-tree/FileTreeItemDeletable.js":
/*!********************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileTreeItemDeletable.js ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var fileTreeItemDeletable = {
  methods: {
    deleteFolder: function deleteFolder(id) {
      axios["delete"]("/folders/" + id).then(function (response) {});
    },
    deleteFile: function deleteFile(id) {
      axios["delete"]("/files/" + id).then(function (response) {});
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (fileTreeItemDeletable);

/***/ }),

/***/ "./resources/js/components/development/file-tree/FileTreeItemFetchable.js":
/*!********************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileTreeItemFetchable.js ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var fileTreeItemFetchable = {
  methods: {
    buildFileTree: function buildFileTree(lessonId, root) {
      axios.get('/folders/fetch?' + "lesson_id=" + lessonId).then(function (response) {
        var fileTreeBuilder = function fileTreeBuilder(current, items, isFile) {
          var _current$children;

          var children = items.filter(function (item) {
            return item.parentFolderId === current.id;
          });

          (_current$children = current.children).push.apply(_current$children, _toConsumableArray(children.map(function (item) {
            var child = {
              isFile: isFile,
              id: item.id,
              name: item.name,
              parentFolderId: current.id,
              children: []
            };

            if (isFile) {
              child.text = item.text;
            }

            return child;
          })));

          children.forEach(function (child) {
            delete items[items.indexOf(child)];
          });

          if (items.length) {
            current.children.forEach(function (child) {
              fileTreeBuilder(child, items, isFile);
            });
          }
        };

        var itemPropertyMapper = function itemPropertyMapper(data, key, isFile) {
          var mapped = {
            id: data[key].id,
            name: data[key].name,
            parentFolderId: data[key].parent_folder_id
          };

          if (isFile) {
            mapped.text = data[key].text;
          }

          return mapped;
        };

        fileTreeBuilder(root, Object.keys(response.data).map(function (key) {
          return itemPropertyMapper(response.data, key, false);
        }), false);
        axios.get("/files/fetch?" + "lesson_id=" + lessonId).then(function (response) {
          fileTreeBuilder(root, Object.keys(response.data).map(function (key) {
            return itemPropertyMapper(response.data, key, true);
          }), true);
        });
      })["catch"](function (error) {
        console.log(error);
      });
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (fileTreeItemFetchable);

/***/ }),

/***/ "./resources/js/components/development/file-tree/FileUpdatable.js":
/*!************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FileUpdatable.js ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

var fileTextUpdatable = {
  methods: {
    updateFileText: function updateFileText(fileId, fileText) {
      axios__WEBPACK_IMPORTED_MODULE_0___default.a.put("/files/" + fileId, {
        text: fileText
      }).then(function (response) {//console.log(response);
      });
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (fileTextUpdatable);

/***/ }),

/***/ "./resources/js/components/development/file-tree/FilecreationViewFileItem.vue":
/*!************************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FilecreationViewFileItem.vue ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FilecreationViewFileItem_vue_vue_type_template_id_351f2c2e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FilecreationViewFileItem.vue?vue&type=template&id=351f2c2e& */ "./resources/js/components/development/file-tree/FilecreationViewFileItem.vue?vue&type=template&id=351f2c2e&");
/* harmony import */ var _FilecreationViewFileItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FilecreationViewFileItem.vue?vue&type=script&lang=js& */ "./resources/js/components/development/file-tree/FilecreationViewFileItem.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FilecreationViewFileItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FilecreationViewFileItem_vue_vue_type_template_id_351f2c2e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FilecreationViewFileItem_vue_vue_type_template_id_351f2c2e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/development/file-tree/FilecreationViewFileItem.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/development/file-tree/FilecreationViewFileItem.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FilecreationViewFileItem.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FilecreationViewFileItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FilecreationViewFileItem.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FilecreationViewFileItem.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FilecreationViewFileItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/development/file-tree/FilecreationViewFileItem.vue?vue&type=template&id=351f2c2e&":
/*!*******************************************************************************************************************!*\
  !*** ./resources/js/components/development/file-tree/FilecreationViewFileItem.vue?vue&type=template&id=351f2c2e& ***!
  \*******************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilecreationViewFileItem_vue_vue_type_template_id_351f2c2e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FilecreationViewFileItem.vue?vue&type=template&id=351f2c2e& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/file-tree/FilecreationViewFileItem.vue?vue&type=template&id=351f2c2e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilecreationViewFileItem_vue_vue_type_template_id_351f2c2e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilecreationViewFileItem_vue_vue_type_template_id_351f2c2e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/development/question/DeleteQuestions.js":
/*!*************************************************************************!*\
  !*** ./resources/js/components/development/question/DeleteQuestions.js ***!
  \*************************************************************************/
/*! exports provided: deleteQuestions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteQuestions", function() { return deleteQuestions; });
var deleteQuestions = function deleteQuestions(ids) {
  var queryString = ids.map(function (id, index) {
    return "ids[" + index + "]=" + id;
  }).join("&");
  axios["delete"]("/questions?" + queryString).then(function (response) {//console.log(response.data);
  });
};

/***/ }),

/***/ "./resources/js/components/development/question/QuestionAddable.js":
/*!*************************************************************************!*\
  !*** ./resources/js/components/development/question/QuestionAddable.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var questionAddable = {
  methods: {
    addQuestion: function addQuestion(startIndex, endIndex, fileId, completion) {
      axios.post("/questions", {
        start_index: startIndex,
        end_index: endIndex,
        file_id: fileId
      }).then(function (response) {
        completion(response.data);
      });
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (questionAddable);

/***/ }),

/***/ "./resources/js/components/development/question/QuestionFetchable.js":
/*!***************************************************************************!*\
  !*** ./resources/js/components/development/question/QuestionFetchable.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var questionFetchable = {
  methods: {
    fetchQuestions: function fetchQuestions(fileId, completion) {
      axios.get("/questions/fetch?file_id=" + fileId).then(function (response) {
        completion(response);
      });
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (questionFetchable);

/***/ }),

/***/ "./resources/js/components/development/question/QuestionItem.vue":
/*!***********************************************************************!*\
  !*** ./resources/js/components/development/question/QuestionItem.vue ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _QuestionItem_vue_vue_type_template_id_624c6633___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./QuestionItem.vue?vue&type=template&id=624c6633& */ "./resources/js/components/development/question/QuestionItem.vue?vue&type=template&id=624c6633&");
/* harmony import */ var _QuestionItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./QuestionItem.vue?vue&type=script&lang=js& */ "./resources/js/components/development/question/QuestionItem.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _QuestionItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _QuestionItem_vue_vue_type_template_id_624c6633___WEBPACK_IMPORTED_MODULE_0__["render"],
  _QuestionItem_vue_vue_type_template_id_624c6633___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/development/question/QuestionItem.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/development/question/QuestionItem.vue?vue&type=script&lang=js&":
/*!************************************************************************************************!*\
  !*** ./resources/js/components/development/question/QuestionItem.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_QuestionItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./QuestionItem.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/question/QuestionItem.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_QuestionItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/development/question/QuestionItem.vue?vue&type=template&id=624c6633&":
/*!******************************************************************************************************!*\
  !*** ./resources/js/components/development/question/QuestionItem.vue?vue&type=template&id=624c6633& ***!
  \******************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_QuestionItem_vue_vue_type_template_id_624c6633___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./QuestionItem.vue?vue&type=template&id=624c6633& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/development/question/QuestionItem.vue?vue&type=template&id=624c6633&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_QuestionItem_vue_vue_type_template_id_624c6633___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_QuestionItem_vue_vue_type_template_id_624c6633___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/development/question/QuestionUpdatable.js":
/*!***************************************************************************!*\
  !*** ./resources/js/components/development/question/QuestionUpdatable.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var questionUpdatable = {
  methods: {
    updateQuestion: function updateQuestion(id, parameters) {
      // console.log(id);
      // console.log(parameters);
      //console.log("will Update");
      axios.put("/questions/" + id, parameters).then(function (response) {//console.log(response);
        //console.log("Updated");
      });
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (questionUpdatable);

/***/ }),

/***/ "./resources/js/development.js":
/*!*************************************!*\
  !*** ./resources/js/development.js ***!
  \*************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_development_DevelopmentView_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/development/DevelopmentView.vue */ "./resources/js/components/development/DevelopmentView.vue");

new Vue({
  el: "#development",
  components: {
    DevelopmentView: _components_development_DevelopmentView_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  }
});

/***/ }),

/***/ 1:
/*!*******************************************!*\
  !*** multi ./resources/js/development.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Documents/AllCoder/AllCoderForDevelopers/resources/js/development.js */"./resources/js/development.js");


/***/ })

/******/ });
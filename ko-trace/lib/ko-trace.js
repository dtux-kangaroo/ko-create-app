/*!
 * ko-trace.js v1.0.1
 * (c) 2018-2020 dtstack
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Kotrace = factory());
}(this, (function () { 'use strict';

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var DEFALUT_OPTIONS = {
    session_expiration: 30 * 60 * 1000,
    status: 1,
    debug: false
  };

  var Option = {
    get: function get(name) {
      if (name) return DEFALUT_OPTIONS[name];
      return DEFALUT_OPTIONS;
    },
    set: function set(options) {
      _extends(DEFALUT_OPTIONS, options);
      return DEFALUT_OPTIONS;
    }
  };

  var T = function T() {
    var d = 1 * new Date();
    var i = 0;
    // this while loop figures how many browser ticks go by
    // before 1*new Date() returns a new number, ie the amount
    // of ticks that go by per millisecond
    while (d == 1 * new Date()) {
      i++;
    }
    return d.toString(16) + i.toString(16);
  };

  var R = function R() {
    return Math.random().toString(16).replace('.', '');
  };

  // User agent entropy
  // This function takes the user agent string, and then xors
  // together each sequence of 8 bytes.  This produces a final
  // sequence of 8 bytes which it returns as hex.
  var UA = function UA() {
    var ua = navigator.userAgent;
    var i = void 0,
        ch = void 0,
        buffer = [],
        ret = 0;

    var xor = function xor(result, byte_array) {
      var j = void 0,
          tmp = 0;
      for (j = 0; j < byte_array.length; j++) {
        tmp |= buffer[j] << j * 8;
      }
      return result ^ tmp;
    };

    for (i = 0; i < ua.length; i++) {
      ch = ua.charCodeAt(i);
      buffer.unshift(ch & 0xFF);
      if (buffer.length >= 4) {
        ret = xor(ret, buffer);
        buffer = [];
      }
    }

    if (buffer.length > 0) {
      ret = xor(ret, buffer);
    }

    return ret.toString(16);
  };

  var uuid = (function () {
    var se = (screen.height * screen.width).toString(16);
    return T() + '-' + R() + '-' + UA() + '-' + se + '-' + T();
  });

  function setCookie(name, value, time, cross_subdomain, is_secure) {
    var cdomain = '',
        expires = '',
        secure = '';
    if (cross_subdomain) {
      var matches = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
          domain = matches ? matches[0] : '';
      cdomain = domain ? '; domain=.' + domain : '';
    }
    if (time) {
      var date = new Date();
      date.setTime(date.getTime() + time);
      expires = '; expires=' + date.toGMTString();
    }
    if (is_secure) {
      secure = '; secure';
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure;
  }
  var cookie = {
    get: function get(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length);
        }if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
      return null;
    },
    set: setCookie,
    remove: function remove(name, cross_subdomain) {
      setCookie(name, '', -1, cross_subdomain);
    }
  };

  var createDtSessionId = function createDtSessionId(sessionId) {
    var _Option$get = Option.get(),
        session_expiration = _Option$get.session_expiration;

    if (document.referrer === '' || document.referrer.indexOf(location.host) < 0) {
      cookie.set('DTTRACE_SESSIONID', sessionId, session_expiration);
      localStorage && localStorage.setItem('DTTRACE_SESSIONID', sessionId);
      localStorage && localStorage.setItem('DTTRACE_SESSIONID_EXPIRE', new Date().getTime() + session_expiration);
    }
  };

  var getDtSessionId = function getDtSessionId() {
    if (cookie.get('DTTRACE_SESSIONID')) return cookie.get('DTTRACE_SESSIONID');
    if (localStorage && localStorage.getItem('DTTRACE_SESSIONID') && localStorage.getItem('DTTRACE_SESSIONID_EXPIRE') > new Date().getTime()) return localStorage.getItem('DTTRACE_SESSIONID');
    var sessionId = uuid();
    createDtSessionId(sessionId);
    return sessionId;
  };

  var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function getReferrerHost(referrer) {
    var REG_TEST_REFERRER_LEGALITY = /:\/\/.*\//;
    if (REG_TEST_REFERRER_LEGALITY.test(referrer)) {
      return referrer.match(REG_TEST_REFERRER_LEGALITY)[0].replace(/(:\/\/)|(\/)/g, '');
    }
  }

  function getScreenInfo() {
    return screen && {
      '$screen_height': screen.height,
      '$screen_width': screen.width,
      '$screen_colordepth': screen.colorDepth
    };
  }

  function getLocationInfo() {
    return location && {
      '$url': location.href,
      '$url_path': location.pathname + location.hash
    };
  }

  function getNavigatorInfo() {
    return navigator && {
      '$lang': navigator.language,
      '$user_agent': navigator.userAgent
    };
  }

  function getDocumentInfo() {
    return document && {
      '$title': document.title,
      '$referrer': document.referrer,
      '$referrer_host': getReferrerHost(document.referrer),
      '$cookie': document.cookie
    };
  }

  function getDTTID() {
    var $DTTID = localStorage ? localStorage.getItem('$DTTID') : cookie.get('$DTTID');
    if (!$DTTID) {
      $DTTID = uuid();
      cookie.set('$DTTID', $DTTID, 1000 * 60 * 60 * 24 * 30 * 6);
      localStorage && localStorage.setItem('$DTTID', $DTTID);
    }
    return $DTTID;
  }

  function getPresetParams() {
    var userId = function () {
      var getUserId = Option.get('getUserId');
      if (typeof getUserId === 'function') {
        return getUserId();
      }
      return;
    }();
    var sessionId = function () {
      var getSessionId = Option.get('getSessionId');
      if (typeof getSessionId === 'function') {
        return getSessionId();
      }
      return;
    }();
    return _extends$1({}, getScreenInfo(), getLocationInfo(), getNavigatorInfo(), getDocumentInfo(), {
      '$dtsession_id': getDtSessionId(),
      '$app_key': Option.get('appKey'),
      '$DTTID': getDTTID(),
      '$user_id': userId,
      '$session_id': sessionId,
      'is_debug': Option.get('debug')
    });
  }

  var DEFALUT_PARAMS = {};

  var Param = {
    get: function get(name) {
      var params = _extends$1({}, getPresetParams(), DEFALUT_PARAMS);
      if (name) return params[name];
      return params;
    },
    set: function set(params) {
      return _extends$1(DEFALUT_PARAMS, params);
    },
    remove: function remove(name) {
      var value = DEFALUT_PARAMS[name];
      delete DEFALUT_PARAMS[name];
      return value;
    }
  };

  var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  // import md5 from '../utils/md5';
  // const hex_md5=md5.hex_md5;
  //判断是否为Android
  function isAndroid() {
    return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
  }
  //判断是否为Ios
  function isIos() {
    return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  }

  //通知ios
  function callIos(params, failback) {
    //这边写调用ios的方法
    if (_typeof(window.DtstackData_APP_JS_Bridge) === 'object' && window.DtstackData_APP_JS_Bridge.dttrace_track) {
      window.DtstackData_APP_JS_Bridge.dttrace_track(params);
    } else {
      failback();
    }
  }
  //通知Android
  function callAndroid(params, failback) {
    if ((typeof DtstackData_APP_JS_Bridge === 'undefined' ? 'undefined' : _typeof(DtstackData_APP_JS_Bridge)) === 'object' && (DtstackData_APP_JS_Bridge.dttrace_verify || DtstackData_APP_JS_Bridge.dttrace_track)) {
      if (DtstackData_APP_JS_Bridge.dttrace_verify) {
        DtstackData_APP_JS_Bridge.dttrace_verify(JSON.stringify(params));
      } else {
        SensorsData_APP_JS_Bridge.dttrace_track(JSON.stringify(params));
      }
    } else {
      failback();
    }
  }
  //通知H5
  function callH5(url, params) {
    var args = serilize(params);
    var img = new Image(1, 1);
    img.src = url + '?' + args;
  }
  //拼接字符串
  function serilize(params) {
    var args = '';
    for (var i in params) {
      if (args != '' && params[i]) {
        args += '&';
      }

      if (params[i]) {
        args += i + '=' + encodeURIComponent(params[i]);
      } else {
        continue;
      }
    }
    return args;
  }
  //采集数据
  var send = function send(params) {
    var options = Option.get();
    if (options.status) {
      var timestamp = new Date().getTime();
      //TODO: remove token temporarily, when use appKey
      // const token=hex_md5(options.appKey+timestamp);
      var newParams = _extends$2({}, Param.get(), params, {
        $timestamp: timestamp
        // $token:token
      });
      if (isAndroid()) {
        callAndroid(newParams, function () {
          callH5(options.server_url, newParams);
        });
      } else if (isIos()) {
        callIos(newParams, function () {
          callH5(options.server_url, newParams);
        });
      } else {
        callH5(options.server_url, newParams);
      }
    } else {
      console.error(new Error('Kotrace not init,please excute Kotrace.init'));
    }
  };

  //实现 $(document).ready方法的效果
  function ready() {
    var funcs = [],
        isReady = false;
    function handler(arg_event) {
      var e = arg_event || window.event;
      if (isReady) return;
      if (e.type === 'onreadystatechange' && document.readyState !== 'complete') {
        return;
      }

      funcs.forEach(function (item) {
        item.call(document);
      });

      isReady = true;
      funcs = [];
    }

    if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', handler, false);
      document.addEventListener('readystatechange', handler, false); //IE9+
      window.addEventListener('load', handler, false);
    } else if (document.attachEvent) {
      document.attachEvent('onreadystatechange', handler);
      window.attachEvent('onload', handler);
    }

    return function (fn) {
      if (isReady) {
        fn.call(document);
      } else {
        funcs.push(fn);
      }
    };
  }

  var ready$1 = ready();

  //事件信息采集器
  var eventInfoAnalyze = function eventInfoAnalyze(event) {
      if (!event.preventDefault) return {};

      var element = event.target || event.srcElement;
      return {
          '$element_id': element.id,
          '$element_name': element.name,
          '$element_content': element.innerHTML,
          '$element_class_name': element.className,
          '$element_type': element.nodeName,
          '$element_target_url': element.href,
          '$screenX': event.screenX,
          '$screenY': event.screenY
      };
  };

  var _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  // 添加监听事件
  var addEventListener = function addEventListener(element, evType, fn, useCapture) {
    if (element.addEventListener) {
      element.addEventListener(evType, fn, useCapture); //DOM2.0
      return true;
    } else if (element.attachEvent) {
      var r = element.attachEvent('on' + evType, fn); //IE5+
      return r;
    } else {
      element['on' + evType] = fn; //DOM 0
    }
  };

  var initialize = (function () {
    ready$1(function () {
      var enter_time = new Date().getTime();
      //分配sessionId
      createDtSessionId(uuid());
      //监听页面进入
      var pageEnterHandler = function pageEnterHandler() {
        send({
          $event_id: 3001
        });
      };

      if ('onpageshow' in window) {
        addEventListener(window, 'pageshow', pageEnterHandler, false);
      } else {
        addEventListener(window, 'load', pageEnterHandler, false);
      }

      //代理所有className为dttrace的dom元素
      var element_body = document.getElementsByTagName('body')[0];
      addEventListener(element_body, 'click', function (arg_event) {
        var final_event = window.event || arg_event;
        var target_element = final_event.target || final_event.srcElement;
        if (target_element.className.indexOf('kotrace') > -1) {
          var params = {};
          for (var key in target_element.dataset) {
            if (key.indexOf('kotrace') > -1) {
              params[key.substring(7).toLocaleLowerCase()] = target_element.dataset[key];
            }
          }
          if (params.eventid) {
            params.$event_id = params.eventid;
            delete params.eventid;
          }
          send(_extends$3({}, eventInfoAnalyze(final_event), params));
        }
      }, false);

      //监听页面离开
      var pageLeaveHandler = function pageLeaveHandler() {
        var current_time = new Date().getTime();
        var $stay_time = current_time - enter_time;
        send({
          $event_id: 3002,
          $stay_time: $stay_time
        });
      };

      if ('onpagehide' in window) {
        addEventListener(window, 'pagehide', pageLeaveHandler, false);
      } else {
        addEventListener(window, 'beforeunload', pageLeaveHandler, false);
      }
    });
  });

  var _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function carryRocket(eventId, fun, params) {
    if (typeof eventId === 'number') {
      if (typeof fun === 'function') {
        return function () {
          var final_event = window.event ? window.event : arguments[0];
          var result = fun.apply(this, arguments);
          send(_extends$4({
            $event_id: eventId
          }, eventInfoAnalyze(final_event), params, result));
        };
      } else {
        console.error(new Error("the second param in Kotrace.carryRocket must be function"));
      }
    } else {
      console.error(new Error("the first param in Kotrace.carryRocket must be number"));
    }
  }

  //DtaRocket注解
  function KotraceRocket(eventId, params) {
    if (typeof eventId === 'number') {
      var final_params = _extends$4({
        $event_id: eventId
      }, params);
      return function (target, name, descriptor) {
        target[name] = carryRocket(eventId, target[name], final_params);
        return target;
      };
    } else {
      console.error(new Error("the first param in @KotraceRocket must be number"));
    }
  }

  // 初始化
  var init = function init(args) {
    var serverUrl = args.serverUrl,
        getSessionId = args.getSessionId,
        getUserId = args.getUserId,
        sessionExpiration = args.sessionExpiration,
        debug = args.debug,
        params = args.params;


    try {
      if (!serverUrl) throw new Error('parameter\'s serverUrl is required!');
    } catch (err) {
      Option.set({ status: 0 });
      console.error(err);
    }

    if (Option.get('status')) {
      var final_option = {};
      if (typeof serverUrl === 'string') _extends$4(final_option, { server_url: serverUrl });
      if (typeof debug === 'boolean') _extends$4(final_option, { debug: debug });
      if (typeof sessionExpiration === 'number') _extends$4(final_option, { session_expiration: sessionExpiration });
      if (typeof getSessionId === 'function') _extends$4(final_option, { getSessionId: getSessionId });
      if (typeof getUserId === 'function') _extends$4(final_option, { getUserId: getUserId });

      Option.set(final_option);
      Param.set(params);
      //初始化
      initialize();
    }
  };

  function launchRocket(eventId, params, event) {
    if (typeof eventId === 'number') {
      var final_params = _extends$4({
        $event_id: eventId
      }, params);
      if (event) {
        _extends$4(final_params, eventInfoAnalyze(event));
      }
      send(final_params);
    } else {
      console.error(new Error("the first param in Kotrace.launchRocket must be number"));
    }
  }

  var Kotrace = {
    init: init,
    launchRocket: launchRocket,
    carryRocket: carryRocket,
    KotraceRocket: KotraceRocket,
    cookie: cookie,
    Param: Param
  };

  return Kotrace;

})));

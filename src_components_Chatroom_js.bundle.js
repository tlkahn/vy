"use strict";
(self["webpackChunkvy"] = self["webpackChunkvy"] || []).push([["src_components_Chatroom_js"],{

/***/ "./src/components/Chatroom.js":
/*!************************************!*\
  !*** ./src/components/Chatroom.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api */ "./src/api.js");
/* harmony import */ var loglevel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! loglevel */ "./node_modules/loglevel/lib/loglevel.js");
/* harmony import */ var loglevel__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(loglevel__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _rails_actioncable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @rails/actioncable */ "./node_modules/@rails/actioncable/app/assets/javascripts/actioncable.esm.js");
/* harmony import */ var _context_UserAuthContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../context/UserAuthContext */ "./src/context/UserAuthContext.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var Chatroom = function Chatroom() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    messages = _useState2[0],
    setMessages = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState4 = _slicedToArray(_useState3, 2),
    message = _useState4[0],
    setMessage = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState6 = _slicedToArray(_useState5, 2),
    onlineUsers = _useState6[0],
    setOnlineUsers = _useState6[1];
  var _useUserAuth = (0,_context_UserAuthContext__WEBPACK_IMPORTED_MODULE_4__.useUserAuth)(),
    loading = _useUserAuth.loading;
  var chatroomChannelRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (loading) return; // Wait until loading is complete
    var jwt = (0,_api__WEBPACK_IMPORTED_MODULE_1__.getToken)(); // Get the JWT token from local storage or another storage mechanism
    var consumer = (0,_rails_actioncable__WEBPACK_IMPORTED_MODULE_3__.createConsumer)("ws://localhost:3333/cable?jwt=".concat(jwt));
    chatroomChannelRef.current = consumer.subscriptions.create('ChatroomChannel', {
      connected: function connected() {
        loglevel__WEBPACK_IMPORTED_MODULE_2___default().info('Connected to the chatroom!');
      },
      disconnected: function disconnected() {
        loglevel__WEBPACK_IMPORTED_MODULE_2___default().info('Disconnected from the chatroom!');
      },
      received: function received(data) {
        loglevel__WEBPACK_IMPORTED_MODULE_2___default().info(data);
        if (data.type === 'online_users') {
          setOnlineUsers(data.users);
        }
        if (data.type === 'message') {
          setMessages(function (prevMessages) {
            return [].concat(_toConsumableArray(prevMessages), [data.message]);
          });
        }
      },
      speak: function speak(message) {
        this.perform('speak', {
          message: message
        });
      }
    });
    _api__WEBPACK_IMPORTED_MODULE_1__.cable_api.get('/messages').then(function (response) {
      setMessages(response.data);
    });
    return function () {
      consumer.disconnect();
    };
  }, [loading]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    loglevel__WEBPACK_IMPORTED_MODULE_2___default().info({
      messages: messages
    });
  }, [messages]);
  var handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    chatroomChannelRef.current.speak(message);
    setMessage('');
  };
  if (loading) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Loading...");
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "chatroom"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, "Chatroom"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    id: "messages"
  }, messages === null || messages === void 0 ? void 0 : messages.map(function (msg, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      key: index
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("strong", null, msg === null || msg === void 0 ? void 0 : msg.user_id, ":"), " ", msg === null || msg === void 0 ? void 0 : msg.content);
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
    type: "text",
    value: message,
    onChange: function onChange(e) {
      return setMessage(e.target.value);
    },
    placeholder: "Type your message here..."
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "submit"
  }, "Send"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "online-users"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, "Online Users"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", null, onlineUsers.map(function (user) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      key: user.id
    }, user.email);
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Chatroom);

/***/ })

}]);
//# sourceMappingURL=src_components_Chatroom_js.bundle.js.map
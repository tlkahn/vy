"use strict";
(self["webpackChunkvy"] = self["webpackChunkvy"] || []).push([["src_components_QuestionForm_js"],{

/***/ "./src/components/QuestionForm.js":
/*!****************************************!*\
  !*** ./src/components/QuestionForm.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _context_ChatContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/ChatContext */ "./src/context/ChatContext.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var loglevel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! loglevel */ "./node_modules/loglevel/lib/loglevel.js");
/* harmony import */ var loglevel__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(loglevel__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_regular_svg_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/free-regular-svg-icons */ "./node_modules/@fortawesome/free-regular-svg-icons/index.mjs");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

 // Adjust the path as needed





var QuestionForm = function QuestionForm(_ref) {
  var toggleModal = _ref.toggleModal;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState2 = _slicedToArray(_useState, 2),
    userQuestion = _useState2[0],
    setUserQuestion = _useState2[1];
  var modalRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(); // Ref for the modal container
  var containerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(); // Ref for the modal container
  var _useChat = (0,_context_ChatContext__WEBPACK_IMPORTED_MODULE_1__.useChat)(),
    chatroomChannelRef = _useChat.chatroomChannelRef,
    messages = _useChat.messages;
  var handleQuestionSubmit = function handleQuestionSubmit(e) {
    e.preventDefault();
    chatroomChannelRef.current.speak(userQuestion);
    setUserQuestion('');
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var handleClickOutside = function handleClickOutside(event) {
      if (modalRef.current && !containerRef.current.contains(event.target)) {
        toggleModal(false); // Assuming toggleModal can accept a boolean to show/hide
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return function () {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleModal]); // Add toggleModal to the dependencies array if it changes

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    loglevel__WEBPACK_IMPORTED_MODULE_2___default().info({
      messages: messages
    });
  }, [messages]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    ref: modalRef,
    className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    ref: containerRef,
    className: "bg-gray-700 p-5 rounded-lg question-form-container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "question-history bg-gray-600 p-4 mb-4 rounded overflow-auto max-h-40"
  }, messages && messages.map(function (m, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      key: index,
      className: "text-white mb-2 last:mb-0"
    }, m.content);
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
    onSubmit: handleQuestionSubmit,
    className: "question-form-input my-4 flex"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
    type: "text",
    value: userQuestion,
    onChange: function onChange(e) {
      return setUserQuestion(e.target.value);
    },
    placeholder: "Ask a question...",
    className: "text-black flex-grow p-2"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "submit",
    className: "ml-2 p-2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__.FontAwesomeIcon, {
    icon: _fortawesome_free_regular_svg_icons__WEBPACK_IMPORTED_MODULE_4__.faPaperPlane
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    onClick: toggleModal,
    className: "absolute top-0 right-0 p-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__.FontAwesomeIcon, {
    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__.faTimes
  }))));
};
QuestionForm.propTypes = {
  toggleModal: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().func).isRequired // Validate src prop
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QuestionForm);

/***/ })

}]);
//# sourceMappingURL=src_components_QuestionForm_js.bundle.js.map
"use strict";

require("core-js/modules/es6.regexp.split");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(t => {
  var e = (t, e, a, n) => new Promise(i => setTimeout(() => {
    var n = 0,
        r = setInterval(() => {
      if (t.text(e.substr(0, ++n)), n == e.length) return clearInterval(r), i();
    }, a);
  }, n)),
      a = (t, e, a) => new Promise(n => setTimeout(function () {
    var a = t.text(),
        i = setInterval(function () {
      if (a = a.substr(0, a.length - 1), t.text(a), !a.length) return clearInterval(i), n();
    }, e);
  }, a));

  t(".animate-typing").each(function (n) {
    var i = t(this),
        r = +i.data("type-speed") || 200,
        s = +i.data("type-delay") || 200,
        o = +i.data("remove-speed") || 50,
        d = +i.data("remove-delay") || 500,
        l = +i.data("cursor-speed") || 300,
        m = i.data("animate-loop") || !1,
        c = i.text().split("|");
    i.text(""), ((e, a, n) => {
      e.attr("data-animate-index", a), t("head").append("\n           <style>\n               .animate-typing[data-animate-index=\"".concat(a, "\"]::after {\n                   content: '|';\n                   animation: animateCursor ").concat(n, "ms infinite alternate cubic-bezier(.68,-0.55,.27,1.55);\n               }\n           </style>\n       "));
    })(i, n, l), _asyncToGenerator(function* () {
      var t = 0;

      do {
        for (var _n of c) {
          t++ && (yield a(i, o, d)), _n.trim() && (yield e(i, _n.trim(), r, s));
        }
      } while (m);
    })();
  }), (() => t("head").append("\n            <style>\n                @keyframes animateCursor {\n                    0% { opacity: 0; }\n                    100% { opacity: 1; }\n                }\n            </style>\n        "))();
})(jQuery);
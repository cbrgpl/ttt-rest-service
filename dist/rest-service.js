!function(e, t) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else {
        var n = t();
        for (var r in n) ("object" == typeof exports ? exports : e)[r] = n[r];
    }
}(this, (function() {
    return (() => {
        "use strict";
        var e = {
            635: e => {
                function t(e) {
                    return t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                        return typeof e;
                    } : function(e) {
                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                    }, t(e);
                }
                function n(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                        Object.defineProperty(e, r.key, r);
                    }
                }
                function r(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                }
                function o(e, n) {
                    if (n && ("object" === t(n) || "function" == typeof n)) return n;
                    if (void 0 !== n) throw new TypeError("Derived constructors may only return object or undefined");
                    return function(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e;
                    }(e);
                }
                function i(e) {
                    var t = "function" == typeof Map ? new Map : void 0;
                    return i = function(e) {
                        if (null === e || (n = e, -1 === Function.toString.call(n).indexOf("[native code]"))) return e;
                        var n;
                        if ("function" != typeof e) throw new TypeError("Super expression must either be null or a function");
                        if (void 0 !== t) {
                            if (t.has(e)) return t.get(e);
                            t.set(e, r);
                        }
                        function r() {
                            return a(e, arguments, f(this).constructor);
                        }
                        return r.prototype = Object.create(e.prototype, {
                            constructor: {
                                value: r,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), u(r, e);
                    }, i(e);
                }
                function a(e, t, n) {
                    return a = c() ? Reflect.construct : function(e, t, n) {
                        var r = [ null ];
                        r.push.apply(r, t);
                        var o = new (Function.bind.apply(e, r));
                        return n && u(o, n.prototype), o;
                    }, a.apply(null, arguments);
                }
                function c() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), 
                        !0;
                    } catch (e) {
                        return !1;
                    }
                }
                function u(e, t) {
                    return u = Object.setPrototypeOf || function(e, t) {
                        return e.__proto__ = t, e;
                    }, u(e, t);
                }
                function f(e) {
                    return f = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                        return e.__proto__ || Object.getPrototypeOf(e);
                    }, f(e);
                }
                e.exports = function(e) {
                    !function(e, t) {
                        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                        e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0
                            }
                        }), Object.defineProperty(e, "prototype", {
                            writable: !1
                        }), t && u(e, t);
                    }(y, e);
                    var t, i, a, s, p, l = (t = y, i = c(), function() {
                        var e, n = f(t);
                        if (i) {
                            var r = f(this).constructor;
                            e = Reflect.construct(n, arguments, r);
                        } else e = n.apply(this, arguments);
                        return o(this, e);
                    });
                    function y(e) {
                        var t;
                        r(this, y);
                        for (var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) o[i - 1] = arguments[i];
                        return (t = l.call.apply(l, [ this ].concat(o))).endpointName = e, t;
                    }
                    return a = y, s && n(a.prototype, s), p && n(a, p), Object.defineProperty(a, "prototype", {
                        writable: !1
                    }), a;
                }(i(Error));
            },
            481: (e, t, n) => {
                function r(e, t) {
                    var n = Object.keys(e);
                    if (Object.getOwnPropertySymbols) {
                        var r = Object.getOwnPropertySymbols(e);
                        t && (r = r.filter((function(t) {
                            return Object.getOwnPropertyDescriptor(e, t).enumerable;
                        }))), n.push.apply(n, r);
                    }
                    return n;
                }
                function o(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = null != arguments[t] ? arguments[t] : {};
                        t % 2 ? r(Object(n), !0).forEach((function(t) {
                            i(e, t, n[t]);
                        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : r(Object(n)).forEach((function(t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                        }));
                    }
                    return e;
                }
                function i(e, t, n) {
                    return t in e ? Object.defineProperty(e, t, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : e[t] = n, e;
                }
                function a(e) {
                    return a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                        return typeof e;
                    } : function(e) {
                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                    }, a(e);
                }
                function c(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                        Object.defineProperty(e, r.key, r);
                    }
                }
                var u = n(635), f = {
                    path: "string",
                    fetchParams: "object",
                    queryParams: "object",
                    body: null,
                    id: null
                };
                e.exports = function() {
                    function e(t, n) {
                        !function(e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                        }(this, e), this.endpointName = t, this.validateEndpointScheme(n), this.endpointScheme = n;
                    }
                    var t, n, r;
                    return t = e, (n = [ {
                        key: "validateEndpointScheme",
                        value: function(e) {
                            for (var t in e) {
                                if (null !== f[t] && !f[t]) throw new u(this.endpointName, "The ".concat(t, " is not valid scheme key"));
                                if (a(e[t]) !== f[t] && e[t] !== f[t]) throw new u(this.endpointName, "The ".concat(t, " key of the endpoint scheme does not match the expected type or value"));
                            }
                        }
                    }, {
                        key: "getRequestParams",
                        value: function(e, t, n) {
                            var r = {
                                url: this.getUrl(e, n),
                                fetchParams: o({}, this.endpointScheme.fetchParams)
                            };
                            return null === this.endpointScheme.body && (r.fetchParams.body = t), r;
                        }
                    }, {
                        key: "getUrl",
                        value: function(e, t) {
                            var n = this.endpointScheme.path.replace("{{id}}", t);
                            return null === this.endpointScheme.queryParams ? this.insertQueryParams(n, e) : n;
                        }
                    }, {
                        key: "insertQueryParams",
                        value: function(e, t) {
                            var n = e + "?";
                            for (var r in t) n += "".concat(r, "=").concat(t[r], "&");
                            return n.slice(0, -1);
                        }
                    } ]) && c(t.prototype, n), r && c(t, r), Object.defineProperty(t, "prototype", {
                        writable: !1
                    }), e;
                }();
            },
            182: (e, t, n) => {
                function r(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                        Object.defineProperty(e, r.key, r);
                    }
                }
                var o = n(481), i = n(635);
                e.exports = function() {
                    function e(t) {
                        for (var n in function(e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                        }(this, e), this.apiEndpoints = {}, t) this.apiEndpoints[n] = new o(n, t[n]);
                    }
                    var t, n, a;
                    return t = e, (n = [ {
                        key: "checkEndpointExist",
                        value: function(e) {
                            if (!Object.keys(this.apiEndpoints).includes(e)) throw new i(e, "Endpoint with name ".concat(e, " is not exists"));
                        }
                    }, {
                        key: "getRequestParams",
                        value: function(e) {
                            var t = e.endpointName, n = e.queryParams, r = e.body, o = e.id;
                            return this.checkEndpointExist(t), this.apiEndpoints[t].getRequestParams(n, r, o);
                        }
                    } ]) && r(t.prototype, n), a && r(t, a), Object.defineProperty(t, "prototype", {
                        writable: !1
                    }), e;
                }();
            }
        }, t = {};
        function n(r) {
            var o = t[r];
            if (void 0 !== o) return o.exports;
            var i = t[r] = {
                exports: {}
            };
            return e[r](i, i.exports, n), i.exports;
        }
        var r, o;
        return r = new (n(182))({
            create: {
                path: "12/create-user/",
                fetchParams: {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Credentials: "include"
                    }
                },
                body: null
            },
            get: {
                path: "12/get-users",
                fetchParams: {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Credentals: "include"
                    }
                },
                queryParams: null
            },
            delete: {
                path: "12/delete-user/{{id}}/",
                fetchParams: {
                    method: "DELETE",
                    headers: {
                        Credentials: "include"
                    }
                }
            }
        }), (o = {}).create = r.getRequestParams({
            endpointName: "create"
        }), o.get = r.getRequestParams({
            endpointName: "get",
            queryParams: {
                quantity: 10
            }
        }), o.detele = r.getRequestParams({
            endpointName: "delete",
            queryParams: {
                hard: !0
            },
            id: "1001"
        }), {};
    })();
}));
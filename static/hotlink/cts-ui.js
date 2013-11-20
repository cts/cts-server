_CTSUI = {
  Domains: {
    UIMockups: 'http://www.treesheets.org/mockups/cts-ui',
    CTS: 'http://www.treesheets.org/hotlink/',
    Server: 'http://www.treesheets.org/',
    Theme: 'http://www.treesheets.org/mockups/blog/',
  }
};

_CTSUI.URLs = {
  Mockups: {
    tray: _CTSUI.Domains.UIMockups + "tray.html",
    editor: _CTSUI.Domains.UIMockups + "editor.html",
    theminator: _CTSUI.Domains.UIMockups + "theminator.html",
    scraper: _CTSUI.Domains.UIMockups + "scraper.html"
  },
  Scripts: {
    cts: _CTSUI.Domains.CTS + "cts.js",
    ckeditor: _CTSUI.Domains.Server + "js/ckeditor/ckeditor.js"
  },
  Styles: {
    tray: _CTSUI.Domains.UIMockups + "css/tray.css",
    editor: _CTSUI.Domains.UIMockups + "css/editor.css",
    modal: _CTSUI.Domains.UIMockups + "css/modal.css",
    theminator: _CTSUI.Domains.UIMockups + "css/theminator.css",
    scraper: _CTSUI.Domains.UIMockups + "css/scraper.css",
    bootstrap: _CTSUI.Domains.UIMockups + "css/bootstrap/bootstrap.min.css",
    ionicons: _CTSUI.Domains.Server + "css/ionicons/css/ionicons.min.css"
  },
  Images: {
    lightWool: _CTSUI.Domains.UIMockups + "img/light_wool.png",
    transparentStar: _CTSUI.Domains.UIMockups + "img/transparent-star.png",
    star: _CTSUI.Domains.UIMockups + "img/star.png",
    emptyStar: _CTSUI.Domains.UIMockups + "img/empty-star.png",
    header: _CTSUI.Domains.UIMockups + "img/cts-header-theminator.png"
  },
  Data: {
    filterInfo: _CTSUI.Domains.Theme + "filterInfo.json",
    themeInfo: _CTSUI.Domains.Theme + "themeInfo.json"
  },
  Services: {
    switchboard: _CTSUI.Domains.Server + 'tree/switchboard',
    zipFactory: _CTSUI.Domains.Server + 'zip'
  }
};

_CTSUI.Blog = {
    Themes: {
        mog: {
            Mockup: {
                index: _CTSUI.themeBase + "mog/index.html",
                list: _CTSUI.themeBase + "mog/list.html",
                post: _CTSUI.themeBase + "mog/post.html",
                page: _CTSUI.themeBase + "mog/page.html",
                default: _CTSUI.themeBase + "mog/default.html"
            },
            Cts: _CTSUI.themeBase + "mog/mog.cts"
        },
        spun: {
            Mockup: {
                index: _CTSUI.themeBase + "spun/index.html",
                list: _CTSUI.themeBase + "spun/list.html",
                post: _CTSUI.themeBase + "spun/post.html",
                page: _CTSUI.themeBase + "spun/page.html",
                default: _CTSUI.themeBase + "spun/default.html"
            },
            Cts: _CTSUI.themeBase + "spun/spun.cts"
        },
        twenty_thirteen: {
            Mockup: {
                index: _CTSUI.themeBase + "twenty-thirteen/index.html",
                list: _CTSUI.themeBase + "twenty-thirteen/list.html",
                post: _CTSUI.themeBase + "twenty-thirteen/post.html",
                page: _CTSUI.themeBase + "twenty-thirteen/page.html",
                default: _CTSUI.themeBase + "twenty-thirteen/default.html"
            },
            Cts: _CTSUI.themeBase + "twenty-thirteen/twenty-thirteen.cts"
        }
    },
    Jekyll: {
        Cts: {
            index: _CTSUI.themeBase + "index.cts",
            list: _CTSUI.themeBase + "list.cts",
            post: _CTSUI.themeBase + "post.cts",
            page: _CTSUI.themeBase + "page.cts",
            default: _CTSUI.themeBase + "default.cts"
        }
    }
};

_CTSUI.Util = {
  addCss: function(url) {
    var link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', url);
    document.getElementsByTagName('head')[0].appendChild(link);
  },

  uniqueSelectorFor: function($node) {
    // Taken from:
    // http://stackoverflow.com/questions/5706837/get-unique-selector-of-element-in-jquery
    var path;
    while ($node.length) {
        var realNode = $node[0], name = realNode.localName;
        if (!name) break;
        name = name.toLowerCase();
        var parent = $node.parent();
        var sameTagSiblings = parent.children(name);
        if (sameTagSiblings.length > 1) { 
            allSiblings = parent.children();
            var index = allSiblings.index(realNode) + 1;
            if (index > 1) {
                name += ':nth-child(' + index + ')';
            }
        }
        path = name + (path ? '>' + path : '');
        $node = parent;
    }
    return path;
  },

  elementHtml: function($e) {
    var $x = $e.clone();
    var $c = CTS.$("<div></div>");
    $c.append($x);
    return $c.html();
  }
};

/*!
 * alertify.js
 * browser dialogs never looked so good
 *
 * @author Fabien Doiron <fabien.doiron@gmail.com>
 * @copyright Fabien Doiron 2013
 * @license MIT <http://opensource.org/licenses/mit-license.php>
 * @link http://fabien-d.github.com/alertify.js/
 * @module alertify
 * @version 0.4.0rc1
 */
(function (global, document, undefined) {
var AlertifyProto = (function () {
    

    var AlertifyProto,
        add,
        attach;

    /**
     * Add
     * Update bind and unbind method for browser
     * that support add/removeEventListener
     *
     * @return {undefined}
     */
    add = function () {
        this.on = function (el, event, fn) {
            el.addEventListener(event, fn, false);
        };
        this.off = function (el, event, fn) {
            el.removeEventListener(event, fn, false);
        };
    };

    /**
     * Attach
     * Update bind and unbind method for browser
     * that support attach/detachEvent
     *
     * @return {undefined}
     */
    attach = function () {
        this.on = function (el, event, fn) {
            el.attachEvent("on" + event, fn);
        };
        this.off = function (el, event, fn) {
            el.detachEvent("on" + event, fn);
        };
    };

    /**
     * Alertify Prototype API
     *
     * @type {Object}
     */
    AlertifyProto = {
        _version : "0.4.0",
        _prefix  : "alertify",
        get: function (id) {
            return document.getElementById(id);
        },
        on: function (el, event, fn) {
            if (typeof el.addEventListener === "function") {
                el.addEventListener(event, fn, false);
                add.call(this);
            } else if (el.attachEvent) {
                el.attachEvent("on" + event, fn);
                attach.call(this);
            }
        },
        off: function (el, event, fn) {
            if (typeof el.removeEventListener === "function") {
                el.removeEventListener(event, fn, false);
                add.call(this);
            } else if (el.detachEvent) {
                el.detachEvent("on" + event, fn);
                attach.call(this);
            }
        }
    };

    return AlertifyProto;
}());
var Alertify = (function () {
    

    var Alertify = function () {};
    Alertify.prototype = AlertifyProto;
    Alertify = new Alertify();

    return Alertify;
}());
var validate = (function () {
    

    var _checkValidation,
        validate;

    /**
     * Validate Parameters
     * The validation checks parameter against specified type.
     * If the parameter is set to optional, is will be valid unless
     * a parameter is specified and does not pass the test
     *
     * @param  {String}  type     Type to check parameter against
     * @param  {Mixed}   param    Parameter to check
     * @param  {Boolean} optional [Optional] Whether the parameter is optional
     * @return {Boolean}
     */
    _checkValidation = function (type, param, optional) {
        var valid = false;
        if (optional && typeof param === "undefined") {
            valid = true;
        } else {
            if (type === "object") {
                valid = (typeof param === "object" && !(param instanceof Array));
            } else {
                valid = (typeof param === type);
            }
        }
        return valid;
    };

    /**
     * Validate API
     *
     * @type {Object}
     */
    validate = {
        messages: {
            invalidArguments: "Invalid arguments"
        },
        isFunction: function (param, optional) {
            return _checkValidation("function", param, optional);
        },
        isNumber: function (param, optional) {
            return _checkValidation("number", param, optional);
        },
        isObject: function (param, optional) {
            return _checkValidation("object", param, optional);
        },
        isString: function (param, optional) {
            return _checkValidation("string", param, optional);
        },
    };

    return validate;
}());
var element = (function () {
    

    var element = {},
        setAttributes;

    /**
     * Set Attributes
     * Add attributes to a created element
     *
     * @param {Object} el     Created DOM element
     * @param {Object} params [Optional] Attributes object
     * @return {Object}
     */
    setAttributes = function (el, params) {
        var k;
        if (!validate.isObject(el) ||
            !validate.isObject(params, true)) {
            throw new Error(validate.messages.invalidArguments);
        }
        if (typeof params !== "undefined") {
            if (params.attributes) {
                for (k in params.attributes) {
                    if (params.attributes.hasOwnProperty(k)) {
                        el.setAttribute(k, params.attributes[k]);
                    }
                }
            }
            if (params.classes) {
                el.className = params.classes;
            }
        }
        return el;
    };

    /**
     * element API
     *
     * @type {Object}
     */
    element = {
        create: function (type, params) {
            var el;
            if (!validate.isString(type) ||
                !validate.isObject(params, true)) {
                throw new Error(validate.messages.invalidArguments);
            }

            el = document.createElement(type);
            el = setAttributes(el, params);
            return el;
        },
        ready: function (el) {
            if (!validate.isObject(el)) {
                throw new Error(validate.messages.invalidArguments);
            }
            if (el && el.scrollTop !== null) {
                return;
            } else {
                this.ready();
            }
        }
    };

    return element;
}());
var transition = (function () {
    

    var transition;

    /**
     * Transition
     * Determines if current browser supports CSS transitions
     * And if so, assigns the proper transition event
     *
     * @return {Object}
     */
    transition = function () {
        var t,
            type,
            supported   = false,
            el          = element.create("fakeelement"),
            transitions = {
                "WebkitTransition" : "webkitTransitionEnd",
                "MozTransition"    : "transitionend",
                "OTransition"      : "otransitionend",
                "transition"       : "transitionend"
            };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                type      = transitions[t];
                supported = true;
                break;
            }
        }

        return {
            type      : type,
            supported : supported
        };
    };

    return transition();
}());
var keys = (function () {
    

    var keys = {
        ENTER : 13,
        ESC   : 27,
        SPACE : 32
    };

    return keys;
}());
var Dialog = (function () {
    

    var dialog,
        _dialog = {};

    var Dialog = function () {
        var controls     = {},
            dialog       = {},
            isOpen       = false,
            queue        = [],
            tpl          = {},
            prefixEl     = Alertify._prefix + "-dialog",
            prefixCover  = Alertify._prefix + "-cover",
            clsElShow    = prefixEl + " is-" + prefixEl + "-showing",
            clsElHide    = prefixEl + " is-" + prefixEl + "-hidden",
            clsCoverShow = prefixCover + " is-" + prefixCover + "-showing",
            clsCoverHide = prefixCover + " is-" + prefixCover + "-hidden",
            elCallee,
            $,
            appendBtns,
            addListeners,
            build,
            hide,
            init,
            onBtnCancel,
            onBtnOK,
            onBtnResetFocus,
            onFormSubmit,
            onKeyUp,
            open,
            removeListeners,
            setFocus,
            setup;

        tpl = {
            buttons : {
                holder : "<nav class=\"alertify-buttons\">{{buttons}}</nav>",
                submit : "<button role=\"button\" type=\"submit\" class=\"alertify-button alertify-button-ok\" id=\"alertify-ok\">{{ok}}</button>",
                ok     : "<button role=\"button\" type=\"button\" class=\"alertify-button alertify-button-ok\" id=\"alertify-ok\">{{ok}}</button>",
                cancel : "<button role=\"button\" type=\"button\" class=\"alertify-button alertify-button-cancel\" id=\"alertify-cancel\">{{cancel}}</button>"
            },
            input   : "<div class=\"alertify-text-wrapper\"><input type=\"text\" class=\"alertify-text\" id=\"alertify-text\"></div>",
            choices : "<div class=\"alertify-choices-wrapper\">{{choices}}</div>",
            message : "<p class=\"alertify-message\">{{message}}</p>",
            log     : "<article class=\"alertify-log{{class}}\">{{message}}</article>"
        };

        addListeners = function (item) {
            // ok event handler
            onBtnOK = function (event) {
                var val = "";
                if (typeof event.preventDefault !== "undefined") {
                    event.preventDefault();
                }
                removeListeners();
                hide();

                if (controls.input) {
                    val = controls.input.value;
                }
                if (controls.choices) {
                  var selected = document.querySelector('input[name="alertify-choice"]:checked');
                  if (selected) {
                    val = selected.value;
                  }
                }
                if (typeof item.accept === "function") {
                    if ((controls.input) || (controls.choices)) {
                        item.accept(val);
                    } else {
                        item.accept();
                    }
                }
                return false;
            };

            // cancel event handler
            onBtnCancel = function (event) {
                if (typeof event.preventDefault !== "undefined") {
                    event.preventDefault();
                }
                removeListeners();
                hide();
                if (typeof item.deny === "function") {
                    item.deny();
                }
                return false;
            };

            // keyup handler
            onKeyUp = function (event) {
                var keyCode = event.keyCode;
                if (keyCode === keys.SPACE && !controls.input) {
                    onBtnOK(event);
                }
                if (keyCode === keys.ESC && controls.cancel) {
                    onBtnCancel(event);
                }
            };

            // reset focus to first item in the dialog
            onBtnResetFocus = function (event) {
                if (controls.input) {
                    controls.input.focus();
                } else if (controls.cancel) {
                    controls.cancel.focus();
                } else {
                    controls.ok.focus();
                }
            };

            // handle reset focus link
            // this ensures that the keyboard focus does not
            // ever leave the dialog box until an action has
            // been taken
            Alertify.on(controls.reset, "focus", onBtnResetFocus);
            // handle OK click
            if (controls.ok) {
                Alertify.on(controls.ok, "click", onBtnOK);
            }
            // handle Cancel click
            if (controls.cancel) {
                Alertify.on(controls.cancel, "click", onBtnCancel);
            }
            // listen for keys, Cancel => ESC
            Alertify.on(document.body, "keyup", onKeyUp);
            // bind form submit
            if (controls.form) {
                Alertify.on(controls.form, "submit", onBtnOK);
            }
            if (!transition.supported) {
                setFocus();
            }
        };

        /**
         * Append Buttons
         * Insert the buttons in the proper order
         *
         * @param  {String} secondary Cancel button string
         * @param  {String} primary   OK button string
         * @return {String}
         */
        appendBtns = function (secondary, primary) {
            return dialog.buttonReverse ? primary + secondary : secondary + primary;
        };

        build = function (item) {
            var html    = "",
                type    = item.type,
                message = item.message;

            html += "<div class=\"alertify-dialog-inner\">";

            if (dialog.buttonFocus === "none") {
                html += "<a href=\"#\" id=\"alertify-noneFocus\" class=\"alertify-hidden\"></a>";
            }

            if ((type === "prompt") || (type === "choose")) {
                html += "<form id=\"alertify-form\" class=\"cts-ignore\">";
            }

            html += "<article class=\"alertify-inner\">";
            html += tpl.message.replace("{{message}}", message);
            if (type === "prompt") {
                html += tpl.input;
            }

            if (type === "choose") {
                var choicesTxt = "<div id='alertify-choices'>";
                if ("choices" in item.placeholder) {
                  for (idx in item.placeholder.choices) {
                    var choice = item.placeholder.choices[idx];
                    choicesTxt += "<input type='radio' name='alertify-choice' value='" + choice + "' /> <span style='color: black'>" + choice + "</span><br />";
                  }
                }
                choicesTxt += "</div>";
                html += tpl.choices.replace("{{choices}}", choicesTxt);
            }

            html += tpl.buttons.holder;
            html += "</article>";

            if ((type === "prompt") || (type === "choose")) {
                html += "</form>";
            }

            html += "<a id=\"alertify-resetFocus\" class=\"alertify-resetFocus\" href=\"#\">Reset Focus</a>";
            html += "</div>";

            switch (type) {
            case "confirm":
                html = html.replace("{{buttons}}", appendBtns(tpl.buttons.cancel, tpl.buttons.ok));
                html = html.replace("{{ok}}", dialog.labels.ok).replace("{{cancel}}", dialog.labels.cancel);
                break;
            case "prompt":
                html = html.replace("{{buttons}}", appendBtns(tpl.buttons.cancel, tpl.buttons.submit));
                html = html.replace("{{ok}}", dialog.labels.ok).replace("{{cancel}}", dialog.labels.cancel);
                break;
            case "choose":
                html = html.replace("{{buttons}}", appendBtns(tpl.buttons.cancel, tpl.buttons.submit));
                html = html.replace("{{ok}}", dialog.labels.ok).replace("{{cancel}}", dialog.labels.cancel);
                break;
            case "alert":
                html = html.replace("{{buttons}}", tpl.buttons.ok);
                html = html.replace("{{ok}}", dialog.labels.ok);
                break;
            }

            return html;
        };

        hide = function () {
            var transitionDone;
            queue.splice(0,1);
            if (queue.length > 0) {
                open(true);
            } else {
                isOpen = false;
                transitionDone = function (event) {
                    event.stopPropagation();
                    //this.className += " alertify-isHidden";
                    Alertify.off(this, transition.type, transitionDone);
                };
                if (transition.supported) {
                    Alertify.on(dialog.el, transition.type, transitionDone);
                    dialog.el.className = clsElHide;
                } else {
                    dialog.el.className = clsElHide;
                }
                dialog.cover.className  = clsCoverHide;
                elCallee.focus();
            }
        };

        /**
         * Initialize Dialog
         * Create the dialog and cover elements
         *
         * @return {Object}
         */
        init = function () {
            var cover = element.create("div", { classes: clsCoverHide }),
                el    = element.create("section", { classes: clsElHide });

            cover.classList.add('cts-ui');
            el.classList.add('cts-ui');

            document.body.appendChild(cover);
            document.body.appendChild(el);
            element.ready(cover);
            element.ready(el);
            dialog.cover = cover;
            return el;
        };

        open = function (fromQueue) {
            var item = queue[0],
                onTransitionEnd;

            isOpen = true;

            onTransitionEnd = function (event) {
                event.stopPropagation();
                setFocus();
                Alertify.off(this, transition.type, onTransitionEnd);
            };

            if (transition.supported && !fromQueue) {
                Alertify.on(dialog.el, transition.type, onTransitionEnd);
            }
            dialog.el.innerHTML    = build(item);
            dialog.cover.className = clsCoverShow;
            dialog.el.className    = clsElShow;

            controls.reset  = Alertify.get("alertify-resetFocus");
            controls.ok     = Alertify.get("alertify-ok")     || undefined;
            controls.cancel = Alertify.get("alertify-cancel") || undefined;
            controls.focus  = (dialog.buttonFocus === "cancel" && controls.cancel) ? controls.cancel : ((dialog.buttonFocus === "none") ? Alertify.get("alertify-noneFocus") : controls.ok),
            controls.input  = Alertify.get("alertify-text")   || undefined;
            controls.choices = Alertify.get("alertify-choices")   || undefined;
            controls.form   = Alertify.get("alertify-form")   || undefined;

            if (typeof item.placeholder === "string" && item.placeholder !== "") {
                controls.input.value = item.placeholder;
            }

            if (fromQueue) {
                setFocus();
            }
            addListeners(item);
        };

        /**
         * Remove Event Listeners
         *
         * @return {undefined}
         */
        removeListeners = function () {
            Alertify.off(document.body, "keyup", onKeyUp);
            Alertify.off(controls.reset, "focus", onBtnResetFocus);
            if (controls.input) {
                Alertify.off(controls.form, "submit", onFormSubmit);
            }
            if (controls.ok) {
                Alertify.off(controls.ok, "click", onBtnOK);
            }
            if (controls.cancel) {
                Alertify.off(controls.cancel, "click", onBtnCancel);
            }
        };

        /**
         * Set Focus
         * Set focus to proper element
         *
         * @return {undefined}
         */
        setFocus = function () {
            if (controls.input) {
                controls.input.focus();
                controls.input.select();
            } else {
                controls.focus.focus();
            }
        };

        /**
         * Setup Dialog
         *
         * @param  {String} type        Dialog type
         * @param  {String} msg         Dialog message
         * @param  {Function} accept    [Optional] Accept callback
         * @param  {Function} deny      [Optional] Deny callback
         * @param  {String} placeholder [Optional] Input placeholder text
         * @return {undefined}
         */
        setup = function (type, msg, accept, deny, placeholder) {
            if (!validate.isString(type)          ||
                !validate.isString(msg)           ||
                !validate.isFunction(accept,true) ||
                !validate.isFunction(deny,true)) {
                throw new Error(validate.messages.invalidArguments);
            }
            dialog.el = dialog.el || init();
            dialog.el.className = dialog.el.className + " " + "cts-ignore"; 
            elCallee = document.activeElement;

            queue.push({
                type        : type,
                message     : msg,
                accept      : accept,
                deny        : deny,
                placeholder : placeholder
            });

            if (!isOpen) {
                open();
            }
        };

        return {
            buttonFocus   : "ok",
            buttonReverse : false,
            cover         : undefined,
            el            : undefined,
            labels: {
                ok: "OK",
                cancel: "Cancel"
            },
            alert: function (msg, accept) {
                dialog = this;
                setup("alert", msg, accept);
                return this;
            },
            confirm: function (msg, accept, deny) {
                dialog = this;
                setup("confirm", msg, accept, deny);
                return this;
            },
            prompt: function (msg, accept, deny, placeholder) {
                dialog = this;
                setup("prompt", msg, accept, deny, placeholder);
                return this;
            },
            choose: function (msg, accept, deny, choices) {
                dialog = this;
                setup("choose", msg, accept, deny, choices);
                return this;
            }
        };
    };

    return new Dialog();
}());
var Log = (function () {
    

    var Log,
        onTransitionEnd,
        remove,
        startTimer,
        prefix  = Alertify._prefix + "-log",
        clsShow = prefix + " is-" + prefix + "-showing",
        clsHide = prefix + " is-" + prefix + "-hidden";

    /**
     * Log Method
     *
     * @param {Object} parent HTML DOM to insert log message into
     * @param {String} type   Log type
     * @param {String} msg    Log message
     * @param {Number} delay  [Optional] Delay in ms
     */
    Log = function (parent, type, msg, delay) {
        if (!validate.isObject(parent) ||
            !validate.isString(type) ||
            !validate.isString(msg) ||
            !validate.isNumber(delay, true)) {
            throw new Error(validate.messages.invalidArguments);
        }

        this.delay  = (typeof delay !== "undefined") ? delay : 5000;
        this.msg    = msg;
        this.parent = parent;
        this.type   = type;
        this.create();
        this.show();
    };

    /**
     * Transition End
     * Handle CSS transition end
     *
     * @param  {Event} event Event
     * @return {undefined}
     */
    onTransitionEnd = function (event) {
        event.stopPropagation();
        if (typeof this.el !== "undefined") {
            Alertify.off(this.el, transition.type, this.fn);
            remove.call(this);
        }
    };

    /**
     * Remove
     * Remove the element from the DOM
     *
     * @return {undefined}
     */
    remove = function () {
        this.parent.removeChild(this.el);
        delete this.el;
    };

    /**
     * StartTimer
     *
     * @return {undefined}
     */
    startTimer = function () {
        var that = this;
        if (this.delay !== 0) {
            setTimeout(function () {
                that.close();
            }, this.delay);
        }
    };

    /**
     * Close
     * Prepare the log element to be removed.
     * Set an event listener for transition complete
     * or call the remove directly
     *
     * @return {undefined}
     */
    Log.prototype.close = function () {
        var that = this;
        if (typeof this.el !== "undefined" && this.el.parentNode === this.parent) {
            if (transition.supported) {
                this.fn = function (event) {
                    onTransitionEnd.call(that, event);
                };
                Alertify.on(this.el, transition.type, this.fn);
                this.el.className = clsHide + " " + prefix + "-" + this.type;
            } else {
                remove.call(this);
            }
        }
    };

    /**
     * Create
     * Create a new log element and
     * append it to the parent
     *
     * @return {undefined}
     */
    Log.prototype.create = function () {
        if (typeof this.el === "undefined") {
            var el = element.create("article", {
                classes: clsHide + " " + prefix + "-" + this.type
            });
            el.innerHTML = this.msg;
            this.parent.appendChild(el);
            element.ready(el);
            this.el = el;
        }
    };

    /**
     * Show
     * Show new log element and bind click listener
     *
     * @return {undefined}
     */
    Log.prototype.show = function () {
        var that = this;
        if (typeof this.el === "undefined") {
            return;
        }
        Alertify.on(this.el, "click", function () {
            that.close();
        });
        this.el.className = clsShow + " " + prefix + "-" + this.type;
        startTimer.call(this);
    };

    return Log;
}());
var logs = (function () {
    

    var init,
        createLog,
        validateParams,
        logs;

    /**
     * Init Method
     * Create the log holder element
     *
     * @return {Object} Log holder element
     */
    init = function () {
        var el = element.create("section", { classes: Alertify._prefix + "-logs" });
        document.body.appendChild(el);
        element.ready(el);
        return el;
    };

    /**
     * Create Log
     *
     * @param  {String} type  Log type
     * @param  {String} msg   Log message
     * @param  {Number} delay [Optional] Delay in ms
     * @return {Object}
     */
    createLog = function (type, msg, delay) {
        validateParams(type, msg, delay);
        this.el = this.el || init();
        return new Log(this.el, type, msg, delay);
    };

    /**
     * Validate Parameters
     *
     * @param  {String} type  Log type
     * @param  {String} msg   Log message
     * @param  {Number} delay [Optional] Delay in ms
     * @return {undefined}
     */
    validateParams = function (type, msg, delay) {
        if (!validate.isString(type) ||
            !validate.isString(msg) ||
            !validate.isNumber(delay, true)) {
            throw new Error(validate.messages.invalidArguments);
        }
    };

    /**
     * Logs API
     *
     * @type {Object}
     */
    logs = {
        delay : 5000,
        el    : undefined,
        create: function (type, msg, delay) {
            return createLog.call(this, type, msg, delay);
        },
        error: function (msg, delay) {
            return createLog.call(this, "error", msg, delay);
        },
        info: function (msg, delay) {
            return createLog.call(this, "info", msg, delay);
        },
        success: function (msg, delay) {
            return createLog.call(this, "success", msg, delay);
        }
    };

    return logs;
}());

    Alertify.dialog = Dialog;
    Alertify.log    = logs;
    window.Alertify = Alertify;

})(this, document);

/*
* jQuery File Download Plugin v1.4.2 
* http://www.johnculviner.com
* Copyright (c) 2013 - John Culviner
* Licensed under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*/
function loadCtsUiFileDownloadPlugin() {
(function($, window){
	// i'll just put them here to get evaluated on script load
	var htmlSpecialCharsRegEx = /[<>&\r\n"']/gm;
	var htmlSpecialCharsPlaceHolders = {
				'<': 'lt;',
				'>': 'gt;',
				'&': 'amp;',
				'\r': "#13;",
				'\n': "#10;",
				'"': 'quot;',
				"'": 'apos;' /*single quotes just to be safe*/
	};

$.extend({
    //
    //$.fileDownload('/path/to/url/', options)
    //  see directly below for possible 'options'
    fileDownload: function (fileUrl, options) {

        //provide some reasonable defaults to any unspecified options below
        var settings = $.extend({

            //
            //Requires jQuery UI: provide a message to display to the user when the file download is being prepared before the browser's dialog appears
            //
            preparingMessageHtml: null,

            //
            //Requires jQuery UI: provide a message to display to the user when a file download fails
            //
            failMessageHtml: null,

            //
            //the stock android browser straight up doesn't support file downloads initiated by a non GET: http://code.google.com/p/android/issues/detail?id=1780
            //specify a message here to display if a user tries with an android browser
            //if jQuery UI is installed this will be a dialog, otherwise it will be an alert
            //
            androidPostUnsupportedMessageHtml: "Unfortunately your Android browser doesn't support this type of file download. Please try again with a different browser.",

            //
            //Requires jQuery UI: options to pass into jQuery UI Dialog
            //
            dialogOptions: { modal: true },

            //
            //a function to call while the dowload is being prepared before the browser's dialog appears
            //Args:
            //  url - the original url attempted
            //
            prepareCallback: function (url) { },

            //
            //a function to call after a file download dialog/ribbon has appeared
            //Args:
            //  url - the original url attempted
            //
            successCallback: function (url) { },

            //
            //a function to call after a file download dialog/ribbon has appeared
            //Args:
            //  responseHtml    - the html that came back in response to the file download. this won't necessarily come back depending on the browser.
            //                      in less than IE9 a cross domain error occurs because 500+ errors cause a cross domain issue due to IE subbing out the
            //                      server's error message with a "helpful" IE built in message
            //  url             - the original url attempted
            //
            failCallback: function (responseHtml, url) { },

            //
            // the HTTP method to use. Defaults to "GET".
            //
            httpMethod: "GET",

            //
            // if specified will perform a "httpMethod" request to the specified 'fileUrl' using the specified data.
            // data must be an object (which will be $.param serialized) or already a key=value param string
            //
            data: null,

            //
            //a period in milliseconds to poll to determine if a successful file download has occured or not
            //
            checkInterval: 100,

            //
            //the cookie name to indicate if a file download has occured
            //
            cookieName: "fileDownload",

            //
            //the cookie value for the above name to indicate that a file download has occured
            //
            cookieValue: "true",

            //
            //the cookie path for above name value pair
            //
            cookiePath: "/",

            //
            //the title for the popup second window as a download is processing in the case of a mobile browser
            //
            popupWindowTitle: "Initiating file download...",

            //
            //Functionality to encode HTML entities for a POST, need this if data is an object with properties whose values contains strings with quotation marks.
            //HTML entity encoding is done by replacing all &,<,>,',",\r,\n characters.
            //Note that some browsers will POST the string htmlentity-encoded whilst others will decode it before POSTing.
            //It is recommended that on the server, htmlentity decoding is done irrespective.
            //
            encodeHTMLEntities: true
            
        }, options);

        var deferred = new $.Deferred();

        //Setup mobile browser detection: Partial credit: http://detectmobilebrowser.com/
        var userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

        var isIos;                  //has full support of features in iOS 4.0+, uses a new window to accomplish this.
        var isAndroid;              //has full support of GET features in 4.0+ by using a new window. Non-GET is completely unsupported by the browser. See above for specifying a message.
        var isOtherMobileBrowser;   //there is no way to reliably guess here so all other mobile devices will GET and POST to the current window.

        if (/ip(ad|hone|od)/.test(userAgent)) {

            isIos = true;

        } else if (userAgent.indexOf('android') !== -1) {

            isAndroid = true;

        } else {

            isOtherMobileBrowser = /avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|playbook|silk|iemobile|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4));

        }

        var httpMethodUpper = settings.httpMethod.toUpperCase();

        if (isAndroid && httpMethodUpper !== "GET") {
            //the stock android browser straight up doesn't support file downloads initiated by non GET requests: http://code.google.com/p/android/issues/detail?id=1780

            if ($().dialog) {
                $("<div>").html(settings.androidPostUnsupportedMessageHtml).dialog(settings.dialogOptions);
            } else {
                alert(settings.androidPostUnsupportedMessageHtml);
            }

            return deferred.reject();
        }

        var $preparingDialog = null;

        var internalCallbacks = {

            onPrepare: function (url) {

                //wire up a jquery dialog to display the preparing message if specified
                if (settings.preparingMessageHtml) {
                  Alertify.log.info(settings.preparingMessageHtml);
                } else if (settings.prepareCallback) {
                  settings.prepareCallback(url);
                }

            },

            onSuccess: function (url) {

                //remove the perparing message if it was specified
                if ($preparingDialog) {
                };

                Alertify.log.success("File download beginning...");
                settings.successCallback(url);

                deferred.resolve(url);
            },

            onFail: function (responseHtml, url) {

                //remove the perparing message if it was specified
                if ($preparingDialog) {
                };

                //wire up a jquery dialog to display the fail message if specified
                if (settings.failMessageHtml) {
                  Alertify.log.error(settings.failMessageHtml);
                }

                settings.failCallback(responseHtml, url);
                
                deferred.reject(responseHtml, url);
            }
        };

        internalCallbacks.onPrepare(fileUrl);

        //make settings.data a param string if it exists and isn't already
        if (settings.data !== null && typeof settings.data !== "string") {
            settings.data = $.param(settings.data);
        }


        var $iframe,
            downloadWindow,
            formDoc,
            $form;

        if (httpMethodUpper === "GET") {

            if (settings.data !== null) {
                //need to merge any fileUrl params with the data object

                var qsStart = fileUrl.indexOf('?');

                if (qsStart !== -1) {
                    //we have a querystring in the url

                    if (fileUrl.substring(fileUrl.length - 1) !== "&") {
                        fileUrl = fileUrl + "&";
                    }
                } else {

                    fileUrl = fileUrl + "?";
                }

                fileUrl = fileUrl + settings.data;
            }

            if (isIos || isAndroid) {

                downloadWindow = window.open(fileUrl);
                downloadWindow.document.title = settings.popupWindowTitle;
                window.focus();

            } else if (isOtherMobileBrowser) {

                window.location(fileUrl);

            } else {

                //create a temporary iframe that is used to request the fileUrl as a GET request
                $iframe = $("<iframe>")
                    .hide()
                    .prop("src", fileUrl)
                    .appendTo("body");
            }

        } else {

            var formInnerHtml = "";

            if (settings.data !== null) {

                $.each(settings.data.replace(/\+/g, ' ').split("&"), function () {

                    var kvp = this.split("=");

                    var key = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[0])) : decodeURIComponent(kvp[0]);
                    if (key) {
                        var value = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[1])) : decodeURIComponent(kvp[1]);
                    formInnerHtml += '<input type="hidden" name="' + key + '" value="' + value + '" />';
                    }
                });
            }

            if (isOtherMobileBrowser) {

                $form = $("<form>").appendTo("body");
                $form.hide()
                    .prop('method', settings.httpMethod)
                    .prop('action', fileUrl)
                    .html(formInnerHtml);

            } else {

                if (isIos) {

                    downloadWindow = window.open("about:blank");
                    downloadWindow.document.title = settings.popupWindowTitle;
                    formDoc = downloadWindow.document;
                    window.focus();

                } else {

                    $iframe = $("<iframe style='display: none' src='about:blank'></iframe>").appendTo("body");
                    formDoc = getiframeDocument($iframe);
                }

                formDoc.write("<html><head></head><body><form method='" + settings.httpMethod + "' action='" + fileUrl + "'>" + formInnerHtml + "</form>" + settings.popupWindowTitle + "</body></html>");
                $form = $(formDoc).find('form');
            }

            $form.submit();
        }


        //check if the file download has completed every checkInterval ms
        setTimeout(checkFileDownloadComplete, settings.checkInterval);


        function checkFileDownloadComplete() {

            //has the cookie been written due to a file download occuring?
            if (document.cookie.indexOf(settings.cookieName + "=" + settings.cookieValue) != -1) {

                //execute specified callback
                internalCallbacks.onSuccess(fileUrl);

                //remove the cookie and iframe
                document.cookie = settings.cookieName + "=; expires=" + new Date(1000).toUTCString() + "; path=" + settings.cookiePath;

                cleanUp(false);

                return;
            }

            //has an error occured?
            //if neither containers exist below then the file download is occuring on the current window
            if (downloadWindow || $iframe) {

                //has an error occured?
                try {

                    var formDoc = downloadWindow ? downloadWindow.document : getiframeDocument($iframe);

                    if (formDoc && formDoc.body != null && formDoc.body.innerHTML.length) {

                        var isFailure = true;

                        if ($form && $form.length) {
                            var $contents = $(formDoc.body).contents().first();

                            if ($contents.length && $contents[0] === $form[0]) {
                                isFailure = false;
                            }
                        }

                        if (isFailure) {
                            internalCallbacks.onFail(formDoc.body.innerHTML, fileUrl);

                            cleanUp(true);

                            return;
                        }
                    }
                }
                catch (err) {

                    //500 error less than IE9
                    internalCallbacks.onFail('', fileUrl);

                    cleanUp(true);

                    return;
                }
            }


            //keep checking...
            setTimeout(checkFileDownloadComplete, settings.checkInterval);
        }

        //gets an iframes document in a cross browser compatible manner
        function getiframeDocument($iframe) {
            var iframeDoc = $iframe[0].contentWindow || $iframe[0].contentDocument;
            if (iframeDoc.document) {
                iframeDoc = iframeDoc.document;
            }
            return iframeDoc;
        }

        function cleanUp(isFailure) {

            setTimeout(function() {

                if (downloadWindow) {

                    if (isAndroid) {
                        downloadWindow.close();
                    }

                    if (isIos) {
                        downloadWindow.focus(); //ios safari bug doesn't allow a window to be closed unless it is focused
                        if (isFailure) {
                            downloadWindow.close();
                        }
                    }
                }
                
                //iframe cleanup appears to randomly cause the download to fail
                //not doing it seems better than failure...
                //if ($iframe) {
                //    $iframe.remove();
                //}

            }, 0);
        }


        function htmlSpecialCharsEntityEncode(str) {
            return str.replace(htmlSpecialCharsRegEx, function(match) {
                return '&' + htmlSpecialCharsPlaceHolders[match];
        	});
        }

        return deferred.promise();
    }
});
})(CTS.$, this);
}

_CTSUI.Switchboard = function($, q, opts) {
  this.opts = opts || {};

  if (typeof this.opts.serverUrl == 'undefined') {
    this.opts.serverUrl = _CTSUI.serverBase + _CTSUI.switchboardPath;
  }

  this._q = q;
  this._$ = $;
  this._opQueue = [];
  this._opSending = null;
  this._flushLock = null; // Null or a promise.
  this._flushAgain = null; // Null or a promise

  // TEMPORARY:
  this.opts.serverUrl = 'cts.php';
};

_CTSUI.Switchboard.prototype.recordOperation = function(operation) {
  console.log("Saving operation: ", operation);
  var tuple = [operation, this._q.defer()];
  this._opQueue.push(tuple);
  return tuple[1].promise;
};

_CTSUI.Switchboard.prototype.flush = function() {
  console.log("Switchboard::flush");
  if (this._flushLock != null) {
    console.log("Switchboard::flush -- Flush already in progress");
    // A flush is already in progress. 
    // So we'll return a promise for the *next* flush.
    if (this._flushAgain == null) {
      console.log("Switchboard::flush -- Creating second flush to come after");
      this._flushAgain = this._q.defer();
    }
    return this._flushAgain.promise;
  } else {
    // No flush is in progress, so we'll perform one and return the promise to
    // finish it.
    this._flushLock = this._q.defer();
    this._opSending = this._opQueue.slice(0); // Clone the array
    console.log("Switchboard::flush -- No flush in progress: performing flush of " + this._opSending.length + " operations");
    this._doFlush();
    return this._flushLock.promise;
  }
};

_CTSUI.Switchboard.prototype._flushComplete = function(success, msg, jqXHR, textStatus) {
  console.log("Switchboard::_flushComplete");
  // Rotate all the locks.
  var oldLock = this._flushLock;
  this._flushLock = this._flushAgain;
  this._flushAgain = null;

  // Now before we do anything, curate the queued operations.
  // If success, prune the ones send. Else, do nothing.
  if (success) {
    console.log("Switchboard::_flushComplete -- Success!");
    this._opQueue = this._opQueue.slice(this._opSending.length);
    // Resolve all sending ops
    var response = msg;
    // TODO: Make sure the same number of ops were received.
    // TODO: Before we flush, verify that we receive confirmation.
    for (var i = 0; i < this._opSending.length; i++) {
      var opResult = response[i];
      this._opSending[i][1].resolve(opResult);
    }
    this._opSending = null;
    oldLock.resolve();
  } else {
    console.log("Switchboard::_flushComplete -- Filed with message", msg);
    this._opSending = null;
    oldLock.reject();
  }

  // If other flushes were pending, do them now.
  if (this._flushLock != null) {
    console.log("Switchboard::_flushComplete -- Doing flush again, since it was scheduled");
    this._doFlush();
  }
};

_CTSUI.Switchboard.prototype._doFlush = function() {
  console.log("Switchboard::_doFlush");
  var self = this;

  // Collet the operations to send.
  var toSend = [];
  for (var i = 0; i < this._opSending.length; i++) {
    toSend.push(this._opSending[i][0]);
  }

  var data = {
    'operations': toSend
  };

  var data = JSON.stringify(data);
  console.log("Posting data", data);

  this._$.ajax({
    type: "POST",
    url: this.opts.serverUrl,
    data: data,
    contentType:"application/json; charset=utf-8"
  }).done(function(message) {
    self._flushComplete(true, message, null, null);
  }).fail(function(jqXHR, textStatus) {
    self._flushComplete(false, null, jqXHR, textStatus);
  });
};

_CTSUI.Switchboard.prototype._maybeFlush = function() {
  console.log("Switchboard::_maybeFlush");
  // TODO: It would be nice to pool multiple operations together.
  return this.flush();
};

_CTSUI.Tray = function() {
  this.$body = CTS.$('body');
  this._originalBodyMargin = this.$body.css("margin-left");
  this.$body.css({"position": "relative", "overflow-x": "scroll"});
  this._width = 100;
  this._buttonWidth = 37;

  // Pages inside the tray, such as the theminator
  this._pages = [];

  // The container DIV which contains the CTS to load the HTML impl.
  this.$container = null;

  // The node representing the tray body, loaded by CTS.
  this.$node = null;

  this.loadMockup();
};

_CTSUI.Tray.prototype.loadMockup = function() {
  this.$container = CTS.$("<div class='cts-ui'></div>");
  this.$container.css({
    zIndex: 64999// Important: more than the picker.
  });

  var cts = "@html tray " + CTS.UI.URLs.Mockups.tray + ";";
  CTS.UI.Util.addCss(CTS.UI.URLs.Styles.tray);
  CTS.UI.Util.addCss(CTS.UI.URLs.Styles.bootstrap);
  CTS.UI.Util.addCss(CTS.UI.URLs.Styles.modal);
  CTS.UI.Util.addCss(CTS.UI.URLs.Styles.ionicons);
  cts += "this :is tray | #cts-ui-tray;";
  this.$container.attr("data-cts", cts);
  var self = this;
  this.$container.on("cts-received-is", function(evt) {
    self.setupMockup();
    evt.stopPropagation();
  });
  this.$container.appendTo(this.$body);
};

_CTSUI.Tray.prototype.setupMockup = function() {
  var self = this;
  this.$node = this.$container.find('.cts-ui-tray');
  this.$trayContents = this.$container.find('.cts-ui-tray-contents');

  this._button = this.$node.find('.cts-ui-expand-tray-button');
  this._button.on('click', function() {
    self.toggle();
  });

  this._buttonContainer = this.$node.find('.cts-ui-expand-tray');
  this._buttonContainer.css({ zIndex: 65000 });

  var $page = CTS.$('<div class="cts-ui-page"></div>');
  $page.appendTo(this.$trayContents);
  this._editor = new CTS.UI.Editor(this, $page);
  this._pages.push(this._editor);

  this.updateSize();
  CTS.$(window).resize(function() {
    self.updateSize();
  });

  this.toggle();
};

_CTSUI.Tray.prototype.invokeTheminator = function(page) {
  var $page = CTS.$('<div class="cts-ui-page"></div>');
  $page.hide();
  $page.appendTo(this.$trayContents);
  this._theminator = new CTS.UI.Theminator(this, $page);
  this.pushPage(this._theminator);
};

_CTSUI.Tray.prototype.invokeScraper = function(page) {
  var $page = CTS.$('<div class="cts-ui-page"></div>');
  $page.hide();
  $page.appendTo(this.$trayContents);
  this._scraper = new CTS.UI.Scraper(this, $page);
  this.pushPage(this._scraper);
};

_CTSUI.Tray.prototype.pushPage = function(page) {
  this._pages[this._pages.length - 1].$page.hide();
  this._pages.push(page);
  page.$page.show();
  this.transitionToWidth(page.requestedWidth());
  var windowHeight = CTS.$(window).height();
  page.updateSize(windowHeight);
};

_CTSUI.Tray.prototype.popPage = function() {
  var page = this._pages.pop();
  if (page) {
    page.$page.remove();
  }
  var newPage = this._pages[this._pages.length - 1];
  this.transitionToWidth(newPage.requestedWidth());
  newPage.$page.show();
};

_CTSUI.Tray.prototype.transitionToWidth = function(width) {
  this._width = width;
  var outerWidth = width + this._buttonWidth;
  this.$node.find('.cts-ui-tray-contents').animate({
    'width': width + 'px'
  });
  this.$node.animate({
    'width': outerWidth + 'px'
  });
  var spec2 = {'left': ((this._width + 1) + "px")};
  this.$node.find('.cts-ui-expand-tray').animate(spec2);
};

_CTSUI.Tray.prototype.open = function() {
    //var fromTop = CTS.$(window).scrollTop();
  this.$node.animate({"left":"0px"});
    //CTS.$(window).scrollTop(fromTop);
  this.$body.animate({"left": ((this._width + 1) + "px")});
};

_CTSUI.Tray.prototype.close = function() {
    //var fromTop = CTS.$(window).scrollTop();
  this.$node.animate({"left":("-" + (this._width + 1) + "px")});
    //CTS.$(window).scrollTop(fromTop);
  this.$body.animate({"left":"0px"});
};

_CTSUI.Tray.prototype.toggle = function() {
  if (this.$node.hasClass("cts-ui-open")) {
    this.close();
    this.$node.removeClass("cts-ui-open");
    this.$node.addClass("cts-ui-closed");
  } else if (this.$node.hasClass("cts-ui-closed")) {
    this.open();
    this.$node.removeClass("cts-ui-closed");
    this.$node.addClass("cts-ui-open");
  } 
};

_CTSUI.Tray.prototype.updateSize = function() {
  // Set the height of the tray to the window size
  var windowHeight = CTS.$(window).height();
  this.$node.height(windowHeight);
  this.$trayContents.height(windowHeight);
  for (var i = 0; i < this._pages.length; i++) {
    this._pages[i].updateSize(windowHeight);
  }
};

/**
 * Card
 *
 * This is a UI widget for flipping an element over.
 *
 * Implementation adapted from:
 *  http://davidwalsh.name/css-flip
 *
 * Args:
 *  $       - jQuery (can be found at CTS.$ once CTS loads)
 *  $front  - The front of the card
 *  $back   - The back of the card
 */
_CTSUI.Card = function($, $front, $back) {
  this.$ = $;
  this.$front = $front;
  this.$back = $back;
  if (typeof $back == 'undefined') {
    this.$back = this.$('<div></div>');
  }

  this.initializeCss();
  this.initializeCard();
  this._showingFront = true;
};


/** Adds CSS to the HEAD if it isn't already
  */
_CTSUI.Card.CssAdded = false;
_CTSUI.Card.Css = "<style>" +
  ".cts-ui-card { -webkit-perspective: 1000; -moz-perspective: 1000; perspective: 1000; }" +
  ".cts-ui-card-flipper { "+
     "-webkit-transition: 0.6s; -moz-transition: 0.6s; transition: 0.6s; " +
     "-webkit-transform-style: preserve-3d; -moz-transform-style: preserve-3d; transform-style: preserve-3d; " +
     "position: relative } " +
  ".cts-ui-card-front, .cts-ui-card-back {" +
     "-webkit-backface-visibility: hidden; -moz-backface-visibility: hidden; backface-visibility: hidden; " +
    "position: absolute; top: 0; left: 0;} " +
  ".cts-ui-card-front { z-index: 2; }" +
  ".flip .cts-ui-card-flipper {-webkit-transform: rotateY(180deg); -moz-transform: rotateY(180deg); transform: rotateY(180deg) }" +
  ".cts-ui-card-back { -webkit-transform: rotateY(180deg); -moz-transform: rotateY(180deg); transform: rotateY(180deg); }" +
  "</style>";

_CTSUI.Card.prototype.initializeCss = function() {
  if (! _CTSUI.Card.CssAdded) {
    this.$('head').append(_CTSUI.Card.Css);
    _CTSUI.Card.CssAdded = true;
  }
};

/** Replaces the element in the DOM with a card structure.
 *
 */
_CTSUI.Card.prototype.initializeCard = function() {
  // Set the width and height.
  var width = 320;
  var height = 480;

  var widthPx = width + 'px';
  var heightPx = height+ 'px';

  this.$front.wrap("<div class='cts-ui-card-front'></div>");
  this.$frontContainer = this.$(this.$front.parent());

  this.$frontContainer.wrap("<div class='cts-ui-card-flipper'></div>");
  this.$flipper = this.$(this.$frontContainer.parent());

  this.$backContainer = this.$("<div class='cts-ui-card-back'></div>");
  this.$backContainer.append(this.$back);
  this.$flipper.append(this.$backContainer);

  this.$flipper.wrap("<div class='cts-ui-card'></div>");
  this.$card = this.$(this.$flipper.parent());

  this.$frontContainer.css('height', heightPx);
  this.$backContainer.css('height', heightPx);
  this.$card.css('height', heightPx);

  this.$frontContainer.css('width', widthPx);
  this.$backContainer.css('width', widthPx);
  this.$card.css('width', widthPx);

};

_CTSUI.Card.prototype.showBack = function() {
  if (! this._showingFront) {
    return;
  }
  this._showingFront = false;
  this.$card.addClass('flip');
};

_CTSUI.Card.prototype.showFront = function() {
  if (this._showingFront) {
    return;
  }
  this._showingFront = true;
  this.$card.removeClass('flip');
};

/**
 * Element Picker.
 *
 * Args:
 *  $ - jQuery (can be found at CTS.$ once CTS loads)
 *  q - The Q library (can be found at CTS.Q once CTS loads)
 */
_CTSUI.Picker = function($, q) {
  this._$ = $;
  this._q = q;

  // The promise for picking. Only one pick action possible at a time.
  this._deferred = null;

  // For rate-limiting mousemove responses
  this._lastTime = new Date();

  // For rate-limiting keypress responses
  this._isKeyDown = false;

  // Various magic numbers
  this.CONST = {
    'PREV': 37, // Left
    'NEXT': 39, // Right
    'CHILD': 40, // Down
    'PARENT': 38, // Up
    'SELECT': 13, // Enter
    'QUIT': 27, // Esc
    'MOUSE_MOVEMENT_GRANULARITY': 25, // Millisec
    'UI_ID': 'cts-ui-picker-chrome',
    'UI': {
      'OptionOnly': {
        'border': '1px solid red',
        'background': 'rgba(255, 0, 0, 0.3)',
        'text': ''
      },
      'Offer': {
        'border': '1px solid blue',
        'background': 'rgba(0, 0, 255, 0.3)',
        'text': 'Click to Edit'
      },
      'NoOffer': {
        'border': 'none',
        'background': 'transparent',
        'text': ''
      }

    }
  };

  // This dictionary stores a copy of these methods with the scope
  // hard wired so that the `this` pointer will address this object
  // instance.
  this.CALLBACK = {
    'keydown': this._$.proxy(this._keyDown, this),
    'keyup': this._$.proxy(this._keyUp, this),
    'mousemove': this._$.proxy(this._mouseMove, this),
    'click': this._$.proxy(this._click, this)
  };

  // The element currently under focus of the picker.
  this._$selected = null;

  // The visual representation of the picker focus in the DOM
  this._$ui = this._$('<div id="' + this.CONST.UI_ID + '" class="cts-ignore"></div>');
  this._$ui.css({
    display: 'none',
    position: 'absolute',
    zIndex: 60000,
    background: this.CONST.UI.Offer.background,
    border: this.CONST.UI.Offer.border
  });

  // Options for the current picking action
  this._currentOpts = {};

};

/*
 * Public methods
 *-----------------------------------------------------*/

/*
 * Returns boolean: whether the picker is active.
 */
_CTSUI.Picker.prototype.isPickInProgress = function() {
  return (this._deferred != null);
};

/**
 * Returns a promise to pick something.
 */
_CTSUI.Picker.prototype.pick = function(opts) {
  this._currentOpts = opts || {};

  if (this.isPickInProgress()) {
    this.cancel("New pick initiated.");
  }
  this._deferred = this._q.defer();
  this._constructUI();
  return this._deferred.promise;
};

/*
 * Cancel the current picking action.
 */
_CTSUI.Picker.prototype.cancel = function(reason) {
  if (this.isPickInProgress()) {
    this._destroyUI();
    this._deferred.reject(reason);
    this._deferred = null;
    this._$selected = null
    this._currentOpts = {};
  }
};

/*
 * User interface
 *-----------------------------------------------------*/

_CTSUI.Picker.prototype._constructUI = function() {
  this._$(document)
    .on('keydown', this.CALLBACK.keydown)
    .on('keyup', this.CALLBACK.keyup)
    .on('mousemove', this.CALLBACK.mousemove)
    .on('click', this.CALLBACK.click);

  var h1 = this._$('body').html();
  this._$('body').append(this._$ui);
  var h2 = this._$('body').html();
};

_CTSUI.Picker.prototype._destroyUI = function() {
  this._$(document)
    .off('keydown', this.CALLBACK.keydown)
    .off('keyup', this.CALLBACK.keyup)
    .off('mousemove', this.CALLBACK.mousemove)
    .off('click', this.CALLBACK.click);
  this._$ui.remove();
};

/*
 * Args:
 *  $elem - jQuery object
 */
_CTSUI.Picker.prototype._select = function($elem) {
  // Behavior on empty selection: nothing
  if ((typeof $elem == 'undefined') || ($elem == null) || ($elem.length == 0)) {
    return;
  }

  // If the selected element is already this, do nothing.
  if ($elem == this._$selected) {
    return;
  }

  var offerElementSelection = this._canSelect($elem);
  var offerElementOptions = this._canOfferOptions($elem);

  var newCss = {
    position: 'absolute',
    width: ($elem.outerWidth() - (this.CONST.UI_BORDER * 2)) + 'px',
    height: ($elem.outerHeight() - (this.CONST.UI_BORDER * 2)) + 'px',
    left: ($elem.offset().left - bodyPos.left) + 'px',
    top: ($elem.offset().top - bodyPos.top) + 'px'
  };
  var bodyPos = this._$('body').position();

  if (offerElementSelection) {
    newCss['background'] = this.CONST.UI.Offer.background;
    newCss['broder'] = this.CONST.UI.Offer.border;
  } else if ((!offerElementSelection) && (offerElementOptions)) {
    newCss['background'] = this.CONST.UI.OptionOnly.background;
    newCss['broder'] = this.CONST.UI.OptionOnly.border;
  } else {
    newCss['background'] = this.CONST.UI.NoOffer.background;
    newCss['broder'] = this.CONST.UI.NoOffer.border;
  }
  this._$ui.css(newCss);

  if (offerElementOptions) {
  } else {
  }

  this._$ui.show();
  this._$selected = $elem;
}

/*
 * Clears current selection.
 */
_CTSUI.Picker.prototype._deselect = function() {
  this._$selected = null;
  this._$ui.hide();
};

/*
 * Listeners
 *-----------------------------------------------------*/

_CTSUI.Picker.prototype._keyDown = function(event) {
  if (this._isKeyDown) {
    // Browser repeats keydown while key is depressed..
    return;
  }
  this._isKeyDown = true;
  var candidate = null;

  var firstChild = function($e) {
    var kids = $e.children();
    var toSelect = null;
    if (kids.length > 0) {
      toSelect = this._$(kids[0]);
    }
    return toSelect;
  };

  switch (event.which) {
    case this.CONST.PREV:
      candidate = this._$selected.prev();
      while ((candidate.length > 0) && (! this._canSelect(candidate)) && (this._canSelect(candidate))) {
        candidate = candidate.prev();
      }
      if ((candidate != null) && (candidate.length > 0)) {
        this._select(candidate);
      }
      break;
    case this.CONST.NEXT:
      candidate = this._$selected.next();
      while ((candidate.length > 0) && (! this._canSelect(candidate))) {
        candidate = candidate.next();
      }
      if ((candidate != null) && (candidate.length > 0) && (this._canSelect(candidate))) {
        this._select(candidate);
      }
      break;
    case this.CONST.PARENT:
      candidate = this._$selected.parent();
      while ((candidate.length > 0) && (candidate[0] != document.body) && (! this._canSelect(candidate))) {
        candidate = candidate.parent();
      }
      if ((candidate.length > 0) && (this._canSelect(candidate))) {
        this._select(candidate);
      }
      break;
    case this.CONST.CHILD:
      candidate = firstChild(this._$selected);
      while ((candidate != null) && (! this._canSelect(candidate))) {
        candidate = firstChild(candidate);
      }
      if ((candidate != null) && (this._canSelect(candidate))) {
        this._select(toSelect);
      }
      break;
    case this.CONST.SELECT:
      this._complete();
      break;
    case this.CONST.QUIT:
      this.cancel("Pressed Esc");
      break;
  }
  this._swallowEvent(event);
};

_CTSUI.Picker.prototype._keyUp = function(event) {
  this._isKeyDown = false;
};

_CTSUI.Picker.prototype._mouseMove = function(event) {
  // Don't be too hyper about tracking mouse movements.
  var now = new Date();
  if (now - this._lastTime < this.CONST.MOUSE_MOVEMENT_GRANULARITY) {
    return;
  }
  this._lastTime = now;

  var element = event.target;

  if (element == document.body) {
    // Selecting the document body is silly.
    return;
  } else if (element.id == this.CONST.UI_ID) {
    // We've selected our own user interface element! Need to
    // figure out what is beneath by momentarily hiding the UI.
    this._$ui.hide();
    element = document.elementFromPoint(event.clientX, event.clientY);
  }

  $element = this._$(element);
  
  if (this._canSelect($element)) {
    this._select($element);
  } else {
    while (($element.length > 0) && ($element[0] != document.body) && (! this._canSelect($element))) {
      $element = $element.parent();
    }
    if (this._canSelect($element)) {
      this._select($element);
    } else {
      this._deselect();
    }
  }
};

_CTSUI.Picker.prototype._click = function(event) {
  if (this._canSelect(this._$selected)) {
    this._complete(this._$selected);
    this._swallowEvent(event);
  }
};

/*
 * Completes the current pick.
 */
_CTSUI.Picker.prototype._complete= function(reason) {
  this._destroyUI();
  if (this._deferred != null) {
    this._deferred.resolve(this._$selected);
    this._deferred = null;
    this._$selected = null;
    this._currentOpts = {};
  }
};

/*
 * Utility methods (General)
 *-----------------------------------------------------*/

/**
 * Returns whether the picker is able to select the jQuery element $e
 * according to the 'restrict' mode in the current options.
 *
 * Valid modes:
 *   text: Only permit editing childless nodes
 *   css: Only permit editing nodes with calss `css-class`
 *
 * Planned modes:
 *   cts-value: Only permit editing cts-value nodes
 *   cts-enumerated: Only permit editing cts-enumerated nodes
 * 
 */
_CTSUI.Picker.prototype._canSelect = function($e) {

  if (!('restrict' in this._currentOpts)) {
    return true;
  }

  var restriction = this._currentOpts.restrict;
  var passesRestriction = true;

  if (restriction == 'text') {
    passesRestriction = ($e.children().length == 0);
  } else if (restriction == 'css') {
    if ('restrict-class' in this._currentOpts) {
      passesRestriction = $e.hasClass(this._currentOpts['restrict-class']);
    }
  } else if ((restriction == 'cts-value') || (restriction == 'cts-enumerated')) {
    var body = CTS.engine.forrest.trees.body;
    var $$node = body.getCtsNode($e);
    if ($$node == null) {
      passesRestriction = false;
    } else {
      if (restriction == 'cts-value') { 
        passesRestriction = $$node.hasRule('is');
      } else if (restriction == 'cts-enumerated') {
        passesRestriction = $$node.isEnumerated();
      }
    }
  }

  var passesIgnore = true;
  if (('ignoreCTSUI' in this._currentOpts) && (this._currentOpts.ignoreCTSUI)) {
    if ($e.is(CTS.UI.tray._container) || (CTS.UI.tray._container.find($e).length)) {
      passesIgnore = false;
    } else {
      console.log(CTS.UI.tray._container.find($e), $e);
      passesIgnore = true;
    }
  }

  console.log(passesRestriction, passesIgnore);

  var passes = (passesRestriction && passesIgnore);
  console.log(passes);
  return passes;
};


_CTSUI.Picker.prototype._canSelectOfferOptions = function($e) {
  return false;
};

_CTSUI.Picker.prototype._swallowEvent = function(e) {
  e.preventDefault();
  e.stopPropagation();
};

/**
 * Modal Dialogue
 *
 * This is currently a light-weight wrapper around a customized version of alertify.js.
 * which has been modified to support asking the user to choose among options. This helps:
 *   1. Provide a layer of encapsulation around third-party UI libraries, and
 *   2. Provide the Q-based deferment method that CTS and CTS-UI use.
 *
 * Dependencies:
 *  lib/alertify.js
 *
 * Args:
 *  $    - jQuery (can be found at CTS.$ once CTS loads)
 *  q    - The Q library (can be found at CTS.Q once CTS loads)
 */
_CTSUI.Modal = function($, q) {
  this._$ = $;
  this._q = q;
  this._deferred = null;
};

/*
 * Public methods
 *-----------------------------------------------------*/


/**
 * Presents an alert with OK button.
 *
 * Params:
 *   title   - null, or the Title of the modal.
 *   body    - null, or the body of the modal.
 *
 * Note: either the title or body must contain a non-empty string.
 *
 * Returns via promise:
 *   When the "OK" button clicked
 */
_CTSUI.Modal.prototype.alert = function(title, body) {
  var deferred = this._deferred = this._q.defer();
  var content = this._makeContent(title, body);
  Alertify.dialog.alert(content, function() {
      deferred.resolve();
  });
  return deferred.promise;
};

/**
 * Presents a dialog box with a yes/no answer buttons.
 *
 * Params:
 *   title   - null, or the Title of the modal.
 *   body    - null, or the body of the modal.
 *
 * Note: either the title or body must contain a non-empty string.
 *
 * Returns via promise:
 *   If the "yes" option clicked.
 * Rejects via promise:
 *   If the "no" option clicked.
 */
_CTSUI.Modal.prototype.confirm = function(title, body) {
  var deferred = this._deferred = this._q.defer();
  var content = this._makeContent(title, body);
  Alertify.dialog.confirm(content,
    function() {
      deferred.resolve();
    }, function() {
      deferred.reject("Canceled");
    }
  );
  return deferred.promise;
};

/**
 * Presents a question with text answer to be filled in.
 *
 * Params:
 *   title   - null, or the Title of the modal.
 *   body    - null, or the body of the modal.
 *
 * Note: either the title or body must contain a non-empty string.
 *
 * Returns via promise:
 *   The selection.
 * Rejects via promise:
 *   "No input" if no data entered.
 *   "Canceled" if the cancel button clicked.
 */
_CTSUI.Modal.prototype.prompt = function(title, body) {
  var deferred = this._deferred = this._q.defer();
  var content = this._makeContent(title, body);
  Alertify.dialog.prompt(content,
    function(answer) {
      if (answer == "") {
        deferred.reject("No input");
      } else {
        deferred.resolve(answer);
      }
    },
    function() {
      deferred.reject("Canceled");
    }
  );
  return deferred.promise;
};

/**
 * Presents a set of choices to the user as radio-button options.
 *
 * Params:
 *   title   - null, or the Title of the modal.
 *   body    - null, or the body of the modal.
 *   choices - A list of strings that represent the choices
 *
 * Note: either the title or body must contain a non-empty string.
 *
 * Returns via promise:
 *   The choice.
 * Rejects via promise:
 *   "No input" if no choice selected.
 *   "Canceled" if the cancel button clicked.
 */
_CTSUI.Modal.prototype.select = function(title, body, choices) {
  var deferred = this._deferred = this._q.defer();
  var content = this._makeContent(title, body);
  var alertify_choices = {'choices': choices};
  Alertify.dialog.choose(content,
    function(choice) {
      if (choice == "") {
        deferred.reject("No input");
      } else {
        deferred.resolve(choice);
      }
    }, function() {
      deferred.reject("Canceled");
    },
    alertify_choices
  );
  return deferred.promise;
};

_CTSUI.Modal.prototype.cancel = function() {
  if (this._deferred != null) {
    this._deferred.reject("Canceled");
    this._deferred = null;
  }
};


/*
 * Helper methods
 *-----------------------------------------------------*/

/**
 * Combines the optional title and body components of the message
 */
_CTSUI.Modal.prototype._makeContent = function(title, body) {
  var msg = "";
  if ((typeof title != 'undefined') && (title != null)) {
    msg += '<h2 style="color: black;">' + title + '</h2>';
  }
  if ((typeof body != 'undefined') && (body != null)) {
    msg += '<div style="color: black;">' + body + '</div>';
  }
  return msg;
};

_CTSUI.Clipboard = function(server) {
  this._key = "cts-clipboard";
  this._server = server;
  if (typeof server == "undefined") {
    this._server = "http://www.treesheets.org/clipboard.html";
  }
  this._deferred = CTS.$.Deferred();
  this._serverWindow = null;
  var self = this;
  window.addEventListener("message", function(e) { self.onLoad(e) }, false);
  this.addIframe();
};

_CTSUI.Clipboard.prototype.addIframe = function() {
  this._iframe = CTS.$("<iframe class='cts-ui' src='" + this._server + "'></iframe>");
  this._iframe.hide();
  CTS.$('body').append(this._iframe);
};

_CTSUI.Clipboard.prototype.onLoad = function(evt) {
  if (evt.source == this._iframe.get(0).contentWindow) {
    window.removeEventListener("message", this._onLoad);
    this._serverWindow = evt.source;
    this._deferred.resolve();
  }
};

_CTSUI.Clipboard.prototype.copy = function(text) {
  var self = this;
  this._deferred.done(function() {
    self._serverWindow.postMessage({
      cmd: "set",
      name: self._key,
      value: text,
      days: 7}, "*");
  });
};


_CTSUI.Clipboard.prototype.paste = function(callback) {
  var self = this;

  var returnData = function(evt) {
    if (typeof(evt) != "undefined") {
      if (evt.source == self._serverWindow) {
        window.removeEventListener("message", returnData);
        if (typeof callback != "undefined") {
          callback(evt.data);
        }
      }
    }
  };

  this._deferred.done(function() {
    window.addEventListener("message", returnData, false);
    self._serverWindow.postMessage({
      cmd: "get",
      name: self._key}, "*"
    );
  });
};

_CTSUI.Theminator = function(tray, $page) {
  this._tray = tray; // A Javascript object
  this.$page = $page;
  this.$container = null;
  this.$node = null;

  // Initialization
  this.favorites = [];
  this.themes = {};
  this.filters = {};
  this.themeDisplayList = [];

  this.loadMockup();
};

_CTSUI.Theminator.prototype.loadMockup = function() {
  this.$container = CTS.$("<div class='cts-ui-theminator-page'></div>");
  var cts = "@html theminator " + CTS.UI.URLs.Mockups.theminator+ ";";
  CTS.UI.Util.addCss(CTS.UI.URLs.Styles.theminator);
  cts += "this :is theminator | #cts-ui-theminator;";
  this.$container.attr("data-cts", cts);
  var self = this;
  this.$container.on("cts-received-is", function(evt) {
    self.setupMockup()
    evt.stopPropagation();
  });
  this.$container.appendTo(this.$page);
};

_CTSUI.Theminator.prototype.setupMockup = function() {
    var self = this;
    this.$node = this.$container.find('.cts-ui-theminator');
    
    if (localStorage.getItem("favorites")!==null && localStorage.getItem("favorites")!='undefined') {
        this.favorites = JSON.parse(localStorage["favorites"]);
    }
    this.$node.find('.cts-ui-filter-container').children().hide();
    this.loadContent();
    this.$node.find('a.cts-ui-filter-expand').on('click', function() {
        self.toggleFilterTray(CTS.$(this))
    });
    this.$themeList = this.$node.find('.cts-ui-templates-container');
    this.$header = this.$node.find('.cts-ui-header');
    this.$back = this.$node.find('.cts-ui-back');
    this.$back.on('click', function() {
      self._tray.popPage();
    });
    this.$node.find('.cts-ui-favorites-icon').attr('css', CTS.UI.Urls.Images.star);
    this.$node.find('.cts-ui-deselect-button').on('click', CTS.$.proxy(this.deselectFilters, this));
    this.$node.find('.cts-ui-filter-button').on('click', CTS.$.proxy(this.performFilter, this));
    this.$node.find('.cts-ui-search-button').on('click', CTS.$.proxy(this.performSearch, this));
    this.$node.find('.cts-ui-favorites-icon').on('click', CTS.$.proxy(this.displayFavorites, this));
    this.$node.find('.cts-ui-header').css('background-image','url('+CTS.UI.URLs.Images.header+')');
    this.$node.find('.cts-ui-header-content').css('background-image','url('+CTS.UI.URLs.Images.header+')');
};

_CTSUI.Theminator.prototype.loadContent = function() {
    var self = this;
    CTS.$.getJSON(CTS.UI.URLs.Data.filterInfo, function(data) {
      console.log(data);
        for (var filterType in data) {
            var tagDetailsType = CTS.$('<div class="cts-ui-tag-'+filterType+'-details cts-ui-tag-details-type"></div>');
            var tagDetailsList = CTS.$('<ul class="cts-ui-tag-details-list"></ul>');
            tagDetailsType.append(tagDetailsList);
            self.$node.find('.cts-ui-tag-details').append(tagDetailsType);
            var filterTypeButton = CTS.$('<li><a class="cts-ui-filter-type cts-ui-'+filterType+'-filter" data-filter="'+filterType+'"><i class="cts-ui-icon-chevron-left"></i> '+self.prettify(filterType)+'</a></li>')
            self.$node.find('.cts-ui-tag-types-list').append(filterTypeButton);
            for (var i=0; i<data[filterType].length; i++) {
                var filter = data[filterType][i];
                tagDetailsList.append('<li><label class="cts-ui-checkbox"><input type="checkbox"><span>'+self.prettify(filter)+'</span></label></li>');
            }
        }
        self.filters =data;
        self.initiateFilters();
    });
    CTS.$.getJSON(CTS.UI.URLs.Data.themeInfo, function(data) {
        self.themes = data;
        self.displayNewData(data);
    });
};

_CTSUI.Theminator.prototype.displayThemeThumbnail = function(theme, themeData) {
    this.$node.find('.cts-ui-templates-container').append(
        '<div class="cts-ui-screenshot-thumbnail cts-ui-effeckt-caption cts-ui-effeckt-caption-2" data-theme="'+this.fixForObject(theme)+'">'+
            '<img width="200px" class="cts-ui-screenshot" src="'+themeData.screenshot+'">'+
            '<div class="cts-ui-screenshot-options">'+
                '<div class="cts-ui-btn-group">'+
                    '<button class="cts-ui-btn cts-ui-preview-button">Preview</button>'+
                    '<button class="cts-ui-btn">Install</button>'+
                '</div>'+
            '</div>'+
            '<a class="cts-ui-add-to-favorites"><img class="cts-ui-not-favorite" src="'+CTS.UI.URLs.Images.emptyStar+'"></a>'+
            '<figcaption>'+
                '<div class="cts-ui-effeckt-figcaption-wrap">'+
                    '<span class="cts-ui-theme-title">'+this.prettify(theme)+'</span>'+
                '</div>'+
            '</figcaption>'+
        '</div>'
    );
};

_CTSUI.Theminator.prototype.displayNewData = function(newData) {
    this.paginate(newData);
    this.displayPage(1);
};

_CTSUI.Theminator.prototype.prettify = function(str) {
    var stringArray = str.split(/[\s-]+/);
    for (var w=0; w<stringArray.length; w++) {
        stringArray[w] = stringArray[w].charAt(0).toUpperCase() + stringArray[w].substring(1);
    }
    return stringArray.join(" ");
}
_CTSUI.Theminator.prototype.fixForObject = function(str) {
    var stringArray = str.split(/[\s-]+/);
    return stringArray.join("_");
}

_CTSUI.Theminator.prototype.paginate = function(themesObject) {
    this.themeDisplayList = [];
    var page = {};
    var count = 0;
    for (var theme in themesObject) {
        page[theme] = themesObject[theme];
        count++;
        if (count>7) {
            this.themeDisplayList.push(CTS.$.extend({},page));
            page = {};
            count=0;
        }
    }
    if (count!=0) {
        this.themeDisplayList.push(CTS.$.extend({},page));
    }
};

_CTSUI.Theminator.prototype.displayPage = function(pageNum) {
    this.$node.find('.cts-ui-templates-container').empty();
    if (this.themeDisplayList.length == 0) {
        this.$node.find('.cts-ui-templates-container').text('No results found');
        this.$node.find('.cts-ui-pager-custom').empty();
    } else {
        this.configurePager(pageNum, this.themeDisplayList.length);
        for (var theme in this.themeDisplayList[pageNum-1]) {
            this.displayThemeThumbnail(theme, this.themeDisplayList[pageNum-1][theme]);
        }
    }
    this.initiateNewThemes();
    this.$node.find('.cts-ui-templates-container').scrollTop(0);
};

_CTSUI.Theminator.prototype.newPageNumber = function(value) {
    return CTS.$('<li><a>'+value+'</a></li>');
};

_CTSUI.Theminator.prototype.configurePager = function(pageNum, pageLength) {
    
    this.$node.find('.cts-ui-pager-custom').empty();
    var leftArrow = this.newPageNumber('<i class="cts-ui-icon-chevron-left"></i>');
    var rightArrow = this.newPageNumber('<i class="cts-ui-icon-chevron-right"></i>');
    if (pageNum==1) {
        leftArrow.addClass("cts-ui-disabled");
    }
    if (pageNum==pageLength) {
        rightArrow.addClass("cts-ui-disabled");
    }
    var pageNumbers = []
    if (pageLength<=7) {
        for (var i=1; i<=pageLength; i++) {
            var newPage = this.newPageNumber(i);
            if (i==pageNum) {
                newPage.addClass("cts-ui-active");
            }
            pageNumbers.push(newPage);
        }
    } else if (pageLength>7) {
        if (pageNum<=4) {
            for (var i=1; i<=5; i++) {
                var newPage = this.newPageNumber(i);
                if (i==pageNum) {
                    newPage.addClass("cts-ui-active");
                }
                pageNumbers.push(newPage);
            }
            pageNumbers.push(this.newPageNumber('...').addClass('cts-ui-disabled'));
            pageNumbers.push(this.newPageNumber(pageLength));
        } else if (pageNum+3>=pageLength) {
            pageNumbers.push(this.newPageNumber(1));
            pageNumbers.push(this.newPageNumber('...').addClass('cts-ui-disabled'));
            for (var i=pageLength-4; i<=pageLength; i++) {
                var newPage = this.newPageNumber(i);
                if (i==pageNum) {
                    newPage.addClass("cts-ui-active");
                }
                pageNumbers.push(newPage);
            }
        } else {
            pageNumbers.push(this.newPageNumber(1));
            pageNumbers.push(this.newPageNumber('...').addClass('cts-ui-disabled'));
            pageNumbers.push(this.newPageNumber(pageNum-1));
            pageNumbers.push(this.newPageNumber(pageNum).addClass('cts-ui-active'));
            pageNumbers.push(this.newPageNumber(pageNum+1));
            pageNumbers.push(this.newPageNumber('...').addClass('cts-ui-disabled'));
            pageNumbers.push(this.newPageNumber(pageLength));
        }
    }
    this.$node.find('.cts-ui-pager-custom').append(leftArrow, pageNumbers, rightArrow);
    var self = this;
    this.$node.find('.cts-ui-pager-custom li:not(.cts-ui-active,.cts-ui-disabled) a').on('click', function() {
        self.goToNewPage(CTS.$(this), pageNum)
    });
};

_CTSUI.Theminator.prototype.goToNewPage = function(pagerValue, pageNum) {
    if (!isNaN(pagerValue.html())) {
        this.displayPage(parseInt(pagerValue.html()));
    } else {
        if (pagerValue.find('i').hasClass('cts-ui-icon-chevron-left')) {
            this.displayPage(pageNum-1);
        } else if (pagerValue.find('i').hasClass('cts-ui-icon-chevron-right')) {
            this.displayPage(pageNum+1);
        }
    }
};

_CTSUI.Theminator.prototype.initiateThumbnailVisibilities = function(thumbnail) {
    thumbnail.on('mouseenter', function() {
        CTS.$(this).find('.cts-ui-screenshot-options').show();
        CTS.$(this).find('.cts-ui-add-to-favorites').show();
    });
    thumbnail.on('mouseleave', function() {
        CTS.$(this).find('.cts-ui-screenshot-options').hide();
        if (!CTS.$(this).find('.cts-ui-add-to-favorites').find('img').hasClass('cts-ui-favorite')) {
            CTS.$(this).find('.cts-ui-add-to-favorites').hide();
        }
    });
    if (this.favorites.indexOf(thumbnail.data("theme")) != -1) {
        thumbnail.find(".cts-ui-add-to-favorites").html('<img class="cts-ui-favorite" src="'+CTS.UI.URLs.Images.star+'">');
        thumbnail.find(".cts-ui-add-to-favorites").show();
    }
};

_CTSUI.Theminator.prototype.initiateScreenshotTints = function(screenshot) {
    screenshot.wrap('<div class="cts-ui-tint"></div>'); 
};

_CTSUI.Theminator.prototype.initiateFavoritesEvents = function(favoriteButton) {
    favoriteButton.on('mouseenter', function() {
        if (CTS.$(this).find('img').hasClass('cts-ui-not-favorite')) {
            CTS.$(this).html('<img class="cts-ui-hover-favorite" src="'+CTS.UI.URLs.Images.transparentStar+'">');
        }
    });
    favoriteButton.on('mouseleave', function() {
        if (CTS.$(this).find('img').hasClass('cts-ui-hover-favorite')) {
            CTS.$(this).html('<img class="cts-ui-not-favorite" src="'+CTS.UI.URLs.Images.emptyStar+'">');
        }
    });
    var self = this;
    favoriteButton.on('click', function() {
        self.toggleFavorite(CTS.$(this))
    });
};

_CTSUI.Theminator.prototype.toggleFavorite = function(favoriteButton) {
    
    if (favoriteButton.find('img').hasClass('cts-ui-hover-favorite')) {
        favoriteButton.html('<img class="cts-ui-favorite" src="'+CTS.UI.URLs.Images.star+'">');
        this.favorites.push(favoriteButton.parents('.cts-ui-screenshot-thumbnail').data("theme"));
    } else if (favoriteButton.find('img').hasClass('cts-ui-favorite')) {
        favoriteButton.html('<img class="cts-ui-hover-favorite" src="'+CTS.UI.URLs.Images.transparentStar+'">');
        this.favorites.splice(this.favorites.indexOf(favoriteButton.parents('.cts-ui-screenshot-thumbnail').data("theme")),1);
        
    }
    localStorage["favorites"] = JSON.stringify(this.favorites);
}

_CTSUI.Theminator.prototype.togglePreview = function(previewButton) {
    if (previewButton.hasClass('cts-ui-active')) {
        previewButton.parents('.cts-ui-screenshot-thumbnail').find('.cts-ui-tint').removeClass('cts-ui-active');
        previewButton.removeClass('cts-ui-active');
        this._theme = new CTS.UI.Theme();
    } else {
        this.$node.find('.cts-ui-tint').removeClass('cts-ui-active');
        this.$node.find('.cts-ui-preview-button').removeClass('cts-ui-active');
        previewButton.addClass('cts-ui-active');
        previewButton.parents('.cts-ui-screenshot-thumbnail').find('.cts-ui-tint').addClass('cts-ui-active');
        var theme = previewButton.parents('.cts-ui-screenshot-thumbnail').data('theme');
        this._theme = new CTS.UI.Theme(theme);
    }
};

_CTSUI.Theminator.prototype.initiateNewThemes = function() {
    var self = this;
    this.$node.find('.cts-ui-screenshot-options').hide();
    this.$node.find('.cts-ui-add-to-favorites').hide();
    this.$node.find('.cts-ui-screenshot').each( function() {
        self.initiateScreenshotTints(CTS.$(this));
    });
    this.$node.find('.cts-ui-screenshot-thumbnail').each(function() {
        self.initiateThumbnailVisibilities(CTS.$(this))
    });
    this.$node.find('.cts-ui-add-to-favorites').each(function() {
        self.initiateFavoritesEvents(CTS.$(this))
    });
    this.$node.find('.cts-ui-preview-button').on('click', function() {
        self.togglePreview(CTS.$(this))
    });
}

_CTSUI.Theminator.prototype.toggleFilterTray = function(toggleButton) {
    var self = this;
    if (toggleButton.find('i').hasClass('cts-ui-icon-chevron-down')) {
        this.$node.find('.cts-ui-filter-content-container').show();
        this.$node.find('.cts-ui-tag-details').hide();
        this.$node.find('.cts-ui-filter-options').show();
        this.$node.find('.cts-ui-filter-container').animate({"height":"130px"},500, function() {
            self.$node.find('a.cts-ui-filter-expand > i').attr('class', 'cts-ui-icon-chevron-up');
        });
    } else if (toggleButton.find('i').hasClass('cts-ui-icon-chevron-up')) {
        this.$node.find('.cts-ui-filter-container').animate({"height":"0px"},500, function() {
            self.$node.find('a.cts-ui-filter-expand > i').attr('class', 'cts-ui-icon-chevron-down');
            self.$ndoe.find('.cts-ui-tag-types-list li').removeClass("active");
            self.$node.find('.cts-ui-filter-container').children().hide();
        });
    }
};

_CTSUI.Theminator.prototype.showOneFilter = function(filterType) {
    this.$node.find('.cts-ui-tag-details').show();
    this.$node.find('.cts-ui-tag-details-type').hide();
    this.$node.find('.cts-ui-tag-'+filterType+'-details').show();
    this.$node.find('.cts-ui-tag-details-type').parent().removeClass("cts-ui-active");
    this.$node.find('.cts-ui-tag-'+filterType+'-details').parent().addClass("cts-ui-active");
};

_CTSUI.Theminator.prototype.initiateFilters = function() {
    var self = this;
    this.$node.find('.cts-ui-filter-type').on('click', function() {
        self.openFilterType(CTS.$(this))
    });
};

_CTSUI.Theminator.prototype.openFilterType = function(typeButton) {
    if (typeButton.parent().hasClass("cts-ui-active")) {
        typeButton.parent().removeClass("cts-ui-active");
        this.$node.find('.cts-ui-tag-details-type').hide();
        this.$node.find('.cts-ui-filter-container').animate({"height":"130px"},500);
        //$('.templates-container').animate( {"height": "388px"} , 500);
    } else {
        this.$node.find('.cts-ui-filter-type').parent().removeClass("cts-ui-active");
        typeButton.parent().addClass("cts-ui-active");
        var currentFilter = this.$node.find('.cts-ui-tag-'+typeButton.data('filter')+'-details');
        this.showOneFilter(typeButton.data('filter'));
        if ((currentFilter.height()+30) != this.$node.find('.cts-ui-filter-container').height() && currentFilter.height()>100) {
            this.$node.find('.cts-ui-filter-container').animate({"height":(currentFilter.height()+30)+"px"},500);
            //$('.templates-container').animate( {"height": (518-currentFilter.height()-30)+"px"} , 500);
        } else if (this.$node.find('.cts-ui-filter-container').height() > 130 && currentFilter.height()<=100) {
            this.$node.find('.cts-ui-filter-container').animate({"height":"130px"},500);
            //$('.templates-container').animate( {"height": "388px"} , 500);
        }
    }
};


_CTSUI.Theminator.prototype.deselectFilters = function() {
    if (this.$node.find('.tag-details-type:visible').length == 0) {
        this.$node.find('.tag-details input[type=checkbox]').attr('checked', false);
    } else {
        this.$node.find('.tag-details-type:visible input[type=checkbox]').attr('checked', false);
    }
};

_CTSUI.Theminator.prototype.performFilter = function() {
    var filterSpans = this.$node.find('.cts-ui-tag-details input[type=checkbox]:checked').next();
    var filters = [];
    filterSpans.each(function() {
        filters.push(CTS.$(this).text());
    });
    var filteredThemes = {};
    for (var theme in this.themes) {
        
        var fits = true;
        
        for (var i=0; i<filters.length; i++) {
            var themeTags = [];
            for (var t=0; t<this.themes[theme].tags.length; t++) {
                themeTags.push(this.prettify(this.themes[theme].tags[t]));
            }
            if (themeTags.indexOf(filters[i]) == -1) {
                fits = false;
            }
        }
        
        if (fits) {
            filteredThemes[theme] = this.themes[theme];
        }
    }
    this.displayNewData(filteredThemes);
}

_CTSUI.Theminator.prototype.performSearch = function(event) {
    event.preventDefault();
    var searchFor = this.$node.find('.cts-ui-search-query').val();
    var searchedThemes = {};
    for (var theme in this.themes) {
        
        var inTags = false;
        for (var i=0; i<this.themes[theme].tags.length; i++) {
            if (this.themes[theme].tags[i].indexOf(searchFor) != -1) {
                inTags = true;
            }
        }
        
        if (theme.indexOf(searchFor) != -1 || inTags) {
            searchedThemes[theme] = this.themes[theme];
        }
    }
    this.displayNewData(searchedThemes);
};

_CTSUI.Theminator.prototype.displayFavorites = function() {
    var displayFavoritesList = {}
    for (var theme in this.themes) {
        if (this.favorites.indexOf(theme) != -1) {
            displayFavoritesList[theme] = this.themes[theme];
        }
    }
    this.displayNewData(displayFavoritesList);
}

_CTSUI.Theminator.prototype.requestedWidth = function() {
  return 200;
};

_CTSUI.Theminator.prototype.updateSize = function(height) {
    this.$container.height(height);
    this.$themeList.height(height - this.$header.height());
};

_CTSUI.Editor = function(tray, $page) {
  this._tray = tray; // A Javascript object

  this.$page = $page;
  this.$container = null;
  this.$node = null;

  this._isEditing = false;
  this._$editNode = null; // Node being edited
  this._editor; // ckeditor
  this._editBefore; // HTML before the edit
  this.loadMockup();


  // TODO: Ensure CKEDITOR is available.
  CKEDITOR.on('instanceCreated', this._onCkEditorInstanceCreated);
};

_CTSUI.Editor.prototype.loadMockup = function() {
  this.$container = CTS.$("<div class='cts-ui-editor-page'></div>");

  var cts = "@html editor " + CTS.UI.URLs.Mockups.editor + ";";
  CTS.UI.Util.addCss(CTS.UI.URLs.Styles.editor);
  cts += "this :is editor | #cts-ui-editor;";
  this.$container.attr("data-cts", cts);

  var self = this;
  this.$container.appendTo(this.$page);
  this.$container.on("cts-received-is", function(evt) {
    self.setupMockup()
    evt.stopPropagation();
  });
    
};

_CTSUI.Editor.prototype.setupMockup = function() {
 // var whatever = this.$node.height();
 // this.$node.height(whatever);

  this.$node = this.$container.find('.cts-ui-editor');
  this._editBtn = this.$node.find('.cts-ui-edit-btn');
  this._uploadBtn = this.$node.find('.cts-ui-upload-btn');
  this._downloadBtn = this.$node.find('.cts-ui-download-btn');
  this._duplicateBtn = this.$node.find('.cts-ui-duplicate-btn');
  this._copyBtn = this.$node.find('.cts-ui-copy-btn');
  this._pasteBtn = this.$node.find('.cts-ui-paste-btn');
  this._saveBtn = this.$node.find('.cts-ui-save-btn');
  this._themeBtn = this.$node.find('.cts-ui-theme-btn');
  this._scrapeBtn = this.$node.find('.cts-ui-scrape-btn');

  var self = this;

  /* Note: picker-related events have to stop propagation.  Otherwise the
   * picker will load and catch the same mouseup event that initiated it in the
   * first place!
   */
  this._editBtn.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    self.editClicked();
  });

  this._uploadBtn.on('click', function(e) {
    self.uploadClicked();
  });

  this._downloadBtn.on('click', function(e) {
    self.downloadClicked();
  });

  this._themeBtn.on('click', function(e) {
    self.themesClicked();
  });

  this._scrapeBtn.on('click', function(e) {
    self.scrapeClicked();
  });

  this._copyBtn.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    self.copyClicked();
  });

  this._pasteBtn.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    self.pasteClicked();
  });

  this._duplicateBtn.on('click', function(e) {
    self.duplicateClicked();
  });

  this._saveBtn.on('click', function(e) {
    self.saveClicked();
  });

};


/* SAVE
 * ====================================================================
 */

//var DOWNLOAD_ZIP = "Download Complete Page";
//var SAVE_TO_WEB = "Save to web";
//
//_CTSUI.Editor.prototype.saveClicked = function() {
//  // Hit the CTS server with a request to duplicate this page, and then redirect.
//  var title = "Save your Changes";
//  var body = "How do you want to save?";
//  var options = [DOWNLOAD_ZIP, SAVE_TO_WEB];
//  CTS.UI.modal.select(title, body, options).then(
//    this.saveChoiceMade,
//    function() {
//      console.log("Save canceled.");
//    });
//};

/**
 * Applies any pending changes to the HTML and provides a link to
 * download the modified page as source.
 *
 * See cts-server/app/models/operation.js for operation definition.
 */
//_CTSUI.Editor.prototype.saveChoiceMade = function(choice) {
//  if ((choice != DOWNLOAD_ZIP) && (choice != SAVE_TO_WEB)) {
//    console.log("Unknown save choice: " + choice);
//    return;
//  }
//
//  if (choice == DOWNLOAD_ZIP) {
//  } else if (choice == SAVE_TO_WEB) {
//    CTS.UI.switchboard.flush().then(
//      function(operation) {
//       CTS.UI.modal.alert("Page Saved", "<p><a href='" + url + "'>Download your Page</a></p>");
//      }, function(errMessage) {
//        CTS.UI.modal.alert("Could not save", errMessage);
//      }
//    );
//  }
//
//  CTS.UI.switchboard.recordOperation(operation).then(
//    function(operation) {
//
//      //TODO: This is a hack. Figure out unified way to handle resources IDs.
//      var key = operation.result.url;
//      var url = _CTSUI.serverBase + 'tree/' + key;
//    },
//    function(errorMesage) {
//    }
//  );
//};

_CTSUI.Editor.prototype.downloadClicked = function(choice) {
  if (this._isEditing) {
    this.completeEdit();
  }

  CTS.$.fileDownload(CTS.UI.URLs.Services.zipFactory, {
    httpMethod: "POST",
    preparingMessageHtml: "We are preparing an archive of this page. Please wait...",
    failMessageHtml: "There was a problem archiving this page for download.",
    data: {
      'url': window.location.href
    }
  });
//  CTS.UI.switchboard.flush().then(
//    function(operation) {
//     CTS.UI.modal.alert("Page Saved", "<p><a href='" + url + "'>Download your Page</a></p>");
//    }, function(errMessage) {
//      CTS.UI.modal.alert("Could not save", errMessage);
//    }
//  );
};

_CTSUI.Editor.prototype.uploadClicked = function(choice) {
  if (this._isEditing) {
    this.completeEdit();
  }

  CTS.UI.switchboard.flush().then(
    function(operation) {
     CTS.UI.modal.alert("Page Saved", "<p><a href='" + url + "'>Download your Page</a></p>");
    }, function(errMessage) {
      CTS.UI.modal.alert("Could not save: " + errMessage);
    }
  );
};

/* DUPLICATE
 * ====================================================================
 */

_CTSUI.Editor.prototype.duplicateClicked = function() {
  if (this._isEditing) {
    this.completeEdit();
  }

  // Hit the CTS server with a request to duplicate this page, and then redirect.
  this.duplicateFailed("Not yet implemented!");
};

_CTSUI.Editor.prototype.duplicateSuccess = function(urlOfDuplicate) {
  window.location.replace(urlOfDuplicate);
};

_CTSUI.Editor.prototype.duplicateFailed = function(reason) {
  var body = "<p><b>Terribly sorry, but I wasn't able to duplicate the page.</b></p>" +
    "<p>The error message my code generated was:</p><br />" +
    "<p>" + reason + "</p>";
  CTS.UI.modal.alert("Oops...", body).then(function() {}, function() {});
};

/* EDIT
 *   - editClicked
 *   - beginEdit
 *   - cancelEdit
 *   - completeEdit
 *
 * ====================================================================
 */

_CTSUI.Editor.prototype.editClicked = function() {
  if (this._isEditing) {
    this.completeEdit();
  } else {
    var pickPromise = CTS.UI.picker.pick({
      ignoreCTSUI: true
    });
    var self = this;
  
    pickPromise.then(
      function(element) {
        self.beginEdit(element);
      },
      function(errorReason) {
        console.log("Edit canceled: ", errorReason);
      }
    );
  }
};

_CTSUI.Editor.prototype.beginEdit = function($e) {
  // 1. Stash away the content of the old node.
  if (this._$editNode != null) {
    this.completeEdit();
  }
  this._$editNode= $e;
  $e.attr('contenteditable', 'true');
  this._editBefore = $e.html();
  this._editor = CKEDITOR.inline($e[0]);
  var self = this;
  this._editor.on('instanceReady', function() {
    self._isEditing = true;
    self._editor.focus();
    self._editBtn.addClass("highlighted");
  });
};

_CTSUI.Editor.prototype.cancelEdit = function() {
  Alertify.log.info("Cancel Edit");
  if (this._$editNode != null) {
    this._editBtn.removeClass("highlighted");
    this._$editNode.html(this._editBefore);
    this._$editNode.removeAttr('contenteditable');
    this._$editNode = null;
    this._editor.destroy();
    this._editBefore = null;
    this._editor = null;
    this._isEditing = false;
  }
};

_CTSUI.Editor.prototype.completeEdit = function($e) {
  var content = null;
  if (this._$editNode != null) {
    this._editBtn.removeClass("highlighted");
    if ((this._editor != null) && (this._editor.checkDirty())) {
      var selector = CTS.UI.Util.uniqueSelectorFor(this._$editNode);
      content = this._editor.getData();
      console.log("content", content);
  
      var operation = {
        treeUrl: window.location.href,
        treeType: 'html',
        action: 'edit',
        parameters: {
          selector: selector,
          content: content
        }
      };
    
      // Flush the queue of pending edit operations.
      CTS.UI.switchboard.recordOperation(operation).then(
        function(operation) {
          console.log("Operation recorded.");
        },
        function(errorMesage) {
          console.log("Error: operation not recorded.");
        }
      );
    }
  }
  this._editor.destroy();
  if (content != null) {
    this._$editNode.html(content);
  }
  this._$editNode.removeAttr('contenteditable');
  this._$editNode = null;
  this._editor = null;
  this._editBefore = null;
  this._isEditing = false;
};


/* COPY
 *
 * ====================================================================
 */
_CTSUI.Editor.prototype.copyClicked = function() {
  if (this._isEditing) {
    this.completeEdit();
  }

 
  var pickPromise = CTS.UI.picker.pick({
    ignoreCTSUI: true
  });
  var self = this;
  
  pickPromise.then(
    function(element) {
      var data = CTS.UI.Util.elementHtml(element);
      console.log(data);
      CTS.UI.clipboard.copy(data);
      Alertify.log.success("Copied to web clipboard.", 1500);
    },
    function(errorReason) {
      Alertify.log.error("Didn't copy: " + errorReason);
    }
  );
};

/* PASTE
 *
 * ====================================================================
 */
_CTSUI.Editor.prototype.pasteClicked = function() {
  if (this._isEditing) {
    this.completeEdit();
  }
 
  var pickPromise = CTS.UI.picker.pick({
    ignoreCTSUI: true
  });
  var self = this;
  
  pickPromise.then(
    function(element) {
      CTS.UI.clipboard.paste(function(data) {
        console.log(data);
        element.append(data);
      });
    },
    function(errorReason) {
      Alertify.log.error("Didn't paste: " + errorReason);
    }
  );
};



_CTSUI.Editor.prototype._onCkEditorInstanceCreated = function(event) {
  var editor = event.editor,
  element = editor.element;
 
  // These editors don't need features like smileys, templates, iframes etc.
  if ( element.is( 'h1', 'h2', 'h3' ) || element.getAttribute( 'id' ) == 'taglist' ) {
    // Customize the editor configurations on "configLoaded" event,
    // which is fired after the configuration file loading and
    // execution. This makes it possible to change the
    // configurations before the editor initialization takes place.
    editor.on( 'configLoaded', function() {
      // Remove unnecessary plugins to make the editor simpler.
      editor.config.removePlugins = 'colorbutton,find,flash,font,' +
        'forms,iframe,image,newpage,removeformat,' +
        'smiley,specialchar,stylescombo,templates';
      // Rearrange the layout of the toolbar.
      editor.config.toolbarGroups = [
        { name: 'editing',		groups: [ 'basicstyles', 'links' ] },
        { name: 'undo' },
        { name: 'clipboard',	groups: [ 'selection', 'clipboard' ] },
        { name: 'save' }
      ];
    });
  }
};


/* Theminator
 *
 * ====================================================================
 */
_CTSUI.Editor.prototype.themesClicked = function() {
  if (this._isEditing) {
    this.completeEdit();
  }
  this._tray.invokeTheminator();
};


/* Scrape Clicked
 *
 * ====================================================================
 */
_CTSUI.Editor.prototype.scrapeClicked = function() {
  if (this._isEditing) {
    this.completeEdit();
  }
  this._tray.invokeTheminator();
};




/* CLONE
 *   - cloneClicked
 *   - clone
 *
 * ====================================================================
 */

_CTSUI.Editor.prototype.cloneClicked = function() {
  console.log("Duplicate clicked");
  var pickPromise = CTS.UI.picker.pick({
    ignoreCTSUI: true,
    restrict: 'cts-enumerated'
  });
  var self = this;

  pickPromise.then(
    function(element) {
      self.cloneElement(element);
    },
    function(errorReason) {
      console.log("Duplicate canceled: ", errorReason);
    }
  );
};

_CTSUI.Editor.prototype.cloneElement = function($e) {
  var clone = $e.clone();
  var selector = CTS.UI.uniqueSelectorFor(e);
  clone.insertAfter($e);
  var operation = {
    treeUrl: window.location.href,
    treeType: 'html',
    action: 'clone',
    parameters: {
      selector: selector
    }
  };

  // Flush the queue of pending edit operations.
  CTS.UI.switchboard.recordOperation(operation).then(
    function(operation) {
      console.log("Operation recorded.");
    },
    function(errorMesage) {
      console.log("Error: operation not recorded.");
    }
  );
};

/* DUPLICATE
 *   - duplicateClicked
 *   - duplicate
 *
 * ====================================================================
 */

_CTSUI.Editor.prototype.requestedWidth = function() {
  return 100;
};

_CTSUI.Editor.prototype.updateSize = function(height) {
  if (typeof this.$container != undefined) {
    this.$container.height(height);
  }
};


_CTSUI.Theme = function (theme) {
    console.log("Theme loading");

    this._bodyNode = CTS.$('body');
    this._originalBodyMargin = this._bodyNode.css("margin-left");

    // Pages inside the tray, such as the theminator
    this._pages = [];

    // The container DIV which contains the CTS to load the HTML impl.
    this._container = null;

    // The node representing the tray body, loaded by CTS.
    this._node = null;
    if (typeof theme != "undefined") {
        this.theme = theme;
        this.loadMockup();
    } else {
        this.revert();
    }
};

_CTSUI.Theme.prototype.loadMockup = function () {
    var self = this;
    var loadTheme = function (self, pageType) {
        CTS.engine.forrest.removeDependencies();
        CTS.engine.shutdown();
        var newEngine = null;
        var cts = "@html mockup " + CTS.UI.Blog.Themes[self.theme].Mockup[pageType] + "; " +
            "@html default " + CTS.UI.Blog.Themes[self.theme].Mockup.default + "; " +
            "@cts " + CTS.UI.Blog.Themes[self.theme].Cts + "; " +
            "@cts " + CTS.UI.Blog.Jekyll.Cts[pageType] + ";";
        var opts = {
            autoLoadSpecs: false,
            forrest: {
                defaultTree: CTS.$('#page')
            }
        };
        CTS.Parser.parse(cts).then(function (specs) {
            opts.forrestSpecs = specs;
            newEngine = new CTS.Engine(opts);
            newEngine.boot();
            CTS.engine = newEngine;
        }, function (reason) {
            console.log(reason);
        });
    }


    CTS.Utilities.fetchString({
        url: window.location
    }).then(function (html) {
        var otherPage = CTS.$(html);
        var ctsFile = otherPage.filter('script[data-treesheet]').data('treesheet');
        console.log(ctsFile);
        var pageType = "page";
        if (ctsFile.indexOf('index.cts') != -1) {
            pageType = "index";
        } else if (ctsFile.indexOf('list.cts') != -1) {
            pageType = "list";
        } else if (ctsFile.indexOf('post.cts') != -1) {
            pageType = "post";
        }
        console.log(pageType);
        otherPage = otherPage.filter('#page').first();
        var page = CTS.$('#page');
        page.html(otherPage.html());
        page.removeAttr('cts-id');
        setTimeout(function() {
            loadTheme(self, pageType);
        }, 500);
    }, function (reason) {
        console.log("Problem", reason);
    });

};
_CTSUI.Theme.prototype.revert = function () {
    console.log("revert")
    CTS.engine.forrest.removeDependencies();
    CTS.engine.shutdown();

    
    CTS.Utilities.fetchString({url: window.location}).then(
      function(html) {
        var otherPage = CTS.$(html);
        otherPage = otherPage.filter('#page').first();
        var page = CTS.$('#page');
        page.html(otherPage.html());
        page.removeAttr('cts-id');
        var newEngine = new CTS.Engine({
          forrest: {
            defaultTree: CTS.$('#page')
          }
        });

        newEngine.boot().then(
            function() {
                CTS.engine = newEngine;
            }
        );
      },
      function(error) {
          
      }
    );
    
};

_CTSUI.Theme.prototype.loadCTSRules = function (file) {
    CTS.$.get(file, function (data) {
        return data;
    });
}

_CTSUI.Theme.prototype.setupMockup = function () {
    console.log("setup mockup");
};
// This is only to be run once we're sure CTS is present.
// (see autoloader.js)
_CTSUI.load = function() {
  console.log("CTS Loaded");
  CTS.$(function() {
    CTS.UI.clipboard = new CTS.UI.Clipboard();
    CTS.UI.switchboard = new CTS.UI.Switchboard(CTS.$, CTS.Q);
    CTS.UI.picker = new _CTSUI.Picker(CTS.$, CTS.Q);
    CTS.UI.modal = new _CTSUI.Modal(CTS.$, CTS.Q);
    CTS.UI.tray = new CTS.UI.Tray();
  });
};

_CTSUI.autoload = function() {
  // Load CK Editor
  var s = document.createElement('script');
  s.setAttribute('src', _CTSUI.URLs.Scripts.ckeditor);
  s.setAttribute('type', 'text/javascript');
  document.getElementsByTagName('head')[0].appendChild(s);

  if (typeof CTS != 'undefined') {
    CTS.UI = _CTSUI;
    CTS.status.defaultTreeReady.then(function() {
      CTS.Q.longStackSupport = true;
      CTS.UI.load();
      loadCtsUiFileDownloadPlugin();
    });
  } else {
    // CTS isn't present. Let's create it with a script.
    var s = document.createElement('script');
    s.setAttribute('src', _CTSUI.URLs.Scripts.cts);
    s.setAttribute('type', 'text/javascript');
    s.onload = function() {

      CTS.UI = _CTSUI;
      // Now we have to wait for $ to load
      CTS.status.defaultTreeReady.then(function() {
        CTS.Q.longStackSupport = true;
        CTS.engine.booted.then(function() {
          CTS.UI.load();
          loadCtsUiFileDownloadPlugin();
        });
      });
    };
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  // Inject CK Editor
  if (typeof CKEDITOR == 'undefined') {
    var ckeditor = document.createElement('script');
    ckeditor.setAttribute('src', _CTSUI.URLs.Scripts.ckeditor);
    ckeditor.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(ckeditor);
  }
};
_CTSUI.autoload();

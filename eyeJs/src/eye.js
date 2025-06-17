const events = [
  // Mouse Events
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "contextmenu",

  // Keyboard Events
  "keydown",
  "keypress", // Deprecated
  "keyup",

  // Focus Events
  "focus",
  "blur",
  "focusin",
  "focusout",

  // Form Events
  "submit",
  "change",
  "input",
  "reset",
  "select",

  // Touch Events (for mobile)
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",

  // Pointer Events
  "pointerdown",
  "pointerup",
  "pointermove",
  "pointerenter",
  "pointerleave",
  "pointercancel",

  // Drag and Drop Events
  "dragstart",
  "dragend",
  "dragenter",
  "dragover",
  "dragleave",
  "drop",

  // Window/Document Events
  "resize",
  "scroll",
  "load",
  "beforeunload",
  "unload",

  // Media Events
  "play",
  "pause",
  "ended",
  "volumechange",
  "timeupdate",

  // Clipboard Events
  "copy",
  "cut",
  "paste",

  // Animation and Transition Events
  "animationstart",
  "animationend",
  "animationiteration",
  "transitionstart",
  "transitionend",

  // Mutation Events
  "DOMSubtreeModified",
  "DOMNodeInserted",
  "DOMNodeRemoved",

  // Other Events
  "error",
  "hashchange",
  "popstate",
];
const triggerableEvents = ["click", "focus", "blur", "play", "pause", "submit"];

const htmlElements = [
  // Metadata
  "base",
  "head",
  "link",
  "meta",
  "style",
  "title",

  // Sections
  "body",
  "address",
  "article",
  "aside",
  "footer",
  "header",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "main",
  "nav",
  "section",

  // Text content
  "blockquote",
  "dd",
  "div",
  "dl",
  "dt",
  "figcaption",
  "figure",
  "hr",
  "li",
  "ol",
  "p",
  "pre",
  "ul",

  // Inline text semantics
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "br",
  "cite",
  "code",
  "data",
  "dfn",
  "em",
  "i",
  "kbd",
  "mark",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr",

  // Image and multimedia
  "area",
  "audio",
  "img",
  "map",
  "track",
  "video",

  // Embedded content
  "embed",
  "iframe",
  "object",
  "picture",
  "portal",
  "source",

  // Scripting
  "canvas",
  "noscript",
  "script",

  // Demarcating edits
  "del",
  "ins",

  // Table content
  "caption",
  "col",
  "colgroup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",

  // Forms
  "button",
  "datalist",
  "fieldset",
  "form",
  "input",
  "label",
  "legend",
  "meter",
  "optgroup",
  "option",
  "output",
  "progress",
  "select",
  "textarea",

  // Interactive elements
  "details",
  "dialog",
  "summary",

  // Web components / scripting base
  "slot",
  "template",
];
const hiddenAttributes = new WeakMap();

function flat(word) {
  let n = "";
  for (let i = 0; i < word.length; i++) {
    const t = word[i];
    if (t === t.toUpperCase() && t !== t.toLowerCase()) n += "-" + t;
    else n += t;
  }
  return n.toLowerCase();
}
/**
 * Creates or select nodes using css selectors, offering a pack of useful functions to use around your code!
 * @param {String} tag 
 * @param {*} attrs 
 * @param {*} css 
 * @returns 
 */
function eye(tag, attrs, css) {
  if (css instanceof Array) children = css;
  /**
   * @type {HTMLDivElement}
   */
  let elm,
    selectFunc = "querySelector",
    parent = this === undefined || this instanceof Window ? document : this;

  if (tag instanceof HTMLElement) elm = tag;
  else {
    // there is three cases
    if (attrs && attrs.all === true)
      // CASE 1: parent is not docuement & all=true
      selectFunc = "querySelectorAll";
    if (parent == document && htmlElements.indexOf(tag) != -1)
      // CASE 3: parent is document & user input a tag name
      selectFunc = "createElement";

    elm = parent[selectFunc](tag);
  }

  if (elm instanceof NodeList) {
    elm.forEach((nd) => eye(nd));
    // for nodelist there's some other available functions
    return [...elm];
  }

  if (!elm) return null;
  if (elm.isEyeInstance) return elm;

  elm.isEyeInstance = true;
  // adding a very special function
  elm.eye = eye;
  elm.setAttrs = function () { };

  elm.show = function (set_to) {
    this.style.display = set_to || "";
    return this;
  };

  elm.hide = function () {
    this.style.display = "none";
    return this;
  };

  elm.child = function (...args) {
    let it = this;
    for (let i = 0; i < args.length; i++) {
      it = it.children[args[i]];
      if (!it) break;
    }
    return eye(it);
  };

  elm.refer = function (key, value) {
    if (value !== undefined) {
      let attr = hiddenAttributes.get(this);
      if (!attr) {
        attr = {};
        hiddenAttributes.set(this, attr);
      }

      // now a small check
      if (value instanceof Array) {
        // if value is instance of array means we're defining an array property of adding to one
        if (attr[key] instanceof Array) attr[key].push(value[0]);
        else attr[key] = [value[0]];
      } else attr[key] = value;
      return this;
    } else return hiddenAttributes.get(this)?.[key];
  };
  elm.unrefer = function (key, subfind) {
    let attr = hiddenAttributes.get(this);
    if (attr) {
      if (!subfind && typeof key === "string" && attr[key])
        attr[key] = undefined;
      else if (typeof subfind === "function" && attr[key] instanceof Array)
        attr[key].forEach((item, i, arr) => {
          if (subfind(item) === true) {
            arr.splice(i, 1);
            i--;
          }
        });
    }
  };

  // re-assinging events handling system
  events.forEach((ev) => {
    var old;
    if (typeof elm[ev] == "function") {
      old = elm[ev];
    }
    elm[ev] = function (cb) {
      if (cb) {
        if (typeof cb == "function") elm.addEventListener(ev, cb);
      } else old.call(elm);
      return this;
    };
  });
  elm.on = function (evs, listener) {
    evs = evs instanceof Array ? evs : [evs];
    for (let j = 0; j < evs.length; j++) elm.addEventListener(evs[j], listener);
    return this;
  };

  elm.appendTo = function (e) {
    if (e) e.append(this);
  };

  elm.attr = function (key, value) {
    if (key) {
      if (value) this.setAttribute(key, value);
      else return this.getAttribute(key);
    }
    return this;
  };

  elm.data = function (key, value) {
    if (key) {
      if (value) this.dataset[key] = value;
      else return this.dataset[key];
    }
    return this.dataset;
  }

  // setting attributes & css
  let parentElm = null;
  let refresh = null;
  if (attrs)
    for (const key in attrs) {
      const value = attrs[key];
      if (key == "class")
        elm.classList.add.apply(
          elm.classList,
          value instanceof Array ? value : [value]
        );
      else if (key == "text") elm.textContent = value;
      else if (key == "html") elm.innerHTML = value;
      else if (key == "data") for (const k in value) elm.dataset[k] = value[k];
      else if (key == "parent") parentElm = value;
      else if (key == "refresh") refresh = value;
      else if (key in elm) elm[key] = value;
      else elm.setAttribute(key, elm);
    }
  if (css)
    for (const key in css)
      if (key.indexOf("-") != -1) elm.style[key] = css[key];
      else elm.style[flat(key)] = css[key];

  if (refresh) {
    const { request, callback } = refresh;
    
    

  }

  if (parentElm) parentElm.append(elm);
  return elm;
}

// gloablly exposed
window.eye = eye;
export default eye;

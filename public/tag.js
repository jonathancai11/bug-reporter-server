// https://stackoverflow.com/questions/8578617/inject-a-script-tag-with-remote-src-and-wait-for-it-to-execute
(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.onload = function () {
    // remote script has loaded
  };
  js.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "bug-reporter");

// https://stackoverflow.com/questions/19846078/how-to-read-from-chromes-console-in-javascript
// log
console.defaultLog = console.log.bind(console);
console.logs = [];
console.log = function () {
  console.defaultLog.apply(console, arguments);
  console.logs.push(Array.from(arguments));
};
// error
console.defaultError = console.error.bind(console);
console.errors = [];
console.error = function () {
  console.defaultError.apply(console, arguments);
  console.errors.push(Array.from(arguments));
};
// warn
console.defaultWarn = console.warn.bind(console);
console.warns = [];
console.warn = function () {
  console.defaultWarn.apply(console, arguments);
  console.warns.push(Array.from(arguments));
};
// debug
console.defaultDebug = console.debug.bind(console);
console.debugs = [];
console.debug = function () {
  console.defaultDebug.apply(console, arguments);
  console.debugs.push(Array.from(arguments));
};

// Create HTML elements to append to document body
let editButton = document.createElement("BUTTON");
editButton.id = "bug";
editButton.innerHTML = "bug?";
editButton.style = "position:fixed;bottom:0px;right:50px;padding:10px";
document.body.appendChild(editButton);

let annotationOverlay = document.createElement("DIV");
annotationOverlay.id = "annotation-overlay";
annotationOverlay.style = "position: fixed; display: none; width: 100%; height: 100%; top: 0px; bottom: 0px; right: 0px; z-index: 2; background-color: rgba(0, 0, 0, 0.5);"

let doneButton = document.createElement("BUTTON");
doneButton.id = "bug-done";
doneButton.style = "position: absolute; padding: 10px; top: 10px; left: 10px;"
doneButton.innerHTML = "done";

let innerOverlay = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg"
);
innerOverlay.id = "inner-overlay";
innerOverlay.style = "width: 100%; height: 100%; cursor: crosshair;"

annotationOverlay.appendChild(doneButton);
annotationOverlay.appendChild(innerOverlay);
document.body.appendChild(annotationOverlay);

function detectBrowser() {
  // Opera 8.0+
  var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== 'undefined';
  // Safari 3.0+ "[object HTMLElementConstructor]" 
  var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/false || !!document.documentMode;
  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;
  // Chrome 1 - 71
  var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!window.CSS;
  let output = {};
  output.firefox = isFirefox;
  output.chrome = isChrome;
  output.safari = isSafari;
  output.opera = isOpera;
  output.ie = isIE;
  output.edge = isEdge;
  output.blink = isBlink;
  return output;
}

function toggleOverlay() {
  let annotationOverlay = document.getElementById("annotation-overlay");
  annotationOverlay.style.display =
    annotationOverlay.style.display === "block" ? "none" : "block";
}

// https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

document.getElementById("bug").onclick = () => {
  toggleOverlay();
};

document.getElementById("bug-done").onclick = (e) => {
  e.stopPropagation();

  html2canvas(document.body, {
    allowTaint: true,
    useCORS: true
  }).then((canvas) => {
    // document.body.appendChild(canvas);

    let innerOverlay = document.getElementById("inner-overlay");
    let comments = innerOverlay.getElementsByTagName("*");
    let url = window.location.href;

    const report = {
      comments: comments,
      url: url,
      canvas: canvas.toDataURL(),
      console: {
        logs: console.logs,
        debugs: console.debugs,
        warns: console.warns,
        errors: console.errors,
      },
      date_created: new Date(),
      browser: detectBrowser(),
    }

    let xhr = new XMLHttpRequest();
    const serviceBaseURL = "http://localhost:5000";
    const reportEndpoint = "/api/v1/report";
    const serviceURL = serviceBaseURL + reportEndpoint;
    xhr.open("POST", serviceURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      report: report,
    }));

    removeAllChildNodes(innerOverlay);
    toggleOverlay();
  });
};

document.getElementById("annotation-overlay").onclick = (e) => {
  let comment = document.createElementNS("http://www.w3.org/2000/svg", "g");
  comment.setAttribute("fill", "white");
  comment.setAttribute("stroke", "red");
  comment.setAttribute("stroke-width", "2");

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", e.clientX);
  circle.setAttribute("cy", e.clientY);
  circle.setAttribute("r", "10");

  comment.appendChild(circle);
  document.getElementById("inner-overlay").appendChild(comment);
};

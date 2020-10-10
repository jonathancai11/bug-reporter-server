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

console.defaultLog = console.log.bind(console);
console.logs = [];
console.log = function () {
  // default &  console.log()
  console.defaultLog.apply(console, arguments);
  // new & array data
  console.logs.push(Array.from(arguments));
};
// error
console.defaultError = console.error.bind(console);
console.errors = [];
console.error = function () {
  // default &  console.error()
  console.defaultError.apply(console, arguments);
  // new & array data
  console.errors.push(Array.from(arguments));
};
// warn
console.defaultWarn = console.warn.bind(console);
console.warns = [];
console.warn = function () {
  // default &  console.warn()
  console.defaultWarn.apply(console, arguments);
  // new & array data
  console.warns.push(Array.from(arguments));
};
// debug
console.defaultDebug = console.debug.bind(console);
console.debugs = [];
console.debug = function () {
  // default &  console.debug()
  console.defaultDebug.apply(console, arguments);
  // new & array data
  console.debugs.push(Array.from(arguments));
};

let editButton = document.createElement("BUTTON");
editButton.id = "bug";
editButton.innerHTML = "bug?";
editButton.style.position = "fixed";
editButton.style.bottom = 0;
editButton.style.right = 0;
document.body.appendChild(editButton);

let annotationOverlay = document.createElement("DIV");
annotationOverlay.id = "annotation-overlay";
annotationOverlay.style.position = "fixed";
annotationOverlay.style.display = "none";
annotationOverlay.style.width = "100%";
annotationOverlay.style.height = "100%";
annotationOverlay.style.top = 0;
annotationOverlay.style.bottom = 0;
annotationOverlay.style.left = 0;
annotationOverlay.style.right = 0;
annotationOverlay.style.zIndex = 2;
annotationOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

let doneButton = document.createElement("BUTTON");
doneButton.id = "bug-done";
doneButton.innerHTML = "done";
doneButton.style.position = "absolute";
let innerOverlay = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg"
);
innerOverlay.id = "inner-overlay";
innerOverlay.style.width = "100%";
innerOverlay.style.height = "100%";
innerOverlay.style.cursor = "crosshair";

annotationOverlay.appendChild(doneButton);
annotationOverlay.appendChild(innerOverlay);
console.log(annotationOverlay);
document.body.appendChild(annotationOverlay);

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

  console.log(document.body);

  html2canvas(document.body, {
    allowTaint: true,
    useCORS: true
  }).then((canvas) => {
    document.body.appendChild(canvas);

    let innerOverlay = document.getElementById("inner-overlay");
    let allComments = innerOverlay.getElementsByTagName("*");
    let url = window.location.href;

    // console.log("INFORMATION TO SEND TO SERVER:");
    // console.log(canvas);
    // console.log(allComments);
    // console.log(url);
    // console.log(console.logs, console.debugs, console.warns);

    removeAllChildNodes(innerOverlay);
    toggleOverlay();
  });
  console.log("in between");
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

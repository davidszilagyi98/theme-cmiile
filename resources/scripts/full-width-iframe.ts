// full width iframe

function setIframeSize() {
  var iframes = document.querySelectorAll('[src^="https://www.youtube.com/embed/"]');

  iframes.forEach((iframe) => {
    iframe.width = "100%";
    iframe.height = (iframe.clientWidth / 16) * 9;
  });
}

window.addEventListener("resize", () => {
  setIframeSize();
});

setIframeSize();

var angle = 0;
function galleryspin(sign) {
  spinner = document.querySelector("#spinner");
  if (!sign) {
    angle = angle + 90;
  } else {
    angle = angle - 90;
  }
  spinner.setAttribute(
    "style",
    "-webkit-transform: rotateY(" +
      angle +
      "deg); -moz-transform: rotateY(" +
      angle +
      "deg); transform: rotateY(" +
      angle +
      "deg);"
  );
}

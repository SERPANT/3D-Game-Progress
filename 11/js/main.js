canvas = document.getElementsByClassName("canvas")[0];
var ctx = canvas.getContext("2d");
var sq = new dottedSquare();
sq.initGeometry(-2, 2, 100, -100, 5);

function render() {
  ctx.clearRect(0, 0, 1000, 1000);
  sq.render(ctx);
  requestAnimationFrame(render);
}

render();

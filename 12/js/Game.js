var Width = 1000;
var height = 1000;
canvas = document.getElementsByClassName("canvas")[0];
var ctx = canvas.getContext("2d");
var points = [];
var triangles = [];
const STEP = 2;
var MAXMODELX = 2;
var MINMODELX = -2;
var MAXMODELY = 2;
var MINMODELY = -2;
var colors = [];

function initGeometry() {
  for (var x = -1; x <= 1; x += STEP) {
    for (var y = -1; y <= 1; y += STEP) {
      for (var z = -1; z <= 1; z += STEP) {
        points.push([x, y, z]);
      }
    }
  }

  for (var dimension = 0; dimension <= 2; dimension++) {
    for (var side = -1; side <= 1; side += 2) {
      //we are getting all the side points
      //sidePoint is an array
      var sidePoints = points.filter(point => {
        return point[dimension] === side;
      });
      var [a, b, c, d] = sidePoints;

      triangles.push(makeTriangle(a, b, c));
      triangles.push(makeTriangle(d, b, c));
    }
  }
}

function makeTriangle(a, b, c) {
  return [a, b, c];
}

var theta = 0;
var deltaTheta = 0.01;

function render() {
  ctx.clearRect(0, 0, Width, height);
  theta += deltaTheta;

  for (triangle of triangles) {
    rotatedTriangle = triangle.map(vertex => {
      // vertex=rotateY(theta,vertex);
      vertex = rotateX(theta * 0.55, vertex);
      return vertex;
    });

    renderTriangle(rotatedTriangle);
  }

  requestAnimationFrame(render);
}

function renderPoints(vertex) {
  //vertex2d = modelToView(vertex);
  vertex2d = project(vertex);
  var [x, y] = vertex2d;
  //console.log(vertex2d);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 2, y + 2);
  ctx.strokeStyle = "white";
  ctx.stroke();
}

function renderTriangle(triangle) {
  var projectedTriangle = triangle.map(project);
  var [a, b, c] = projectedTriangle;

  ctx.beginPath();
  ctx.moveTo(a[0], a[1], a[2]);
  ctx.lineTo(b[0], b[1], b[2]);
  ctx.lineTo(c[0], c[1], c[2]);
  ctx.lineTo(a[0], a[1], a[2]);
  ctx.strokeStyle = "white";
  ctx.stroke();
}

function modelToView(vertex) {
  var [x, y, z] = vertex;
  f = 200 / z;
  x = x * f;
  y = y * f;
  // console.log(f);
  return [x, y];
}

function rotateY(theta, point) {
  var [x, y, z] = point;
  return [
    Math.cos(theta) * x - Math.sin(theta) * z,
    y,
    Math.sin(theta) * x + Math.cos(theta) * z
  ];
}

function rotateX(theta, point) {
  var [x, y, z] = point;
  return [
    x,
    Math.cos(theta) * y - Math.sin(theta) * z,
    Math.sin(theta) * y + Math.cos(theta) * z
  ];
}

function ProspectiveProjection(vertex) {
  var [x, y, z] = vertex;

  return [x / (z + 4), y / (z + 4)];
}

function project(vertex) {
  var prospectivePoint = ProspectiveProjection(vertex);

  var [x, y] = prospectivePoint;
  return [
    (Width * (x - MINMODELX)) / (MAXMODELX - MINMODELX),
    height * (1 - (y - MINMODELY) / (MAXMODELY - MINMODELY))
  ];
}

initGeometry();
render();

var dottedSquare = function() {
  var Width;
  var height;
  // canvas=document.getElementsByClassName('canvas')[0]
  // var ctx=canvas.getContext('2d');
  var points = [];

  var MAXMODELX;
  var MINMODELX;
  var MAXMODELY;
  var MINMODELY;

  var a, b, c;

  this.initGeometry = function(
    start,
    stop,
    l,
    m,
    n,
    w = 500,
    h = 500,
    STEP = 0.3
  ) {
    MAXMODELX = stop + 1;
    MINMODELX = start - 1;
    MAXMODELY = stop + 1;
    MINMODELY = -start - 1;

    a = l;
    b = m;
    c = n;

    Width = w;
    height = h;

    for (var x = start; x <= stop; x += STEP) {
      for (var y = start; y <= stop; y += STEP) {
        for (var z = start; z <= stop; z += STEP) {
          points.push([x, y, z + c]);
        }
      }
    }
  };

  var theta = 0;
  var deltaTheta = 0.01;

  this.render = function(ctx) {
    theta += deltaTheta;

    for (vertex of points) {
      vertex = rotateY(theta, vertex);
      // vertex=rotateX(theta*0.55,vertex);
      renderPoints(vertex, ctx);
    }

    //  requestAnimationFrame(render);
  };

  function renderPoints(vertex, ctx) {
    vertex2d = project(vertex);
    var [x, y] = vertex2d;
    ctx.beginPath();
    ctx.moveTo(x + a, y + b);
    ctx.lineTo(x + 2 + a, y + 2 + b);
    ctx.strokeStyle = "white";
    ctx.stroke();
  }

  // function modelToView(vertex)
  // {
  //   var [x,y,z]=vertex;
  //   f=200/(z);
  //   x=x*f;
  //   y=y*f;
  //  // console.log(f);
  //   return [x,y];
  // }

  function rotateY(theta, point, center = [0, 2, -4]) {
    var [x, y, z] = point;

    x = x + center[0];
    y = y + center[1];
    z = z + center[2];

    return [
      Math.cos(theta) * x - Math.sin(theta) * z - center[0],
      y - center[1],
      Math.sin(theta) * x + Math.cos(theta) * z - center[2]
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
};

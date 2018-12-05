function Game(canv) {
  var canvas;
  var ctx;
  var score = 0;
  var canvasWidth;
  var canvasHeight;
  const dx = 500;
  const dy = 500;
  var cam;
  var cw = 1000;
  var ch = 1000;
  var oldmousex = 735;
  var oldmousey = 0;
  var objects = [];
  var limitRendering = 400;
  var Footstep;
  var pointSound;

  var texture1 = new Image();
  texture1.src = "images/texture1.jpg";
  var texture2 = new Image();
  texture2.src = "images/texture2.jpg";
  var texture3 = new Image();
  texture3.src = "images/texture3.jpg";
  var texture4 = new Image();
  texture4.src = "images/texture4.jpg";
  var texture5 = new Image();
  texture5.src = "images/texture7.jpg";
  var texture6 = new Image();
  texture6.src = "images/texture6.jpg";

  var pattern = [];

  // var gameMap = [
  //   [1, 1, 1, 1, 1, 0, 1],
  //   [-1, 0, 0, 0, 0, 0, -1],
  //   [1, 0, 1, 1, 1, 1, 1],
  //   [-1, 0, 0, 0, 0, 0, -1],
  //   [1, 1, 1, 1, 1, 0, 1],
  //   [-1, 0, 0, 0, 0, 0, -1],
  //   [1, 0, 1, 1, 1, 1, 1]
  // ];

  // var gameMap = [
  //   [1, 1, 1, 1, 1, 0, 1],
  //   [0, 0, 0, 0, 0, 0, 0],
  //   [1, 0, 1, 1, 1, 1, 1],
  //   [1, 1, 1, 1, 1, 0, 1],
  //   [0, 0, 0, 0, 0, 0, 0],
  //   [1, 1, 1, 1, 1, 0, 1],
  //   [1, 0, 1, 1, 1, 1, 1],
  //   [-1, 0, 0, 0, 0, 0, 0],
  //   [1, 0, 1, 1, 1, 1, 1]
  // ];

  var gameMap = [
    [1, 1, 1, 1, 1, 0, 1],
    [4, 0, 0, 0, 0, 0, 5],
    [1, 0, 1, 1, 1, 1, 1],
    [0, 0, 5, 0, 4, 0, 0],
    [1, 1, 1, 1, 1, 0, 1],
    [5, 0, 4, 0, 0, 0, 0],
    [1, 0, 1, 1, 1, 1, 1]
  ];

  //var gameMap = [[0, 1, 0, 1]];

  // var a = new CubeObject();
  // a.init([100, -250, 0]);

  var colorType = ["gray", "red", "blue", "purple", "brown", "indigo"];
  var colorType2 = ["gold", "gold", "gold", "gold", "gold", "gold"];
  var v = 10;

  this.init = function(canv) {
    setupCanvas(canv);

    cam = new camera();
    cam.init([100, -340, -250]);
    makeObjects();
    initAudio();
    gameLoop();
  };

  function initAudio() {
    Footstep = new Audio();
    Footstep.src = "audio/1step.mp3";

    pointSound = new Audio();
    pointSound.src = "audio/point.ogg";
  }

  function makeObjects() {
    makeMaze();
    // makeSingleCube();
  }

  function makeSingleCube() {
    pir = new pyramidObject();

    pir.init([-670, 0, 700], "red", 0, 5, 100);
    objects.push(pir);
    console.log(objects);
  }

  function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
  }

  function draw() {
    ctx.clearRect(0, 0, 2 * canvasWidth, 2 * canvasHeight);
    drawGround();
    drawObjects();
    drawStaticStuff();
  }

  function drawStaticStuff() {
    drawScore();
  }

  function drawScore() {
    ctx.font = "50px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.fillText("Score : " + score, canvas.width / 3 + 30, 60);
  }

  function update() {
    collisionArray = checkCollision();
    if (!collisionArray[0]) {
      cam.updatePosition();
    } else {
      let objectType = collisionArray[1].objectType;

      if (objectType !== 1) {
        if (objectType === 4) {
          console.log("you are dead");
        } else if (objectType === 5) {
          score++;
          pointSound.play();
          index = objects.indexOf(collisionArray[1]);
          objects.splice(index, 1);
        }

        cam.updatePosition();
      }
    }
    updateObjectPosition();
    sortCubes();
    updateEnemyPosition();
  }

  function updateEnemyPosition() {
    for (let ob of objects) {
      if (ob.objectType === 4) {
        ob.moveUpdate();
      }
    }
  }

  function checkCollision() {
    let currentPostion = cam.positon;
    let nearObjects = getNearObjects(currentPostion);
    let futurePosition = cam.getFutureLocation();

    let collided = false;
    let collidedObject;
    for (ob of nearObjects) {
      collided = checkIntersection(ob, futurePosition);
      //console.log(collided);
      if (collided) {
        objectType = ob.objectType;
        collidedObject = ob;
        break;
      }
    }

    return [collided, collidedObject];
  }

  function checkIntersection(object, camFuturePosition) {
    let extend = 100;
    let extendSide = 30;
    let extendHeight = 400;
    for (cube of object.getCube()) {
      if (
        camFuturePosition[0] >= cube.verti[0][0] - extendSide &&
        camFuturePosition[0] <= cube.verti[1][0] + extendSide &&
        camFuturePosition[1] >= cube.verti[0][1] - extendHeight &&
        camFuturePosition[1] <= cube.verti[3][1] &&
        camFuturePosition[2] >= cube.verti[3][2] - extend &&
        camFuturePosition[2] <= cube.verti[7][2] + extend
      ) {
        //    console.log("clashed");
        return true;
      }
    }
    return false;
  }

  function getNearObjects(currentPostion) {
    let minDist = 800;
    let nearObject = [];
    for (ob of objects) {
      let objectPosition = ob.top;

      diffX = objectPosition[0] - currentPostion[0];
      // diffY = objectPosition[1] - currentPostion[1];
      diffZ = objectPosition[2] - currentPostion[2];
      if (
        diffX < minDist &&
        diffX > -minDist &&
        (diffZ < minDist && diffZ > -minDist)
      ) {
        nearObject.push(ob);
      }
    }
    return nearObject;
  }

  function updateObjectPosition() {
    //sorting the objects
    let [x1, y1, z1] = cam.positon;
    //distance calculation
    let distarray = [];
    let counter = 0;
    for (ob of objects) {
      var [x2, y2, z2] = ob.top;
      var xdis = Math.pow(x2 - x1, 2);
      var ydis = Math.pow(y2 - y1, 2);
      var zdis = Math.pow(z2 - z1, 2);
      var dist = xdis + ydis + zdis;

      distarray.push([dist, counter]);
      counter++;
    }
    distarray.sort(sortFunction);
    distarray.reverse();
    var newObjectArr = [];

    for (i of distarray) {
      newObjectArr.push(objects[i[1]]);
    }
    objects = Object.assign([], newObjectArr);
  }

  function sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return a[0] < b[0] ? -1 : 1;
    }
  }

  function sortCubes() {
    //sorting the cube
    for (ob of objects) {
      if (ob.rotated === false) {
        ob.sortCubes(cam.positon);
      }
    }
  }

  function setupCanvas(canv) {
    canvas = canv;
    ctx = canvas.getContext("2d");
    canvasWidth = canvas.width / 2;
    canvasHeight = canvas.height / 2;
    texture1.onload = function() {
      pattern.push(ctx.createPattern(texture1, "repeat"));
    };
    texture2.onload = function() {
      pattern.push(ctx.createPattern(texture2, "repeat"));
    };
    texture3.onload = function() {
      pattern.push(ctx.createPattern(texture3, "repeat"));
    };
    texture4.onload = function() {
      pattern.push(ctx.createPattern(texture4, "repeat"));
    };
    texture5.onload = function() {
      pattern.push(ctx.createPattern(texture5, "repeat"));
    };
    texture6.onload = function() {
      pattern.push(ctx.createPattern(texture6, "repeat"));
    };
  }

  //adding camera
  function rotate2D(pos, rad) {
    var [x, y] = pos;
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    return [x * c - y * s, y * c + x * s];
  }

  function TransformAndRotate(q, w, e) {
    //finding the position of the point with respective to  the camera as the origin
    q -= cam.positon[0];
    w -= cam.positon[1];
    e -= cam.positon[2];

    [v, d] = rotate2D([q, e], cam.rotation[1]);
    q = v;
    e = d;

    // [v, d] = rotate2D([w, e], cam.rotation[0]);
    // w = v;
    // e = d;

    return [q, w, e];
  }

  function project(q, w, e) {
    f = 200 / (e / 3);
    q = q * f;
    w = w * f;
    return [q, w];
  }

  function drawCube(facesList, color, type, direction, rotated) {
    direction[3][2] = 100;
    for (j in facesList) {
      //calculate direction of camera
      //compare direction of camera and the direction of the cube faces
      let faceDirection = direction[j];
      //  console.log(j, faceDirection);

      //  if (rotated === false) {
      if (faceDirection[2] < 0) {
        var face = facesList[j];
        ctx.beginPath();

        ctx.moveTo(face[0][0], face[0][1]);

        // Draw the vector2 vertices
        for (var k = 1, n_vertices = face.length; k < n_vertices; ++k) {
          ctx.lineTo(face[k][0], face[k][1]);
        }

        // Close the path and draw the face
        ctx.closePath();
        if (type === 0) {
          ctx.strokeWidth = 4;
          ctx.strokeStyle = "red";
          ctx.stroke();
        }
        //ctx.fillStyle = colorType[j];
        ctx.fillStyle = color[j];
        //console.log(pattern);
        ctx.fill();
      }
    }
  }

  function checkCubeOnScreen(face, screen_coords, vertexList) {
    for (vertex of face) {
      var [x, y] = screen_coords[vertex];
      if (
        vertexList[vertex][2] > -100 &&
        x > -limitRendering &&
        x < cw + limitRendering &&
        y > -limitRendering &&
        y < ch + limitRendering &&
        vertexList[vertex][2] < 5000
      ) {
        onscreen = true;
      } else {
        onscreen = false;
        break;
      }
    }

    return onscreen;
  }

  function calculateDirection(face, vertexList) {
    let vertex0 = vertexList[face[0]];
    let vertex1 = vertexList[face[1]];
    let vertex2 = vertexList[face[2]];
    let vertex3 = vertexList[face[3]];
    // console.log(vertex1, vertex2, vertex3, vertex4);

    let side1 = subtract(vertex2, vertex3);
    let side2 = subtract(vertex0, vertex3);
    // console.log(vertexList);
    var oriantationVector = cross(side1, side2);
    return oriantationVector;
  }

  function drawObjects() {
    //console.log(objects);
    for (ob of objects) {
      cubes = ob.getCube();
      //if (!ob.rotated) {
      for (var cubeObject of cubes) {
        let cube = cubeObject.verti;

        var vertexList = [];
        var screen_coords = [];

        for (var i of cube) {
          var [q, w, e] = i;
          [q, w, e] = TransformAndRotate(q, w, e);
          vertexList.push([q, w, e]);
          [q, w] = project(q, w, e);
          screen_coords.push([q + dx, w + dy, e]);
        }

        let facesList = [];
        let direction = [];
        let onscreen;

        for (face of cubeObject.cubeFace) {
          onscreen = false;
          onscreen = checkCubeOnScreen(face, screen_coords, vertexList);
          direction.push(calculateDirection(face, screen_coords));
          if (onscreen) {
            var coords = [];
            for (var i of face) {
              coords.push(screen_coords[i]);
            }
            facesList.push(coords);
          }
        }

        drawCube(
          facesList,
          ob.facePattern,
          cubeObject.Type,
          direction,
          ob.rotated
        );
      }
    }
  }

  // function drawObjects() {
  //   for (var cubeObject of objects) {
  //     let cube = cubeObject.verti;
  //     console.log(cube);
  //     var vertexList = [];
  //     var screen_coords = [];

  //     for (var i of cube) {
  //       var [q, w, e] = i;
  //       [q, w, e] = TransformAndRotate(q, w, e);
  //       vertexList.push([q, w, e]);
  //       [q, w] = project(q, w, e);
  //       screen_coords.push([q + dx, w + dy, e]);
  //     }

  //     let facesList = [];
  //     let direction = [];
  //     let onscreen;

  //     for (face of cubeObject.cubeFace) {
  //       onscreen = false;
  //       onscreen = checkCubeOnScreen(face, screen_coords, vertexList);
  //       direction.push(calculateDirection(face, screen_coords));
  //       if (onscreen) {
  //         var coords = [];
  //         for (var i of face) {
  //           coords.push(screen_coords[i]);
  //         }
  //         facesList.push(coords);
  //       }
  //     }

  //     drawCube(facesList, colorType, cubeObject.Type, direction, false);
  //   }
  // }

  function makeMaze() {
    for (let row in gameMap) {
      let mapRow = gameMap[row];
      for (let col in mapRow) {
        if (mapRow[col] === 1) {
          let detail = [
            col * 220 - 670,
            0,
            row * 300 + 700,
            200,
            400,
            0,
            "gray",
            pattern
          ];
          makeWall(detail);
        } else if (mapRow[col] === -1) {
          let detail = [
            row * 220 - 900,
            0,
            col * 220 - 500,
            380,
            200,
            30,
            "gray",
            pattern
          ];
          makeWall(detail);
        } else if (mapRow[col] === 4) {
          let detail = [
            [col * 220 - 670, 0, row * 300 + 700],
            shuffle(colorType)
          ];
          makeEnemy(detail);
        } else if (mapRow[col] === 5) {
          let detail = [[col * 220 - 670, -300, row * 300 + 700], colorType2];
          makeStar(detail);
        }
      }
    }
  }

  function makeStar(detail) {
    let star = new Star();
    star.init(detail);
    objects.push(star);
  }

  function makeWall(detail) {
    var wall = new Wall();
    wall.makeWall(detail);
    objects.push(wall);
  }

  function makeEnemy(detail) {
    var enemy = new Enemy();
    enemy.init(detail);
    objects.push(enemy);
  }

  function shuffle(array) {
    let newArray = Object.assign([], array);
    var currentIndex = newArray.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = newArray[currentIndex];
      newArray[currentIndex] = newArray[randomIndex];
      newArray[randomIndex] = temporaryValue;
    }

    return newArray;
  }

  function makeStair() {}

  function drawGround() {
    var ground = [[0, 550], [0, 1000], [1000, 1000], [1000, 550]];
    ctx.beginPath();
    ctx.moveTo(ground[0][0], ground[0][1]);

    for (var i = 1; i < ground.length; i++) {
      ctx.lineTo(ground[i][0], ground[i][1]);
    }

    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.stroke();
  }

  function move(event) {
    rightKey = cam.keydownUpdate("Key" + event.key.toUpperCase());
    if (rightKey) {
      Footstep.play();
    }
  }

  function mouse(event) {
    cam.rotate(event, oldmousex, oldmousey);
    oldmousex = event.clientX;
    oldmousey = event.clientY;
  }

  function mouseup() {
    cam.mousedown = false;
  }

  function reset(event) {
    cam.resetDeltaPosition(event.code);
    cam.resetSpeed();
  }

  document.addEventListener("keypress", move);
  document.addEventListener("keyup", reset);
  document.addEventListener("mousemove", mouse);
  document.addEventListener("mouseup", mouseup);
}

var game = new Game();
game.init(document.getElementsByClassName("canvas")[0]);

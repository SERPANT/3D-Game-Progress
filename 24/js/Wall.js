var Wall = function() {
  this.CubeArray = [];
  this.top;
  this.rotated = false;
  this.facePattern = [];
  this.objectType = 1;
  // this.bottomLeftBack;
  // this.bottomLeftFront;
  // this.bottomRightBack;
  // this.bottomRightFront;
  // this.topLeftBack;
  // this.topLeftFront;
  // this.topRightBack;
  // this.topRightFront;

  this.makeWall = function(detail) {
    var [x, y, z, wallW, wallH, angle, color, pattern] = detail;
    this.facePattern = pattern;
    // let a = Math.floor(wallW / 55);
    // let b = Math.floor(wallH / 55);
    // console.log("height", wallH);
    // console.log("width", wallW);
    // console.log("pos", x, y, z);
    // console.log("a", a);
    // console.log("b", b);
    if (angle === 0) {
      for (var i = x; i < x + wallW; i = i + 55) {
        for (var j = y; j < y + wallH; j = j + 55) {
          cubeOb = new CubeObject();
          cubeOb.init([i, -j, z], color, angle, 0, 30);
          // if (i === x && j === y) {
          //   this.bottomLeftFront = cubeOb.verti[3];
          //   this.bottomLeftBack = cubeOb.verti[7];
          // }

          // if (i === x + a * 55 && j === y) {
          //   this.bottomRightFront = cubeOb.verti[2];
          //   this.bottomRightBack = cubeOb.verti[6];
          // }
          // if (i === x && j === y + b * 55) {
          //   this.topLeftFront = cubeOb.verti[0];
          //   this.topLeftBack = cubeOb.verti[4];
          // }
          // if (i === x + a * 55 && j === y + b * 55) {
          //   this.topRightFront = cubeOb.verti[1];
          //   this.topRightFront = cubeOb.verti[5];
          // }

          this.CubeArray.push(cubeOb);
        }
      }
    } else {
      for (var i = z; i < z + wallW; i = i + 55) {
        for (var j = y; j < y + wallH; j = j + 55) {
          cubeOb = new CubeObject();
          cubeOb.init([x, -j, i], color, angle, 5, 30);

          this.CubeArray.push(cubeOb);
        }
      }
    }
    //  console.log(this.wallSidePoints);

    var final = this.CubeArray[this.CubeArray.length - 1];
    this.top = final.verti[Math.floor((final.verti.length - 1) / 2)];
    if (angle > 0) {
      this.rotated = true;
    }
  };

  this.getCube = function() {
    return this.CubeArray;
  };

  this.sortCubes = function(camPositon) {
    this.CubeArray = sortAllCubes(this.CubeArray, camPositon);
  };

  this.sortCubes2 = function(camPositon) {
    this.CubeArray = sortAllCubes2(this.CubeArray, camPositon);
  };
};

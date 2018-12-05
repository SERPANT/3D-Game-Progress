var Enemy = function() {
  this.CubeArray = [];
  this.facePattern = [];
  this.top = [0, 0, 0];
  this.rotated = false;
  this.objectType = 4;
  var moveDirection = 0;

  this.init = function(detail) {
    let [position, pattern] = detail;
    let [x, y, z] = position;
    this.facePattern = pattern;
    for (let i = 0; i < 3; i++) {
      let cubeOb = new CubeObject();
      cubeOb.init([x, i * -100 + y, z], "gold", 0, 4, 60);
      this.CubeArray.push(cubeOb);
    }
    this.initTop();
  };

  this.initTop = function() {
    let final = this.CubeArray[this.CubeArray.length - 1];
    this.top = final.verti[Math.floor((final.verti.length - 1) / 2)];
  };

  this.getCube = function() {
    return this.CubeArray;
  };

  this.sortCubes = function(camPositon) {
    this.CubeArray = sortAllCubes(this.CubeArray, camPositon);
  };

  this.moveUpdate = function() {
    for (let cubeOb of this.CubeArray) {
      //console.log(cubeOb.position);
      let [x, y, z] = cubeOb.position;
      changeDirection(x);
      if (moveDirection === 0) {
        cubeOb.updatePosition([x + 20, y, z]);
      } else {
        cubeOb.updatePosition([x - 20, y, z]);
      }
    }
    this.initTop();
  };

  function changeDirection(x) {
    if (x > 850) {
      moveDirection = 1;
    } else if (x < -670) {
      moveDirection = 0;
    }
  }
};

var Wall = function() {
  this.CubeArray = [];
  this.top;
  this.center;

  this.makeWall = function(detail) {
    var [x, y, z, wallW, wallH, angle, color] = detail;
    this.top = [x + wallW / 2, y + wallH / 2, z];

    this.center = [x + wallW - 10005, (y - wallH) / 2, z];

    for (var i = x; i < x + wallW; i = i + 20) {
      for (var j = y; j < y + wallH; j = j + 20) {
        cubeOb = new CubeObject();
        cubeOb.init([i, -j, z], color, angle, 0, 10, this.center);
        //cubeOb.selfRotate(center);
        this.CubeArray.push(cubeOb);
      }
    }
  };

  this.getCube = function() {
    return this.CubeArray;
  };
};

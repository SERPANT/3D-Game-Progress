class overCube extends GameObject {
  constructor() {
    super();
    this.objectType = 1;
    this.ratationAngle = 1;
    this.mapLost = [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 1],
      [1, 1, 1, 0, 0, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0, 1],
      [0, 0, 1, 0, 0, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1],
      [0, 0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1],
      [0, 0, 1, 1, 0, 0],
      [1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 0, 1],
      [0, 0, 1, 1, 0, 1],
      [1, 1, 0, 1, 1, 1]
    ];

    this.mapWon = [
      [0, 0, 0, 0, 1, 1],
      [0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0],
      [1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 1],
      [0, 0, 1, 1, 0, 0],
      [1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1]
    ];
  }

  /**
   *
   * @param {*} detail :array specifing [x, y, z, wallWeight, wallHeight, angle of rotation , color, pattern to be drawn]
   */
  init(detail) {
    let [position, pattern, won] = detail;
    let [x, y, z] = position;

    if (won === false) {
      for (let row in this.mapLost) {
        for (let col in this.mapLost[row]) {
          let cubeOb = new CubeObject();
          if (this.mapLost[row][col] === 1) {
            cubeOb.init([row * 210 + x, col * -210 + y, z], pattern, 0, 5, 100);
            this.CubeArray.push(cubeOb);
          }
        }
      }
    } else {
      for (let row in this.mapWon) {
        for (let col in this.mapWon[row]) {
          let cubeOb = new CubeObject();
          if (this.mapWon[row][col] === 1) {
            cubeOb.init([row * 210 + x, col * -210 + y, z], pattern, 0, 5, 100);
            this.CubeArray.push(cubeOb);
          }
        }
      }
    }

    this.initPosition();
  }
}
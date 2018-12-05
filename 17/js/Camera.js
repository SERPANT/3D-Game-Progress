var camera = function() {
  //assuming y axis is top and bottom movement
  //assuming x axis is left and right movement
  //assuming any forward and backward movement is z axis movement

  this.mousedown = false;
  this.directionMovement = [0, 0, 1];
  this.positiony;
  this.deltaPosition = [0, 0, 0];
  var minSpeed = 20;
  this.s = minSpeed;
  this.jumping = false;
  this.globalJumpY = -35;
  this.jumpVelocity = [0, this.globalJumpY, 12];
  this.deltaTimeJump = 0.9;
  this.gravity = 8;

  //here rotation[0]---this is the rotation of x axis
  //then rotation[1]---this is the rotation of y axis

  this.init = function(positon = [0, 0, 0], rotation = [0, 0]) {
    this.positon = positon;
    this.rotation = rotation;
    this.positiony = positon[1];
  };

  this.resetSpeed = function() {
    this.s = minSpeed;
  };

  this.resetDeltaPosition = function(key) {
    if (key === "KeyU") {
      this.deltaPosition[1] = 0;
    }
    if (key === "KeyI") {
      this.deltaPosition[1] = 0;
    }

    if (key === "KeyW") {
      this.deltaPosition[0] = 0;
      this.deltaPosition[2] = 0;
    }
    if (key === "KeyS") {
      this.deltaPosition[0] = 0;
      this.deltaPosition[2] = 0;
    }
    if (key === "KeyA") {
      this.deltaPosition[0] = 0;
      this.deltaPosition[2] = 0;
    }
    if (key === "KeyD") {
      this.deltaPosition[0] = 0;
      this.deltaPosition[2] = 0;
    }
  };

  this.keydownUpdate = function(key) {
    let rightKey = false;
    if (this.s < 40) {
      this.s += 0.3;
    }

    if (key === "KeyE") {
      this.rotation[1] += 0.03;
      if (this.jumping === false) {
        this.jumpVelocity = [
          12 * Math.sin(this.rotation[1]),
          this.globalJumpY,
          12 * Math.cos(this.rotation[1])
        ];
        //  this.deltaPosition[1] = -this.s;
        //  this.positon[1] -= this.s;
      }
    }
    if (key === "KeyQ") {
      this.rotation[1] -= 0.03;
      if (this.jumping === false) {
        this.jumpVelocity = [
          12 * Math.sin(this.rotation[1]),
          this.globalJumpY,
          12 * Math.cos(this.rotation[1])
        ];
      }
      //this.deltaPosition[1] = this.s;
      //this.positon[1] += this.s;
    }

    if (key === "KeyU") {
      this.deltaPosition[1] = this.s;
    }

    if (key === "KeyI") {
      this.deltaPosition[1] = -this.s;
    }
    //this is the movement required so as the insure the correct rotation
    //this is rotation 1 as we are taking the x axis for transformation
    x = this.s * Math.sin(this.rotation[1]);
    y = this.s * Math.cos(this.rotation[1]); //this y is for z axis

    //this works as we are still working with increasing the distance and not anything else
    if (key === "KeyW") {
      // this.positon[0] += x;
      // this.positon[2] += y;
      this.deltaPosition[0] = x;
      this.deltaPosition[2] = y;
      this.directionMovement = [0, 0, 1];
      rightKey = true;
    }
    if (key === "KeyS") {
      // this.positon[0] -= x;
      // this.positon[2] -= y;
      this.deltaPosition[0] = -x;
      this.deltaPosition[2] = -y;
      this.directionMovement = [0, 0, -1];
      rightKey = true;
    }
    if (key === "KeyA") {
      // this.positon[0] -= y;
      // this.positon[2] += x;
      this.deltaPosition[0] = -y;
      this.deltaPosition[2] = x;
      this.directionMovement = [-1, 0, 0];
      rightKey = true;
    }
    if (key === "KeyD") {
      // this.positon[0] += y;
      // this.positon[2] -= x;
      this.deltaPosition[0] = y;
      this.deltaPosition[2] = -x;
      this.directionMovement = [1, 0, 0];
      rightKey = true;
    }

    if (key === "KeyC") {
      this.rotation[0] += 1 / 500;
    }

    //dive functionality to be modified
    if (key === "Key ") {
      this.jumping = true;
    }
    return rightKey;

    // if(key==="KeyW") {  this.positon[2]+=s; }
    // if(key==="KeyS") {  this.positon[2]-=s; }
    // if(key==="KeyA") { this.positon[0]-=s; }
    // if(key==="KeyD") { this.positon[0]+=s;  }
    // console.log(this.directionMovement);
  };

  this.rotate = function(event, oldmousex, oldmousey) {
    //   if (this.mousedown) {

    x = oldmousex - event.clientX;
    y = oldmousey - event.clientY;

    //controlling the sensativity so that rotation does not happen very fast
    x /= 500;
    y /= 500;

    this.rotation[0] += y; //rotation arround x axis

    // this.rotation[0] = (this.rotation[0] + y) % 2;
    this.rotation[1] += x; //rotation arround y axis
    if (this.jumping === false) {
      this.jumpVelocity = [
        12 * Math.sin(this.rotation[1]),
        this.globalJumpY,
        12 * Math.cos(this.rotation[1])
      ];
    }
    // oldmousex
    // }
  };

  this.updatePosition = function() {
    this.positon[0] += this.deltaPosition[0];

    if (this.jumping === false) {
      if (this.positiony > this.positon[1]) {
        this.gravity = 8;
      } else {
        this.gravity = 0;
      }
      this.positon[1] += this.deltaPosition[1] + this.gravity;
    } else {
      this.gravity = 2;
      this.positon[0] =
        this.positon[0] + this.deltaTimeJump * this.jumpVelocity[0];
      this.positon[1] =
        this.positon[1] + this.deltaTimeJump * this.jumpVelocity[1];
      this.positon[2] =
        this.positon[2] + this.deltaTimeJump * this.jumpVelocity[2];

      this.jumpVelocity[1] =
        this.jumpVelocity[1] + this.deltaTimeJump * this.gravity;
      if (onGround(this.positiony, this.positon[1]) === true) {
        this.positon[1] = this.positiony;
        this.jumpVelocity = [
          12 * Math.sin(this.rotation[1]),
          this.globalJumpY,
          12 * Math.cos(this.rotation[1])
        ];
        this.jumping = false;
      }
    }
    this.positon[2] += this.deltaPosition[2];
  };

  function onGround(limity, currenty) {
    console.log(currenty);
    if (limity <= currenty) {
      return true;
    }
  }

  this.getFutureLocation = function() {
    let futureX = this.positon[0] + this.deltaPosition[0];
    let futureY = this.positon[1] + this.deltaPosition[1] + this.gravity;
    let futureZ = this.positon[2] + this.deltaPosition[2];
    return [futureX, futureY, futureZ];
  };
};

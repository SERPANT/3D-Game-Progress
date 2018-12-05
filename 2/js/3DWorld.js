
var ctx;
var canvas = document.getElementById('canvas');
var cam;
var objects=[];
var dx;
var mousedown = false;
var dy;
var cube;
var cube_center;
//var radian=5;
//var counter=5;

var camera =function(position,rotate)
{
  this.x=position.x;
  this.y=position.y;
  this.z=position.z;
  this.rotatePoint=rotate;

  var that=this;
  this.update=function(key)
  {
   
    var s=10;


    if(key==="KeyD"){
        this.x+=s;
    }

    if(key==="KeyS")
    {
      this.y-=s;
    }

    if(key==="KeyA")
    {
      this.x-=s;
    }
    if(key==="KeyW")
    {
      this.y+=s;

    }

    if(key==="KeyE")
    {
      this.z-=s;

    }
    
    if(key==="KeyQ")
    {
      this.z+=s;

    }

  }

}




var Vertex=function(x,y,z)
{
  this.x=parseFloat(x);
  this.y=parseFloat(y);
  this.z=parseFloat(z);
}

var Vertex2D=function(x,y)
{
  this.x=parseFloat(x);
  this.y=parseFloat(y);
}


var Cube = function(center, side) {
	// Generate the vertices
	var d = side / 2;

	this.vertices = [
        new Vertex(center.x - d, center.y - d/2, center.z + d),
        new Vertex(center.x - d, center.y - d/2, center.z - d),
        new Vertex(center.x + d, center.y - d/2, center.z - d),
        new Vertex(center.x + d, center.y - d/2, center.z + d),
        new Vertex(center.x + d, center.y + d/2, center.z + d),
        new Vertex(center.x + d, center.y + d/2, center.z - d),
        new Vertex(center.x - d, center.y + d/2, center.z - d),
        new Vertex(center.x - d, center.y + d/2, center.z + d)
	];

	// Generate the faces
	this.faces = [
		[this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
        [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
        [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
        [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
        [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
        [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
	];
};


function project(M) {
	// Distance between the camera and the plane
	var d = 200;
	var r = d / M.y;

	return new Vertex2D(r * M.x, r * M.z);
}




function transformToCamera(point)
{
  transformedPoint=new Vertex(point.x-cam.x,point.y-cam.y,point.z-cam.z);
  return transformedPoint;
}

function render() {

  // if (counter===14){
  //  radian++;
  // }

  // counter=(counter+1)%15;
  
	// Clear the previous frame
	ctx.clearRect(0, 0, 2*dx, 2*dy);


	// For each object
	for (var i = 0, n_obj = objects.length; i < n_obj; ++i) {
    
		// For each face
		for (var j = 0, n_faces = objects[i].faces.length; j < n_faces; ++j) {
			// Current face
			var face = objects[i].faces[j];
    
      var tempfir=transformToCamera(face[0]);
     
     // rotate2D(tempfir,cam.rotatePoint.x);
      //rotate2DY(tempfir,cam.rotatePoint.y);
			// Draw the first vertex
			var P = project(tempfir);
      ctx.beginPath();
      
    
			ctx.moveTo(P.x + dx, -P.y + dy);

			// Draw the other vertices
			for (var k = 1, n_vertices = face.length; k < n_vertices; ++k) {

        //var tempver=new Vertex(face[k].x-cam.x,face[k].y-cam.y,face[k].z-cam.z);
        var tempver=transformToCamera(face[k]);
      //  rotate2D(tempver,cam.rotatePoint.x);
       // rotate2DY(tempver,cam.rotatePoint.y);
				P = project(tempver);
				ctx.lineTo(P.x + dx, -P.y + dy);
			}

			// Close the path and draw the face
			ctx.closePath();
      ctx.stroke();
      ctx.fill();
      
			
		}
  }
  
  requestAnimationFrame(render);
}

(function(){

  canvas=document.getElementsByClassName('canvas')[0];


  canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	 dx = canvas.width / 2;
   dy = canvas.height / 2;
  

  ctx=canvas.getContext('2d');
  ctx.strokeStyle = 'rgba(0, 0, 0,1)';
	ctx.fillStyle = 'rgba(0, 150, 255,1)';

  //for(var i=0;i<10;i++)
  //{
   //cube_center = new Vertex(i*dy, 15*dy/10, 0);
   cube_center = new Vertex(0, 15*dy/10, 0);
    cube = new Cube(cube_center, dy);
   // console.log(cube);
     objects.push(cube);
  //}


  // for(var i=0;i<10;i++)
  // {
  //   cube_center = new Vertex(i*dy, 25*dy/10, 0);
  //   cube = new Cube(cube_center, dy);
  //    objects.push(cube);
  // }
  
  
 

  cam=new camera(new Vertex(0,0,-5),new Vertex2D(0,0));
  render();

})();


document.addEventListener("keydown",(event)=>{ 

  cam.update(event.code);
  
 })




 


canvas.addEventListener('mousedown', initMove);
document.addEventListener('mousemove', move);
document.addEventListener('mouseup', stopMove);


	// Rotate a vertice
	function rotate(M, center, theta, phi) {
        // Rotation matrix coefficients
      var ct = Math.cos(theta);
      var st = Math.sin(theta);
      var cp = Math.cos(phi);
      var sp = Math.sin(phi);

    // Rotation
    var x = M.x - center.x;
    var y = M.y - center.y;
    var z = M.z - center.z;

    M.x = ct * x - st * cp * y + st * sp * z + center.x;
    M.y = st * x + ct * cp * y - ct * sp * z + center.y;
    M.z = sp * y + cp * z + center.z;
}

// Initialize the movement
function initMove(evt) {

    mousedown = true;
    mx = evt.clientX;
    my = evt.clientY;
}

function move(evt) {
      if (mousedown) {

        //changing pixel to angle
        var theta = (evt.clientX - mx) * Math.PI / 360; 
        var phi = (evt.clientY - my) * Math.PI / 180;

        for(var j=0;j<objects.length;j++){
        for (var i = 0; i < 8; ++i){
          rotate(objects[j].vertices[i], new Vertex(cam.x,cam.y,cam.z), theta, phi);              //cube-center rotation is not their make it player centered
        }
        }

        mx = evt.clientX;
        my = evt.clientY;

        render(objects, ctx, dx, dy);
      }
}

function stopMove() {
mousedown = false;
}


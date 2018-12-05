
var ctx;
var cam;
var objects=[];
var dx;
var dy;
//var radian=0;
//var counter=5;

var mousedown = false;
var mx = 0;
var my = 0;

var camera =function(position,rotate)
{
  this.x=position.x;
  this.y=position.y;
  this.z=position.z;
  this.rotatePoint=rotate;

  var that=this;
  this.update=function(key)
  {
   
    var s=5;

    if(key==="KeyE")
    {
      this.z-=s;

    }
    
    if(key==="KeyQ")
    {
      this.z+=s;

    }

    var a=s*Math.sin(this.rotatePoint.y);
    var b=s*Math.cos(this.rotatePoint.y);


    if(key==="KeyD"){
      this.y-=a;
      this.x+=b
    }

    if(key==="KeyS")
    {
      this.y-=b;
      this.x-=a
    }

    if(key==="KeyA")
    {
      this.y+=a;
      this.x-=b
    }
    if(key==="KeyW")
    {
      this.y+=b;
      this.x+=a
    }


  }

  this.rotate=function(x,y)
  {
    this.rotatePoint.x+=y;
    this.rotatePoint.y+=x;
    console.log("running");
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
        new Vertex(center.x - d, center.y - d, center.z + d),
        new Vertex(center.x - d, center.y - d, center.z - d),
        new Vertex(center.x + d, center.y - d, center.z - d),
        new Vertex(center.x + d, center.y - d, center.z + d),
        new Vertex(center.x + d, center.y + d, center.z + d),
        new Vertex(center.x + d, center.y + d, center.z - d),
        new Vertex(center.x - d, center.y + d, center.z - d),
        new Vertex(center.x - d, center.y + d, center.z + d)
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




function rotate2D(x,y,radian)
{
  var s=Math.sin(radian);
  var c=Math.cos(radian);

  return new Vertex2D(x*c-y*s,y*c+x*s);
}

function transformToCamera(point)
{
  transformedPoint=new Vertex(point.x-cam.x,point.y-cam.y,point.z-cam.z);
  return transformedPoint;
}




function render() {

 // radian++;
	// Clear the previous frame
	ctx.clearRect(0, 0, 2*dx, 2*dy);


	// For each object
	for (var i = 0, n_obj = objects.length; i < n_obj; ++i) {
    
		// For each face
		for (var j = 0, n_faces = objects[i].faces.length; j < n_faces; ++j) {
			// Current face
			var face = objects[i].faces[j];
    
      var temp=new Vertex(face[0].x,face[0].y,face[0].z);
      temp2=rotate2D(temp.x,temp.z,cam.rotatePoint.y);
      temp.x=temp2.x;
      temp.z=temp2.y;
      temp3=rotate2D(temp.y,temp.z,cam.rotatePoint.x);
      temp.y=temp3.x;
      temp.z=temp3.y;

      var tempfir=transformToCamera(temp);
			// Draw the first vertex
			var P = project(tempfir);
      ctx.beginPath();
      
    
			ctx.moveTo(P.x + dx, -P.y + dy);

			// Draw the other vertices
			for (var k = 1, n_vertices = face.length; k < n_vertices; ++k) {

        //var tempver=new Vertex(face[k].x-cam.x,face[k].y-cam.y,face[k].z-cam.z);


        var temp=new Vertex(face[k].x,face[k].y,face[k].z);
        temp2=rotate2D(temp.x,temp.z,cam.rotatePoint.y);
        temp.x=temp2.x;
        temp.z=temp2.y;
        temp3=rotate2D(temp.y,temp.z,cam.rotatePoint.x);
        temp.y=temp3.x;
        temp.z=temp3.y;
        
        
        var tempver=transformToCamera(temp);

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

(function() {

  canvas=document.getElementsByClassName('canvas')[0];


  canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	 dx = canvas.width / 2;
   dy = canvas.height / 2;
  

  ctx=canvas.getContext('2d');
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
	ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';

  
  var cube_center = new Vertex(0, 15*dy/10, 0);
  var cube = new Cube(cube_center, dy);
  
  objects.push(cube);

  cam=new camera(new Vertex(0,0,-5),new Vertex2D(0,0));
  render();

})();


document.addEventListener("keydown",(event)=>{ 

  cam.update(event.code);
  
 })


function rotatelogic(event)
{
  // mx = event.clientX;
  // my = event.clientY;
  // mx/=800;
  // my/=800;
  // cam.rotate(mx,my);


  if (mousedown) {
    // var theta = (evt.clientX - mx) * Math.PI / 360;
    // var phi = (evt.clientY - my) * Math.PI / 180;

    // for (var i = 0; i < 8; ++i)
    //   rotate(cube.vertices[i], cube_center, theta, phi);

    // mx = evt.clientX;
    // my = evt.clientY;

    // render(objects, ctx, dx, dy);


    mx = event.clientX;
  my = event.clientY;
  mx/=2000;
  my/=2000;
  cam.rotate(mx,my);
  }
}

function down(event)
{
	  mousedown = true;
		mx = event.clientX;
		my = event.clientY;
}


function stopMove() {
  mousedown = false;

}

document.addEventListener("mousemove",rotatelogic);

document.addEventListener("mousedown",down);

document.addEventListener("mouseup",stopMove);

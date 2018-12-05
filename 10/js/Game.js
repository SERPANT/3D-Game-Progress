var Width=1000;
var height=1000;
canvas=document.getElementsByClassName('canvas')[0]
var ctx=canvas.getContext('2d');
var points=[];
const STEP=0.5;
var MAXMODELX=2;
var MINMODELX=-2;
var MAXMODELY=2
var MINMODELY=-2;

function initGeometry()
{
  for( var x = -1 ;x <= 1;x += STEP)
  {
      for(var y= -1; y <= 1;y+=STEP)
    {
        for(var z= -1; z<= 1;z+=STEP)
      {
        points.push([x,y,z]);
      }
    }
  }
  //console.log(points);
}

var theta=0;
var deltaTheta=0.01;


function render ()
{
  ctx.clearRect(0,0,Width,height);
  theta+=deltaTheta;
  
  for( vertex of points)
  {
    vertex=rotateY(theta,vertex);
    vertex=rotateX(theta*0.55,vertex);
    renderPoints(vertex);
  }

  requestAnimationFrame(render);
}


function renderPoints(vertex)
{
  //vertex2d = modelToView(vertex);
  vertex2d = project(vertex);
  var [x,y] = vertex2d;
  //console.log(vertex2d);
  ctx.beginPath();
  ctx.moveTo( x, y );
  ctx.lineTo( x+2, y+2 );
  ctx.strokeStyle = 'white';
  ctx.stroke();
}


function modelToView(vertex)
{
  var [x,y,z]=vertex;
  f=200/(z);
  x=x*f;
  y=y*f;
 // console.log(f);
  return [x,y];
}


function rotateY(theta,point)
{
  var [x,y,z]=point;
  return [
    Math.cos(theta)*x - Math.sin(theta)*z,
    y,
    Math.sin(theta)*x + Math.cos(theta)*z
  ]
}



function rotateX(theta,point)
{
  var [x,y,z]=point;
  return [
   x,
    Math.cos(theta)*y - Math.sin(theta)*z,
    Math.sin(theta)*y + Math.cos(theta)*z
  ]
}


function ProspectiveProjection(vertex){
  var [x,y,z]=vertex;

  return [x/(z+4),y/(z+4)];
}

function project(vertex)
{
  var prospectivePoint=ProspectiveProjection(vertex);

  var [x,y]= prospectivePoint;
  return [
    Width*(x-MINMODELX)/(MAXMODELX-MINMODELX),
    height*(1-(y-MINMODELY)/(MAXMODELY-MINMODELY))
  ]
}

initGeometry();
render();
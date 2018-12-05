function draw() {
  ctx.clearRect(0, 0, 2 * canvasWidth, 2 * canvasHeight);

  for (var cubeObject of objects) {
    cube = cubeObject.verti;

    var vertexList = [];
    var screen_coords = [];

    for (var i of cube) {
      var [q, w, e] = i;
      [q, w, e] = TransformAndRotate(q, w, e);
      vertexList.push([q, w, e]);
      [q, w] = project(q, w, e);
      screen_coords.push([q + dx, w + dy]);
    }

    facesList = [];
    //  facColor=[];
    //depth=[];
    var onscreen;
    // mindist=[];
    //var counter=0;

    for (face of cubeObject.cubeFace) {
      onscreen = false;
      for (vertex of face) {
        x, (y = screen_coords[i]);
        if (vertexList[vertex][2] > 0) {
          onscreen = true;
        } else {
          onscreen = false;
          break;
        }
      }

      // var min=500000;
      // for ( vertex of face)
      // {
      //   var [x1,y1,z1]=vertex;

      //   xp=Math.pow((x2 - x1),2);
      //   yp=Math.pow((y2 - y1),2);
      //   zp=Math.pow((z2 - z1),2);
      //   d = Math.pow((xp+yp+zp),1/2);

      //   if(min<d)
      //   {
      //     min=d;
      //   }
      // }

      // mindist.push(min);

      if (onscreen) {
        var coords = [];
        for (var i of face) {
          coords.push(screen_coords[i]);
          //put code here............................................
        }

        facesList.push(coords);

        // var total=0;
        // for(var i=0;i<3;i++)
        // {
        //   var sum=0;
        //   for(j of face)
        //   {
        //     sum+=vertexList[j][i]/4;
        //    // console.log(j,vertexList[j][i]);
        //   }

        //  sum=sum*sum;
        //   total+=sum;

        // }
        // total=total*total;
        // depth.push(total);
      }
    }

    //   //sorting
    //   //console.log(mindist);
    //   temp=Object.assign([],depth);

    //   depth.sort();
    //  // console.log(depth);

    //   var index=[];
    //   for(var i=0;i<depth.length;i++)
    //   {

    //     test=temp.indexOf(depth[i]);
    //     temp[test]=-100;
    //     index.push(test);
    //   }

    // for (var j=index.length-1;j>=0;j--) {

    for (j in facesList) {
      var face = facesList[j]; //remember to use index
      ctx.beginPath();

      ctx.moveTo(face[0][0], face[0][1]);

      // Draw the other vertices
      for (var k = 1, n_vertices = face.length; k < n_vertices; ++k) {
        ctx.lineTo(face[k][0], face[k][1]);
      }

      // Close the path and draw the face
      ctx.closePath();
      //ctx.stroke();
      ctx.fillStyle = cubeObject.color;
      ctx.fill();
    }
  }

  requestAnimationFrame(draw);
}

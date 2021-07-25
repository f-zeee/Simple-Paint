window.onload = function () {

    var canvas = document.getElementById("myCanvas");
     canvas.width= window.innerWidth *0.6;
     canvas.height=window.innerHeight * 0.8; 
    var clearButton = document.getElementById("clear"),
     isActive = false,
     startCoordinates = null,
     endCoordinates = null,
     context = canvas.getContext("2d"),
     dataArray = [],
     flag = false,
     recIndex = 0,
     randomRGB = null,
     changeDistance = {
        x: 0,
        y: 0
    };

//double click listener
    canvas.addEventListener('dblclick', function (e) {

        var pos = getMousePositions(canvas, e);
        dataArray.forEach(function (value) {
            var Area = findArea(value[0][0], value[0][1], value[1][0], value[1][1], value[2][0], value[2][1]) + findArea(value[0][0], value[0][1], value[3][0], value[3][1], value[2][0], value[2][1]) ;
            var Area1 = findArea(value[0][0], value[0][1], pos.x, pos.y, value[1][0], value[1][1]);
            var Area2 = findArea(value[1][0], value[1][1], value[2][0], value[2][1], pos.x, pos.y);
            var Area3 = findArea(pos.x, pos.y, value[2][0], value[2][1], value[3][0], value[3][1]);
            var Area4 = findArea(pos.x, pos.y, value[3][0], value[3][1], value[0][0], value[0][1]);
            if (Math.round(Area) === Math.round(Area1 + Area2 + Area3 + Area4)) {
                var newList = [];
                var item = dataArray[dataArray.indexOf(value)];
                dataArray.forEach(function (value2) {
                    if (value2 !== item) {
                        newList.push(value2);
                    }
                });
                dataArray = newList;
                clearCanvas();
                dataArray.forEach(function (value2) {
                    reDrawTriangles(value2[0][0], value2[0][1], value2[1][0], value2[1][1]);
                });
                return true;
            }
        });
        isActive = false;

    });

//one mousedown listener
    canvas.addEventListener('mousedown', function (e) {
        canvas.style.cursor = 'move';
        e.preventDefault();
        var mousePos = getMousePositions(canvas, e);
        startCoordinates = mousePos;
        endCoordinates = mousePos;
        isActive = true;
        flag = checkIfInside(mousePos);
        startCoordinates = mousePos;
        endCoordinates = mousePos;
        randomRGB = getRandomRgb();
        if (dataArray.length > 0) {
            changeDistance.x = dataArray[recIndex][0][0] - mousePos.x;
            changeDistance.y = dataArray[recIndex][0][1] - mousePos.y
        }
        console.log(changeDistance);
    });

//movement listener
    canvas.addEventListener('mousemove', function (e) {

        endCoordinates = getMousePositions(canvas, e);

        if (isActive && flag) {
            clearCanvas();
            canvas.style.cursor = 'ne-resize';
            reDrawRec(startCoordinates.x, startCoordinates.y, endCoordinates.x, endCoordinates.y);
            dataArray.forEach(function (value) {
                reDrawRec(value[0][0], value[0][1],value[1][0], value[1][1]);
            });
        } else if (isActive) {
            canvas.style.cursor = 'crosshair';
            clearCanvas();
            // doDragTranslationAtMove(endCoordinates.x, endCoordinates.y);
            var item = dataArray[recIndex];
            var difX = endCoordinates.x - item[0][0] + changeDistance.x;
            var difY = endCoordinates.y - item[0][1] + changeDistance.y;
            item[0][0] += difX;
            item[0][1] += difY;
            item[1][0] += difX;
            item[1][1] += difY;
            item[2][0] += difX;
            item[2][1] += difY;
            item[3][0] += difX;
            item[3][1] += difY;
            reDrawRec(item[0][0], item[0][1], item[1][0], item[1][1]);
            dataArray.forEach(function (value) {
                if (value[0][0] !== startCoordinates.x && value[0][1] !== startCoordinates.y) {
                    reDrawRec(value[0][0], value[0][1], value[1][0], value[1][1] );
                }
            });
        }

    }, true);

//click-release listener
    canvas.addEventListener('mouseup', function (e) {
        canvas.style.cursor = 'pointer';
        var mousePos = getMousePositions(canvas, e);
        if (!flag) {
            isActive = false;
            flag = false;
            doDragTranslation(mousePos.x, mousePos.y);
        } else if (isActive && calculateLineDistance(startCoordinates.x, startCoordinates.y, endCoordinates.x, endCoordinates.y) > 2) {
            isActive = false;
            flag = false;
            // getting the end mouse position
            endCoordinates = mousePos;
            drawRectangle( startCoordinates.x, startCoordinates.y, endCoordinates.x, endCoordinates.y);
        }

    });

//adding click listener for the clear button
    clearButton.addEventListener('click', function () {

        dataArray = [];
        clearCanvas();

    });

    function calculateLineDistance(x1, y1, x2, y2) {

        return Math.round(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

    }

    //function to check if the mouse is inside the given triangle
    function checkIfInside(pos) {

        flag = true;
        dataArray.forEach(function (value) {
            var Area = findArea(value[0][0], value[0][1], value[1][0], value[1][1], value[2][0], value[2][1]) + findArea(value[0][0], value[0][1], value[3][0], value[3][1], value[2][0], value[2][1]) ;
            var Area1 = findArea(value[0][0], value[0][1], pos.x, pos.y, value[1][0], value[1][1]);
            var Area2 = findArea(value[1][0], value[1][1], value[2][0], value[2][1], pos.x, pos.y);
            var Area3 = findArea(pos.x, pos.y, value[2][0], value[2][1], value[3][0], value[3][1]);
            var Area4 = findArea(pos.x, pos.y, value[3][0], value[3][1], value[0][0], value[0][1]);
            if (Math.round(Area) === Math.round(Area1 + Area2 + Area3+ Area4)) {
                recIndex = dataArray.indexOf(value);
                flag = false;
                return true;
            }
        });
        return flag;

    }

    function findArea(x1, y1, x2, y2, x3, y3) {

        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);

    }


// function used to do translation
    function doDragTranslation(newx, newy) {

        var item = dataArray[recIndex];
        var difX = newx - item[0][0] + changeDistance.x;
        var difY = newy - item[0][1] + changeDistance.y;
        item[0][0] += difX;
        item[0][1] += difY;
        item[1][0] += difX;
        item[1][1] += difY;
        item[2][0] += difX;
        item[2][1] += difY;
        item[3][0] += difX;
        item[3][1] += difY;
        dataArray.splice(recIndex, 0, item);
        clearCanvas();
        dataArray.forEach(function (value) {
            reDrawTriangles(value[0][0], value[0][1], value[1][0], value[1][1]);
        });

    }

    function clearCanvas() {

        context.clearRect(0, 0, canvas.width, canvas.height);

    }

// function to get current mouse position
    function getMousePositions(canvas, event) {

        var bounds = canvas.getBoundingClientRect();
        return {

            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top

        };

    }

    
    function reDrawRec(x1, y1, x2, y2) {

        
        //making a path
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x1, y2);
        context.lineTo(x2, y2);
        context.lineTo(x2, y1);
        context.moveTo(x1, y1);
        context.fillStyle = randomRGB;
        context.fill();
        context.stroke();

    }

    function drawRectangle( x1, y1, x2, y2) {

        var distance = calculateLineDistance(x1, y1, x2, y2)
        //making a path
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x1, y2);
        context.lineTo(x2, y2);
        context.lineTo(x2, y1);

        context.moveTo(x1, y1);
        context.fillStyle = randomRGB;
        context.fill();
        context.stroke();
        dataArray.push([[x1, y1], [x1,y2], [x2,y2], [x2,y1] ]);

    }

    function getRandomRgb() {
        var r = Math.ceil(Math.random() * 256);
        var g = Math.ceil(Math.random() * 256);
        var b = Math.ceil(Math.random() * 256);
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }

};
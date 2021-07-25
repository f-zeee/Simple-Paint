window.onload = function () {

    const canvas = document.getElementById("myCanvas");
    const clearButton = document.getElementById("clear");
    let isActive = false;
    let startCoordinates = null;
    let endCoordinates = null;
    const context = canvas.getContext("2d");
    let dataPool = [];
    let flag = false;
    let draggedRecIndex = 0;
    let randomRGB = null;
    const changeDistance = {
        x: 0,
        y: 0
    };

//double click listener
    canvas.addEventListener('dblclick', function (e) {

        const pos = getMousePositions(canvas, e);
        dataPool.forEach(function (value) {
            if (pos.x >= value[0] &&
                pos.y >= value[1] &&
                pos.x <= value[2] &&
                pos.y <= value[3]) {
                
                console.log("inside")
                
                const newList = [];
                const item = dataPool[dataPool.indexOf(value)];
                dataPool.forEach(function (value2) {
                    if (value2 !== item) {
                        newList.push(value2);
                    }
                });
                dataPool = newList;
                clearCanvas();
                dataPool.forEach(function (value2) {
                    reDrawRectangle(value2[0], value2[1], value2[2], value2[3], value2[4]);
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
        const mousePos = getMousePositions(canvas, e);
        startCoordinates = mousePos;
        endCoordinates = mousePos;
        isActive = true;
        flag = checkIfInside(mousePos);
        startCoordinates = mousePos;
        endCoordinates = mousePos;
        randomRGB = getRandomRgb();
        if (dataPool.length > 0 && dataPool.length > draggedRecIndex) {
            changeDistance.x = dataPool[draggedRecIndex][0] - mousePos.x;
            changeDistance.y = dataPool[draggedRecIndex][1] - mousePos.y
        }
    });

//movement listener
    canvas.addEventListener('mousemove', function (e) {

        endCoordinates = getMousePositions(canvas, e);

        if (isActive && flag) {
            clearCanvas();
            canvas.style.cursor = 'ne-resize';
            reDrawRectangle(startCoordinates.x, startCoordinates.y, endCoordinates.x, endCoordinates.y, randomRGB);
            dataPool.forEach(function (value) {
                reDrawRectangle(value[0], value[1], value[2], value[3], value[4]);
            });
        } else if (isActive) {
            canvas.style.cursor = 'crosshair';
            clearCanvas();
            // doDragTranslationAtMove(endCoordinates.x, endCoordinates.y);
            const item = dataPool[draggedRecIndex];
            const difX = endCoordinates.x - item[0] + changeDistance.x;
            const difY = endCoordinates.y - item[1] + changeDistance.y;
            item[0] += difX;
            item[1] += difY;
            item[2] += difX;
            item[3] += difY;
            reDrawRectangle(item[0], item[1], item[2], item[3], randomRGB);
            dataPool.forEach(function (value) {
                reDrawRectangle(value[0], value[1], value[2], value[3], value[4]);
            });
        }

    }, true);

//click-release listener
    canvas.addEventListener('mouseup', function (e) {
        canvas.style.cursor = 'pointer';
        const mousePos = getMousePositions(canvas, e);
        if (!flag) {
            isActive = false;
            flag = false;
            doDragTranslation(mousePos.x, mousePos.y);
        } else if (isActive) {
            isActive = false;
            flag = false;
            // getting the end mouse position
            endCoordinates = mousePos;
            drawRectangle(startCoordinates.x, startCoordinates.y, endCoordinates.x, endCoordinates.y, randomRGB);
        }

    });

//adding click listener for the clear button
    clearButton.addEventListener('click', function () {

        dataPool = [];
        clearCanvas();

    });

    //function to check if the mouse is inside the given triangle
    function checkIfInside(pos) {

        flag = true;
        dataPool.forEach(function (value) {
            if (
                pos.x >= value[0] &&
                pos.y >= value[1] &&
                pos.x <= value[2] &&
                pos.y <= value[3]
            ) {
                draggedRecIndex = dataPool.indexOf(value);
                flag = false;
                return true;
            }
        });
        return flag;

    }

// function used to do translation
    function doDragTranslation(newx, newy) {

        var item = dataPool[draggedRecIndex];
        var difX = newx - item[0] + changeDistance.x;
        var difY = newy - item[1] + changeDistance.y;
        item[0] += difX;
        item[1] += difY;
        item[2] += difX;
        item[3] += difY;
        dataPool.splice(draggedRecIndex, 0, item);
        clearCanvas();
        dataPool.forEach(function (value) {
            reDrawRectangle(value[0], value[1], value[2], value[3], value[4]);
        });

    }

    function clearCanvas() {

        context.clearRect(0, 0, canvas.width, canvas.height);

    }

// function to get current mouse position
    function getMousePositions(canvas, event) {

        const bounds = canvas.getBoundingClientRect();
        return {

            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top

        };

    }

    function reDrawRectangle(x1, y1, x2, y2, color) {

        //making a path
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y1);
        context.lineTo(x2, y2);
        context.lineTo(x1, y2);
        context.moveTo(x1, y1);
        context.fillStyle = color;
        context.fill();
        context.stroke();

    }

    function drawRectangle(x1, y1, x2, y2, color) {

        //making a path
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y1);
        context.lineTo(x2, y2);
        context.lineTo(x1, y2);
        context.moveTo(x1, y1);
        context.fillStyle = color;
        context.fill();
        context.stroke();
        dataPool.push([x1, y1, x2, y2, context.fillStyle]);

    }

    function getRandomRgb() {
        const r = Math.ceil(Math.random() * 256);
        const g = Math.ceil(Math.random() * 256);
        const b = Math.ceil(Math.random() * 256);
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }

};
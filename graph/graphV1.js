
const { createCanvas, loadImage } = require('canvas');
const general = require('./general');

const fs = require('fs');
var QRCode = require('qrcode');

var canvasEl = null;
var canvasElms = [];
var canvasQr = null;
var id = null;
var test = null;
var isLoading = true;
var submitted = false;
var today = new Date().toISOString();
/////////////////////////////////////////////////////////////

//formEdit: FormGroup;
var tests = null;
var movementEntriesT = 0;
var averageFHR = 0;
var lengthOfTest = 0;
var mothers = [];
var mother = [];
var showCommentInputs = false;
var isInputhide = true;
var moments = null;

/**
 * graph variable
 */
var WIDTH_PX = 2620; /////////////////////////
var HEIGHT_PX = 1770; /////////////////////////
var pixelsPerOneCM = 100;
var pixelsPerOneMM = pixelsPerOneCM / 10;
var auto = false;
var highlight = true;
var scale = 1;
var touched_down = 0;
var touched_up = 0;
var movmentImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAABwAAAAoCAYAAADt5povAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QsbCTMS6Qes/wAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEySURBVFjD7dY/S0JRGMfxb9Kgi2A1CNIiiGM4NATtDUkvQoeW2hV6DUZDgm8g6BUEYkRLvgJBaVGDmmpQnCprOU9cLvee+9cL0nngN53n3A+c89zLhTWpTZXEqgvcJYVdAD8qjVVjhxZMcrAqbBeYO4AzoBA3tgE8OGCSXtzgtQaTXMWFnQDfPsAvoBoVKwNLH5hkCZTCYhlgGACTDIB0GPA2BCa5CYqdRcAkp36xihqAqOAnsOeF7QAfMWCSd2BbBz56TGCYtXs3rOOyYQScA2+ah76qnmeX9bYdO7Y1zIEWsK9GPAtMNeBY9aTVnktgYes5EqxgOZYnoAbkHO72RQNOgC3bnhxQB/qWI8/LC94Eih7DFBS0VlEZvj8IUcG/SiX9M2RAAxrQgAY0oAH/A/gLVhjmv8J4WgsAAAAASUVORK5CYII=";
var movementData = Buffer.from(movmentImageBase64, 'base64');//java /// Base64.decode(movmentImageBase64, Base64.DEFAULT);
var movementBitmap = new Buffer(movementData.length);
for (var i = 0; i < movementData.length; i++) {
    movementBitmap[i] = movementData[i];
}

var graphOutlines = null;
var graphGridLines = null;
var graphBackGround = null;
var graphSafeZone = null;
var graphAxisText = null;
var graphGridSubLines = null;
var yDivLength = null;
var yOrigin = null;
var axisFontSize = null; //pixelsPerOneMM * 5; /////////////////////////
var paddingLeft = null; //////////////////////////
var paddingTop = null; ///////////////////////////
var paddingBottom = null;////////////////////////////
var paddingRight = null; ///////////////////////////
var xOrigin = null;
var graphBpmLine = null;
var xDivLength = null;
var xDiv = 20;
var screenHeight = null;
var screenWidth = null;
var xAxisLength = null;
var yDiv = null;
var yAxisLength = null;
var bitmaps = [];
var timeScaleFactor = null; //= scale === 1 ? 6 : 2;
var pointsPerPage = null;
var informationText = null;
var XDIV = 20;
var pointsPerDiv = null;
var mData = null;
var xTocoOrigin = null;
var yTocoOrigin = null;
var yTocoEnd = null;
var yTocoDiv = null;

var user = null;
var comment = null;
var comments = true;
var interpretationType = null;
var notmalType = false;
var abnormalType = false;
var atypicalType = false;
var testId = null;
var scaleOrigin = 40;
var interpretations = true;
var gridPerMin = 3;

var paints = {
    graphGridMainLines: { color: "Gray", lineWidth: 1.5 },
    graphGridLines: { color: "Gray", lineWidth: 1.1 },
    graphGridSubLines: { color: "BlueGrey", lineWidth: 0.6 },
    graphOutlines: { color: "Black", lineWidth: 2.25 },
    graphMovement: { color: "Black", lineWidth: 4 },
    graphSafeZone: { color: "#64C80014", lineWidth: 1.0 },//Color.fromARGB(20, 100, 200, 0)
    graphUnSafeZone: { color: "#FA1E0026", lineWidth: 1.0 },//Color.fromARGB(40, 250, 30, 0)
    graphNoiseZone: { color: "#222f2d63", lineWidth: 1.0 },//Color.fromARGB(100,169,169,169)

    graphBpmLine: { color: "Blue", lineWidth: 1.75 },
    graphAxisText: { color: "Blue", lineWidth: 1.75 },
    informationText: { color: "Blue", lineWidth: 1.75 },

    graphBaseLine: { color: "BlueGrey", lineWidth: pixelsPerOneMM * 0.50 },

}

function initialize(data) {
    scale = data.scale ? parseInt(data.scale) : 1;
    comments = ("" + data.comments).toLowerCase() === "false" ? false : true;
    auto = ("" + data.interpretations).toLowerCase() === "false" ? false : true;
    highlight = ("" + data.highlight).toLowerCase() === "false" ? false : true;
    if (data.lengthOfTest < 180 || data.lengthOfTest > 3600) {
        auto = false;
        highlight = false;
        scale = 1;
    }
    timeScaleFactor = scale === 3 ? 2 : 6;
    pixelsPerOneCM = 100;
    pixelsPerOneMM = 10;

    axisFontSize = pixelsPerOneMM * 5;

    paddingLeft = HEIGHT_PX / 3;
    paddingTop = pixelsPerOneMM;
    paddingBottom = pixelsPerOneCM;
    paddingRight = pixelsPerOneMM;
}

JSON.dateParser = function (key, value) {
    var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
    var reMsAjax = /^Date\((d|-|.*)\)[\\]$/;
    if (typeof value === 'string') {
        var a = reISO.exec(value);
        if (a)
            return new Date(value);
        a = reMsAjax.exec(value);
        if (a) {
            var b = a[1].split(/[-+,.]/);
            return new Date(b[0] ? +b[0] : 0 - +b[1]);
        }
    }
    return value;
};

exports.getGraph = (req, res, next) => {
    // things to be inserted in database from mobile phone: -  comments, interpretations, scale, comments, highlight
    if (req.method === 'POST' || req.method === 'OPTIONS') {
        canvasEl = createCanvas(WIDTH_PX, HEIGHT_PX, "pdf");
        console.log(canvasEl);
        //WIDTH_PX = canvasEl.offsetWidth;
        //HEIGHT_PX = canvasEl.offsetHeight;
        console.log("WIDTH_PX", WIDTH_PX, "HEIGHT_PX", HEIGHT_PX);
        var data = JSON.parse(JSON.stringify(req.body.data), JSON.dateParser);
        lengthOfTest = data.lengthOfTest;

        getNSTGraph(data);
        res.send("Done");
    }
}

function createCanvasHere() {
    const canvas = canvasEl.getContext('2d');
    return canvas;
}

function getSpecificCanvas(pageNumber) {
    const canvas = canvasElms[pageNumber].getContext('2d');
    return canvas
}

function getNSTGraph(data) {
    //general.debugLog('getNSTGraph', data);
    try {
        lengthOfTest = data.lengthOfTest;
        mData = data;
        initialize(mData);
        pointsPerPage = (10 * timeScaleFactor * XDIV);
        pointsPerDiv = timeScaleFactor * 10;

        var pages = lengthOfTest / pointsPerPage;
        pages = Math.floor(pages);
        if ((mData.bpmEntries.length % pointsPerPage) > 20) pages++;
        //pages += 1;
        bitmaps = [pages];
        //    canvas = [pages];

        for (i = 0; i < pages; i++) {
            canvasElms.push(createCanvas(WIDTH_PX, HEIGHT_PX));
        }
        //general.debugLog('getNSTGraph 1');
        drawGraph(pages);
        //general.debugLog('getNSTGraph 2');
        //drawBpmLine(bpmList, pages);

        //general.debugLog('getNSTGraph 3');
        //drawBPMLine(canvas, interpretations.baselineBpmList, graphBaseLine);
        drawLine(data['bpmEntries'], pages, paints.graphBpmLine);
        drawTocoLine(data['tocoEntries'], pages);
        drawMovements(data['movementEntries'], pages);
        drawAutoMovements(data["autoFetalMovement"], pages);

        if (mData.autoInterpretations && highlight) {
            // drawAccelerations(mData.autoInterpretations.accelerationsList, pages);
            // drawDecelerations(mData.autoInterpretations.decelerationsList, pages);
            // drawNoiseArea(mData.autoInterpretations.noiseList, pages);

            drawInterpretations(mData.autoInterpretations.accelerationsList, pages, paints.graphSafeZone);
            drawInterpretations(mData.autoInterpretations.decelerationsList, pages, paints.graphUnSafeZone);
            drawInterpretations(mData.autoInterpretations.noiseList, pages, paints.graphNoiseZone)
        }

        //general.debugLog('getNSTGraph 4');
        var canvasMain = canvasEl.getContext('2d');
        for (i = 0; i < pages; i++) {
            if (i >= 1) { canvasMain.addPage(); }
            canvasMain.drawImage(canvasElms[i], 100, 100, WIDTH_PX - 100, HEIGHT_PX - 100);
        }
        //general.debugLog("canvasEl.toBuffer() ", canvasEl.toBuffer());
        // remove
        fs.writeFile("testGraph.pdf", canvasEl.toBuffer(), () => {
            general.debugLog("File Written");
        });
        return bitmaps[pages];
    } catch (err) {
        console.error(err);
    }
}

function drawGraph(pages) {
    //general.debugLog('drawGraph 0');
    screenHeight = HEIGHT_PX;//canvas.getHeight();//1440
    screenWidth = WIDTH_PX;//canvas.getWidth();//2560

    xTocoOrigin = paddingLeft;
    yTocoOrigin = screenHeight - (paddingBottom) - pixelsPerOneCM * 2;

    xOrigin = paddingLeft;
    yOrigin = screenHeight - (paddingBottom);


    xDivLength = pixelsPerOneCM;
    // programatically decide
    //xDiv = (int) ((screenWidth - xOrigin - paddingRight) / pixelsPerOneCM);
    // static
    xDiv = 20;

    yAxisLength = yOrigin - paddingTop;
    xAxisLength = xDiv * xDivLength;//screenWidth - paddingLeft - pixelsPerOneCM - paddingRight;


    yOrigin = yTocoOrigin - xDivLength * 6;// x= 2y

    yDivLength = xDivLength / 2;
    yDiv = (yOrigin - paddingTop) / pixelsPerOneCM * 2;

    //reinitialize for toco
    //xOrigin = paddingLeft;
    yOrigin = yTocoOrigin - yDivLength * 12;

    yTocoEnd = yOrigin + xDivLength;
    yTocoDiv = (yTocoOrigin - yTocoEnd) / pixelsPerOneCM * 2;

    pointsPerPage = (10 * timeScaleFactor * xDiv);
    pointsPerDiv = timeScaleFactor * 10;
    //general.debugLog('drawGraph 1', pages);
    for (var pageNumber = 0; pageNumber < pages; pageNumber++) {
        var canvas = getSpecificCanvas(pageNumber);
        canvas.clearRect(0, 0, WIDTH_PX, HEIGHT_PX)
        //general.debugLog('drawGraph displayInformation');
        displayInformation(pageNumber);
        //general.debugLog('drawGraph drawXAxis');
        drawXAxis(pageNumber);
        //general.debugLog('drawGraph drawYAxis');
        drawYAxis(pageNumber);
        //general.debugLog('drawGraph drawTocoXAxis');
        drawTocoXAxis(pageNumber);
        //general.debugLog('drawGraph drawTocoYAxis');
        drawTocoYAxis(pageNumber);
        //general.debugLog('drawGraph __', pageNumber);
    }
    //general.debugLog('drawGraph 2');
}

function drawXAxis(pageNumber) {
    var interval = 10;
    var ymin = 50;
    var safeZoneMax = 160;

    var canvas = getSpecificCanvas(pageNumber);
    canvas.fillStyle = paints.graphSafeZone.color;
    // canvas.fillRect(xOrigin, (yOrigin - yDivLength) - ((safeZoneMax - ymin) / interval) * yDivLength,
    //     xOrigin + xAxisLength, yOrigin - yDivLength * 8);

    canvas.fillRect(xOrigin,
        (yOrigin - yDivLength) - ((safeZoneMax - ymin) / interval) * yDivLength,
        xAxisLength, yDivLength * 4);
    canvas.stroke();
    var numberOffset = XDIV * (pageNumber);
    canvas.font = '13px Sans';
    canvas.beginPath();
    canvas.moveTo(xOrigin + ((xDivLength / 2)), paddingTop);
    canvas.lineTo(xOrigin + ((xDivLength / 2)), yOrigin);
    canvas.lineWidth = paints.graphGridSubLines.lineWidth;//1.5;
    canvas.strokeStyle = paints.graphGridSubLines.color;//'LightGray';
    canvas.stroke();
    console.log("pixelsPerOneMM", pixelsPerOneMM);
    for (var i = 1; i <= xDiv; i++) {
        canvas.beginPath();
        canvas.moveTo(xOrigin + (xDivLength * i), paddingTop);
        canvas.lineTo(xOrigin + (xDivLength * i), yOrigin);
        canvas.lineWidth = paints.graphGridLines.lineWidth;//2.5;
        canvas.strokeStyle = paints.graphGridLines.color;//'Gray';
        canvas.stroke();

        canvas.beginPath();
        canvas.moveTo(xOrigin + (xDivLength * i) + ((xDivLength / 2)), paddingTop);
        canvas.lineTo(xOrigin + (xDivLength * i) + ((xDivLength / 2)), yOrigin);
        canvas.lineWidth = paints.graphGridSubLines.lineWidth;//1.5;
        canvas.strokeStyle = paints.graphGridSubLines.color;//'LightGray';
        canvas.stroke();

        // var offset = parseInt(mOffset / pointsPerDiv);
        // if ((i + offset) % gridPerMin === 0) {
        //     var pstr = parseInt((i + (offset)) / gridPerMin).toString();
        //     pstr = (pstr.length === 1) ? "0" + pstr : pstr;
        //     //console.log("pstr",pstr);
        //     canvas.fillText(pstr, xOrigin + (xDivLength * i) - pixelsPerOneMM * 5, pixelsPerOneCM * 0.2);
        //     canvas.stroke();

        //     canvas.beginPath();
        //     canvas.moveTo(xOrigin + (xDivLength * i), paddingTop);
        //     canvas.lineTo(xOrigin + (xDivLength * i), yOrigin);
        //     canvas.lineWidth = paints.graphGridMainLines.lineWidth;//1.5;
        //     canvas.strokeStyle = paints.graphGridMainLines.color;//'LightGray';
        //     canvas.stroke();
        // }
    }
}

function drawYAxis(pageNumber) {
    //y-axis outlines
    var canvas = getSpecificCanvas(pageNumber);
    canvas.font = '30px Sans';
    canvas.beginPath();
    canvas.lineWidth = 3;
    canvas.moveTo(xOrigin, yOrigin);
    canvas.lineTo(xOrigin + xAxisLength, yOrigin);
    canvas.strokeStyle = paints.graphOutlines.color; //'Black';
    canvas.lineWidth = paints.graphOutlines.lineWidth;
    canvas.stroke();
    //Fhr top line
    canvas.beginPath();
    canvas.lineWidth = 3;
    canvas.moveTo(xOrigin - pixelsPerOneCM, paddingTop);
    canvas.lineTo(xOrigin + xAxisLength, paddingTop);
    canvas.strokeStyle = paints.graphOutlines.color; //'Black';
    canvas.lineWidth = paints.graphOutlines.lineWidth;
    canvas.stroke();

    var interval = 10;
    var ymin = 50;
    var safeZoneMax = 160;


    //SafeZone
    // canvas.beginPath();
    // canvas.fillStyle = '#b3ffb380';

    // canvas.fillRect(xOrigin,
    //     (yOrigin - yDivLength) - ((safeZoneMax - ymin) / interval) * yDivLength,
    //     xAxisLength, yDivLength * 4);


    // general.debugLog("safe data", xOrigin,
    // (yOrigin - yDivLength) - ((safeZoneMax - ymin) / interval) * yDivLength,
    // xAxisLength, yDivLength * 4)

    // general.debugLog("safe data new", xOrigin, ((yOrigin - yDivLength) - ((safeZoneMax - ymin) / interval) * yDivLength),
    //       (xOrigin + xAxisLength), (yOrigin - yDivLength * 8));
    // canvas.fillRect(xOrigin,
    //     (yOrigin - yDivLength) - ((safeZoneMax - ymin) / interval) * yDivLength,
    //     xOrigin + xAxisLength, yOrigin - yDivLength * 8);

    //canvas.stroke();

    for (var i = 1; i <= yDiv; i++) {
        if (i % 2 === 0) {
            canvas.beginPath();
            canvas.moveTo(xOrigin, yOrigin - (yDivLength * i));
            canvas.lineTo(xOrigin + xAxisLength, yOrigin - (yDivLength * i));
            canvas.strokeStyle = paints.graphGridLines.color; //'GRAY';
            canvas.lineWidth = paints.graphGridLines.lineWidth; // 2.5
            canvas.stroke();

            canvas.beginPath();
            canvas.fillStyle = '#000000';
            canvas.font = '30px Sans';

            //console.log("y axis" + parseInt(ymin + (interval * (i - 1))));
            // canvas.fillText("" + parseInt(ymin + (interval * (i - 1))), pixelsPerOneMM * 2,
            //     yOrigin - (yDivLength * i - (pixelsPerOneMM*3)));

            canvas.fillText("" + (ymin + (interval * (i - 1))), xOrigin - pixelsPerOneCM + pixelsPerOneMM,
                yOrigin - (yDivLength * i) + 2);
            canvas.stroke();

            canvas.beginPath();
            canvas.moveTo(xOrigin, yOrigin - (yDivLength * i) + yDivLength / 2);
            canvas.lineTo(xOrigin + xAxisLength, yOrigin - (yDivLength * i) + yDivLength / 2);
            canvas.strokeStyle = paints.graphGridSubLines.color; //'LightGray';
            canvas.lineWidth = paints.graphGridSubLines.lineWidth; // 1.5
            canvas.stroke();
        }
        else {
            canvas.beginPath();
            canvas.moveTo(xOrigin, yOrigin - (yDivLength * i));
            canvas.lineTo(xOrigin + xAxisLength, yOrigin - (yDivLength * i));
            canvas.strokeStyle = paints.graphGridSubLines.color; //'LightGray';
            canvas.lineWidth = paints.graphGridSubLines.lineWidth; // 1.5
            canvas.stroke();

            canvas.beginPath();
            canvas.moveTo(xOrigin, yOrigin - (yDivLength * i) + yDivLength / 2);
            canvas.lineTo(xOrigin + xAxisLength, yOrigin - (yDivLength * i) + yDivLength / 2);
            canvas.strokeStyle = paints.graphGridSubLines.color; //'LightGray';
            canvas.lineWidth = paints.graphGridSubLines.lineWidth; // 1.5
            canvas.stroke();
        }
    }
}

function drawTocoXAxis(pageNumber) {
    var canvas = getSpecificCanvas(pageNumber);
    var numberOffset = XDIV * (pageNumber);
    //var numberOffset = XDIV * (pageNumber);
    for (var j = 1; j < 2; j++) {
        canvas.beginPath();
        canvas.moveTo(xOrigin + ((xDivLength / 2) * j), yTocoEnd);
        canvas.lineTo(xOrigin + ((xDivLength / 2) * j), yTocoOrigin);
        canvas.strokeStyle = paints.graphGridSubLines.color; //'LightGray';
        canvas.lineWidth = paints.graphGridSubLines.lineWidth; // 1.5
        canvas.stroke();
    }

    for (var i = 1; i <= xDiv; i++) {
        canvas.beginPath();
        canvas.moveTo(xOrigin + (xDivLength * i), yTocoEnd);
        canvas.lineTo(xOrigin + (xDivLength * i), yTocoOrigin);
        canvas.strokeStyle = paints.graphGridLines.color; //'Gray';
        canvas.lineWidth = paints.graphGridLines.lineWidth; // 2.5
        canvas.stroke();

        canvas.beginPath();
        canvas.moveTo(xOrigin + (xDivLength * i) + ((xDivLength / 2)), yTocoEnd);
        canvas.lineTo(xOrigin + (xDivLength * i) + ((xDivLength / 2)), yTocoOrigin);
        canvas.strokeStyle = paints.graphGridSubLines.color; //'LightGray';
        canvas.lineWidth = paints.graphGridSubLines.lineWidth; // 1.5
        canvas.stroke();

        // canvas.beginPath();
        // canvas.fillStyle = '#000000';
        // canvas.font = '30px Sans';
        // var offSet = (numberOffset + i) / scale;
        // if ((numberOffset + i) % scale === 0) {
        //     canvas.fillText(("" + offSet), xOrigin + (xDivLength * i) - 5,/// (graphAxisText.measureText("00") / 2) instead of 5
        //         yTocoOrigin + axisFontSize);
        // }
        // canvas.stroke();
        //console.log("(i + mOffset / 60) % gridPerMin", (i + mOffset / 60) % gridPerMin);

        var offSet = parseInt((numberOffset + i) / scale);
        // if ((i + mOffset / 60) % gridPerMin === 0) {
        //     canvas.beginPath();
        //     canvas.moveTo(xOrigin + (xDivLength * i), yTocoEnd);
        //     canvas.lineTo(xOrigin + (xDivLength * i), yTocoOrigin);
        //     canvas.strokeStyle = paints.graphGridMainLines.color;
        //     canvas.lineWidth = paints.graphGridMainLines.lineWidth;
        //     canvas.stroke();
        // }
        if ((numberOffset + i) % scale === 0) {
            canvas.beginPath();
            canvas.fillStyle = '#000000';
            canvas.font = '30px Sans';
            canvas.fillText("" + offSet, xOrigin + (xDivLength * i) - (pixelsPerOneMM),
                yTocoOrigin + axisFontSize - (pixelsPerOneMM * 2));
            canvas.stroke();
        }
    }

}

function drawTocoYAxis(pageNumber) {
    var canvas = getSpecificCanvas(pageNumber);
    // toco bottom line
    canvas.beginPath();
    canvas.moveTo(xOrigin, yTocoOrigin);
    canvas.lineTo(xOrigin + xAxisLength, yTocoOrigin);
    canvas.strokeStyle = paints.graphOutlines.color; //'Black';
    canvas.lineWidth = paints.graphOutlines.lineWidth;// 3
    canvas.stroke();

    canvas.beginPath();
    canvas.moveTo(xOrigin, yTocoEnd);
    canvas.lineTo(xOrigin + xAxisLength, yTocoEnd);
    canvas.strokeStyle = paints.graphOutlines.color; //'Black';
    canvas.lineWidth = paints.graphOutlines.lineWidth;// 3
    canvas.stroke();

    canvas.beginPath();
    canvas.moveTo(paddingLeft - pixelsPerOneCM, yTocoOrigin + (pixelsPerOneCM - pixelsPerOneMM));
    canvas.lineTo(screenWidth - paddingRight, yTocoOrigin + (pixelsPerOneCM - pixelsPerOneMM));
    canvas.strokeStyle = paints.graphOutlines.color; //'Black';
    canvas.lineWidth = paints.graphOutlines.lineWidth;// 3
    canvas.stroke();

    //toco top line
    canvas.beginPath();
    canvas.moveTo(paddingLeft - pixelsPerOneCM, paddingTop);
    canvas.lineTo(paddingLeft - pixelsPerOneCM, yTocoOrigin + (pixelsPerOneCM - pixelsPerOneMM));
    canvas.strokeStyle = paints.graphOutlines.color; //'Black';
    canvas.lineWidth = paints.graphOutlines.lineWidth;
    canvas.stroke();

    // //Xaxis outer line
    // canvas.beginPath();
    // canvas.moveTo(paddingLeft - pixelsPerOneCM, yTocoOrigin + (pixelsPerOneCM - pixelsPerOneMM));
    // canvas.lineTo(screenWidth - paddingRight, yTocoOrigin + (pixelsPerOneCM - pixelsPerOneMM));
    // canvas.strokeStyle = 'Black';
    // canvas.stroke();

    // //yaxis outer line
    // canvas.beginPath();
    // canvas.moveTo(paddingLeft - pixelsPerOneCM, paddingTop);
    // canvas.lineTo(paddingLeft - pixelsPerOneCM, yTocoOrigin + (pixelsPerOneCM - pixelsPerOneMM));
    // canvas.strokeStyle = 'Black';
    // canvas.stroke();

    var interval = 10;
    var ymin = 10;


    for (var i = 1; i <= yTocoDiv; i++) {
        if (i % 2 === 0) {
            canvas.beginPath();
            canvas.moveTo(xOrigin, yTocoOrigin - (yDivLength * i));
            canvas.lineTo(xOrigin + xAxisLength, yTocoOrigin - (yDivLength * i));
            canvas.strokeStyle = paints.graphGridLines.color; //''Gray;
            canvas.lineWidth = paints.graphGridLines.lineWidth; //2.5
            canvas.stroke();

            canvas.beginPath();
            canvas.fillStyle = '#000000';
            canvas.font = '30px Sans';
            canvas.fillText("" + (ymin + (interval * (i - 1))), xOrigin - pixelsPerOneCM + pixelsPerOneMM,
                yTocoOrigin - (yDivLength * i) + 2);
            canvas.stroke();

            canvas.beginPath();
            canvas.moveTo(xOrigin, yTocoOrigin - (yDivLength * i) + yDivLength / 2);
            canvas.lineTo(xOrigin + xAxisLength, yTocoOrigin - (yDivLength * i) + yDivLength / 2);
            canvas.strokeStyle = paints.graphGridSubLines.color; //''LightGray;
            canvas.lineWidth = paints.graphGridSubLines.lineWidth; //1.5
            canvas.stroke();

        } else {

            canvas.beginPath();
            canvas.moveTo(xOrigin, yTocoOrigin - (yDivLength * i));
            canvas.lineTo(xOrigin + xAxisLength, yTocoOrigin - (yDivLength * i));
            canvas.strokeStyle = paints.graphGridSubLines.color; //''LightGray;
            canvas.lineWidth = paints.graphGridSubLines.lineWidth; //1.5
            canvas.stroke();

            canvas.beginPath();
            canvas.moveTo(xOrigin, yTocoOrigin - (yDivLength * i) + yDivLength / 2);
            canvas.lineTo(xOrigin + xAxisLength, yTocoOrigin - (yDivLength * i) + yDivLength / 2);
            canvas.strokeStyle = paints.graphGridSubLines.color; //''LightGray;
            canvas.lineWidth = paints.graphGridSubLines.lineWidth; //1.5
            canvas.stroke();
        }
    }
}

function drawLine(bpmList, pages, paint) {
    //var canvas = createCanvasHere();
    if (bpmList === null) {
        return;
    }

    for (var pageNumber = 0; pageNumber < pages; pageNumber++) {
        var startX, startY, stopX = 0, stopY = 0;
        var startData, stopData = 0;
        var canvas = getSpecificCanvas(pageNumber);

        for (var i = (pageNumber * pointsPerPage), j = 0; i < bpmList.length && j < pointsPerPage; i++, j++) {

            startData = stopData;
            stopData = bpmList[i];

            startX = stopX;
            startY = stopY;

            stopX = getScreenX(i, pageNumber);
            stopY = getYValueFromBPM(bpmList[i]);

            if (i < 1) continue;
            if (startData === 0 || stopData === 0 || startData > 210 || stopData > 210 ||
                Math.abs(startData - stopData) > 30) {
                continue;
            }

            // a. If the value is 0, it is not drawn
            // b. If the results of the two values before and after are different by more than 30, they are not connected.
            canvas.beginPath();
            canvas.moveTo(startX, startY);
            canvas.lineTo(stopX, stopY);
            canvas.strokeStyle = paint.color; //''LightGray;
            canvas.lineWidth = paint.lineWidth; //1.5
            // canvas.strokeStyle = 'BLUE';
            canvas.stroke();
        }

        // canvas.fillText('', pages,
        //     screenWidth - paddingRight -
        //     screenHeight - pixelsPerOneMM * 2, graphAxisText);
    }
}

function getScreenX(i, startIndex) {
    var increment = (pixelsPerOneMM / timeScaleFactor);
    var k = xOrigin + increment * 4;
    k += increment * (i - (startIndex * pointsPerPage));
    return k;
}

function getYValueFromBPM(bpm) {
    var adjustedBPM = bpm - scaleOrigin;
    adjustedBPM = adjustedBPM / 2; //scaled down version for mobile phone
    var y_value = yOrigin - (adjustedBPM * pixelsPerOneMM);
    return y_value;
}

function drawTocoLine(tocoEntries, pages) {
    //var canvas = createCanvasHere();
    if (mData.tocoEntries === null) {
        return;
    }
    //general.debugLog("pages",pages);
    for (var pageNumber = 0; pageNumber < pages; pageNumber++) {
        var startX, startY, stopX = 0, stopY = 0;
        var startData, stopData = 0;
        var canvas = getSpecificCanvas(pageNumber);
        for (var i = (pageNumber * pointsPerPage), j = 0; i < tocoEntries.length && j < pointsPerPage; i++, j++) {
            startData = stopData;
            stopData = tocoEntries[i];

            startX = stopX;
            startY = stopY;

            stopX = getScreenX(i, pageNumber);
            stopY = getYValueFromToco(tocoEntries[i]); // getScreenY(stopData);

            if (i < 1) continue;
            if (startData === 0 || stopData === 0 || startData > 210 || stopData > 210 ||
                Math.abs(startData - stopData) > 30) {
                continue;
            }
            canvas.beginPath();
            canvas.moveTo(startX, startY);
            canvas.lineTo(stopX, stopY);
            canvas.strokeStyle = paints.graphBpmLine.color;//Blue
            canvas.lineWidth = paints.graphBpmLine.lineWidth;//2.5;
            canvas.stroke();
        }
        canvas.beginPath();
        canvas.fillStyle = '#000000';
        canvas.font = '30px Sans';

        canvas.fillText(("page " + (pageNumber + 1) + " of " + pages + ""),
            screenWidth - paddingRight -
            (canvas.measureText("page 1 of 10").width),
            screenHeight - pixelsPerOneMM * 2);
        canvas.stroke();
    }
}

function getYValueFromToco(bpm) {
    var adjustedBPM = bpm;
    adjustedBPM = adjustedBPM / 2; //scaled down version for mobile phone
    var yValue = yTocoOrigin - (adjustedBPM * pixelsPerOneMM);
    return yValue;
}

function drawMovements(movementList, pages) {
    //var canvas = createCanvasHere();
    for (var pageNumber = 0; pageNumber < pages; pageNumber++) {
        var canvas = getSpecificCanvas(pageNumber);
        if (movementList === null || movementList.length === 0)
            return;

        var increment = (pixelsPerOneMM / timeScaleFactor);
        for (var i = 0; i < movementList.length; i++) {
            var movement = movementList[i] - (pageNumber * pointsPerPage);
            if (movement > 0 && movement < pointsPerPage) {

                // canvas.beginPath();
                // canvas.fillStyle = '#000000';
                // canvas.font = "bold 20pt Courier";
                // canvas.fillText('↑',
                //     xOrigin + (pixelsPerOneMM / timeScaleFactor * (movement)) - (pixelsPerOneMM * 2.4),
                //     yOrigin + axisFontSize + 3);
                // canvas.stroke();

                canvas.beginPath();
                canvas.moveTo(xOrigin + (increment * (movement)), yOrigin + pixelsPerOneMM * 2);
                canvas.lineTo(xOrigin + (increment * (movement)), yOrigin + pixelsPerOneMM * 2 + (pixelsPerOneMM * 4));
                // canvas.strokeStyle = 'BLUE';
                // canvas.lineWidth = 2.5;
                canvas.strokeStyle = paints.graphMovement.color; //''BLUE;
                canvas.lineWidth = paints.graphMovement.lineWidth; //2.5
                canvas.stroke();

                canvas.beginPath();
                canvas.moveTo(xOrigin + (increment * (movement)), yOrigin + pixelsPerOneMM * 2);
                canvas.lineTo(xOrigin + (increment * (movement)) + pixelsPerOneMM, yOrigin + pixelsPerOneMM * 2 + (pixelsPerOneMM * 2));
                // canvas.strokeStyle = 'BLUE';
                // canvas.lineWidth = 2.5;
                canvas.strokeStyle = paints.graphMovement.color; //''BLUE;
                canvas.lineWidth = paints.graphMovement.lineWidth; //2.5
                canvas.stroke();
            }
        }
    }
}

function drawAutoMovements(movementList, pages) {
    //var canvas = createCanvasHere();
    for (var pageNumber = 0; pageNumber < pages; pageNumber++) {
        var canvas = getSpecificCanvas(pageNumber);
        if (movementList === null || movementList.length === 0)
            return;

        var increment = (pixelsPerOneMM / timeScaleFactor);
        for (var i = 0; i < movementList.length; i++) {
            var movement = movementList[i] - (pageNumber * pointsPerPage);
            if (movement > 0 && movement < pointsPerPage) {

                // canvas.beginPath();
                // canvas.fillStyle = '#000000';
                // canvas.font = "bold 20pt Courier";
                // canvas.fillText('↑',
                //     xOrigin + (pixelsPerOneMM / timeScaleFactor * (movement)) - (pixelsPerOneMM * 2.4),
                //     yOrigin + axisFontSize + 3);
                // canvas.stroke();

                canvas.beginPath();
                canvas.moveTo(xOrigin + (increment * (movement)), yOrigin - pixelsPerOneCM + pixelsPerOneMM);
                canvas.lineTo(xOrigin + (increment * (movement)), yOrigin - pixelsPerOneMM * 3);
                // canvas.strokeStyle = 'BLUE';
                // canvas.lineWidth = 2.5;
                canvas.strokeStyle = paints.graphOutlines.color; //''BLUE;
                canvas.lineWidth = paints.graphOutlines.lineWidth; //2.5
                canvas.stroke();

                canvas.beginPath();
                canvas.moveTo(xOrigin + (increment * (movement)), yOrigin - pixelsPerOneCM + pixelsPerOneMM);
                canvas.lineTo(xOrigin + (increment * (movement)) + pixelsPerOneMM + pixelsPerOneMM, yOrigin - pixelsPerOneMM * 7);
                // canvas.strokeStyle = 'BLUE';
                // canvas.lineWidth = 2.5;
                canvas.strokeStyle = paints.graphOutlines.color; //''BLUE;
                canvas.lineWidth = paints.graphOutlines.lineWidth; //2.5
                canvas.stroke();

                canvas.beginPath();
                canvas.moveTo(xOrigin + (increment * (movement)), yOrigin - pixelsPerOneCM + pixelsPerOneMM * 7);
                canvas.lineTo(xOrigin + (increment * (movement)) + pixelsPerOneMM + pixelsPerOneMM, yOrigin - pixelsPerOneMM * 5);
                // canvas.strokeStyle = 'BLUE';
                // canvas.lineWidth = 2.5;
                canvas.strokeStyle = paints.graphOutlines.color; //''BLUE;
                canvas.lineWidth = paints.graphOutlines.lineWidth; //2.5
                canvas.stroke();
            }
        }
    }
}

function displayInformation(pageNumber) {

    var dtcr = mData.createdOn;
    dtcr = new Date(dtcr.getTime() + (5 * 60 * 60000) + (30 * 60000));

    var date = dtcr.toLocaleDateString("en-US", { day: "2-digit" }) + " " + dtcr.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    var time = ("0" + dtcr.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })).slice(-8);

    // var datestr = ("0" + dtcr.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })).slice(-8)
    //     + ", " + dtcr.toLocaleDateString("en-US", { day: "2-digit" })
    //     + " " + dtcr.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    var rowLength = (screenWidth + (pixelsPerOneCM * 2)) / rows;
    // var rowHeight = pixelsPerOneCM * 0.7;
    // var rowPos = rowHeight * 0.5;

    var rowHeight = pixelsPerOneCM * 0.6;
    var rowPos = rowHeight * 0.5;


    //general.debugLog("displayInformation 4");

    //general.debugLog("displayInformation 0");
    interpretation = getAutoInterpretation(mData);
    //general.debugLog("displayInformation 1");

    var canvas = getSpecificCanvas(pageNumber);
    //general.debugLog("displayInformation 2");

    if (interpretation === null) {
        //interpretation = new Interpretations2(); //////////////////////////////////// to see
    }

    var rows = 3;

    // //SimpleDateFormat sdf = new SimpleDateFormat("hh:mm a, dd MMM yyyy ", Locale.ENGLISH);


    // var rowHeight = pixelsPerOneCM * 0.6;
    // var rowPos = rowHeight * 0.5;

    //mData.setOrganizationName("hospital i Morey MD FICOG and so on");
    mData.organizationName = mData.organizationName ? mData.organizationName : null;

    canvas.beginPath();
    canvas.lineWidth = 3;
    canvas.fillStyle = '#000000';
    canvas.font = "normal 34px Sans";
    //general.debugLog("displayInformation 5");

    if (mData.organizationName !== null && mData.organizationName.length >= 30) {
        var s1 = mData.organizationName.substr(0, 30);
        s1 = mData.organizationName.substr(0, s1.lastIndexOf(" ") + 1);
        var s2 = mData.organizationName.replace(s1, "");

        canvas.fillText(("" + s1).replace("null", ""), 0, rowPos);
        rowPos += rowHeight * 0.8;
        canvas.fillText(("" + s2).replace("null", ""), 0, rowPos - pixelsPerOneMM);
        rowPos += rowHeight;
        canvas.stroke();

    } else {
        canvas.fillText("Hospital :", 0, rowPos);
        rowPos += rowHeight * 0.8;
        canvas.fillText(("" + mData.organizationName).replace("null", ""), 0, rowPos - pixelsPerOneMM);
        rowPos += rowHeight;
        canvas.stroke();
    }
    //general.debugLog("displayInformation 6");

    //mData.setDoctorName("Dr Bharati Morey MD FICOG and so on");
    mData.doctorName = mData.doctorName ? mData.doctorName : null;
    if (mData.doctorName !== null && mData.doctorName.length >= 20) {
        s1 = mData.doctorName.subst(0, 30);
        s1 = mData.doctorName.substr(0, s1.lastIndexOf(" ") + 1);
        s2 = mData.doctorName.replace(s1, "");

        canvas.fillText(("" + s1).replace("null", ""), 0, rowPos);
        rowPos += rowHeight * 0.8;
        canvas.fillText(("" + s2).replace("null", ""), 0, rowPos - pixelsPerOneMM);
        rowPos += rowHeight;
        canvas.stroke();
    } else {
        canvas.fillText("Doctor :", 0, rowPos);
        rowPos += rowHeight * 0.8;
        canvas.fillText(("" + mData.doctorName).replace("null", ""), 0, rowPos - pixelsPerOneMM);
        rowPos += rowHeight;
        canvas.stroke();
    }
    //general.debugLog("displayInformation 7");

    if (mData.patientId !== null && mData.patientId.length >= 30) {
        s1 = mData.patientId.substr(0, 30);
        s1 = mData.patientId.substr(0, s1.lastIndexOf(" ") + 1);
        s2 = mData.patientId.replace(s1, "");

        canvas.fillText(("" + s1).replace("null", ""), 0, rowPos);
        rowPos += rowHeight * 0.8;
        canvas.fillText(("" + s2).replace("null", ""), 0, rowPos - pixelsPerOneMM);
        rowPos += rowHeight;
        canvas.stroke();
    } else {
        canvas.fillText("Patient Id :", 0, rowPos);
        rowPos += rowHeight * 0.8;
        canvas.fillText(("" + mData.patientId).replace("null", ""), 0, rowPos - pixelsPerOneMM);
        rowPos += rowHeight;
        canvas.stroke();
    }

    mData.motherName = mData.motherName ? mData.motherName : null;
    if (mData.motherName !== null && mData.motherName.length >= 30) {
        s1 = mData.motherName.substr(0, 30);
        s1 = mData.motherName.substr(0, s1.lastIndexOf(" ") + 1);
        s2 = mData.motherName.replace(s1, "");

        canvas.fillText(("" + s1).replace("null", ""), 0, rowPos);
        rowPos += rowHeight * 0.8;
        canvas.fillText(("" + s2).replace("null", ""), 0, rowPos - pixelsPerOneMM);
        rowPos += rowHeight;
        canvas.stroke();
    } else {
        canvas.fillText("Mother :", 0, rowPos);
        rowPos += rowHeight * 0.8;
        canvas.fillText(("" + mData.motherName).replace("null", ""), 0, rowPos - pixelsPerOneMM);
        rowPos += rowHeight;
        canvas.stroke();
    }

    canvas.fillText(("Duration : " + (mData.lengthOfTest / 60).toFixed(2) + " min"), 0, rowPos);
    rowPos += rowHeight;
    //general.debugLog("displayInformation 8");

    //general.debugLog("datestr", datestr);
    canvas.fillText("Time : " + time, 0, rowPos);
    rowPos += rowHeight;

    canvas.fillText("Date : " + date, 0, rowPos);
    rowPos += rowHeight;

    canvas.fillText(("Gest. Week : " + mData.gAge), 0, rowPos);
    rowPos += rowHeight;

    canvas.fillText("Basal HR : " + (auto ? interpretation.basalHeartRate : "_______"), 0, rowPos);
    rowPos += rowHeight;

    canvas.fillText(("FM : " + (mData.movementEntries.length ? mData.movementEntries.length : "--") + " man/ " + (mData.autoFetalMovement.length ? mData.autoFetalMovement.length : "--")), 0, rowPos);
    rowPos += rowHeight;

    canvas.fillText(("Accelerations : " + (auto ? interpretation.nAccelerations : "_______")), 0, rowPos);
    rowPos += rowHeight;

    canvas.fillText(("Decelerations : " + (auto ? interpretation.nDecelerations : "_______")), 0, rowPos);
    rowPos += rowHeight;

    var stvb = ("" + (interpretation.shortTermVariationBpm ? interpretation.shortTermVariationBpm : "--"));
    var stvm = interpretation.shortTermVariationMilli ? interpretation.shortTermVariationMilli : "--"
    canvas.fillText("STV : " + (auto ? (stvb + " bpm /" + stvm + " milli") : "______"), 0, rowPos);
    rowPos += rowHeight;

    var ltv = interpretation.longTermVariation ? interpretation.longTermVariation : "--";
    canvas.fillText("LTV : " + (auto ? (ltv + " bpm") : "______"), 0, rowPos);
    rowPos += rowHeight;

    canvas.fillText("Conclusion : ", 0, rowPos);
    rowPos += pixelsPerOneMM * 3;

    canvas.stroke();
    //informationText.setTextSize(20);
    canvas.font = "normal 20px Sans";
    canvas.fillText("(Reactive, Non-Reactive, Inconclusive)", 0, rowPos);
    canvas.stroke();
    rowPos += pixelsPerOneMM;
    // rowPos = yTocoOrigin + rowHeight;
    // rowPos -= rowHeight * 0.5;

    //general.debugLog("displayInformation 9");

    if (mData.dynamicURL || mData.longDynamicLink || mData.shortDynamicLink) {
        //canvas.drawImage(getQRCode(mData), 0, rowPos); /////////////////// to see afterwards
        drawQRCode(0, rowPos, canvas, mData);
        rowPos = yTocoOrigin - (rowHeight);
        canvas.fillText("Want to Listen to your Baby's Heart Beat again?", 0, rowPos);
        rowPos += pixelsPerOneMM * 3;
        canvas.fillText("Scan the above QRCode to listen again and", 0, rowPos);
        rowPos += pixelsPerOneMM * 3;
        canvas.fillText("also share your joy with your loved ones.", 0, rowPos);
        rowPos += pixelsPerOneMM * 3;
        canvas.fillText("www.CareMother.in", 0, rowPos);
        rowPos += pixelsPerOneMM * 3;
        rowPos += rowHeight * 1.3;
    }
    else {
        rowPos = yTocoOrigin + (rowHeight);
    }
    canvas.font = "normal 34px Sans";
    rowPos -= rowHeight * 0.5;

    canvas.fillText("X-Axis : " + (timeScaleFactor * 10) + " SEC/DIV", 0, rowPos);
    rowPos += rowHeight * 0.6;

    canvas.fillText("Y-Axis : 20 BPM/DIV", 0, rowPos);
    rowPos += rowHeight * 1.5;

    if (comments && interpretations && mData.interpretationType) {
        mData.interpretationExtraComments = mData.interpretationExtraComments === null ? "" : "-- " + mData.interpretationExtraComments;
        canvas.fillText("Doctor's comments : " + mData.interpretationType + " " + mData.interpretationExtraComments, 0, rowPos);
    }

    canvas.font = "normal 24px Sans";
    canvas.fillText("Disclaimer : NST auto interpretation does not provide medical advice it is intended for informational purposes only. It is not a substitute for professional medical advice, diagnosis or treatment.", 0, screenHeight - (pixelsPerOneMM * 2));
    //}
    canvas.font = "normal 34px Sans";
    canvas.stroke();
    //general.debugLog("displayInformation 10");

}

function drawQRCode(x, y, canvas, mdata) {

    var canvasQr = createCanvas(350, 350);
    // canvas_qr = canvasQr.getContext('2d');
    // canvas_qr.fillStyle = '#2828e6';  // Color.argb(40, 40, 230, 0)
    // canvas_qr.fillRect(0, 0, 350, 350);
    // canvas_qr.stroke();
    // canvas.drawImage(canvasQr, x, y);

    var dynamicURL = "";
    if (mdata.longDynamicLink) { dynamicURL = mdata.longDynamicLink }
    else if (mdata.shortDynamicLink) { dynamicURL = mdata.shortDynamicLink }
    else if (mdata.dynamicURL) { dynamicURL = mdata.dynamicURL }
    else { return false }
    QRCode.toCanvas(canvasQr, dynamicURL, { width: 300 }, function (err) {
        if (err) { console.error("Error", err); return reject(err); }
        canvas.drawImage(canvasQr, x, y);
    })
    return true;
}

function getAutoInterpretation(tdata) {
    return tdata.autoInterpretations ? tdata.autoInterpretations : {};
}
// function not used
function drawBaseline(baseline, pages) {
    if (baseline === null) {
        return;
    }

    for (var pageNumber = 0; pageNumber < pages; pageNumber++) {
        var startX = 0, startY = 0, stopX = 0, stopY = 0, startData = 0, stopData = 0;
        for (var i = (pageNumber * pointsPerPage), j = 0; i < baseline.length && j < pointsPerPage; i++, j++) {

            startData = stopData;
            stopData = baseline[i];

            startX = stopX;
            startY = stopY;


            stopX = getScreenX(i, pageNumber);
            stopY = getYValueFromBPM(baseline.get(i)); // getScreenY(stopData);

            if (i < 1) continue;
            if (startData === 0 || stopData === 0 || startData > 210 || stopData > 210 ||
                Math.abs(startData - stopData) > 35) {
                continue;
            }

            // a. If the value is 0, it is not drawn
            // b. If the results of the two values before and after are different by more than 30, they are not connected.

            canvas[pageNumber].drawLine(startX, startY,
                stopX, stopY, graphBaseLine);
        }


    }
}

function drawInterpretations(list, pages, paint) {

    for (pageNumber = 0; pageNumber < pages; pageNumber++) {
        if (list === null || list.length === 0)
            return;

        var canvas = getSpecificCanvas(pageNumber);
        var startX = 0, startY = 0, stopX = 0, stopY = 0;
        var startData = 0, stopData = 0;

        for (i = 0; i < list.length; i++) {

            // startX = getScreenX((list[i].from - 3), pageNumber);
            // stopX = getScreenX(list[i].to + 3, pageNumber);

            startX = getScreenX((list[i].from - 3), pageNumber);
            stopX = getScreenX((list[i].to + 3), pageNumber);

            if (startX < xOrigin)
                startX = xOrigin;
            if (stopX < xOrigin)
                stopX = xOrigin;
            if (startX === stopX)
                continue;
            canvas.fillStyle = paint.color;//"#666671ad";//'#2828e6';  // Color.argb(40, 40, 230, 0)
            canvas.fillRect(startX, paddingTop, stopX - startX, yTocoOrigin - 5);
            // console.log(startX, paddingTop, stopX-startX, yTocoOrigin);
            // console.log(startX, paddingTop, stopX, xOrigin, yTocoOrigin);
            canvas.stroke();
        }
    }
}

function drawAccelerations(list, pages) {

    for (pageNumber = 0; pageNumber < pages; pageNumber++) {
        if (list === null || list.length === 0)
            return;

        var canvas = getSpecificCanvas(pageNumber);
        var startX = 0, startY = 0, stopX = 0, stopY = 0;
        var startData = 0, stopData = 0;

        for (i = 0; i < list.length; i++) {

            // startX = getScreenX((list[i].from - 3), pageNumber);
            // stopX = getScreenX(list[i].to + 3, pageNumber);

            startX = getScreenX((list[i].from), pageNumber);
            stopX = getScreenX(list[i].to, pageNumber);

            if (startX < xOrigin)
                startX = xOrigin;
            if (stopX < xOrigin)
                stopX = xOrigin;
            if (startX === stopX)
                continue;
            canvas.fillStyle = "#666671ad";//'#2828e6';  // Color.argb(40, 40, 230, 0)
            canvas.fillRect(startX, paddingTop, stopX, yTocoOrigin);
            canvas.stroke();
        }
    }
}

function drawDecelerations(list, pages) {

    for (var pageNumber = 0; pageNumber < pages; pageNumber++) {
        if (!list || list.length === 0)
            return;

        var canvas = getSpecificCanvas(pageNumber);
        var startX = 0, startY = 0, stopX = 0, stopY = 0, startData = 0, stopData = 0;

        for (var i = 0; i < list.length; i++) {

            startX = getScreenX((list[i].from - 3), pageNumber);
            stopX = getScreenX(list[i].to + 3, pageNumber);

            if (startX < xOrigin)
                startX = xOrigin;
            if (stopX < xOrigin)
                stopX = xOrigin;
            if (startX === stopX)
                continue;
            //canvas[pageNumber].drawRect(zoneRect, graphDecelerationZone);
            canvas.fillStyle = "#666671e0";//'#28fa1e';  // Color.argb(40, 250, 30, 0)
            canvas.fillRect(startX, paddingTop, stopX, yTocoOrigin);
            canvas.stroke();
        }
    }
}

function drawNoiseArea(list, pages) {

    for (var pageNumber = 0; pageNumber < pages; pageNumber++) {
        if (!(list) || list.length === 0)
            return;

        var canvas = getSpecificCanvas(pageNumber);
        var startX = 0, startY = 0, stopX = 0, stopY = 0;
        var startData = 0, stopData = 0;

        for (i = 0; i < list.length; i++) {

            startX = getScreenX((list[i].from - 3), pageNumber);
            stopX = getScreenX(list[i].to + 3, pageNumber);

            if (startX < xOrigin)
                startX = xOrigin;
            if (stopX < xOrigin)
                stopX = xOrigin;
            if (startX === stopX)
                continue;

            //canvas[pageNumber].drawRect(zoneRect, graphDecelerationZone);
            canvas.fillStyle = '#64a9a9';  // Color.argb(100, 169, 169, 169)
            canvas.fillRect(startX, paddingTop, stopX, yTocoOrigin);
            canvas.stroke();
        }
    }
}

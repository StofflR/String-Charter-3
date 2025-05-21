import {Trip, StopTime} from "./interfaces.ts";

let minTime = 0;
let maxTime = 0;

function getOffsetX(axisFlip: boolean): number {
    if (axisFlip) {
        return 240;
    } else {
        return 40;
    }
}

function getOffsetY(axisFlip: boolean): number {
    if (axisFlip) {
        return 40;
    } else {
        return 170;
    }
}

function splitLongStationName(name: string): number {      //maybe better splitting like at , or space
    return Math.ceil(name.length / 2);
}


function translateTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':');
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    return totalMinutes;
}

function findMinTime(timetable: Trip[]): number {
    let minTime: number = 23 * 60 + 59;
    let str: number = 0;
    if (timetable == null) {
        console.log("timetable is null");
    }
    for (const trip of timetable) {
        for (const stop of trip.stops) {
            if (!minTime || translateTimeToMinutes(stop.time) < minTime) {
                minTime = translateTimeToMinutes(stop.time);
                str = parseInt(stop.time.split(':')[0]);
            }
        }
    }
    return str;
}

function findMaxTime(timetable: Trip[]): number {
    let maxTime: number = 0;
    let str: number = 0;

    for (const trip of timetable) {
        for (const stop of trip.stops) {
            if (!maxTime || translateTimeToMinutes(stop.time) > maxTime) {
                maxTime = translateTimeToMinutes(stop.time);
                str = parseInt(stop.time.split(':')[0]);
            }
        }
    }
    return str;
}

function drawStopCircle(canvas: HTMLCanvasElement, x: number, y: number, trip: string, stop: string, time: string): void {
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
        console.error('Canvas context is not supported.');
        return;
    }
    const radius: number = 3;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    ctx.stroke();
    createMouseOverStopInfo(canvas, x, y, radius, trip, stop, time);
}

function drawStopCircleSVG(svg: SVGSVGElement, x: number, y: number): void {
    const radius: number = 3;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x.toString());
    circle.setAttribute('cy', y.toString());
    circle.setAttribute('r', radius.toString());
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'black');
    svg.appendChild(circle);

}

function createMouseOverStopInfo(canvas: HTMLCanvasElement, posX: number, posY: number, rad: number, trip: string, stop: string, time: string): void {
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
        console.error('Canvas context is not supported.');
        return;
    }
    const stopDetailElement = document.getElementById('stop-detail');
    if (!stopDetailElement) {
        console.error('Stop detail element not found.');
        return;
    }

    // let windowVisible = false;
    const relativeX = posX / canvas.width;
    const relativeY = posY / canvas.height;


    canvas.addEventListener('mousemove', (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const relativeMouseX = mouseX / rect.width;
        const relativeMouseY = mouseY / rect.height;

        // Calculate the distance between the mouse coordinates and the center of the arc
        const distance = Math.sqrt(Math.pow(relativeMouseX - relativeX, 2) * canvas.width + Math.pow(relativeMouseY - relativeY, 2) * canvas.height);

        // Check if the distance is within the arc radius
        if (distance <= rad) {
            stopDetailElement.textContent = trip + ' stopping at: ' + stop + ', time: ' + time;
        }
    });

    canvas.addEventListener('mouseout', () => {
        stopDetailElement.textContent = ' --- hover over a stop to see details --- ';
    });


}

function drawGraphBackgroundSVG(svg: SVGSVGElement, width: number, height: number, data: Trip[], axisFlip: boolean): void {

    let maxLength = 0;
    let longestStationArray: string[] = [];

    for (let i = 0; i < data?.length; i++) {
        const stations = data[i].stations;
        if (stations.length > maxLength) {
            maxLength = stations.length;
            longestStationArray = stations;
        }
    }

    const svgNS = 'http://www.w3.org/2000/svg';
    const stationCount = longestStationArray.length;
    let stationHeight;
    let stationWidth;
    if (axisFlip) {
        stationHeight = (height - getOffsetY(axisFlip)) / (longestStationArray.length + 1);
        stationWidth = (width - getOffsetX(axisFlip));
    } else { //not axis flipped
        stationHeight = height - getOffsetY(axisFlip);
        stationWidth = (width - getOffsetX(axisFlip)) / (longestStationArray.length + 1);
    }
    if (axisFlip) {
        //Vertical axis labels
        for (let i = 0; i < longestStationArray.length; i++) {
            let stationName = longestStationArray[i];

            const y = (i + 1) * stationHeight;
            const textElement = document.createElementNS(svgNS, 'text');
            textElement.setAttribute('x', (getOffsetX(axisFlip) - 20).toString());
            textElement.setAttribute('y', (y + getOffsetY(axisFlip)).toString());
            textElement.setAttribute('font-size', '12');
            textElement.setAttribute('fill', 'black');
            textElement.setAttribute('text-anchor', 'end');
            if (stationName.length < 33) {
                textElement.textContent = stationName;
                svg.appendChild(textElement);
            } else {

                const splitPosition = splitLongStationName(stationName);
                textElement.textContent = stationName.slice(0, splitPosition);
                svg.appendChild(textElement);
                const secondLine = document.createElementNS(svgNS, 'text');
                secondLine.setAttribute('x', (getOffsetX(axisFlip) - 20).toString());
                secondLine.setAttribute('y', (y + getOffsetY(axisFlip) + 15).toString());
                secondLine.setAttribute('font-size', '12');
                secondLine.setAttribute('fill', 'black');
                secondLine.setAttribute('text-anchor', 'end');
                secondLine.textContent = stationName.slice(splitPosition);
                svg.appendChild(secondLine);
            }

            const lineElement = document.createElementNS(svgNS, 'line');
            lineElement.setAttribute('x1', (getOffsetX(axisFlip) - 10).toString());
            lineElement.setAttribute('y1', (y + getOffsetY(axisFlip)).toString());
            lineElement.setAttribute('x2', width.toString());
            lineElement.setAttribute('y2', (y + getOffsetY(axisFlip)).toString());
            lineElement.setAttribute('stroke', 'rgb(200, 200, 200)');
            svg.appendChild(lineElement);
        }
        //horizontal labels
        for (let time = 0; time <= maxTime - minTime; time++) {
            const x = ((stationWidth - 40) / (maxTime - minTime)) * time;
            const textElement = document.createElementNS(svgNS, 'text');
            textElement.setAttribute('x', (x + getOffsetX(axisFlip)).toString());
            textElement.setAttribute('y', (getOffsetY(axisFlip)).toString());
            textElement.setAttribute('font-size', '12');
            textElement.setAttribute('fill', 'black');
            textElement.setAttribute('text-anchor', 'middle');
            let timeLabel: number = time + minTime;
            if (timeLabel >= 24) {
                timeLabel -= 24
            }

            textElement.textContent = timeLabel.toString() + ':00';
            svg.appendChild(textElement);


            const lineElement = document.createElementNS(svgNS, 'line');
            lineElement.setAttribute('x1', (getOffsetX(axisFlip) + x).toString());
            lineElement.setAttribute('y1', (getOffsetY(axisFlip) + 30).toString());
            lineElement.setAttribute('x2', (getOffsetX(axisFlip) + x).toString());
            lineElement.setAttribute('y2', (getOffsetY(axisFlip) + 20).toString());
            lineElement.setAttribute('stroke', 'rgb(200, 200, 200)');
            svg.appendChild(lineElement);
        }

    } else {  //not axis flipped
        //Vertical axis
        for (let time = 0; time <= maxTime - minTime; time++) {
            //Time label
            const y = (stationHeight / (maxTime - minTime)) * time;
            const textElement = document.createElementNS(svgNS, 'text');
            textElement.setAttribute('x', (getOffsetX(axisFlip) + 5).toString());
            textElement.setAttribute('y', (y + getOffsetY(axisFlip)).toString());
            textElement.setAttribute('font-size', '12');
            textElement.setAttribute('fill', 'black');
            textElement.setAttribute('text-anchor', 'end');
            let timeLabel: number = time + minTime;
            if (timeLabel >= 24) {
                timeLabel -= 24
            }

            textElement.textContent = timeLabel.toString() + ':00';
            svg.appendChild(textElement);

            //Horizontal lines
            const lineElement = document.createElementNS(svgNS, 'line');
            lineElement.setAttribute('x1', (getOffsetX(axisFlip) + 10).toString());
            lineElement.setAttribute('y1', (y + getOffsetY(axisFlip)).toString());
            lineElement.setAttribute('x2', width.toString());
            lineElement.setAttribute('y2', (y + getOffsetY(axisFlip)).toString());
            lineElement.setAttribute('stroke', 'rgb(200, 200, 200)');
            svg.appendChild(lineElement);

        }

        const labelOffsetY = -20; // Adjust this value to control the vertical position of the labels

        for (let i = 0; i < stationCount; i++) {
            const stationName = longestStationArray[i] as string;
            const x = (i + 1) * stationWidth + getOffsetX(axisFlip);
            const y = labelOffsetY;

            // Draw rotated text label
            const textElement = document.createElementNS(svgNS, 'text');
            textElement.setAttribute('x', x.toString());
            textElement.setAttribute('y', (y + getOffsetY(axisFlip)).toString());
            textElement.setAttribute('font-size', '12');
            textElement.setAttribute('fill', 'black');
            textElement.setAttribute('text-anchor', 'start');
            textElement.setAttribute('transform', `rotate(-45 ${x.toString()},${(y + getOffsetY(axisFlip)).toString()})`);
            textElement.textContent = stationName;
            svg.appendChild(textElement);
        }
    }
}

function getPxPerDistance(axisFlip: boolean, maxDistance : number, stations : number): number {
    let distPerStation = maxDistance / stations;
    let pxPerStation = (axisFlip ? 1900 : 1080) / stations;
    if(pxPerStation < (axisFlip ? 1900 : 1080) / 10) {
        pxPerStation = (axisFlip ? 1900 : 1080) / 10;
    }
    return pxPerStation / distPerStation;
}

function drawGraphBackground(ctx: CanvasRenderingContext2D, data: StopTime[], axisFlip: boolean, longestStationArray: string[], maxDistance: number, canvas : HTMLCanvasElement, trip: Trip[]): void {

    let pxPerDistance = getPxPerDistance(axisFlip, maxDistance, longestStationArray.length);
    let pxPerTime = ((axisFlip ? canvas.width : canvas.height)) / ((maxTime - minTime));

    let xOffset = getOffsetX(!axisFlip);
    let yOffset = getOffsetY(!axisFlip);
    let labelOffset = 50;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = `rgb(200, 200, 200)`;



    let longestLabel = 0;
    for (let stopTime of data) {
        let step = stopTime.distance * pxPerDistance;

        ctx.save();
        ctx.translate(xOffset + (!axisFlip ? step : 0), yOffset + (!axisFlip ? 0 : step));
        ctx.rotate(!axisFlip ? -Math.PI/2 : 0);
        ctx.textAlign = !axisFlip ? "right" : "left";
        ctx.fillText(stopTime.station,  !axisFlip ? labelOffset : -labelOffset, 0, labelOffset);
        ctx.restore();
        if(stopTime.station.length > longestLabel) {
            longestLabel = stopTime.station.length;
        }
    }

    if(!axisFlip) {
        yOffset += labelOffset;
    } else {
        xOffset += labelOffset;
    }
    
    ctx.strokeStyle = 'black';
    for (let time = 0; time <= maxTime - minTime; time++) {
        let timeLabel = time + minTime;
        if (timeLabel >= 24) {
            timeLabel -= 24
        }
        let step = time * pxPerTime;

        // rotate if flip axis
        ctx.fillText(timeLabel.toString() + ':00',   xOffset + (!axisFlip ? 0 : step), yOffset + (!axisFlip ? step : 0), labelOffset);

        ctx.beginPath();
        if (!axisFlip) {
            ctx.moveTo(xOffset, step + yOffset);
            ctx.lineTo(canvas.width + xOffset, step + yOffset);
        } else {
            ctx.moveTo(step + xOffset, yOffset);
            ctx.lineTo(step + xOffset, canvas.height + yOffset);
        }
        ctx.stroke();
        ctx.closePath();
    }
    drawData(canvas, trip, axisFlip, longestStationArray, maxDistance, xOffset, yOffset);

}

function drawDataSVG(svg: SVGSVGElement, data: Trip[], width: number, height: number, axisFlip: boolean): void {
    let maxLength = 0;
    let longestStationArray: string[] = [];

    for (let i = 0; i < data?.length; i++) {
        const stations = data[i].stations;
        if (stations.length > maxLength) {
            maxLength = stations.length;
            longestStationArray = stations;
        }
    }
    const svgNS = 'http://www.w3.org/2000/svg';
    let stationHeight;
    let stationWidth;
    if (axisFlip) {
        stationHeight = (height - getOffsetY(axisFlip)) / (longestStationArray.length + 1);
        stationWidth = (width - getOffsetX(axisFlip));
    } else { //not axis flipped
        stationHeight = height - getOffsetY(axisFlip);
        stationWidth = (width - getOffsetX(axisFlip)) / (longestStationArray.length + 1);
    }


    for (const trip of data) {
        let datat: StopTime[] = trip.stops;
        for (let i = 0; i < datat.length - 1; i++) {   //draw one trip

            const currentConnection = datat[i];
            const nextConnection = datat[i + 1];
            let index = longestStationArray.indexOf(currentConnection.station);
            let index_n = longestStationArray.indexOf(nextConnection.station);

            let startX, startY, endX, endY;
            if (index == -1 || index_n == -1) {
                break;
            }
            if (axisFlip) {
                startX = ((stationWidth - 40) / (maxTime * 60 - minTime * 60)) * (translateTimeToMinutes(currentConnection.time) - minTime * 60) + getOffsetX(axisFlip);
                startY = (longestStationArray.indexOf(currentConnection.station) + 1) * stationHeight + getOffsetY(axisFlip);
                endX = ((stationWidth - 40) / (maxTime * 60 - minTime * 60)) * (translateTimeToMinutes(nextConnection.time) - minTime * 60) + getOffsetX(axisFlip);
                endY = (longestStationArray.indexOf(nextConnection.station) + 1) * stationHeight + getOffsetY(axisFlip);
            } else { //not axis flipped
                startX = (longestStationArray.indexOf(currentConnection.station) + 1) * stationWidth + getOffsetX(axisFlip);
                startY = (stationHeight / (maxTime * 60 - minTime * 60)) * (translateTimeToMinutes(currentConnection.time) - minTime * 60) + getOffsetY(axisFlip);
                endX = (longestStationArray.indexOf(nextConnection.station) + 1) * stationWidth + getOffsetX(axisFlip);
                endY = (stationHeight / (maxTime * 60 - minTime * 60)) * (translateTimeToMinutes(nextConnection.time) - minTime * 60) + getOffsetY(axisFlip);
            }

            if (i == 0) {
                drawStopCircleSVG(svg, startX, startY);
            }
            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', startX.toString());
            line.setAttribute('y1', startY.toString());
            line.setAttribute('x2', endX.toString());
            line.setAttribute('y2', endY.toString());
            line.setAttribute('stroke', 'black');
            svg.appendChild(line);

            drawStopCircleSVG(svg, endX, endY);
        }
    }
}

function drawPath(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.closePath();
    ctx.stroke();
}

function drawData(canvas: HTMLCanvasElement, data: Trip[], axisFlip: boolean, longestStationArray: String[],  maxD: number, xOff: number, yOff : number): void {
    const ctx = canvas.getContext('2d');

    if (ctx === null) {
        console.error('Canvas context is not supported.');
        return;
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    let stationHeight;
    let stationWidth;
    if (axisFlip) {
        stationHeight = (canvasHeight - yOff) / (longestStationArray.length + 1);
        stationWidth = (canvasWidth - xOff);
    } else { //not axis flipped
        stationHeight = canvasHeight - yOff;
        stationWidth = (canvasWidth - xOff) / (longestStationArray.length + 1);
    }
    ctx.strokeStyle = 'black';


    for (const trip of data) {
        let datat: StopTime[] = trip.stops;
        for (let i = 0; i < datat.length - 1; i++) {   //draw one trip
            const currentConnection = datat[i];
            const nextConnection = datat[i + 1];
            let index = longestStationArray.indexOf(currentConnection.station);
            let index_n = longestStationArray.indexOf(nextConnection.station);
            //console.log("index_ " + index + " index_n " + index_n);
            if (index == -1 || index_n == -1) {
                break;
            }
            //console.log("time: " + currentConnection.time + "currentConnection station " + currentConnection.station + "nextConnection station  " + nextConnection.station);
            let startX, startY, endX, endY;
            if (axisFlip) {
                startX = ((stationWidth - 40) / (maxTime * 60 - minTime * 60)) * (translateTimeToMinutes(currentConnection.time) - minTime * 60) + xOff;
                startY = (longestStationArray.indexOf(currentConnection.station) + 1) * stationHeight + yOff;
                endX = ((stationWidth - 40) / (maxTime * 60 - minTime * 60)) * (translateTimeToMinutes(nextConnection.time) - minTime * 60) + xOff;
                endY = (longestStationArray.indexOf(nextConnection.station) + 1) * stationHeight + yOff;
            } else { //not axis flipped
                startX = (longestStationArray.indexOf(currentConnection.station) + 1) * stationWidth + xOff;
                startY = (stationHeight / (maxTime * 60 - minTime * 60)) * (translateTimeToMinutes(currentConnection.time) - minTime * 60) + yOff;
                endX = (longestStationArray.indexOf(nextConnection.station) + 1) * stationWidth + xOff;
                endY = (stationHeight / (maxTime * 60 - minTime * 60)) * (translateTimeToMinutes(nextConnection.time) - minTime * 60) + yOff;

                //ctx.save();
            }
            drawPath(ctx, startX, startY, endX, endY);
            let x = i == 0 ? startX : endX;
            let y = i == 0 ? startY : endY;
            let connection = i == 0 ? currentConnection : nextConnection;
            drawStopCircle(canvas, x, y, trip.name, connection.station, connection.time);
        }
    }
}


export function generateSVG(data: Trip[], svg: SVGSVGElement, width: number, height: number, axisFlip: boolean) {


    minTime = findMinTime(data);
    //const minTimeMinutes = findMinTimeMinutes(timetable);
    //const maxTimeMinutes = findMaxTimeMinutes(timetable);
    maxTime = findMaxTime(data) + 1;

    drawGraphBackgroundSVG(svg, width, height, data, axisFlip);
    drawDataSVG(svg, data, width, height, axisFlip);
}

export function generateStringGraph(data: Trip[], axisFlip: boolean): void {
    const canvas = document.getElementById('graphCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    canvas.width = 1900
    canvas.height = 1080

    if (ctx === null) {
        console.error('Canvas context is not supported.');
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    minTime = findMinTime(data);
    maxTime = findMaxTime(data) + 1;

    let maxLength = 0;
    let longestStationArray: string[] = [];
    let longestStops: StopTime[] = [];
    let maxDistance = 0;
    for (let i = 0; i < data?.length; i++) {
        const stations = data[i].stations;
        const stops = data[i].stops;

        for (let j = 0; j < stops.length; j++) {
            const stop = stops[j];
            if (stop.distance > maxDistance) {
                maxDistance = stop.distance;
            }
        }

        if (stations.length > maxLength) {
            maxLength = stations.length;
            longestStationArray = stations;
            longestStops = stops;
        }
    }

    // Draw graph backdrop (labels, lines)
    drawGraphBackground(ctx, longestStops, axisFlip, longestStationArray, maxDistance, canvas, data);
}
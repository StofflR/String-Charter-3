import { Trip, StopTime} from "./interfaces.ts";
 let minTime = 0;
 let maxTime = 0;

function getOffsetX(axisFlip:boolean):number{
    if(axisFlip){
        return 240;
    }else{
        return 40;
    }
}
function getOffsetY(axisFlip:boolean):number{
    if(axisFlip){
        return 40;
    }else{
        return 170;
    }
}

function splitLongStationName(name:string):number{      //maybe better splitting like at , or space
    return Math.ceil(name.length/2);
}


function translateTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':');
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    return totalMinutes;
}

function findMinTime(timetable: Trip[]): number {
    let minTime: number = 23*60 + 59;
    let str: number = 0;
    if(timetable == null){
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

function drawStopCircle(canvas :HTMLCanvasElement, x :number, y: number, trip:string, stop:string, time:string): void{
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
        console.error('Canvas context is not supported.');
        return;
    }
    const radius: number = 3;

    ctx.beginPath();
    ctx.arc(x,y,radius, 0, 2* Math.PI, false);
    ctx.lineWidth = 1;
    ctx.stroke();
    createMouseOverStopInfo(canvas, x, y, radius, trip, stop, time);
}

function drawStopCircleSVG(svg:SVGSVGElement, x:number, y:number) : void{
  const radius: number = 3;
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x.toString());
  circle.setAttribute('cy', y.toString());
  circle.setAttribute('r', radius.toString());
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', 'black');
  svg.appendChild(circle);

}

function createMouseOverStopInfo(canvas: HTMLCanvasElement, posX:number, posY:number, rad:number, trip:string, stop:string, time:string): void{
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

    canvas.addEventListener('mousemove', (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    
        // Calculate the distance between the mouse coordinates and the center of the arc
        const distance = Math.sqrt(Math.pow(mouseX - posX, 2) + Math.pow(mouseY - posY, 2));
    
        // Check if the distance is within the arc radius
        if (distance <= rad) {
          stopDetailElement.textContent = trip+' stopping at: '+stop+ ', time: '+ time;
        }
      });
    
      canvas.addEventListener('mouseout', () => {
        stopDetailElement.textContent = ' --- hover over a stop to see details --- ';
      });


}

function drawGraphBackgroundSVG(svg:SVGSVGElement, width:number, height:number, data: Trip[], axisFlip:boolean): void{

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
    if(axisFlip){
        stationHeight = (height - getOffsetY(axisFlip)) / (longestStationArray.length + 1);
        stationWidth = (width - getOffsetX(axisFlip));
    }
    else{ //not axis flipped
        stationHeight = height - getOffsetY(axisFlip);
        stationWidth = (width - getOffsetX(axisFlip)) / (longestStationArray.length + 1);
    }
    if(axisFlip){
        //Vertical axis labels
        for(let i = 0; i < longestStationArray.length; i++){
            let stationName = longestStationArray[i];

            const y = (i + 1) * stationHeight;
            const textElement = document.createElementNS(svgNS, 'text');
            textElement.setAttribute('x', (getOffsetX(axisFlip)-20).toString());
            textElement.setAttribute('y', (y + getOffsetY(axisFlip)).toString());
            textElement.setAttribute('font-size', '12');
            textElement.setAttribute('fill', 'black');
            textElement.setAttribute('text-anchor', 'end');
            if(stationName.length < 33){
                textElement.textContent = stationName;
                svg.appendChild(textElement);
            }
            else{
                
                const splitPosition = splitLongStationName(stationName);
                textElement.textContent = stationName.slice(0,splitPosition);
                svg.appendChild(textElement);
                const secondLine = document.createElementNS(svgNS, 'text');
                secondLine.setAttribute('x', (getOffsetX(axisFlip)-20).toString());
                secondLine.setAttribute('y', (y + getOffsetY(axisFlip)+15).toString());
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
        for (let time = 0; time <= maxTime-minTime; time ++){
            const x = ((stationWidth-40)/(maxTime-minTime))*time;
            const textElement = document.createElementNS(svgNS, 'text');
            textElement.setAttribute('x', (x+getOffsetX(axisFlip)).toString());
            textElement.setAttribute('y', (getOffsetY(axisFlip)).toString());
            textElement.setAttribute('font-size', '12');
            textElement.setAttribute('fill', 'black');
            textElement.setAttribute('text-anchor', 'middle');
            let timeLabel:number = time + minTime;
            if(timeLabel >= 24){
                timeLabel -= 24
            }

            textElement.textContent = timeLabel.toString() + ':00';
            svg.appendChild(textElement);


            const lineElement = document.createElementNS(svgNS, 'line');
            lineElement.setAttribute('x1', (getOffsetX(axisFlip)+x).toString());
            lineElement.setAttribute('y1', (getOffsetY(axisFlip)+30).toString());
            lineElement.setAttribute('x2', (getOffsetX(axisFlip)+x).toString());
            lineElement.setAttribute('y2', (getOffsetY(axisFlip)+20).toString());
            lineElement.setAttribute('stroke', 'rgb(200, 200, 200)');
            svg.appendChild(lineElement);
        }

    }
    else{  //not axis flipped
        //Vertical axis
        for (let time = 0; time <= maxTime-minTime; time ++) {
            //Time label
            const y = (stationHeight / (maxTime-minTime)) * time;
            const textElement = document.createElementNS(svgNS, 'text');
            textElement.setAttribute('x', (getOffsetX(axisFlip)+5).toString());
            textElement.setAttribute('y', (y + getOffsetY(axisFlip)).toString());
            textElement.setAttribute('font-size', '12');
            textElement.setAttribute('fill', 'black');
            textElement.setAttribute('text-anchor', 'end');
            let timeLabel:number = time + minTime;
            if(timeLabel >= 24){
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

function drawGraphBackground(canvas:HTMLCanvasElement, data: Trip[], axisFlip:boolean): void{
    const ctx = canvas.getContext('2d');

    if (ctx === null) {
        console.error('Canvas context is not supported.');
        return;
    }

    let maxLength = 0;
    let longestStationArray: string[] = [];

    for (let i = 0; i < data?.length; i++) {
        const stations = data[i].stations;
        if (stations.length > maxLength) {
            maxLength = stations.length;
            longestStationArray = stations;
        }
    }
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    let stationHeight;
    let stationWidth;
    if(axisFlip){
        stationHeight = (canvasHeight - getOffsetY(axisFlip)) / (longestStationArray.length + 1);
        stationWidth = (canvasWidth - getOffsetX(axisFlip));
    }
    else{ //not axis flipped
        stationHeight = canvasHeight - getOffsetY(axisFlip);
        stationWidth = (canvasWidth - getOffsetX(axisFlip)) / (longestStationArray.length + 1);
    }



    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = `rgb(200, 200, 200)`;

    if(axisFlip){
        //Vertical axis labels
        for(let i = 0; i < longestStationArray.length; i++){
            let stationName = longestStationArray[i];

            const y = (i + 1) * stationHeight;
            ctx.textAlign = 'right';
            if(stationName.length >= 40){
                const splitPosition = splitLongStationName(stationName);
                ctx.fillText(stationName.slice(0,splitPosition), getOffsetX(axisFlip)-20, getOffsetY(axisFlip)+ y); // Adjust the position of the text as needed
                ctx.fillText(stationName.slice(splitPosition), getOffsetX(axisFlip)-20, getOffsetY(axisFlip)+ y+15); // Adjust the position of the text as needed
            }
            else{
                ctx.fillText(stationName, getOffsetX(axisFlip)-20, getOffsetY(axisFlip)+ y); // Adjust the position of the text as needed
            }

            ctx.beginPath();
            ctx.moveTo(getOffsetX(axisFlip)-10, y+getOffsetY(axisFlip));
            ctx.lineTo(canvasWidth, y+getOffsetY(axisFlip));
            ctx.stroke();
        }
        ctx.strokeStyle = 'black';
        for (let time = 0; time <= maxTime-minTime; time ++){
            const x = ((stationWidth-40)/(maxTime-minTime))*time;
            ctx.textAlign = "center";
            let timeLabel:number = time + minTime;
            if(timeLabel >= 24){
                timeLabel -= 24
            }
            ctx.fillText(timeLabel.toString() + ':00', getOffsetX(axisFlip)+x, getOffsetY(axisFlip));
            ctx.beginPath();
            ctx.moveTo(getOffsetX(axisFlip)+x, getOffsetY(axisFlip)+30);
            ctx.lineTo(getOffsetX(axisFlip)+x, getOffsetY(axisFlip)+20);
            ctx.stroke();
        }

    }
    else{ //not axis flipped
        // Draw vertical axis labels
        for (let time = 0; time <= maxTime-minTime; time ++) {
            const y = (stationHeight / (maxTime-minTime)) * time;
            ctx.textAlign = 'right';
            let timeLabel:number = time + minTime;
            if(timeLabel >= 24){
                timeLabel -= 24
            }
            ctx.fillText(timeLabel.toString() + ':00', getOffsetX(axisFlip), y +getOffsetY(axisFlip));
            ctx.beginPath();
            ctx.moveTo(getOffsetX(axisFlip)+10, y+getOffsetY(axisFlip));
            ctx.lineTo(canvasWidth, y+getOffsetY(axisFlip));
            ctx.stroke();
        }

        ctx.strokeStyle = 'black';
        const labelOffsetY = -70; // Adjust this value to control the vertical position of the labels
        // Draw horizontal axis labels
        /* for (let i = 0; i < stations.length; i++) {
            const x = (i + 1) * stationWidth;
            ctx.textAlign = 'center';
            ctx.fillText(stations[i] as string, x, getOffsetY(axisFlip)-40);
            ctx.beginPath();
            ctx.moveTo(x, getOffsetY(axisFlip)-30);
            ctx.lineTo(x, getOffsetY(axisFlip)-20);
            ctx.stroke();
        }*/

        // Draw diagonal axis labels
        for (let i = 0; i < longestStationArray.length; i++) {
            const stationName = longestStationArray[i];
            const x = (i + 1) * stationWidth;
            const y = labelOffsetY;

            ctx.translate(x, y);
            ctx.textAlign = 'left';
            ctx.rotate(-Math.PI / 4); // Rotate the text by -45 degrees (or any desired angle)
            ctx.fillText(stationName, -105, getOffsetY(axisFlip)+ 0); // Adjust the position of the text as needed
            ctx.rotate(Math.PI / 4); // Reset the rotation
            ctx.translate(-x, -y);
        }
    }

}

function drawDataSVG(svg:SVGSVGElement, data:Trip[], width:number, height:number, axisFlip:boolean):void{
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
    if(axisFlip){
        stationHeight = (height - getOffsetY(axisFlip)) / (longestStationArray.length + 1);
        stationWidth = (width - getOffsetX(axisFlip));
    }
    else{ //not axis flipped
        stationHeight = height - getOffsetY(axisFlip);
        stationWidth = (width - getOffsetX(axisFlip)) / (longestStationArray.length + 1);
    }


    for(const trip of data){
        let datat: StopTime[] = trip.stops;
        for (let i = 0; i < datat.length - 1; i++) {   //draw one trip

            const currentConnection = datat[i];
            const nextConnection = datat[i + 1];
            let index = longestStationArray.indexOf(currentConnection.station);
            let index_n = longestStationArray.indexOf(nextConnection.station);

            let startX, startY, endX, endY;
            if(index == -1 || index_n == -1)
            {
                break;
            }
            if(axisFlip){
                startX = ((stationWidth-40) / (maxTime*60-minTime*60)) * (translateTimeToMinutes(currentConnection.time)-minTime*60) + getOffsetX(axisFlip);
                startY = (longestStationArray.indexOf(currentConnection.station) + 1) * stationHeight + getOffsetY(axisFlip);
                endX = ((stationWidth-40) / (maxTime*60-minTime*60)) * (translateTimeToMinutes(nextConnection.time)-minTime*60)+getOffsetX(axisFlip);
                endY = (longestStationArray.indexOf(nextConnection.station) + 1) * stationHeight + getOffsetY(axisFlip);
            }
            else{ //not axis flipped
                startX = (longestStationArray.indexOf(currentConnection.station) + 1) * stationWidth + getOffsetX(axisFlip);
                startY = (stationHeight / (maxTime*60-minTime*60)) * (translateTimeToMinutes(currentConnection.time)-minTime*60) + getOffsetY(axisFlip);
                endX = (longestStationArray.indexOf(nextConnection.station) + 1) * stationWidth + getOffsetX(axisFlip);
                endY = (stationHeight / (maxTime*60-minTime*60)) * (translateTimeToMinutes(nextConnection.time)-minTime*60)+getOffsetY(axisFlip);
            }
            
            if(i == 0){
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

function drawData(canvas:HTMLCanvasElement, data: Trip[], axisFlip:boolean): void{
    const ctx = canvas.getContext('2d');
    let maxLength = 0;
    let longestStationArray: string[] = [];
    let holdbackStations: string[] = [];

    for (let i = 0; i < data?.length; i++) {
        const stations = data[i].stations;
        if (stations.length > maxLength) {
            maxLength = stations.length;
            longestStationArray = stations;
        }
    }
    if (ctx === null) {
        console.error('Canvas context is not supported.');
        return;
    }

    // Go through all trips and add stations that are not in the station array yet (longestStationArray).
    for (let i = 0; i < data?.length; i++) {
        const stations = data[i].stations;
        for (let j = 0; j < stations.length; j++) {
            const station = stations[j];
            if(!longestStationArray.includes(station)) {

                let prevprev = longestStationArray.indexOf(stations[j-2]);
                let prev = longestStationArray.indexOf(stations[j-1]);
                let next = longestStationArray.indexOf(stations[j+1]);
                
                if(prev == -1 && next == -1){
                    // The previous and next station are unknown, skip for later.
                    holdbackStations.push(station);
                } else if (next == prev + 1) {
                    // The previous and next station are known and right after each other.
                    // Add it in between.
                    longestStationArray.splice(prev+1, 0, station);
                } else if (prev == next + 1) {
                    // The previous and next station are known and right after each other.
                    // Add it in between (reverse order).
                    longestStationArray.splice(next+1, 0, station);
                } else if (prev == longestStationArray.length-1) {
                    // The previous station is the last station.
                    // Add it to the end.
                    longestStationArray.splice(prev+1, 0, station);
                } else if (prevprev != -1 && prev != -1 && prevprev > prev) {
                    // The previous two stations are known, but in different order.
                    // Add it after the second.
                    longestStationArray.splice(prev, 0, station);
                } else if (prevprev != -1 && next == -1) {
                    // The next station is unknown, but the previous and previous-previous station are known.
                    // Add it after the previous station.
                    longestStationArray.splice(prev+1, 0, station);
                } else if (prevprev != -1 && prev == -1) {
                    // The previous two stations are known.
                    // Add it after them.
                    longestStationArray.splice(next-1, 0, station);
                } else {
                    // No matching pattern found, keep the station name for later.
                    holdbackStations.push(station);
                }
            }
        }
    }

    // Add stations that didn't fit at the end.
    for (let i = 0; i < holdbackStations.length; i++) {
        if(!longestStationArray.includes(holdbackStations[i])) {
            longestStationArray.push(holdbackStations[i]);
        }
    }


    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    let stationHeight;
    let stationWidth;
    if(axisFlip){
        stationHeight = (canvasHeight - getOffsetY(axisFlip)) / (longestStationArray.length + 1);
        stationWidth = (canvasWidth - getOffsetX(axisFlip));
    }
    else{ //not axis flipped
        stationHeight = canvasHeight - getOffsetY(axisFlip);
        stationWidth = (canvasWidth - getOffsetX(axisFlip)) / (longestStationArray.length + 1);
    }
        ctx.strokeStyle = 'black';


    for(const trip of data){
      let datat: StopTime[] = trip.stops;
      for (let i = 0; i < datat.length - 1; i++) {   //draw one trip
        const currentConnection = datat[i];
        const nextConnection = datat[i + 1];
        let index = longestStationArray.indexOf(currentConnection.station);
        let index_n = longestStationArray.indexOf(nextConnection.station);
        //console.log("index_ " + index + " index_n " + index_n);
        if(index == -1 || index_n == -1)
        {
          break;
        }
        //console.log("time: " + currentConnection.time + "currentConnection station " + currentConnection.station + "nextConnection station  " + nextConnection.station);
        let startX, startY, endX, endY;
        if(axisFlip){
            startX = ((stationWidth-40) / (maxTime*60-minTime*60)) * (translateTimeToMinutes(currentConnection.time)-minTime*60) + getOffsetX(axisFlip);
            startY = (longestStationArray.indexOf(currentConnection.station) + 1) * stationHeight + getOffsetY(axisFlip);
            endX = ((stationWidth-40) / (maxTime*60-minTime*60)) * (translateTimeToMinutes(nextConnection.time)-minTime*60)+getOffsetX(axisFlip);
            endY = (longestStationArray.indexOf(nextConnection.station) + 1) * stationHeight + getOffsetY(axisFlip);
        }
        else{ //not axis flipped
            startX = (longestStationArray.indexOf(currentConnection.station) + 1) * stationWidth + getOffsetX(axisFlip);
            startY = (stationHeight / (maxTime*60-minTime*60)) * (translateTimeToMinutes(currentConnection.time)-minTime*60) + getOffsetY(axisFlip);
            endX = (longestStationArray.indexOf(nextConnection.station) + 1) * stationWidth + getOffsetX(axisFlip);
            endY = (stationHeight / (maxTime*60-minTime*60)) * (translateTimeToMinutes(nextConnection.time)-minTime*60)+getOffsetY(axisFlip);
    
            //ctx.save();
        }
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.closePath();
        ctx.stroke();
        if(i == 0){
            drawStopCircle(canvas, startX, startY, trip.name, currentConnection.station, currentConnection.time);
        }
        drawStopCircle(canvas, endX, endY, trip.name, nextConnection.station, nextConnection.time);
    }
  }
}



export function generateSVG(data: Trip[], svg:SVGSVGElement, width:number, height:number, axisFlip:boolean){


    minTime = findMinTime(data);
    //const minTimeMinutes = findMinTimeMinutes(timetable);
    //const maxTimeMinutes = findMaxTimeMinutes(timetable);
    maxTime = findMaxTime(data) +1;
    
    drawGraphBackgroundSVG(svg, width, height, data, axisFlip);
    drawDataSVG(svg, data, width, height, axisFlip);
}

export function generateStringGraph(data: Trip[], axisFlip:boolean): void {
    const canvas = document.getElementById('graphCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx === null) {
        console.error('Canvas context is not supported.');
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    minTime = findMinTime(data);
    maxTime = findMaxTime(data) +1;

    // Draw lines
    drawData(canvas, data, axisFlip);
    // Draw graph backdrop (labels, lines)
    drawGraphBackground(canvas, data, axisFlip);
}
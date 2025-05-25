import { Trip, StopTime} from "./interfaces.ts";
import {CanvasGenerator} from "./src/CanvasGenerator.ts";
import {SVGGenerator} from "./src/SVGGenerator.ts";

let eventHandlers: ((event: MouseEvent) => void)[] = [];


export function generateSVG(data: Trip[], svg:SVGSVGElement, width:number, height:number, axisFlip:boolean){
    let svgGen = new SVGGenerator(svg, width, height, data, axisFlip);
    svgGen.generate();
}

export function generateStringGraph(data: Trip[], axisFlip:boolean): void {
    const canvas = document.getElementById('graphCanvas') as HTMLCanvasElement;
    canvas.width = 1900;
    canvas.height = 1080;
    if (!canvas) {
        console.error('Canvas element not found.');
        return;
    }
    let canvasGenerator = new CanvasGenerator(canvas, eventHandlers, data, axisFlip);
    canvasGenerator.resetEventHandlers();
    canvasGenerator.generate();
    eventHandlers = canvasGenerator.getEventHandlers();
}
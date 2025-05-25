import {Trip} from "./interfaces";
import {CanvasGenerator} from "./CanvasGenerator";
import {SVGGenerator} from "./SVGGenerator";

let canvasGenerator: CanvasGenerator | null = null;


export function generateSVG(data: Trip[], svg: SVGSVGElement, axisFlip: boolean) {
    let svgGen = new SVGGenerator(svg, data, axisFlip);
    svgGen.generate();
}

export function generateStringGraph(data: Trip[], axisFlip: boolean): void {
    if (canvasGenerator)
        canvasGenerator.resetEventHandlers();

    const canvas = document.getElementById('graphCanvas') as HTMLCanvasElement;
    canvas.width = 1900;
    canvas.height = 1080;
    if (!canvas) {
        console.error('Canvas element not found.');
        return;
    }
    canvasGenerator = new CanvasGenerator(canvas, data, axisFlip);
    canvasGenerator.generate();
}
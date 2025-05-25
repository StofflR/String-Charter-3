import {Trip} from "../interfaces.ts";
import {StringChartGenerator} from "./StringChartGenerator.ts";

export class SVGGenerator extends StringChartGenerator {
    private readonly svg: SVGSVGElement;
    readonly width: number;
    readonly height: number;
    private readonly svgNS = 'http://www.w3.org/2000/svg';
    public stroke = 'black';

    constructor(svg: SVGSVGElement, width: number, height: number, data: Trip[], axisFlip: boolean) {
        super(data, axisFlip);
        this.svg = svg;
        this.width = width;
        this.height = height;
    }

    public getHeight(): number {
        return this.height;
    }

    public getWidth(): number {
        return this.width;
    }


    public override drawStopCircle(x: number, y: number, trip: string, stop: string, time: string): void {
        const circle = document.createElementNS(this.svgNS, 'circle');
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', this.radius.toString());
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'black');
        this.svg.appendChild(circle);
    }

    public override drawLine(startX: number, startY: number, endX: number, endY: number) {
        let line = document.createElementNS(this.svgNS, 'line');
        line.setAttribute('x1', startX.toString());
        line.setAttribute('y1', startY.toString());
        line.setAttribute('x2', endX.toString());
        line.setAttribute('y2', endY.toString());
        line.setAttribute('stroke', this.stroke);
        this.svg.appendChild(line);
    }

    public override drawData() {
        this.stroke = 'black';
        super.drawData();
    }

    public override drawBackground() {
        this.stroke = `rgb(200, 200, 200)`;
        super.drawBackground();
    }

    public override drawDiagonalText(x: number, y: number, stationName: string) {
        const textElement = document.createElementNS(this.svgNS, 'text');
        textElement.setAttribute('x', x.toString());
        textElement.setAttribute('y', (y + this.getOffsetY()).toString());
        textElement.setAttribute('font-size', '12');
        textElement.setAttribute('fill', 'black');
        textElement.setAttribute('text-anchor', 'start');
        textElement.setAttribute('transform', `rotate(-45 ${x.toString()},${(y + this.getOffsetY()).toString()})`);
        textElement.textContent = stationName;
        this.svg.appendChild(textElement);
    }

    public override drawText(text: string, x: number, y: number, alignment: string = 'middle'): void {
        const textElement = document.createElementNS(this.svgNS, 'text');
        textElement.setAttribute('x', (x).toString());
        textElement.setAttribute('y', (y).toString());
        textElement.setAttribute('font-size', '12');
        textElement.setAttribute('fill', 'black');
        textElement.setAttribute('text-anchor', alignment);
        textElement.textContent = text;
        this.svg.appendChild(textElement);
    }
}
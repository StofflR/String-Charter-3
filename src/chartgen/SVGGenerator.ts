import {Trip} from "../interfaces.ts";
import {StringChartGenerator} from "./StringChartGenerator.ts";

export class SVGGenerator extends StringChartGenerator {
    private readonly svg: SVGSVGElement;
    readonly width: number;
    readonly height: number;
    private readonly svgNS = 'http://www.w3.org/2000/svg';
    public stroke = 'black';
    private xTrans: string = "0";
    private yTrans: string = "0";

    constructor(svg: SVGSVGElement, data: Trip[], axisFlip: boolean) {
        super(data, axisFlip);
        this.svg = svg;
        this.width = this.getDynamicWidth() + this.getOffsetX() + this.getOffsetY();
        this.height = this.getDynamicHeight() + this.getOffsetX() + this.getOffsetY();
        svg.setAttribute('viewBox', "0 0 " + this.width + " " + this.height);
    }

    public getHeight(): number {
        return this.height - (this.getOffsetX() + this.getOffsetY());
    }

    public getWidth(): number {
        return this.width - (this.getOffsetX() + this.getOffsetY());
    }

    private toString(value: number): string {
        return value.toFixed(4);
    }

    protected override drawStopCircle(x: number, y: number, _trip: string, _stop: string, _time: string, color: string = "black"): void {
        const circle = document.createElementNS(this.svgNS, 'circle');
        circle.setAttribute('cx', this.toString(x));
        circle.setAttribute('cy', this.toString(y));
        circle.setAttribute('r', this.toString(this.radius));
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', color);
        circle.setAttribute('transform', this.getTransformString());
        this.svg.appendChild(circle);
    }

    protected override drawLine(startX: number, startY: number, endX: number, endY: number, color: string = "black") {
        let line = document.createElementNS(this.svgNS, 'line');
        line.setAttribute('x1', this.toString(startX));
        line.setAttribute('y1', this.toString(startY));
        line.setAttribute('x2', this.toString(endX));
        line.setAttribute('y2', this.toString(endY));
        line.setAttribute('stroke', color);
        line.setAttribute('transform', this.getTransformString());
        this.svg.appendChild(line);
    }

    protected override drawData() {
        this.stroke = 'black';
        super.drawData();
    }

    protected override drawDiagonalText(x: number, y: number, stationName: string) {
        const textElement = document.createElementNS(this.svgNS, 'text');
        textElement.setAttribute('x', this.toString(x));
        textElement.setAttribute('y', this.toString(y + this.getOffsetY()));
        textElement.setAttribute('font-size', '12');
        textElement.setAttribute('fill', 'black');
        textElement.setAttribute('text-anchor', 'start');
        textElement.setAttribute('transform', `rotate(-45 ${this.toString(x)},${this.toString(y + this.getOffsetY())})` + this.getTransformString());
        textElement.textContent = stationName;
        this.svg.appendChild(textElement);
    }

    protected override drawText(text: string, x: number, y: number, alignment: string = 'middle'): void {
        const textElement = document.createElementNS(this.svgNS, 'text');
        textElement.setAttribute('x', this.toString(x));
        textElement.setAttribute('y', this.toString(y));
        textElement.setAttribute('font-size', '12');
        textElement.setAttribute('fill', 'black');
        textElement.setAttribute('text-anchor', alignment);
        textElement.setAttribute('transform', this.getTransformString());
        textElement.textContent = text;
        this.svg.appendChild(textElement);
    }

    private getTransformString(): string {
        return "translate(" + this.xTrans + "," + this.yTrans + ")";
    }

}
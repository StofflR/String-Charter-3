import {Tripstyle, StrokeDashPattern, Trip} from "../interfaces.ts";
import {StringChartGenerator} from "./StringChartGenerator.ts";
import xmlFormat from 'xml-formatter';
import saveAs from 'file-saver';

let svgNS: string = 'http://www.w3.org/2000/svg';

export class SVGGenerator extends StringChartGenerator {
    private svg: Element;
    readonly width: number;
    readonly height: number;
    public stroke = 'black';

    constructor(data: Trip[], axisFlip: boolean, colors: Tripstyle[] = [], radius: number, strokewidth: number, compare: boolean, diagonalTilt: number = -45, geographicScale: number = 100, sanitize: boolean = true) {
        super(data, axisFlip, colors, radius, strokewidth, compare, diagonalTilt, geographicScale, sanitize);
        this.svg = document.createElementNS(svgNS, 'svg');
        this.width = this.getDynamicWidth() + this.getOffsetX() + this.getOffsetY();
        this.height = this.getDynamicHeight() + this.getOffsetX() + this.getOffsetY();
    }

    public getHeight(): number {
        let scale = this.axisFlip ? this.geographicScale / 100 : 1;
        return this.height * scale - (this.getOffsetX() + this.getOffsetY());
    }

    public getWidth(): number {
        let scale = !this.axisFlip ? this.geographicScale / 100 : 1;
        return this.width * scale - (this.getOffsetX() + this.getOffsetY());
    }

    protected override drawStopCircle(x: number, y: number, _trip: string, _stop: string, _time: string, color: string = "black"): void {
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', this.format(x))
        circle.setAttribute('cy', this.format(y))
        circle.setAttribute('r', this.format(this.radius))
        circle.setAttribute('fill', color)
        circle.setAttribute('stroke', color)
        this.svg.appendChild(circle);
    }

    protected override drawLine(startX: number, startY: number, endX: number, endY: number, color: string = "black", _strokewidth: number = 3, _strockdash = StrokeDashPattern.Solid) {
        let line = document.createElementNS(svgNS, 'path');
        line.setAttribute('stroke-dasharray', this.getStrokeDashPattern(_strockdash, _strokewidth));
        line.setAttribute('stroke-width', String(_strokewidth));
        line.setAttribute('stroke', color);
        line.setAttribute('d', `M ${this.format(startX)} ${this.format(startY)} L ${this.format(endX)} ${this.format(endY)}`);
        this.svg.appendChild(line);
    }

    protected override drawData() {
        this.stroke = 'black';
        super.drawData();
    }

    protected override drawDiagonalText(x: number, y: number, stationName: string) {
        const textElement = document.createElementNS(svgNS, 'text');
        textElement.setAttribute('x', this.format(x));
        textElement.setAttribute('y', this.format(y + this.getOffsetY()));
        textElement.setAttribute('font-size', '12');
        textElement.setAttribute('fill', 'black');
        textElement.setAttribute('text-anchor', 'start');
        textElement.setAttribute('transform', `rotate(${this.diagonalTilt.toString()} ${this.format(x)},${this.format(y + this.getOffsetY())})`);
        textElement.textContent = stationName;
        this.svg.appendChild(textElement);
    }

    protected override drawText(text: string, x: number, y: number, alignment: string = 'middle'): void {
        const textElement = document.createElementNS(svgNS, 'text');
        textElement.setAttribute('x', this.format(x));
        textElement.setAttribute('y', this.format(y));
        textElement.setAttribute('text-anchor', alignment || 'start');
        textElement.setAttribute('dominant-baseline', 'middle');
        textElement.setAttribute('font-size', '12');
        textElement.setAttribute('fill', 'black');
        textElement.textContent = text;
        this.svg.appendChild(textElement);
    }

    public async exportAsSVG() {
        this.svg = document.createElementNS(svgNS, 'svg');
        this.svg.setAttribute('viewBox', "0 0 " + this.format(this.getOffsetX() + this.getWidth()) + " " + this.format(this.getOffsetY() + this.getHeight()));
        this.generate();
        // pretty print the SVG
        const mimeType: string = 'image/svg+xml';
        const svgData = xmlFormat(new XMLSerializer().serializeToString(this.svg));
        const blob = new Blob([svgData], {type: mimeType});

        // check if showSaveFilePicker is supported
        if (!('showSaveFilePicker' in window)) {
            saveAs(blob, 'chart.svg');
            return;
        }

        // currently not widely supported, but can be used in modern browsers
        const handle = await window.showSaveFilePicker({
            suggestedName: 'chart.svg',
            types: [{
                description: 'SVG file',
                accept: {"image/*": ['.svg']},
            }],
        });

        const writableStream = await handle.createWritable();
        await writableStream.write(blob);
        await writableStream.close();
    }
}
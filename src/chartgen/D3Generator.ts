import * as d3 from "d3";
import { Trip } from "../interfaces.ts";
import { StringChartGenerator } from "./StringChartGenerator.ts";

export class D3Generator extends StringChartGenerator {
    public svg: d3.Selection<SVGSVGElement, undefined, null, undefined> | undefined;
    protected container;
    protected width: number;
    protected height: number;
    protected geographicScale: number;
    protected diagonalTilt: number;
    protected stopCirlces: { x: number, y: number, trip: string, stop: string, time: string, color: string }[] = [];
    protected format = d3.format(".2f");

    public getHeight(): number {
        let scale = this.axisFlip ? this.geographicScale / 100 : 1;
        return this.height * scale - (this.getOffsetX() + this.getOffsetY());
    }

    public getWidth(): number {
        let scale = !this.axisFlip ? this.geographicScale / 100 : 1;
        return this.width * scale - (this.getOffsetX() + this.getOffsetY());
    }

    constructor(data: Trip[], axisFlip: boolean, compare: boolean, diagonalTilt: number = -45, geographicScale: number = 100, sanitize: boolean = true) {
        super(data, axisFlip, compare, sanitize);
        this.geographicScale = geographicScale;
        this.width = this.getDynamicWidth() + this.getOffsetX() + this.getOffsetY();
        this.height = this.getDynamicHeight() + this.getOffsetX() + this.getOffsetY();
        this.diagonalTilt = diagonalTilt;
        this.container = document.getElementById("graphCanvas") as HTMLDivElement;
        if (!this.container) {
            console.error('Container with id "graphCanvas" not found.');
            return;
        }
        this.container.innerHTML = '';
        this.svg = d3.create('svg');
        if (!this.svg || !this.svg.node()) {
            console.error('Failed to create SVG element.');
            return;
        }
        this.svg.attr('class', 'flex w-full h-full');
        this.svg.attr('id', 'svgGraph');
        this.container.append(this.svg.node()!);
    }

    protected override drawLine(_startX: number, _startY: number, _endX: number, _endY: number, _color: string = "black") {
        if (!this.svg) {
            console.error('SVG element not initialized.');
            return;
        }
        this.svg.append('path')
            .attr('stroke-width', 3)
            .attr('stroke', _color)
            .attr('d', `M ${this.format(_startX)} ${this.format(_startY)} L ${this.format(_endX)} ${this.format(_endY)}`);
    }

    protected override drawText(_text: string, _x: number, _y: number, _alignment?: string): void {
        if (!this.svg) {
            console.error('SVG element not initialized.');
            return;
        }
        this.svg.append('text')
            .attr('x', this.format(_x))
            .attr('y', this.format(_y))
            .text(_text)
            .attr('text-anchor', _alignment || 'start')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '12px')
            .attr('fill', 'black');
    }

    protected drawStopCircle(_x: number, _y: number, _trip: string, _stop: string, _time: string, _color: string = "") {
        // save stop circles to list draw after all lines are drawn
        this.stopCirlces.push({
            x: _x,
            y: _y,
            trip: _trip,
            stop: _stop,
            time: _time,
            color: _color
        })
    }

    private _drawStopCircle(_x: number, _y: number, _trip: string, _stop: string, _time: string, _color: string = "black"): void {
        if (!this.svg) {
            console.error('SVG element not initialized.');
            return;
        }
        this.svg.append('circle')
            .attr('cx', this.format(_x))
            .attr('cy', this.format(_y))
            .attr('r', this.format(this.radius))
            .attr('fill', _color)
            .attr('stroke', _color)
            .on('mouseover', () => {


                d3.select('#tooltip').remove();
                d3.select('#tooltip-trip').remove();
                d3.select('#tooltip-stop').remove();
                d3.select('#tooltip-time').remove();

                //calculate box with based on string lenght
                const boxWidth = Math.max(100, Math.max(
                    _trip.length * 10,
                    _stop.length * 10,
                    _time.length * 10
                ));
                if (!this.svg) {
                    console.error('SVG element not initialized.');
                    return;
                }
                //add tooltip as rectangle to svg
                this.svg.append('rect')
                    .attr('id', 'tooltip')
                    .attr('x', _x + 10)
                    .attr('y', _y - 25)
                    .attr('width', boxWidth)
                    .attr('height', 50)
                    .attr('fill', 'white')
                    .attr('stroke', 'black')
                    .attr('rx', 5)
                    .attr('ry', 5);

                // add trip name
                this.svg.append('text')
                    .attr('id', 'tooltip-trip')
                    .attr('x', _x + 15)
                    .attr('y', _y - 10)
                    .attr('font-style', 'bold')
                    .text('Trip: ')
                    .append('tspan')
                    .text(_trip)
                    .attr('font-weight', 'normal');
                //add stop name
                this.svg.append('text')
                    .attr('id', 'tooltip-stop')
                    .attr('x', _x + 15)
                    .attr('y', _y + 5)
                    .text('Stop: ')
                    .append('tspan')
                    .text(_stop)
                    .attr('font-weight', 'normal');
                //add time
                this.svg.append('text')
                    .attr('id', 'tooltip-time')
                    .attr('x', _x + 15)
                    .attr('y', _y + 20)
                    .text('Time: ')
                    .append('tspan')
                    .text(_time)
                    .attr('font-weight', 'normal');
            })
            .on('mouseout', () => {
                // remove tooltip
                d3.select('#tooltip').remove();
                d3.select('#tooltip-trip').remove();
                d3.select('#tooltip-stop').remove();
                d3.select('#tooltip-time').remove();
            });

    }

    protected override drawDiagonalText(_x: number, _y: number, _stationName: string): void {
        if (!this.svg) {
            console.error('SVG element not initialized.');
            return;
        }
        this.svg.append('text')
            .attr('x', this.format(_x))
            .attr('y', this.format(_y + this.getOffsetY()))
            .attr('font-size', '12px')
            .attr('fill', 'black')
            .attr('text-anchor', 'start')
            .attr('transform', `rotate(${this.diagonalTilt.toString()} ${this.format(_x)},${this.format(_y + this.getOffsetY())})`)
            .text(_stationName);
    }

    override generate() {
        super.generate();
        for (const circle of this.stopCirlces) {
            this._drawStopCircle(circle.x, circle.y, circle.trip, circle.stop, circle.time, circle.color);
        }
    }

    updateViewBox(offsetX: number, offsetY: number, viewBoxX: number, viewBoxY: number) {
        if (!this.svg) {
            console.error('SVG element not initialized.');
            return;
        }
        this.svg.attr("viewBox", `${offsetX} ${offsetY} ${viewBoxX} ${viewBoxY}`);
    }
}
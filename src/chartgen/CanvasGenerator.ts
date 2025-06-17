import {Trip} from "../interfaces.ts";
import {StringChartGenerator} from "./StringChartGenerator.ts";

export class CanvasGenerator extends StringChartGenerator {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private readonly stopDetailElement: HTMLElement | null = document.getElementById('stop-detail');
    private eventHandlers: ((event: MouseEvent) => void)[] = [];

    constructor(canvas: HTMLCanvasElement, data: Trip[] = [], axisFlip: boolean, colors: { keys: string; color: string; }[], radius: number, strokewidth: number) {
        super(data, axisFlip, colors, radius, strokewidth, false, -45, 100, true);
        this.canvas = canvas;
        this.canvas.width = this.getDynamicWidth() + this.getOffsetX() + this.getOffsetY();
        this.canvas.height = this.getDynamicHeight() + this.getOffsetX() + this.getOffsetY();
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        if (!this.stopDetailElement) {
            this.stopDetailElement = document.createElement('stop-detail');
        }
    }

    public getHeight(): number {
        return this.canvas.height - (this.getOffsetX() + this.getOffsetY());
    }

    public getWidth(): number {
        return this.canvas.width - (this.getOffsetX() + this.getOffsetY());
    }

    public resetEventHandlers(): void {
        for (let eventHandler of this.eventHandlers) {
            this.canvas.removeEventListener('mousemove', eventHandler);
        }
        this.eventHandlers = [];
    }

    protected override drawStopCircle(x: number, y: number, trip: string, stop: string, time: string, color: string = "black"): void {
        this.context.beginPath();
        this.context.arc(x, y, this.radius, 0, 2 * Math.PI, false);
        this.context.lineWidth = 1;
        this.context.strokeStyle = color;
        this.context.stroke();
        this.createMouseOverStopInfo(x, y, trip, stop, time);
    }

    protected override drawLine(startX: number, startY: number, endX: number, endY: number, color: string = "black", _strokewidth: number = 3) {
        this.context.beginPath();
        this.context.moveTo(startX, startY);
        this.context.lineTo(endX, endY);
        this.context.closePath();
        this.context.strokeStyle = color;
        this.context.lineWidth = _strokewidth;
        this.context.stroke();
    }

    protected override drawData() {
        this.context.strokeStyle = 'black';
        super.drawData();
    }

    protected override drawLabels() {
        this.context.font = '12px Arial';
        this.context.fillStyle = 'black';
        this.context.strokeStyle = `black`;
        super.drawLabels();
    }

    protected override drawDiagonalText(x: number, y: number, stationName: string) {
        this.context.translate(x, y);
        this.context.textAlign = 'left';
        this.context.rotate(-Math.PI / 4); // Rotate the text by -45 degrees (or any desired angle)
        this.context.fillText(stationName, -105, this.getOffsetY()); // Adjust the position of the text as needed
        this.context.rotate(Math.PI / 4); // Reset the rotation
        this.context.translate(-x, -y);
    }

    protected override drawText(text: string, x: number, y: number, alignment: CanvasTextAlign = 'center'): void {
        this.context.textAlign = alignment;
        this.context.fillText(text, x, y);
    }

    private createMouseOverStopInfo(posX: number, posY: number, trip: string, stop: string, time: string): void {
        // let windowVisible = false;
        const relativeX = posX / this.canvas.width;
        const relativeY = posY / this.canvas.height;

        let mouseOverHandler: (event: MouseEvent) => void;
        mouseOverHandler = (event: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            const relativeMouseX = mouseX / rect.width;
            const relativeMouseY = mouseY / rect.height;

            // Calculate the distance between the mouse coordinates and the center of the arc
            const distance = Math.sqrt(Math.pow(relativeMouseX - relativeX, 2) + Math.pow(relativeMouseY - relativeY, 2)) * ( this.canvas.width + this.canvas.height ) / 2;

            // Check if the distance is within the arc radius
            if (distance <= 2*this.radius && this.stopDetailElement) {
                this.stopDetailElement.textContent = trip + ' stopping at: ' + stop + ', time: ' + time;
            }
        };
        this.eventHandlers.push(mouseOverHandler);
        this.canvas.addEventListener('mousemove', mouseOverHandler);

        this.canvas.addEventListener('mouseout', () => {
            if (this.stopDetailElement)
                this.stopDetailElement.textContent = ' --- hover over a stop to see details --- ';
        });
    }
}
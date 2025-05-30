import {RelativeStop, Trip} from "../interfaces";
import {
    splitLongStationName
} from "../Utility";
import {RelativeTrips} from "./RelativeTrips";

export class StringChartGenerator {
    readonly data: RelativeTrips;
    readonly axisFlip: boolean = false;
    readonly radius: number = 5;

    constructor(data: Trip[] = [], axisFlip: boolean = false) {
        this.data = new RelativeTrips(data);
        this.axisFlip = axisFlip;

    }

    protected getDynamicWidth(){
        if(this.axisFlip){
            const timeDiff = this.data.maxTime - this.data.minTime;
            return timeDiff / 60 * 100;
        }else {
            return this.data.allStations.length * 150;
        }

    }

    protected getDynamicHeight(){
        if(!this.axisFlip){
            const timeDiff = this.data.maxTime - this.data.minTime;
            return timeDiff / 60 * 100;
        }else {
            return this.data.allStations.length * 150;
        }
    }

    protected getOffsetX(): number {
        if (this.axisFlip) {
            return 240;
        } else {
            return 80;
        }
    }

    protected getOffsetY(): number {
        if (this.axisFlip) {
            return 80;
        } else {
            return 170;
        }
    }

    protected drawLabels() {
        this.drawXLabels();
        this.drawYLabels();
    }

    private drawBackgroundLine(_startX: number, _startY: number, _endX: number, _endY: number): void {
        this.drawLine(_startX, _startY, _endX, _endY, 'lightgray');
    }

    private getRelX(connection: RelativeStop) {
        return this.axisFlip ? connection.time : connection.distance;
    }

    private getRelY(connection: RelativeStop) {
        return this.axisFlip ? connection.distance : connection.time;
    }

    protected drawData(): void {
        this.drawLine(this.getOffsetX() - 40, this.getOffsetY() - 20, this.getOffsetX() + 40 + this.getWidth(), this.getOffsetY() - 20);
        this.drawLine(this.getOffsetX() - 20, this.getOffsetY() - 40, this.getOffsetX() - 20, this.getHeight() + 20 + this.getOffsetY());
        for (const trip of this.data.relative_trips) {
            let color: string = "black";
            if (['RJ', 'RJX'].includes(trip.traintype))
                color = '#ca2e35';
            if (['IC', 'ICE', 'EC', 'NJ'].includes(trip.traintype))
                color = '#e8002a';
            if (['R', "REX", "CJX"].includes(trip.traintype))
                color = '#0060aa';
            if (['S'].includes(trip.traintype))
                color = '#0097d9';

            let relativeStops = trip.stops;
            for (let i = 0; i < relativeStops.length - 1; i++) {   //draw one trip
                const currentConnection = relativeStops[i];
                const nextConnection = relativeStops[i + 1];

                let startX = this.getRelX(currentConnection) * this.getWidth() + this.getOffsetX();
                let endX = this.getRelX(nextConnection) * this.getWidth() + this.getOffsetX();


                let startY = this.getRelY(currentConnection) * this.getHeight() + this.getOffsetY();
                let endY = this.getRelY(nextConnection) * this.getHeight() + this.getOffsetY();

                this.drawLine(startX, startY, endX, endY)
                if (i == 0) {
                    this.drawStopCircle(startX, startY, trip.name, currentConnection.station, currentConnection.timeLabel, color);
                }
                this.drawStopCircle(endX, endY, trip.name, nextConnection.station, nextConnection.timeLabel, color);
            }
        }
    }

    protected drawLine(_startX: number, _startY: number, _endX: number, _endY: number, _color: string = ""): void {
        // This method should be overridden in subclasses to draw the line
        throw ('drawLine method not implemented');
    }

    protected drawStopCircle(_x: number, _y: number, _trip: string, _stop: string, _time: string, _color: string = ""): void {
        // This method should be overridden in subclasses to draw the stop circle
        throw ('drawStopCircle method not implemented');
    }

    public getHeight(): number {
        // This method should be overridden in subclasses to return the height of the chart
        throw ('getHeight method not implemented');
    }

    public getWidth(): number {
        // This method should be overridden in subclasses to return the width of the chart
        throw ('getWidth method not implemented');
    }

    public generate(): void {
        this.drawLabels();
        this.drawData();
    }

    protected drawText(_text: string, _x: number, _y: number, _alignment = ""): void {
        throw ('drawText method not implemented');
    }

    protected drawDiagonalText(_x: number, _y: number, _stationName: string) {
        throw ('drawDiagonalText method not implemented');
    }

    private drawXLabels() {

        if (this.axisFlip) {
            // time
            for (let i = this.data.minTime; i <= this.data.maxTime + 30; i += 60) {
                const timeLabel = `${Math.floor(i / 60).toString().padStart(2, '0')}:${(i % 60).toString().padStart(2, '0')}`;
                const xPosition = (i - this.data.minTime) / (this.data.maxTime - this.data.minTime) * this.getWidth() + this.getOffsetX();
                this.drawText(timeLabel, xPosition, this.getOffsetY() / 2, 'center');
            }
        } else {
            // stations
            for (let i = 0; i < this.data.allStations.length; i++) {
                const stationName = this.data.allStations[i];
                const xPosition = this.data.allStationDistances.get(stationName)! * this.getWidth();
                const yPosition = -this.getOffsetY() / 2;
                this.drawBackgroundLine(xPosition + this.getOffsetX(), this.getOffsetY() - 20, xPosition + this.getOffsetX(), this.getHeight() + this.getOffsetY());

                if (stationName.length > 20) {
                    const splitIndex = splitLongStationName(stationName);
                    const firstPart = stationName.slice(0, splitIndex);
                    const secondPart = stationName.slice(splitIndex);
                    this.drawDiagonalText(xPosition + this.getOffsetX() / 2, yPosition, firstPart);
                    this.drawDiagonalText(xPosition + this.getOffsetX() / 2, yPosition + 15, secondPart);
                } else {
                    this.drawDiagonalText(xPosition + this.getOffsetX() / 2, yPosition, stationName);
                }
            }
        }
    }

    private drawYLabels() {
        if (this.axisFlip) {
            // stations
            for (let i = 0; i < this.data.allStations.length; i++) {
                const stationName = this.data.allStations[i];
                const xPosition = this.getOffsetX() - 30;
                const yPosition = this.data.allStationDistances.get(stationName)! * this.getHeight() + this.getOffsetY();
                this.drawBackgroundLine(this.getOffsetX() - 20, yPosition, this.getOffsetX() + this.getWidth(), yPosition);

                if (stationName.length > 50) {
                    const splitIndex = splitLongStationName(stationName);
                    const firstPart = stationName.slice(0, splitIndex);
                    const secondPart = stationName.slice(splitIndex);
                    this.drawText(firstPart, xPosition, yPosition - 10, 'end');
                    this.drawText(secondPart, xPosition, yPosition + 5, 'end');
                } else {
                    this.drawText(stationName, xPosition, yPosition, 'end');
                }
            }
        } else {
            // time
            for (let i = this.data.minTime; i <= this.data.maxTime + 30; i += 60) {
                const timeLabel = `${Math.floor(i / 60).toString().padStart(2, '0')}:${(i % 60).toString().padStart(2, '0')}`;
                const yPosition = (i - this.data.minTime) / (this.data.maxTime - this.data.minTime) * this.getHeight();
                this.drawText(timeLabel, this.getOffsetX() - 30, yPosition + this.getOffsetY(), 'end');
            }
        }
    }
}
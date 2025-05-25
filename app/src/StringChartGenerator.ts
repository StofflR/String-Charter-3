import {StopTime, Trip} from "../interfaces.ts";
import {
    getAllStations,
    splitLongStationName,
    findMaxDistance,
    findMaxTime,
    findMinTime,
    translateTimeToMinutes
} from "./Utility.ts";

export class StringChartGenerator {
    readonly data: Trip[];
    readonly minTime: number = 0;
    readonly maxTime: number = 0;
    readonly axisFlip: boolean = false;
    readonly radius: number = 3;
    readonly allStations: string[];
    readonly maxDistance: number = 0;
    readonly allStationDistances: number[] = [];

    constructor(data: Trip[] = [], axisFlip: boolean = false) {
        this.data = data;
        this.minTime = findMinTime(data);
        this.maxTime = findMaxTime(data) + 1;
        this.axisFlip = axisFlip;
        this.allStations = getAllStations(data);
        this.maxDistance = findMaxDistance(data);
        this.allStationDistances = this.allStations.map(station => {
            const trip = this.data.find(t => t.stops.some(s => s.station === station));
            if (trip) {
                const stop = trip.stops.find(s => s.station === station);
                return stop ? stop.distance : 0;
            }
            return 0;
        });
    }

    public getPxPerDistance(): number {
        if (this.axisFlip) {
            return (this.getWidth() - this.getOffsetX()) / this.maxDistance;
        } else {
            return (this.getHeight() - this.getOffsetY()) / this.maxDistance;
        }
    }

    public getOffsetX(): number {
        if (this.axisFlip) {
            return 240;
        } else {
            return 40;
        }
    }

    public getOffsetY(): number {
        if (this.axisFlip) {
            return 40;
        } else {
            return 170;
        }
    }

    public drawBackground(): void {

        let stationHeight;
        let stationWidth;

        if (this.axisFlip) {
            stationHeight = (this.getHeight() - this.getOffsetY()) / (this.allStations.length + 1);
            stationWidth = (this.getWidth() - this.getOffsetX());
        } else { //not axis flipped
            stationHeight = this.getHeight() - this.getOffsetY();
            stationWidth = (this.getWidth() - this.getOffsetX()) / (this.allStations.length + 1);
        }


        if (this.axisFlip) {
            //Vertical axis labels
            for (let i = 0; i < this.allStations.length; i++) {
                let stationName = this.allStations[i];
                const y = (i + 1) * stationHeight;
                if (stationName.length >= 40) {
                    const splitPosition = splitLongStationName(stationName);
                    this.drawText(stationName.slice(0, splitPosition), this.getOffsetX() - 20, this.getOffsetY() + y, 'right');
                    this.drawText(stationName.slice(splitPosition), this.getOffsetX() - 20, this.getOffsetY() + y + 15, 'right'); // Adjust the position of the text as needed
                } else {
                    this.drawText(stationName, this.getOffsetX() - 20, this.getOffsetY() + y, 'right'); // Adjust the position of the text as needed
                }
                this.drawLine(this.getOffsetX() - 10, y + this.getOffsetY(), this.getWidth(), y + this.getOffsetY());
            }

            for (let time = 0; time <= this.maxTime - this.minTime; time++) {
                const x = ((stationWidth - 40) / (this.maxTime - this.minTime)) * time;
                let timeLabel: number = time + this.minTime;
                if (timeLabel >= 24) {
                    timeLabel -= 24
                }
                this.drawText(timeLabel.toString() + ':00', this.getOffsetX() + x, this.getOffsetY());
                this.drawLine(this.getOffsetX() + x, this.getOffsetY() + 30, this.getOffsetX() + x, this.getOffsetY() + 20);
            }

        } else { //not axis flipped
            // Draw vertical axis labels
            for (let time = 0; time <= this.maxTime - this.minTime; time++) {
                const y = (stationHeight / (this.maxTime - this.minTime)) * time;

                let timeLabel: number = time + this.minTime;
                if (timeLabel >= 24) {
                    timeLabel -= 24
                }
                this.drawText(timeLabel.toString() + ':00', this.getOffsetX(), y + this.getOffsetY(), 'right');
                this.drawLine(this.getOffsetX() + 10, y + this.getOffsetY(), this.getWidth(), y + this.getOffsetY());
            }

            const labelOffsetY = -70; // Adjust this value to control the vertical position of the labels

            // Draw diagonal axis labels
            for (let i = 0; i < this.allStations.length; i++) {
                const stationName = this.allStations[i];
                const x = (i + 1) * stationWidth;
                const y = labelOffsetY;
                this.drawDiagonalText(x, y, stationName);
            }


        }
    }

    public drawData(): void {
        let stationHeight;
        let stationWidth;
        if (this.axisFlip) {
            stationHeight = (this.getHeight() - this.getOffsetY()) / (this.allStations.length + 1);
            stationWidth = (this.getWidth() - this.getOffsetX());
        } else { //not axis flipped
            stationHeight = this.getHeight() - this.getOffsetY();
            stationWidth = (this.getWidth() - this.getOffsetX()) / (this.allStations.length + 1);
        }


        for (const trip of this.data) {
            let datat: StopTime[] = trip.stops;
            for (let i = 0; i < datat.length - 1; i++) {   //draw one trip
                const currentConnection = datat[i];
                const nextConnection = datat[i + 1];
                let index = this.allStations.indexOf(currentConnection.station);
                let index_n = this.allStations.indexOf(nextConnection.station);
                //console.log("index_ " + index + " index_n " + index_n);
                if (index == -1 || index_n == -1) {
                    break;
                }
                let startX, startY, endX, endY;
                if (this.axisFlip) {
                    startX = ((stationWidth - 40) / (this.maxTime * 60 - this.minTime * 60)) * (translateTimeToMinutes(currentConnection.time) - this.minTime * 60) + this.getOffsetX();
                    startY = (this.allStations.indexOf(currentConnection.station) + 1) * stationHeight + this.getOffsetY();
                    endX = ((stationWidth - 40) / (this.maxTime * 60 - this.minTime * 60)) * (translateTimeToMinutes(nextConnection.time) - this.minTime * 60) + this.getOffsetX();
                    endY = (this.allStations.indexOf(nextConnection.station) + 1) * stationHeight + this.getOffsetY();
                } else { //not axis flipped
                    startX = (this.allStations.indexOf(currentConnection.station) + 1) * stationWidth + this.getOffsetX();
                    startY = (stationHeight / (this.maxTime * 60 - this.minTime * 60)) * (translateTimeToMinutes(currentConnection.time) - this.minTime * 60) + this.getOffsetY();
                    endX = (this.allStations.indexOf(nextConnection.station) + 1) * stationWidth + this.getOffsetX();
                    endY = (stationHeight / (this.maxTime * 60 - this.minTime * 60)) * (translateTimeToMinutes(nextConnection.time) - this.minTime * 60) + this.getOffsetY();

                }

                this.drawLine(startX, startY, endX, endY)
                if (i == 0) {
                    this.drawStopCircle(startX, startY, trip.name, currentConnection.station, currentConnection.time);
                }
                this.drawStopCircle(endX, endY, trip.name, nextConnection.station, nextConnection.time);
            }
        }
    }

    public drawLine(startX: number, startY: number, endX: number, endY: number): void {
        // This method should be overridden in subclasses to draw the line
        throw ('drawLine method not implemented');
    }

    public drawStopCircle(x: number, y: number, trip: string, stop: string, time: string): void {
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
        this.drawBackground();
        this.drawData();
    }

    public drawText(text: string, x: number, y: number, alignment = ""): void {
        throw ('drawText method not implemented');
    }

    public drawDiagonalText(x: number, y: number, stationName: string) {
        throw ('drawDiagonalText method not implemented');
    }
}
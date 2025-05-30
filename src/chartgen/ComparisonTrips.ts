import {RelativeTrips} from "./RelativeTrips";
import {Trip} from "../interfaces";

export class ComparisonTrips extends RelativeTrips {
    constructor(data: Trip[] = []) {
        super(data);
        if (data.length === 0) {
            return;
        }
        let timeDelta = this.maxTime - this.minTime;
        this.maxTime = Number.MIN_SAFE_INTEGER;
        this.minTime = Number.MAX_SAFE_INTEGER;


        this.relative_trips.forEach(
            (trip) => {
                let initialStopTime = trip.stops.at(0)?.time;
                trip.stops.forEach((stop) => {
                    stop.time = stop.time - initialStopTime!
                    this.maxTime = Math.max(this.maxTime, stop.time);
                    this.minTime = Math.min(this.minTime, stop.time);
                });
            });
        // scale times to [0, 1]
        this.relative_trips.forEach((trip) => {
            trip.stops.forEach((stop) => {
                stop.time = (stop.time - this.minTime) / (this.maxTime - this.minTime);
            });
        });

        this.minTime *= timeDelta; // convert to seconds
        this.maxTime *= timeDelta; // convert to seconds
    }
}
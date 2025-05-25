import {NormalizedTrip, RelativeStop, StopTime, Trip} from "./interfaces.ts";
import {translateTimeToMinutes} from "./Utility.ts";

export class RelativeTrips {
    public maxDistance: number = 0;
    public minDistance: number = Number.MAX_SAFE_INTEGER;
    public maxTime: number = Number.MIN_SAFE_INTEGER;
    public minTime: number = Number.MAX_SAFE_INTEGER;

    public relative_trips: NormalizedTrip[] = [];

    private init(data: Trip[] = []) {
        for (const trip of data) {
            for (const stop of trip.stops) {
                if (stop.distance > this.maxDistance) {
                    this.maxDistance = stop.distance;
                }
                if (stop.distance < this.minDistance) {
                    this.minDistance = stop.distance;
                }
                const timeInMinutes = translateTimeToMinutes(stop.time);
                if (timeInMinutes > this.maxTime) {
                    this.maxTime = timeInMinutes;
                }
                if (timeInMinutes < this.minTime) {
                    this.minTime = timeInMinutes;
                }
            }
        }

    }

    constructor(data: Trip[] = []) {
        this.init(data);
        for (const trip of data) {
            const relativeTrip: NormalizedTrip = {
                name: trip.name,
                traintype: trip.traintype,
                stops: []
            }
            for (const stop of trip.stops) {
                const relativeStop: RelativeStop = {
                    station: stop.station,
                    timeLabel: stop.time,
                    time: (translateTimeToMinutes(stop.time) - this.minTime) / (this.maxTime - this.minTime),
                    distance: (stop.distance - this.minDistance) / (this.maxDistance - this.minDistance)
                }
                relativeTrip.stops.push(relativeStop);
            }
            this.relative_trips.push(relativeTrip);
        }
    }
}
import {NormalizedTrip, Trip} from "../interfaces";
import {getAllStations, translateTimeToMinutes} from "../Utility";

export class RelativeTrips {
    public maxDistance: number = 0;
    public minDistance: number = Number.MAX_SAFE_INTEGER;
    public maxTime: number = Number.MIN_SAFE_INTEGER;
    public minTime: number = Number.MAX_SAFE_INTEGER;

    public relative_trips: NormalizedTrip[] = [];

    public allStations: string[] = [];
    public allStationDistances: Map<string, number> = new Map();

    private init(data: Trip[] = []) {
        this.allStations = getAllStations(data);
        for (const trip of data) {
            for (const stop of trip.stops) {
                if (!this.allStationDistances.has(stop.station)) {
                    this.allStationDistances.set(stop.station, stop.distance);
                } else {
                    stop.distance = this.allStationDistances.get(stop.station)!;
                }

                this.maxDistance = Math.max(this.maxDistance, stop.distance);
                this.minDistance = Math.min(this.minDistance, stop.distance);

                const timeInMinutes = translateTimeToMinutes(stop.time);
                this.maxTime = Math.max(this.maxTime, timeInMinutes);
                this.minTime = Math.min(this.minTime, timeInMinutes);
            }
        }

    }

    constructor(data: Trip[] = []) {
        this.init(data);
        this.ensureDistances();
        for (const trip of data) {
            const relativeTrip: NormalizedTrip = {
                name: trip.name,
                traintype: trip.traintype,
                stops: []
            }
            trip.stops.forEach(stop => {
                relativeTrip.stops.push({
                    station: stop.station,
                    timeLabel: stop.time,
                    time: (translateTimeToMinutes(stop.time) - this.minTime) / (this.maxTime - this.minTime),
                    distance: this.allStationDistances.get(stop.station)!,
                });
            });
            this.relative_trips.push(relativeTrip);
        }
    }

    private ensureDistances() {
        if (this.maxDistance < this.minDistance || isNaN(this.maxDistance) || isNaN(this.minDistance)) {
            this.allStations.forEach((station, index) => {
                this.allStationDistances.set(station, index / this.allStations.length);
            });
        } else {
            for (const [station, distance] of this.allStationDistances.entries()) {
                const normalizedDistance = (distance - this.minDistance) / (this.maxDistance - this.minDistance);
                this.allStationDistances.set(station, normalizedDistance);
            }
        }
    }
}
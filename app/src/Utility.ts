import {Trip} from "../interfaces.ts";

export function getAllStations(data: Trip[]): string[] {
    let allStations: string[] = [];
    let holdbackStations: string[] = [];
    let maxLength = 0;

    // Go through all trips to find the longest one.
    for (let i = 0; i < data?.length; i++) {
        const stations = data[i].stations;
        if (stations.length > maxLength) {
            maxLength = stations.length;
            allStations = stations;
        }
    }

    // Go through all trips and add stations that are not in the station array yet (longestStationArray).
    for (let i = 0; i < data?.length; i++) {
        const stations = data[i].stations;
        for (let j = 0; j < stations.length; j++) {
            const station = stations[j];
            if (!allStations.includes(station)) {

                let prevprev = allStations.indexOf(stations[j - 2]);
                let prev = allStations.indexOf(stations[j - 1]);
                let next = allStations.indexOf(stations[j + 1]);

                if (prev == -1 && next == -1) {
                    // The previous and next station are unknown, skip for later.
                    holdbackStations.push(station);
                } else if (next == prev + 1) {
                    // The previous and next station are known and right after each other.
                    // Add it in between.
                    allStations.splice(prev + 1, 0, station);
                } else if (prev == next + 1) {
                    // The previous and next station are known and right after each other.
                    // Add it in between (reverse order).
                    allStations.splice(next + 1, 0, station);
                } else if (prev == allStations.length - 1) {
                    // The previous station is the last station.
                    // Add it to the end.
                    allStations.splice(prev + 1, 0, station);
                } else if (prevprev != -1 && prev != -1 && prevprev > prev) {
                    // The previous two stations are known, but in different order.
                    // Add it after the second.
                    allStations.splice(prev, 0, station);
                } else if (prevprev != -1 && next == -1) {
                    // The next station is unknown, but the previous and previous-previous station are known.
                    // Add it after the previous station.
                    allStations.splice(prev + 1, 0, station);
                } else if (prevprev != -1 && prev == -1) {
                    // The previous two stations are known.
                    // Add it after them.
                    allStations.splice(next - 1, 0, station);
                } else {
                    // No matching pattern found, keep the station name for later.
                    holdbackStations.push(station);
                }
            }
        }
    }

    // Add stations that didn't fit at the end.
    for (let i = 0; i < holdbackStations.length; i++) {
        if (!allStations.includes(holdbackStations[i])) {
            allStations.push(holdbackStations[i]);
        }
    }

    return allStations;
}


export function splitLongStationName(name: string): number {      //maybe better splitting like at , or space
    return Math.ceil(name.length / 2);
}

export function translateTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
}

export function findMaxTime(data: Trip[]): number {
    let maxTime: number = 0;
    let str: number = 0;

    for (const trip of data) {
        for (const stop of trip.stops) {
            if (!maxTime || translateTimeToMinutes(stop.time) > maxTime) {
                maxTime = translateTimeToMinutes(stop.time);
                str = parseInt(stop.time.split(':')[0]);
            }
        }
    }
    return str;
}

export function findMinTime(data: Trip[]): number {
    let minTime: number = 23 * 60 + 59;
    let str: number = 0;
    if (data == null) {
        console.log("timetable is null");
    }
    for (const trip of data) {
        for (const stop of trip.stops) {
            if (!minTime || translateTimeToMinutes(stop.time) < minTime) {
                minTime = translateTimeToMinutes(stop.time);
                str = parseInt(stop.time.split(':')[0]);
            }
        }
    }
    return str;
}

export function findMaxDistance(data: Trip[]): number {
    let maxDistance: number = 0;
    for (const trip of data) {
        for (const stop of trip.stops) {
            if (!maxDistance || stop.distance > maxDistance) {
                maxDistance = stop.distance;
            }
        }
    }
    return maxDistance;
}
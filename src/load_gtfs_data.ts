import JSZip from "jszip";
import {parse} from 'papaparse';
import {StopTime, Trip, RouteD} from "./interfaces";

export async function loadGTFSData(file: File): Promise<RouteD[]> {
    let zip = new JSZip();
    let content = await zip.loadAsync(file);

    let tripData = content.files['trips.txt'];
    let tripCsvText = await tripData.async('text');
    let routeData = content.files['routes.txt'];
    let routeCsvText = await routeData.async('text');
    let stopTimesData = content.files['stop_times.txt'];
    let stopTimesCsvText = await stopTimesData.async('text');
    let stopsData = content.files['stops.txt'];
    let stopsCsvText = await stopsData.async('text');
    let routes = parseRouteData_R(routeCsvText);

    let trips = parseRouteData(tripCsvText, stopTimesCsvText, stopsCsvText, routes);


    return trips;
}

const stopsById: Record<string, string> = {};

function parseRouteData(csvText: string, stopTimesCsvText: string, stopsCsvText: string, routes_: RouteD[]): RouteD[] {
    const results = parse(csvText, {header: true});
    const stopTimesResults = parse(stopTimesCsvText, {header: true});
    const stopsResults = parse(stopsCsvText, {header: true});
    const existingTripIds: Set<string> = new Set<string>();

    stopsResults.data.forEach((row: any) => {
        // Crop the station_id to the first three parts and add its first occurence to the list.
        // If the station is already added, skip it.
        let stop_id_parts = row.stop_id.split(":");
        const cropped_stop_id = stop_id_parts.slice(0, 3).join(":");

        if (cropped_stop_id in stopsById)
            return;

        let stationName = row.stop_name || "";

        // Skip some edge cases that can occur in the station list ordering.
        // The next stop_name is probably for suitable for the station.
        if (["bahn", "bus", "sev", "g23", "zugang", "vorplatz"].includes(stationName.toLowerCase()))
            return;

        stopsById[cropped_stop_id] = stationName;
    });

    const tripsByRouteId: Record<string, Trip[]> = {};
    const stopTimesByTripId: Record<string, StopTime[]> = {};

  results.data.forEach((row: any) => {
    const routeId = row.route_id;
    if (!tripsByRouteId[routeId]) {
      tripsByRouteId[routeId] = [];
    }
    if (row.trip_id && !existingTripIds.has(row.trip_id)) {
      existingTripIds.add(row.trip_id);
      tripsByRouteId[routeId].push({
        id: row.trip_id,
        name: row.trip_headsign,
        stops: [],
        routeId: row.routeId,
        stations: [],
        traintype: row.trip_short_name.split(" ")[0],
      });
    }

    });

    stopTimesResults.data.forEach((row: any) => {
        const tripId = row.trip_id;
        if (!stopTimesByTripId[tripId]) {
            stopTimesByTripId[tripId] = [];
        }

        if (row.trip_id == "")
            return;

        // handle only the main part of the stop id
        let stop_id_parts = row.stop_id.split(":");
        const cropped_stop_id = stop_id_parts.slice(0, 3).join(":");

        stopTimesByTripId[tripId].push({
            id: cropped_stop_id,
            tripId: tripId,
            station: stopsById[cropped_stop_id],
            time: row.arrival_time,
            distance: parseFloat(row.shape_dist_traveled),
        });
    });


    routes_.forEach((route) => {
        const routeTrips: Trip[] = tripsByRouteId[route.id] || [];
        routeTrips.forEach((trip) => {
            trip.stops = stopTimesByTripId[trip.id] || [];
        });
        route.trips = routeTrips;
    });

    return routes_;
}


function parseRouteData_R(csvText: string): RouteD[] {
    let results = parse(csvText, {header: true});
    let routes: RouteD[] = results.data.map((row: any) => ({
        id: row.route_id,
        name: row.route_short_name,
        shortname: row.route_short_name,
        trips: [],
    }));
    return routes;
}

export function getStations(trips: Trip[]): void {
    for (const trip of trips) {
        let stationSet = new Set<string>();
        for (let i = 0; i < trip.stops.length; i++) {
            const cropped_stop_id = trip.stops[i].id;
            stationSet.add(stopsById[cropped_stop_id]);
        }
        trip.stations = Array.from(stationSet);
    }
}
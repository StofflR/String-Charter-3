import JSZip from "jszip";
import { parse } from 'papaparse';
import { StopTime, Trip, RouteD } from "./interfaces";

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

function parseRouteData(csvText: string, stopTimesCsvText: string, stopsCsvText: string, routes_: RouteD[]): RouteD[] {
  const results = parse(csvText, { header: true });
  const stopTimesResults = parse(stopTimesCsvText, { header: true });
  const stopsResults = parse(stopsCsvText, { header: true });
  const existingTripIds: Set<string> = new Set<string>();
  const stopsById: Record<string, string> = {};
  stopsResults.data.forEach((row: any) => {
    const stationName = row.stop_name || "";
    stopsById[row.stop_id] = stationName;
  });

  const tripsByRouteId: Record<string, Trip[]> = {};
  const stopTimesByTripId: Record<string, StopTime[]> = {};

  results.data.forEach((row: any) => {
    const routeId = row.route_id;
    if (!tripsByRouteId[routeId]) {
      tripsByRouteId[routeId] = [];
    }
    if (!existingTripIds.has(row.trip_id)) {
      existingTripIds.add(row.trip_id);
      tripsByRouteId[routeId].push({
        id: row.trip_id,
        name: row.trip_headsign,
        stops: [],
        routeId: row.routeId,
        stations: [],
      });
    }

  });

  stopTimesResults.data.forEach((row: any) => {
    const tripId = row.trip_id;
    if (!stopTimesByTripId[tripId]) {
      stopTimesByTripId[tripId] = [];
    }
    stopTimesByTripId[tripId].push({
      id: row.stop_id,
      tripId: tripId,
      station: stopsById[row.stop_id],
      time: row.arrival_time,
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
  let results = parse(csvText, { header: true });
  let routes: RouteD[] = results.data.map((row: any) => ({
    id: row.route_id,
    name: row.route_short_name,
    trips: [],
  }));
  return routes;
}

export function getStations(trips: Trip[]): string[] {
  let stationSet = new Set<string>();

  for (const trip of trips) {
    stationSet.clear();
    for (let i = 0; i < trip.stops.length; i++) {
      const stationName = trip.stops[i].station;
      stationSet.add(stationName);
    }
    trip.stations = Array.from(stationSet);
  }

  const stations = Array.from(stationSet);
  return stations;
}
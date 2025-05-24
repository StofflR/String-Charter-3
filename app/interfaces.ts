export interface StopTime {
    id: string;
    tripId: string;
    station: string;
    time: string;
    distance: number;
}

export interface Trip {
    id: string;
    name: string;
    stops: StopTime[];
    routeId: string;
    stations: string[];
}

export interface Route {
    id: string;
    name: string;
}

export interface RouteD {
    id: string;
    name: string;
    trips: Trip[];
}
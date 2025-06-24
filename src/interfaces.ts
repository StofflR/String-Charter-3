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
    traintype: string;
}

export interface NormalizedTrip {
    name: string;
    stops: RelativeStop[];
    traintype: string
}

export interface RelativeStop {
    station: string;
    timeLabel: string;
    time: number; // Normalized time
    distance: number; // Normalized distance
}

export interface Route {
    id: string;
    name: string;
}

export interface RouteD {
    id: string;
    name: string;
    shortname: string;
    trips: Trip[];
}

export interface StopCircle {
    x: number,
    y: number,
    trip: string,
    stop: string,
    time: string,
    color: string
}

export interface Tripstyle {
    keys: string;
    color: string;
    strokedash: StrokeDashPattern;
}

export enum StrokeDashPattern {
    Solid        = "------------------",
    FourDouble   = "----  ----  ----  ",
    DoubleSingle = "-- -- -- -- -- -- ",
    DoubleDouble = "--  --  --  --  --",
    SingleSingle = "- - - - - - - - - ",
    HalfHalf     = ". . . . . . . . . "
}

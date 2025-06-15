import { computed, ref } from "vue";
import { getStations, loadGTFSData } from "./load_gtfs_data.ts";
import { RouteD, Trip } from "./interfaces.ts";
import { D3Generator } from "./chartgen/D3Generator.ts";

let instance: App | null = null;

export class App {
    public d3Gen: D3Generator | null = null;

    public offsetX: number = 0;
    public offsetY: number = 0;
    public viewBoxX: number = 0;
    public viewBoxY: number = 0;

    public scale = ref(100);
    public offset = ref(0);

    public sanitized = ref(false);
    public geographicScale = ref(100);
    public diagonalTilt = ref(-45);
    public colors = ref([
        {keys: "RJ, RJX", color: "#7b0e07"},
        {keys: "IC, ICE, EC, NJ", color: "#e8002a"},
        {keys: "R, REX, CJX", color: "#0060aa"},
        {keys: "S", color: "#0097d9"}
    ])

    public trips = ref<Trip[]>([]);
    public loadedRoutes = ref<RouteD[]>([]);
    public flipAxis = ref(false);
    public compare = ref(false);
    public routeNames = ref<string[]>([]);
    public routesSelected = ref<string[]>([])
    public routeFilter = ref('');
    public showOnlySelected = ref(false);
    public availableRoutes = computed<string[]>(() => {
        const routes = !this.showOnlySelected.value ? this.routeNames.value : this.routesSelected.value;
        return routes.filter((route: string) => route.includes(this.routeFilter.value))
    });
    public dataFiles = ref<any[]>([]);

    constructor() {
        if (instance) {
            throw new Error("New instance cannot be created!!");
        }
        instance = this;
    }

    fetchDataFile(fileName: string, data: any) {
        if (this.dataFiles.value.find((dataFile) => {
            return dataFile.name === fileName;
        })) return;

        fetch(data)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => {
                this.dataFiles.value.push({
                    "name": fileName,
                    "data": new File([blob], fileName, { type: "application/zip" })
                });
            }
            );
    }

    toggleSelection(route: string) {
        let index = this.routesSelected.value.indexOf(route);
        if (index === -1)
            this.routesSelected.value.push(route);
        else
            this.routesSelected.value.splice(index, 1);
        this.routeUpdate();
    }

    async routeUpdate() {
        this.trips.value = [];

        for (let i = 0; i < this.routesSelected.value.length; i++) {
            const route = this.loadedRoutes.value.find((route) => route.name === this.routesSelected.value[i]);
            if (route) {
                for (let j = 0; j < route?.trips.length; j++) {
                    this.trips.value.push(route?.trips[j]);
                }
            }
        }

        if (this.trips.value)
            this.generateStringGraph();
    }


    clearRouteFilter() {
        this.routesSelected.value = [];
        this.routeFilter.value = "";
        this.showOnlySelected.value = false;
        this.routeUpdate();
    }


    async handleGtfsUpload(file: File) {
        if (!this.dataFiles.value.find((dataFile) => {
            return dataFile.data == file;
        })) {
            this.dataFiles.value.push({
                "name": file.name,
                "data": file
            })
        }
        this.routeNames.value = []
        if (file) {

            const routes = await loadGTFSData(file);

            for (const route of routes) {

                // update appSettings prop trips
                this.trips.value = route.trips;
                let maxLength = 0;
                getStations(route.trips);
                let longestArray: string[] = [];

                for (let i = 0; i < this.trips.value?.length; i++) {
                    const stations = this.trips.value[i].stations;
                    if (stations.length > maxLength) {
                        maxLength = stations.length;
                        longestArray = stations;
                    }
                }

                if (longestArray.length > 0) {
                    const firstStation = longestArray[0];
                    const lastStation = longestArray[longestArray.length - 1];
                    const routeString = `${route.shortname}: ${firstStation} ↔ ${lastStation}`;
                    if (!this.routeNames.value.includes(routeString)) {
                        this.routeNames.value.push(routeString);
                    }
                    route.name = routeString;
                }
            }
            this.loadedRoutes.value = routes;

            if (this.routeNames.value.length > 0)
                this.toggleSelection(this.routeNames.value[0]); // Automatically select the first route
        }
    }

    updateViewBox(scale: number, offset: number): void {
        if (!this.d3Gen) {
            console.error('D3Generator instance is not initialized.');
            return;
        }
        let scaledWidth = this.d3Gen.getWidth() * (!this.flipAxis.value ? 1 : scale / 100);
        let scaledHeight = this.d3Gen.getHeight() * (!this.flipAxis.value ? scale / 100 : 1);

        let maxOffsetX = this.d3Gen.getWidth() - scaledWidth;
        let maxOffsetY = this.d3Gen.getHeight() - scaledHeight;

        this.offsetX = maxOffsetX * (offset / 100);
        this.offsetY = maxOffsetY * (offset / 100);

        this.viewBoxX = this.d3Gen.getOffsetX() + this.d3Gen.getOffsetY() + scaledWidth
        this.viewBoxY = this.d3Gen.getOffsetY() + this.d3Gen.getOffsetX() + scaledHeight
        this.d3Gen.updateViewBox(this.offsetX, this.offsetY, this.viewBoxX, this.viewBoxY);
    }

    generateStringGraph(): void {
        this.d3Gen = new D3Generator(this.trips.value, !this.flipAxis.value, this.colors.value, this.compare.value, this.diagonalTilt.value, this.geographicScale.value, this.sanitized.value);
        this.updateViewBox(this.scale.value, this.offset.value);
        this.d3Gen.generate();
    }
}

export const appInstance = new App(); //TODO freezeze this instance


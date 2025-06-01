import {computed, ref} from "vue";
import {generateStringGraph} from "./string_graph.ts";
import {getStations, loadGTFSData} from "./load_gtfs_data.ts";

let instance;

export class App {
    public trips = ref([]);
    public loadedRoutes = ref([]);
    public flipAxis = ref(false);
    public compare = ref(false);
    public routeNames = ref([]);
    public routesSelected = ref([])
    public routeFilter = ref('');
    public showOnlySelected = ref(false);
    public availableRoutes = computed(() => {
        const routes = !this.showOnlySelected.value ? this.routeNames.value : this.routesSelected.value;
        return routes.filter((route: string) => route.includes(this.routeFilter.value))
    })

    constructor() {
        if (instance) {
            throw new Error("New instance cannot be created!!");
        }

        instance = this;

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

            for (let j = 0; j < route?.trips.length; j++) {
                this.trips.value.push(route?.trips[j]);
            }
        }

        if (this.trips.value)
            generateStringGraph(this.trips.value, this.flipAxis.value, this.compare.value);
    }


    clearRouteFilter() {
        this.routesSelected.value = [];
        this.routeFilter.value = "";
        this.showOnlySelected.value = false;
        this.routeUpdate();
    }


    async handleGtfsUpload(file: File) {
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

    exportAsSVG() {
        const svg = document.getElementById('graphCanvas') as SVGElement;
        if (!svg) {
            console.error('SVG element not found');
            return;
        }

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'graph.svg';
        link.style.display = 'none';
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

export const appInstance = Object.freeze(new App());


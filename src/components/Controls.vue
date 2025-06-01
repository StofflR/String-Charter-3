<script lang="ts">
import {getStations, loadGTFSData} from "@/load_gtfs_data.ts";
import {RouteD, Trip} from "@/interfaces.ts";
import {computed, ref} from "vue";
import {generateStringGraph} from "@/string_graph.ts";

export default {
  name: 'Controls',
}

let trips: Trip[] = [];
let loadedRoutes: RouteD[] = [];

let flip_axis = false;
let compare = false;


let routeNames = ref([]);
const routes_selected = ref([])

export function toggleSelection(route: string) {
  let index = routes_selected.value.indexOf(route);
  if (index === -1)
    routes_selected.value.push(route);
  else
    routes_selected.value.splice(index, 1);
  routeUpdate();
}

export async function routeUpdate() {
  trips = [];

  for (let i = 0; i < routes_selected.value.length; i++) {
    const route = loadedRoutes.find((route) => route.name === routes_selected.value[i]);

    for (let j = 0; j < route?.trips.length; j++) {
      trips.push(route?.trips[j]);
    }
  }

  if (trips)
    generateStringGraph(trips, flip_axis, compare);
}

export function clearRouteFilter() {
  routes_selected.value = [];
  routeFilter.value = "";
  showOnlySelected.value = false;
  routeUpdate();
}

let routeFilter = ref('');
let showOnlySelected = ref(false);

const filteredRoutes = computed(() => {
  if (showOnlySelected.value) {
    return routes_selected.value;
  } else {
    return routeNames.value.filter(option =>
        option.toLowerCase().includes(routeFilter.value.toLocaleLowerCase())
    )
  }
});


export async function handleGtfsUpload(file: File) {
  routeNames.value = []
  if (file) {

    const routes = await loadGTFSData(file);

    for (const route of routes) {

      trips = route.trips;
      let maxLength = 0;
      getStations(route.trips);
      let longestArray: string[] = [];

      for (let i = 0; i < trips?.length; i++) {
        const stations = trips[i].stations;
        if (stations.length > maxLength) {
          maxLength = stations.length;
          longestArray = stations;
        }
      }

      if (longestArray.length > 0) {
        const firstStation = longestArray[0];
        const lastStation = longestArray[longestArray.length - 1];
        const routeString = `${route.shortname}: ${firstStation} ↔ ${lastStation}`;
        if (!routeNames.value.includes(routeString)) {
          routeNames.value.push(routeString);
        }
        route.name = routeString;
      }
    }
    loadedRoutes = routes;

    if (routeNames.value.length > 0)
      toggleSelection(routeNames.value[0]); // Automatically select the first route
  }
}

</script>


<script setup lang="ts">
import SliderControls from "@/components/SliderControls.vue";
import ExportButton from "@/components/ExportButton.vue";
import ControlSwitches from "@/components/ControlSwitches.vue";
import DragDropArea from "@/components/DragDropArea.vue";
import RouteSelect from "@/components/RouteSelect.vue";


function handleToggle(event: { flip_axis: boolean, compare: boolean }) {
  flip_axis = event.flip_axis;
  compare = event.compare;
}

</script>


<template>
  <div id="container">
    <div id="controls">
      <h1 class="mb-4">String Charter 3</h1>
      <label for="drop-area" class="mt-8">Select a GTFS zip</label>
      <DragDropArea/>
      <SliderControls/>

      <label for="route-filter" class="mt-6">Filter routes:</label>
      <input id="rout-filter" v-model="routeFilter"
             class="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">

      <label for="route-select" class="mt-6">Select a route:</label>
      <input type="checkbox" v-model="showOnlySelected"/>Show Selected
      <a @click="clearRouteFilter()">Clear</a>
      <div>
        <div id="route-select"
             class="h-100 overflow-scroll block w-full appearance-none bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
          <!-- <option disabled selected value> -- select a route -- </option> -->
          <div @click="toggleSelection(option)" :class="{ 'bg-gray-200': routes_selected.includes(option) }"
               v-for="option in filteredRoutes" :key="option" :value="option"
               class="py-3 px-4 "
          > {{ option }}
          </div>
        </div>
      </div>

      <ControlSwitches @update="handleToggle" :trips="trips"/>
      <ExportButton/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Trip, RouteD } from '../../interfaces.ts';
import { loadGTFSData, getStations } from '../../load_gtfs_data';
import { generateSVG, generateStringGraph } from '../../string_graph';

let trips: Trip[];
let loadedRoutes: RouteD[] = [];

const routeNames = ref([]);
const fileNameLabel = ref("Drag & drop a GTFS zip file here, or <span class='text-blue-600 underline'>click to select</span>");
const routes_selected = ref([])
const flip_axis = ref(false);

async function routeUpdate() {
  trips = [];

  for (let i = 0; i < routes_selected.value.length; i++) {
    const route = loadedRoutes.find((route) => route.name === routes_selected.value[i]);
    
    for (let j = 0; j < route?.trips.length; j++) {
      trips.push(route?.trips[j]);
    }
   }

  if(trips)
    generateStringGraph(trips, flip_axis.value);
}

function toggleSelection(route: string) {
  let index = routes_selected.value.indexOf(route);
  if(index === -1)
    routes_selected.value.push(route);
  else
    routes_selected.value.splice(index, 1);
  routeUpdate();
}

function clearRouteFilter() {
  routes_selected.value = [];
  routeFilter.value = "";
  showOnlySelected.value = false;
  routeUpdate();
}

function handleUploadButton(e: Event) {
  const inputElement = e.target as HTMLInputElement;
  
  if (inputElement && inputElement.files && inputElement.files.length > 0)
    handleGtfsUpload(inputElement.files);
}

async function handleGtfsUpload(files: FileList) {
    const file = files[0];
    console.log(file);
    fileNameLabel.value = `Selected file: ${file.name}`;
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
      
      const selectedRoute = loadedRoutes.at(0);
      if (selectedRoute && selectedRoute.trips.length < 20) {
         generateStringGraph(selectedRoute.trips, flip_axis.value);
      }
    }
}


const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

const onDragOver = () => {
  isDragging.value = true;
}

const onDragLeave = () => {
  isDragging.value = false;
}

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files
  if (files && files.length > 0)
    handleGtfsUpload(files);
}


function exportAsSVG() {
  const canvas = document.getElementById('graphCanvas') as HTMLCanvasElement;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  while (svg.firstChild) {
    svg.firstChild.remove();
  }

  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', canvas.width.toString());
  svg.setAttribute('height', canvas.height.toString());
  svg.setAttribute('font-family', 'Verdana');

  generateSVG(trips, svg, canvas.width, canvas.height, flip_axis.value);



  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
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

let routeFilter = ref('');
let showOnlySelected = ref(false);

const filteredRoutes = computed(() => {
  if (showOnlySelected.value){
    return routes_selected.value;
  }
  else {
    return routeNames.value.filter(option => 
      option.toLowerCase().includes(routeFilter.value.toLocaleLowerCase())
    )
  }
});

</script>


<template>
  <div id="container">
    <div id="controls">
      <h1>String Charter 3</h1>
      <label for="drop-area" class="mt-8">Select a GTFS zip</label>
      <div @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop"
    :class="{ 'bg-gray-200': isDragging }" id="drop-area" @click="fileInput?.click()"
        class="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer transition hover:bg-gray-100 ">
        <p v-html="fileNameLabel"></p>
        <input ref="fileInput" @change="handleUploadButton" type="file" id="file-input" accept=".zip" class="hidden" />
      </div>
  
      <div class="mt-2text-gray-700" id="file-name-label"></div>

      <label for="route-filter" class="mt-6">Filter routes:</label>
      <input id="rout-filter" v-model="routeFilter" class="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">

      <label for="route-select" class="mt-6">Select a route:</label>
      <input type="checkbox" v-model="showOnlySelected" />Show Selected
      <a @click="clearRouteFilter()">Clear</a>  
      <div>
        <div id="route-select"
          class="h-100 overflow-scroll block w-full appearance-none bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
          <!-- <option disabled selected value> -- select a route -- </option> -->
          <div @click="toggleSelection(option)" :class="{ 'bg-gray-200': routes_selected.includes(option) }"
          v-for="option in filteredRoutes" :key="option" :value="option" 
          class="py-3 px-4 "
          > {{ option }} </div>
        </div>
      </div>

      <div class="flex items-center justify-center mt-4 mx-2" id="flip-axis">
        <label for="axis-switch" class="flex items-center cursor-pointer">
          <span class="mr-3 text-gray-700 font-medium">Flip Axis</span>
          <div class="relative">
            <input id="axis-switch" type="checkbox" class="sr-only peer" @change="generateStringGraph(trips, flip_axis)" v-model="flip_axis">
            <div class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
            <div
              class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition">
            </div>
          </div>
        </label>
      </div>
      <div class="flex items-center justify-center mt-4 mx-2">
        <button id="exportButton" @click="exportAsSVG"
        class="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-md transition transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">Export
        as SVG</button>
      </div>
    </div>
  </div>
</template>

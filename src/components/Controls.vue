<script setup lang="ts">
import {computed, ref} from 'vue';
import {Trip, RouteD} from '../interfaces';
import {loadGTFSData, getStations} from '../load_gtfs_data';
import {generateStringGraph} from '../string_graph';

import obbData from "../assets/datasets/GTFS_OP_2025_obb.zip";
import SliderControls from "@/components/SliderControls.vue";

let obbDataFile: File | null = null;

let trips: Trip[];
let loadedRoutes: RouteD[] = [];

const routeNames = ref([]);
const fileNameLabel = ref("Drag & drop a GTFS zip file here, or <span class='text-blue-600 underline'>click to select</span>");
const routes_selected = ref([])
const flip_axis = ref(false);

fetch(obbData)
    .then(res => res.blob()) // Gets the response and returns it as a blob
    .then(blob => {
      obbDataFile = new File([blob], "GTFS_OP_2025_obb.zip", {type: "application/zip"});
    });
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
    handleGtfsUpload(inputElement.files[0]);
}

async function handleGtfsUpload(file: File) {
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

    if(routeNames.value.length > 0)
      toggleSelection(routeNames.value[0]); // Automatically select the first route
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
    handleGtfsUpload(files[0]);
}


function exportAsSVG() {
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
      <h1 class="mb-4">String Charter 3</h1>
      <label for="drop-area" class="mt-8">Select a GTFS zip</label>
      <div @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop"
           :class="{ 'bg-gray-200': isDragging }" id="drop-area" @click="fileInput?.click()"
           class="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer transition hover:bg-gray-100 ">
        <p v-html="fileNameLabel"></p>
        <input ref="fileInput" @change="handleUploadButton" type="file" id="file-input" accept=".zip" class="hidden"/>
      </div>

      <div class="mt-2 text-gray-700" id="file-name-label"></div>

      <div class="flex items-center justify-center mt-4 mb-4 mx-2">
        <button id="exampleData" @click="handleGtfsUpload(obbDataFile)"
                class="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-md transition transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
          Load Example OBB Data
        </button>
      </div>

      <SliderControls/>

      <label for="route-filter" class="mt-6">Filter routes:</label>
      <input id="rout-filter" v-model="routeFilter"
             class="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">

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
            <input id="axis-switch" type="checkbox" class="sr-only peer" @change="generateStringGraph(trips, flip_axis)"
                   v-model="flip_axis">
            <div class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
            <div
                class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition">
            </div>
          </div>
        </label>
      </div>
      <div class="flex items-center justify-center mt-4 mx-2">
        <button id="exportButton" @click="exportAsSVG"
                class="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-md transition transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
          Export
          as SVG
        </button>
      </div>
    </div>
  </div>
</template>

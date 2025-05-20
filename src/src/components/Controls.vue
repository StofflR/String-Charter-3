<script setup lang="ts">
import { computed, ref } from 'vue';
import { Trip, RouteD } from '../../interfaces.ts';
import { loadGTFSData, getStations } from '../../load_gtfs_data';
import { generateSVG, generateStringGraph } from '../../string_graph';

let trips: Trip[];
let loadedRoutes: RouteD[] = [];

function getFlipAxisValue(): boolean {
  const checkbox = document.getElementById('axis-switch') as HTMLInputElement;
  return checkbox.checked;
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('graphCanvas') as HTMLCanvasElement;
  const exportButton = document.getElementById('exportButton');

  if (exportButton == null) {
    console.error('SVG export not supported');
    return;
  }

  exportButton.addEventListener('click', () => {

    exportAsSVG(canvas);

  });
});

function flipAxisToggle(event: Event) {
  const target = event.target as HTMLInputElement;
  const isChecked = target.checked;
  console.log('Checkbox value changed:', isChecked);
  generateStringGraph(trips, getFlipAxisValue());
}


let routeNames = ref([]);

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  const routeSelect = document.getElementById('route-select') as HTMLSelectElement;
  const fileNameLabel = document.getElementById('file-name-label') as HTMLElement;

  fileInput.addEventListener('change', async () => {
    if (fileInput == null || fileInput.files == null) {
      return;
    }
    if (fileInput.files.length) {
      fileNameLabel.textContent = `Selected file: ${fileInput.files[0].name}`;
    }

    const file = fileInput.files?.[0];
    routeNames.value = []

    if (routeSelect) {
      routeSelect.addEventListener('change', async () => {
        if (routeSelect.value == null) {
          return;
        }
        const stringGraphCard = document.getElementById('string-graph-card');

        stringGraphCard!.style.display = 'flex';
        const selectedRouteName = routeSelect.value;
        const selectedRoute = loadedRoutes.find((route) => route.name === selectedRouteName);
        trips = selectedRoute?.trips as Trip[];
        if (selectedRoute) {
          const file = fileInput.files?.[0];
          if (file)
            generateStringGraph(selectedRoute.trips, getFlipAxisValue());
        }
      });
    }
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
          const routeString = `${firstStation} -> ${lastStation}`;
          if (!routeNames.value.includes(routeString)) {
            routeNames.value.push(routeString);
          }

          route.name = routeString;

        }
      }
      loadedRoutes = routes;
      //await populateRouteSelect(routeNames);
      const selectedRoute = loadedRoutes.at(0);
      if (selectedRoute) {
        generateStringGraph(selectedRoute.trips, getFlipAxisValue());
      }
    }
  });


  const dropArea = document.getElementById('drop-area') as HTMLElement;

  dropArea.addEventListener('click', () => fileInput.click());

  dropArea.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
    dropArea.classList.add('bg-gray-200');
  });

  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('bg-gray-200');
  });

  dropArea.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    dropArea.classList.remove('bg-gray-200');
    if (e.dataTransfer?.files.length) {
      fileInput.files = e.dataTransfer.files;
      // Handle the file as needed
    }
  });




});


function exportAsSVG(canvas: HTMLCanvasElement): void {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  while (svg.firstChild) {
    svg.firstChild.remove();
  }

  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', canvas.width.toString());
  svg.setAttribute('height', canvas.height.toString());
  svg.setAttribute('font-family', 'Verdana');

  generateSVG(trips, svg, canvas.width, canvas.height, getFlipAxisValue());



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
const filteredRoutes = computed(() => {
  return routeNames.value.filter(option => 
    option.toLowerCase().includes(routeFilter.value.toLocaleLowerCase())
  )
});

</script>


<template>
  <div id="container">
    <div id="controls">
      <h1>String Charter 3</h1>
      <label for="drop-area" class="mt-8">Select a GTFS zip</label>
      <div id="drop-area"
        class="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer transition hover:bg-gray-100 ">
        <p>Drag & drop a GTFS zip file here, or <span class="text-blue-600 underline">click to
            select</span>
        </p>
        <input type="file" id="file-input" accept=".zip" class="hidden" />
      </div>
  
      <div class="mt-2text-gray-700" id="file-name-label"></div>

      <label for="route-filter" class="mt-6">Filter routes:</label>
      <input id="rout-filter" v-model="routeFilter" class="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">

      <label for="route-select" class="mt-6">Select a route:</label>
      <div>
        <select size="10" id="route-select"
          class="block w-full appearance-none bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
          <!-- <option disabled selected value> -- select a route -- </option> -->
          <option v-for="option in filteredRoutes" :key="option" :value="option" 
          class="py-3 px-4 "
          > {{ option }} </option>
        </select>
      </div>

      <div class="flex items-center justify-center mt-4 mx-2" id="flip-axis">
        <label for="axis-switch" class="flex items-center cursor-pointer">
          <span class="mr-3 text-gray-700 font-medium">Flip Axis</span>
          <div class="relative">
            <input id="axis-switch" type="checkbox" class="sr-only peer" @change="flipAxisToggle">
            <div class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
            <div
              class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition">
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

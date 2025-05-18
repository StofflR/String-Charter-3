<script setup lang="ts">
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

async function populateRouteSelect(routes: string[]): Promise<void> {
  const routeSelect = document.getElementById('route-select') as HTMLSelectElement;
  routeSelect.innerHTML = '';

  routes.forEach((route) => {
    const option = document.createElement('option');
    option.value = route;
    option.textContent = route;
    routeSelect.appendChild(option);
  });
}

function flipAxisToggle(event: Event) {
  const target = event.target as HTMLInputElement;
  const isChecked = target.checked;
  console.log('Checkbox value changed:', isChecked);
  generateStringGraph(trips, getFlipAxisValue());
}



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
    const routeNames: string[] = [];
    graph.hidden = fileInput.files.length === 0;

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
          if (!routeNames.includes(routeString)) {
            routeNames.push(routeString);
          }

          route.name = routeString;

        }
      }
      loadedRoutes = routes;
      await populateRouteSelect(routeNames);
      const selectedRoute = loadedRoutes.at(0);
      if (selectedRoute) {
        generateStringGraph(selectedRoute.trips, getFlipAxisValue());
      }
    }
  });


  const dropArea = document.getElementById('drop-area') as HTMLElement;
  const graph = document.getElementById('graph-card') as HTMLButtonElement;

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
</script>


<template>
  <div id="container">
    <div id="controls">
      <h1>String Charter 3: Visual Transport Schedule</h1>
      <label for="drop-area" class="mt-8 mx-8">Select a GTFS zip</label>
      <div id="drop-area"
        class="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer transition hover:bg-gray-100 mx-8">
        <p class="mb-2">Drag & drop a GTFS zip file here, or <span class="text-blue-600 underline">click to
            select</span>
        </p>
        <input type="file" id="file-input" accept=".zip" class="hidden" />
      </div>
      <br>
  
      <div class="mt-2 mx-8 text-gray-700" id="file-name-label"></div>

      <label for="route-select" class="mt-2 mx-8 ">Select a route:</label>
      <div class="relative w-64 mx-auto my-4">
        <select id="route-select"
          class="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
          <option disabled selected value> -- select a route -- </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div class="flex items-center justify-center my-4" id="flip-axis">
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

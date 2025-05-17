<script setup lang="ts">
import { Trip, RouteD } from '../../interfaces.ts';
import { loadGTFSData, getStations } from '../../load_gtfs_data';
import { generateSVG, generateStringGraph } from '../../string_graph';

let trips: Trip[];

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

  let loadedRoutes: RouteD[] = [];
  
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    const routeNames: string[] = [];
    
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
      
    }
  });
  
  if (routeSelect) {
    routeSelect.addEventListener('change', async () => {
      if(routeSelect.value == null){
        return;
      }
      const stringGraphCard = document.getElementById('string-graph-card');

      stringGraphCard!.style.display = 'flex';
      const selectedRouteName = routeSelect.value;
      const selectedRoute = loadedRoutes.find((route) => route.name === selectedRouteName);
      trips = selectedRoute?.trips as Trip[];
      if (selectedRoute) {
        const file = fileInput.files?.[0];
        if (file) {
          
          generateStringGraph(selectedRoute.trips, getFlipAxisValue());
        }
      }
    });
  }
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
      <label for="file-input" class="">Select a GTFS zip:</label>
      <input class="" type="file" id="file-input" accept=".zip"/>
      <br>
      <label for="route-select" class="">Select a route:</label>
      <select id="route-select" class=""></select>
      <div class="" id="flip-axis">
        <input class="" type="checkbox" id="axis-switch" @change="flipAxisToggle">
        <label class="" for="axis-switch">Flip Axis</label>
      </div>
    </div>
  </div>
</template>

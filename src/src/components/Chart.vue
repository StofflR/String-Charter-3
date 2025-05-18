<template>
  <div id="string-graph-card">
    <div id="stop-detail" class="flex items-center mx-8"> --- hover over a stop to see details --- </div>
    <canvas id="graphCanvas" width="1200" height="600"></canvas>
    <div class="flex justify-center">
      <button id="exportButton"
        class="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-md transition transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">Export
        as SVG</button>
    </div>
  </div>
</template>

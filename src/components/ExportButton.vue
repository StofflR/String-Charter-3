<template>
  <div class="flex items-center justify-center mt-4 mx-2">
    <button id="exportButton" @click="exportAsSVG"
            class="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-md transition transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
      Export
      as SVG
    </button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ExportButton'
}
</script>

<script setup lang="ts">
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
</script>
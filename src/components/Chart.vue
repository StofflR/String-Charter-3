<script setup lang="ts">
let scale = 1;
let panX = 0;
let panY = 0;

function zoom(e: WheelEvent) {
  e.stopPropagation();
  let container = e.currentTarget as HTMLDivElement;
  let canvas = container.children[0] as HTMLCanvasElement;
  
  canvas.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`;

  if (e.deltaY > 0) {
    canvas.style.transform = `scale(${(scale += .1)})`;
  } else if (scale > 1) {
    canvas.style.transform = `scale(${(scale -= .1)})`;
  }
}

function pan(e: MouseEvent) {
  if(e.buttons) {
    let container = e.currentTarget as HTMLDivElement;
    let canvas = container.children[0] as HTMLCanvasElement;

    panX += e.movementX;
    panY += e.movementY;

    canvas.style.translate = `${panX}px ${panY}px`;
  }
}
</script>

<template>
  <div id="string-graph-card" class="max-w-3/4 overflow-hidden">
    <div id="stop-detail" class="flex items-center mx-8"> --- hover over a stop to see details ---</div>
    <div @wheel="zoom" @mousemove="pan" class="size-full cursor-move">
      <canvas id="graphCanvas" class="w-full"></canvas>
  </div></div>
</template>

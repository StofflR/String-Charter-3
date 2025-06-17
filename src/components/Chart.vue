<script lang="ts" setup>
import { appInstance } from '../AppSettings';
import { ref } from 'vue';

let scaling = false;
let selectedCursor = ref('grab');

// change  cursor on shift key press
document.addEventListener('keydown', (event) => {
  if (event.shiftKey) {
    selectedCursor.value = appInstance.flipAxis.value ? 'ew-resize' : 'ns-resize';
  } else {
    selectedCursor.value = 'grab';
  }
});

document.addEventListener('keyup', () => {
  selectedCursor.value = 'grab';
});



function scale(event: MouseEvent) {
  let dx = event.movementX;
  let dy = event.movementY;
  if (!scaling)
    return
  const canvas = document.getElementById('graphCanvas');
  if (!canvas || !canvas.contains(event.target as Node)) {
    return;
  }

  if (event.shiftKey) {
    appInstance.scale.value -= 0.5 * (appInstance.flipAxis.value ? dx : dy);
  } else {
    appInstance.offset.value -= 0.5 * (appInstance.flipAxis.value ? dx : dy);
  }
  appInstance.scale.value = Math.max(0, Math.min(appInstance.scale.value, 100));
  appInstance.offset.value = Math.max(0, Math.min(appInstance.offset.value, 100));
  appInstance.updateViewBox(appInstance.scale.value, appInstance.offset.value);
}

document.addEventListener("mousemove", scale);
document.addEventListener("mousedown", () => { scaling = true; });
document.addEventListener("mouseup", () => { scaling = false; });
document.addEventListener("wheel", (event) => {

  const canvas = document.getElementById('graphCanvas');
  if (!canvas || !canvas.contains(event.target as Node)) {
    return;
  }

  let delta = event.deltaY;
  appInstance.geographicScale.value += delta / 10;
  appInstance.geographicScale.value = Math.max(30, Math.min(appInstance.geographicScale.value, 200));
  appInstance.generateStringGraph();
});

</script>


<template>
  <div id="string-graph-card" class="flex w-full h-full">
    <div id="graphCanvas" class="flex w-full h-full" v-bind:style="{cursor: selectedCursor}"></div>
  </div>
</template>

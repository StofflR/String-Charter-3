<script setup lang="ts">
import { appInstance } from "@/AppSettings.ts";

let scale = appInstance.scale;
let offset = appInstance.offset;

</script>

<template>
  <div id="slider-controls" class="flex flex-col items-center justify-center gap-4">
    <div class="flex items-center gap-2">
      <label for="view-slider" class="text-sm">Scale:</label>
      <input type="range" id="view-slider" min="0" max="100" value="100" v-model="scale"
        @input="appInstance.updateViewBox(scale, offset)" class="slider w-full">
    </div>
    <div class="flex items-center gap-2">
      <label for="offset-slider" class="text-sm">Offset:</label>
      <input type="range" id="offset-slider" min="0" max="100" v-model="offset"
        @input="appInstance.updateViewBox(scale, offset)" class="slider w-full">
    </div>
  </div>
</template>

<style scoped></style>
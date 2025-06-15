<script setup lang="ts">

import { appInstance } from "@/AppSettings.ts";


let sanitized = appInstance.sanitized;
let geographicScale = appInstance.geographicScale
let diagonalTilt = appInstance.diagonalTilt;
let colors = appInstance.colors;

</script>

<template>
  <label class="text-1xl font-extrabold bg-clip-text drop-shadow-lg mb-4">General settings:</label>

  <label for="sanitice-switch" class="ml-6 flex items-center cursor-pointer">
    <span class="mr-3 text-gray-700 font-medium">Sanitize input</span>
    <div class="relative">
      <input id="sanitice-switch" type="checkbox" class="sr-only peer" @change="appInstance.generateStringGraph()"
        v-model="sanitized">
      <div class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
      <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition">
      </div>
    </div>
  </label>

  <div class="flex items-center gap-2">
    <label for="distance-scale-slider" class="text-sm">Scale geographic distance:</label>
    <input type="range" id="distance-scale-slide" min="30" max="200" v-model="geographicScale" @change="appInstance.generateStringGraph()" class="slider w-full">
  </div>
  <div class="flex items-center gap-2">
    <label for="x-tilt-slider" class="text-sm">Tilt x label:</label>
    <input type="range" id="x-tilt-slider" min="-90" max="90" v-model="diagonalTilt" @change="appInstance.generateStringGraph()" class="slider w-full">
  </div>
  <label class="text-1xl font-extrabold bg-clip-text drop-shadow-lg mb-4">Color settings: </label>


  <div v-for="(item, index) in colors" :key="index" class="flex mb-1">
    <input :id="'colorkey'+index" type="text" v-model="item.keys" class="rounded border border-gray-300 mr-1" @input="appInstance.generateStringGraph()">
    <input :id="'colorval'+index" type="color" v-model="item.color" @change="appInstance.generateStringGraph()">
  </div>
  <button @click="colors.push({keys:''})">Add Color</button>


</template>

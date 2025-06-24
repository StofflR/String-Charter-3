<script setup lang="ts">

import {appInstance} from "@/AppSettings.ts";
import { StrokeDashPattern } from "../interfaces";


let sanitized = appInstance.sanitized;
let geographicScale = appInstance.geographicScale
let diagonalTilt = appInstance.diagonalTilt;
let tripstyle = appInstance.tripstyle;
let radius = appInstance.radius;
let strokewidth = appInstance.strokewidth;
let tiltable = appInstance.flipAxis;

</script>

<template>
  <div class="mr-4 justify-center ml-4 mb-4">
    <hr class="my-3 border-gray-200"/>

    <label class="text-1xl font-extrabold bg-clip-text drop-shadow-lg mb-4">General settings:</label>

    <div class="flex items-center gap-2">
      <label for="sanitice-switch" class="flex items-center cursor-pointer">
        <span class="mr-3 text-gray-700 text-sm">Sanitise input</span>
        <div class="relative">
          <input id="sanitice-switch" type="checkbox" class="sr-only peer" @change="appInstance.generateStringGraph()"
                 v-model="sanitized">
          <div class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
          <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition">
          </div>
        </div>
      </label>
    </div>
    <div class="flex items-center gap-2">
      <label for="distance-scale-slider" class="text-sm">Scale geographic distance:</label>
      <input type="range" id="distance-scale-slide" min="30" max="200" v-model="geographicScale"
             @input="appInstance.generateStringGraph()" class="slider w-full">
    </div>

    <div class="flex items-center gap-2" v-if="tiltable == true">
      <label for="x-tilt-slider" class="text-sm">Tilt x label:</label>
      <input type="range" id="x-tilt-slider" min="-90" max="0" v-model="diagonalTilt"
             @input="appInstance.generateStringGraph()" class="slider w-full">
    </div>

    <hr class="my-3 border-gray-200"/>
    <label class="text-1xl font-extrabold bg-clip-text drop-shadow-lg mb-4">Colour settings: </label>

    <div class="flex items-center gap-2">
      <label for="radius-slider" class="text-sm">Circle Radius:</label>
      <input type="range" id="radius-slider" min="1" max="10" v-model="radius"
             @input="appInstance.generateStringGraph()" class="slider w-full">
    </div>
    <div class="flex items-center gap-2 mb-4">
      <label for="strokewidth-slider" class="text-sm">Stroke Width:</label>
      <input type="range" id="strokewith-slider" min="1" max="10" v-model="strokewidth"
             @input="appInstance.generateStringGraph()" class="slider w-full">
    </div>
    <div class="flex justify-center gap-2 mb-4">
      <button @click="tripstyle.push({keys:''})">Add Colour</button>
    </div>
    <div v-for="(item, index) in tripstyle" :key="index" class="flex mb-1">
      <input :id="'colorkey'+index" type="text" v-model="item.keys" class="rounded border border-gray-300 mr-1"
             @input="appInstance.generateStringGraph()">
      <input :id="'colorval'+index" type="color" v-model="item.color" @change="appInstance.generateStringGraph()">
      <select v-model="item.strokedash" @change="appInstance.generateStringGraph()" class="rounded border border-gray-300 ml-1">
        <option v-for="option in StrokeDashPattern" :value="option">{{option}}</option>
      </select>
    </div>
  </div>
</template>

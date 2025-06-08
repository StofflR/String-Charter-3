<script setup lang="ts">
import { appInstance } from "@/AppSettings.ts";
import SliderControls from "@/components/SliderControls.vue";
import ControlSwitches from "@/components/ControlSwitches.vue";
import ExportButton from "@/components/ExportButton.vue";

let routeFilter = appInstance.routeFilter;
let showOnlySelected = appInstance.showOnlySelected;
let availableRoutes = appInstance.availableRoutes;
let selectedRoutes = appInstance.routesSelected;
</script>


<template>
  <ControlSwitches />
  <SliderControls />
  <label for="route-filter" class="mt-6">Filter routes:</label>
  <input id="rout-filter" v-model="routeFilter"
    class="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">

  <label for="route-select" class="mt-6">Select a route:</label>

  <label for="available-switch" class="ml-6 flex items-center cursor-pointer">
    <span class="mr-3 text-gray-700 font-medium">Sanitize input</span>
    <div class="relative">
      <input id="available-switch" type="checkbox" class="sr-only peer" v-model="showOnlySelected">
      <div class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
      <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition">
      </div>
    </div>
  </label>

  <div class="flex items-center justify-center">
    <button id="clearButton" @click="appInstance.clearRouteFilter()"
      class="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-md transition transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
      Clear
    </button>
  </div>

  <div>
    <div id="route-select"
      class="h-100 overflow-scroll block w-full appearance-none bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
      <!-- <option disabled selected value> -- select a route -- </option> -->
      <div @click="appInstance.toggleSelection(item)" v-for="item in availableRoutes"
        :class="{ 'bg-gray-200': selectedRoutes.includes(item) }" :key="item" :value="item" class="py-3 px-4">
        {{ item }}
      </div>
    </div>
  </div>
  <ExportButton />
</template>

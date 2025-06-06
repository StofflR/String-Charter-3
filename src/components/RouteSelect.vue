<script setup lang="ts">
import {appInstance} from "@/AppSettings.ts";
import SliderControls from "@/components/SliderControls.vue";
import ControlSwitches from "@/components/ControlSwitches.vue";
import ExportButton from "@/components/ExportButton.vue";

let routeFilter = appInstance.routeFilter;
let showOnlySelected = appInstance.showOnlySelected;
let availableRoutes = appInstance.availableRoutes;
let selectedRoutes = appInstance.routesSelected;
</script>


<template>
  <ControlSwitches/>
  <SliderControls/>
  <label for="route-filter" class="mt-6">Filter routes:</label>
  <input id="rout-filter" v-model="routeFilter"
         class="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">

  <label for="route-select" class="mt-6">Select a route:</label>
  <input type="checkbox" v-model="showOnlySelected"/>Show Selected
  <a @click="appInstance.clearRouteFilter()">Clear</a>
  <div>
    <div id="route-select"
         class="h-100 overflow-scroll block w-full appearance-none bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
      <!-- <option disabled selected value> -- select a route -- </option> -->
      <div @click="appInstance.toggleSelection(item)" v-for="item in availableRoutes" :class="{ 'bg-gray-200': selectedRoutes.includes(item) }" :key="item" :value="item" class="py-3 px-4">
        {{ item }}
      </div>
    </div>
  </div>
  <ExportButton/>
</template>


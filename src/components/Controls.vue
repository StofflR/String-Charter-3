<script setup lang="ts">
import VisualSettings from "@/components/VisualSettings.vue";
import BaseControls from "@/components/BaseControls.vue";
import DragDropArea from "@/components/DragDropArea.vue";
import RouteSelect from "./RouteSelect.vue";
import Chart from "@/components/Chart.vue";
import {appInstance} from "@/AppSettings.ts";

let sideMenuComponents = appInstance.sideMenuComponents;
let expandView = appInstance.expandView;
let currentComponent = appInstance.currentComponent;

</script>


<template>
  <div class="flex flex-row h-full w-screen">
    <div class="p-2 flex gap-2 w-max-2/10" v-for="item in sideMenuComponents">
      <button v-if="expandView || item.component == null" class="items-center w-12 h-12 shadow border"
              :class="[item.component == currentComponent && expandView ? 'border-indigo-500' : 'border-transparent']"
              @click="appInstance.swapViewComponent(item.component)">
        <img :src="item.icon" alt="" class="w-full h-full scale-300">
      </button>
    </div>
    <div class="flex h-min w-full items-stretch p-4">
      <BaseControls/>
    </div>
  </div>
  <div class="flex h-full w-full">
    <div class="flex flex-col w-2/10 h-screen  border-r border-gray-300" v-if="expandView">
      <DragDropArea v-if="currentComponent != 'RouteSelect' && currentComponent != 'VisualSettings' && expandView"/>
      <RouteSelect v-if="currentComponent == 'RouteSelect' && expandView"/>
      <VisualSettings v-if="currentComponent == 'VisualSettings' && expandView"/>
    </div>
    <div class="flex flex-col w-full h-full">
      <Chart/>
    </div>
  </div>
</template>

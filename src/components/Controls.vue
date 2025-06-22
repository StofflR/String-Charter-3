<script setup lang="ts">
import VisualSettings from "@/components/VisualSettings.vue";
import BaseControls from "@/components/BaseControls.vue";
import DragDropArea from "@/components/DragDropArea.vue";
import RouteSelect from "./RouteSelect.vue";
import uploadIcon from "../assets/icons/upload_file_24dp.svg";
import trainIcon from "../assets/icons/train_24dp.svg";
import menuIcon from "../assets/icons/menu_24dp.svg";
import settingIcon from "../assets/icons/display_settings_24dp.svg";

import {ref} from "vue";
import Chart from "@/components/Chart.vue";

let expandView = ref(false);
let currentComponent = ref("");
let sideMenuComponents = [
  {
    "name": "Menu",
    "component": null,
    "icon": menuIcon
  }, {
    "name": 'Upload File',
    "component": "DragDropArea",
    "icon": uploadIcon
  }, {
    "name": 'Select Route',
    "component": "RouteSelect",
    "icon": trainIcon
  }, {
    "name": "Visual Settings",
    "component": "VisualSettings",
    "icon": settingIcon
  }
]

function swapComponent(component: string | null) {
  if (!component) {
    expandView.value = !expandView.value;
    return;
  }
  currentComponent.value = component;
}
</script>


<template>
  <div class="flex flex-row h-full w-screen">
    <div class="p-2 flex gap-2 w-max-2/10" v-for="item in sideMenuComponents">
      <button v-if="expandView || item.component == null" class="items-center w-12 h-12 shadow border"
              :class="[item.component == currentComponent && expandView ? 'border-indigo-500' : 'border-transparent']"
              @click="swapComponent(item.component)">
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

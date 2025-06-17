<script setup lang="ts">
import VisualSettings from "@/components/VisualSettings.vue";
import BaseControls from "@/components/BaseControls.vue";
import DragDropArea from "@/components/DragDropArea.vue";
import RouteSelect from "./RouteSelect.vue";
import uploadIcon from "../assets/icons/upload_file_24dp.svg";
import trainIcon from "../assets/icons/train_24dp.svg";
import menuIcon from "../assets/icons/menu_24dp.svg";
import settingIcon from "../assets/icons/display_settings_24dp.svg";
import collapseIcon from "../assets/icons/keyboard_arrow_up_24dp.svg";

import {ref} from "vue";

let expandView = ref(false);
let showSettings = ref(false);
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
  expandView.value = false;
  showSettings.value = true;
  currentComponent.value = component;
}
</script>


<template>
  <span class="flex flex-col h-full w-screen">
    <div class="flex h-min w-screen items-stretch">
      <div class="flex">
        <div class="p-2 flex gap-2 w-max-3/10" v-for="item in sideMenuComponents">
          <button v-if="expandView || item.component == null" class="items-center w-12 h-12 shadow border"
                  :class="[item.component == currentComponent && expandView ? 'border-indigo-500' : 'border-transparent']"
                  @click="swapComponent(item.component)">
            <img :src="item.icon" alt="" class="w-full h-full scale-300">
          </button>
        </div>
      </div>
      <BaseControls/>
      <div class="flex-grow flex items-end p-2 gap-2 ">
        <button class="absolute inset-y-19 right-4 w-12 h-12 shadow border" v-if="showSettings"
                @click="showSettings = !showSettings">
          <img :src="collapseIcon" alt="" class="w-full h-full scale-300">
        </button>
      </div>
    </div>
    <div class="w-full h-min">
      <DragDropArea v-if="currentComponent == 'DragDropArea' && showSettings"/>
      <RouteSelect v-if="currentComponent == 'RouteSelect' && showSettings"/>
      <VisualSettings v-if="currentComponent == 'VisualSettings' && showSettings"/>
    </div>
  </span>
</template>

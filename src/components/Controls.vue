<script setup lang="ts">
import VisualSettings from "@/components/VisualSettings.vue";
import DragDropArea from "@/components/DragDropArea.vue";
import RouteSelect from "./RouteSelect.vue";
import uploadIcon from "../assets/icons/upload_file_24dp.svg";
import trainIcon from "../assets/icons/train_24dp.svg";
import menuIcon from "../assets/icons/menu_24dp.svg";
import settingIcon from "../assets/icons/display_settings_24dp.svg";
import { ref } from "vue";

let expandView = ref(true);
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
  expandView.value = true;
  currentComponent.value = component;
}
</script>


<template>
  <div class="flex items-top h-full border-right">
    <div class="p-2 flex flex-col gap-2 h-full">
      <div v-for="item in sideMenuComponents">
        <button class="items-center rounded-md w-12 h-12 shadow border"
        :class="[item.component == currentComponent && expandView ? 'border-indigo-500' : 'border-transparent']"
        @click="swapComponent(item.component)">
          <img :src="item.icon" alt="" class="w-full h-full scale-300">
        </button>
      </div>
    </div>
    <div class="w-max-1/10 pl-3 overflow-y-scroll">
      <DragDropArea v-if="currentComponent == 'DragDropArea' && expandView" />
      <RouteSelect v-if="currentComponent == 'RouteSelect' && expandView" />
      <VisualSettings v-if="currentComponent == 'VisualSettings' && expandView" />
    </div>
  </div>
</template>

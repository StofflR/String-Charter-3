<script setup lang="ts">
import VisualSettings from "@/components/VisualSettings.vue";
import DragDropArea from "@/components/DragDropArea.vue";
import RouteSelect from "./RouteSelect.vue";
import uploadIcon from "../assets/icons/upload_file_24dp.svg";
import trainIcon from "../assets/icons/train_24dp.svg";
import menuIcon from "../assets/icons/menu_24dp.svg";
import settingIcon from "../assets/icons/display_settings_24dp.svg";
import {ref} from "vue";

let expandView = ref(true);
let currentComponent = ref("DragDropArea");
let sideMenuComponents = [
  {
    "name": "Menu",
    "component": null,
    "icon": menuIcon
  },
  {
    "name": 'Upload File',
    "component": "DragDropArea",
    "icon": uploadIcon
  },
  {
    "name":
        'Select Route',
    "component":
        "RouteSelect",
    "icon":
    trainIcon
  }, {
  "name" : "Visual Settings",
    "component": "VisualSettings",
    "icon" : settingIcon
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
  <div class="items-top w-max-2/10 h-full">
    <span v-for="item in sideMenuComponents">
      <button class="items-center rounded-md w-12 h-12"
            @click="swapComponent(item.component)">
        <img :src="item.icon" alt="" class="w-full h-full scale-300">
      </button>
    </span>
    <div class="w-max-2/20">
    <DragDropArea v-if="currentComponent == 'DragDropArea' && expandView"/>
    <RouteSelect v-if="currentComponent == 'RouteSelect' && expandView"/>
    <VisualSettings v-if="currentComponent == 'VisualSettings' && expandView"/>
    </div>
  </div>

</template>

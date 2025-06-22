<script setup lang="ts">
import {ref} from 'vue';
import {appInstance} from '../AppSettings';

const fileInput = ref<HTMLInputElement | null>(null);
const dataFiles = appInstance.dataFiles;
const triggerFileUpload = () => {
  fileInput.value?.click();
};

let activeIndex = ref(-1);

function showAbout() {
  alert("String Charter\nVersion 3.0.0\nMIT License 2025");
}

function toggleSubMenu(index: number) {
  index = activeIndex.value == index ? -1 : index;
  activeIndex.value = index;
}

function handleUploadButton(e: Event) {
  const inputElement = e.target as HTMLInputElement;
  if (inputElement && inputElement.files && inputElement.files.length > 0)
    appInstance.handleGtfsUpload(inputElement.files[0]);
}
</script>


<template>
  <input ref="fileInput" @change="handleUploadButton" type="file" id="file-input" accept=".zip" class="hidden"/>
  <nav class="cursor-pointer bg-gray-100">
    <ul class="flex">
      <li>
        <div @click="toggleSubMenu(0)" class="px-1 hover:bg-gray-300 " :class="{'bg-gray-300': activeIndex == 0}">
          File
        </div>
        <ul class="absolute z-1 bg-gray-300 rounded-b" v-show="activeIndex == 0">
          <li class="px-1 hover:bg-gray-400" @click="triggerFileUpload">
            Open...
          </li>
          <li v-for="dataFile in dataFiles" class="px-1 hover:bg-gray-400"
              @click="appInstance.handleGtfsUpload(dataFile.data)">
            Load {{ dataFile.name }}
          </li>
        </ul>
      </li>
      <li>
        <div @click="toggleSubMenu(1)" class="px-1 hover:bg-gray-300 " :class="{'bg-gray-300': activeIndex == 1}">
          View
        </div>
        <ul class="absolute z-1 bg-gray-300 rounded-b" v-show="activeIndex == 1">
          <li class="px-1 hover:bg-gray-400" v-for="(sub, subIndex) in appInstance.sideMenuComponents" :key="subIndex"
              @click="appInstance.swapViewComponent(sub.component)">
            {{ sub.component }}
          </li>
        </ul>
      </li>
      <li>
        <div @click="toggleSubMenu(2)" class="px-1 hover:bg-gray-300 " :class="{'bg-gray-300': activeIndex == 2 }">
          Export
        </div>
        <ul class="absolute z-1 bg-gray-300 rounded-b" v-show="activeIndex == 2">
          <li class="px-1 hover:bg-gray-400" @click="appInstance.svgGen?.exportAsSVG">
            Export as SVG
          </li>
        </ul>
      </li>
      <li>
        <div @click="showAbout()" class="px-1 hover:bg-gray-300 " :class="{'bg-gray-300': activeIndex == 3}">
          About
        </div>
      </li>
    </ul>
  </nav>
</template>

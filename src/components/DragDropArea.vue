<template>
  <label for="drop-area" class="text-1xl font-extrabold bg-clip-text drop-shadow-lg mb-4">Select or Upload data</label>
  <div @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop"
       :class="{ 'bg-gray-200': isDragging }" id="drop-area" @click="fileInput?.click()"
       class="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer transition hover:bg-gray-100 ">
    <p v-html="fileNameLabel"></p>
    <input ref="fileInput" @change="handleUploadButton" type="file" id="file-input" accept=".zip" class="hidden"/>
  </div>
  <label for="drop-area" class="text-1xl font-extrabold bg-clip-text drop-shadow-lg mb-4">Available data sets:</label>
  <div v-for="dataFile in dataFiles" class="flex items-left justify-left mt-4 mb-4 mx-2">
    <button @click="appInstance.handleGtfsUpload(dataFile.data)"
            class="px-6 py-3 bg-gradient-to-r w-full from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-md transition transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
      Load {{dataFile.name}}
    </button>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {appInstance} from "../AppSettings.ts";

const fileInput = ref<HTMLInputElement | null>(null);
const fileNameLabel = ref("Drag & drop a GTFS zip file here, or <span class='text-blue-600 underline'>click to select</span>");
const isDragging = ref(false);
const dataFiles = appInstance.dataFiles;
import obbData from '../assets/datasets/GTFS_OP_2025_obb.zip';

appInstance.fetchDataFile("OBB 2025 GTFS", obbData);
function handleUploadButton(e: Event) {
  const inputElement = e.target as HTMLInputElement;
  if (inputElement && inputElement.files && inputElement.files.length > 0)
    appInstance.handleGtfsUpload(inputElement.files[0]);
}

const onDragOver = () => {
  isDragging.value = true;
}

const onDragLeave = () => {
  isDragging.value = false;
}

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    appInstance.handleGtfsUpload(files[0]);
  }
}

</script>
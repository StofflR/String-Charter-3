<template>
  <label for="drop-area" class="mt-8">Select a GTFS zip</label>
  <div @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop"
       :class="{ 'bg-gray-200': isDragging }" id="drop-area" @click="fileInput?.click()"
       class="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer transition hover:bg-gray-100 ">
    <p v-html="fileNameLabel"></p>
    <input ref="fileInput" @change="handleUploadButton" type="file" id="file-input" accept=".zip" class="hidden"/>
  </div>
  <div class="mt-2 text-gray-700" id="file-name-label"></div>
  <div class="flex items-center justify-center mt-4 mb-4 mx-2">
    <button id="exampleData" @click="handleGtfsUpload(obbDataFile)"
            class="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-md transition transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
      Load Example OBB Data
    </button>
  </div>
</template>

<script setup lang="ts">
import obbData from "../assets/datasets/GTFS_OP_2025_obb.zip";
import {ref} from "vue";

import {handleGtfsUpload} from '@/components/Controls.vue'

const fileInput = ref<HTMLInputElement | null>(null);
const fileNameLabel = ref("Drag & drop a GTFS zip file here, or <span class='text-blue-600 underline'>click to select</span>");
const isDragging = ref(false);

let obbDataFile: File | null = null;

fetch(obbData)
    .then(res => res.blob()) // Gets the response and returns it as a blob
    .then(blob => {
      obbDataFile = new File([blob], "GTFS_OP_2025_obb.zip", {type: "application/zip"});
    });

function handleUploadButton(e: Event) {
  const inputElement = e.target as HTMLInputElement;

  if (inputElement && inputElement.files && inputElement.files.length > 0)
    handleGtfsUpload(inputElement.files[0]);
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
    fileNameLabel.value = "Selected file: " + files[0].name;
    handleGtfsUpload(files[0]);
  }
}

</script>
<script lang="ts">
export default {
  name: 'DragDropArea',
  props: {
    fileNameLabel: {
      type: String,
      default: "Drag & drop a GTFS zip file here, or <span class='text-blue-600 underline'>click to select</span>"
    }
  },
}
</script>
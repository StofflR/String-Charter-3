<template>
  <div class="mr-4 justify-center ml-4">
    <hr class="my-3 border-gray-200"/>
    <div class="flex">
      <div class="w-2/5 mr-10">
        <div @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop"
             :class="{ 'bg-gray-200': isDragging }" id="drop-area" @click="fileInput?.click()"
             class="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer transition hover:bg-gray-100 ">
          <p v-html="fileNameLabel" class="flex w-full gap-2"/>
          <input ref="fileInput" @change="handleUploadButton" type="file" id="file-input" accept=".zip" class="hidden"/>
        </div>
      </div>
      <div class="w-min">
        <label for="route-select" class="text-1xl w-max font-extrabold bg-clip-text drop-shadow-lg">Available data
          sets:</label>
        <select id="route-select" class="form-control p-2 border border-gray-300 rounded-lg"
                @change="handleSelection($event)">
          <option value="" selected disabled>Choose Route:</option>
          <option v-for="dataFile in dataFiles" :value="dataFile.name" :key="dataFile.name">Load {{
              dataFile.name
            }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {appInstance} from "../AppSettings.ts";

const fileInput = ref<HTMLInputElement | null>(null);
const fileNameLabel = ref("Drag & drop a GTFS zip file here, or <span class='text-blue-600 underline'> click to select </span>");
const isDragging = ref(false);
const dataFiles = appInstance.dataFiles;

function handleSelection(event: Event) {
  if (!event.target || !(event.target instanceof HTMLSelectElement)) return;
  let selectedValue = event.target.value;
  let data = appInstance.dataFiles.value.find(file => file.name === selectedValue)?.data;
  if (!data) return;
  appInstance.handleGtfsUpload(data);
}

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
<script setup lang="ts">
import { ref } from 'vue';
import { appInstance } from '../AppSettings';

const fileInput = ref<HTMLInputElement | null>(null);
const dataFiles = appInstance.dataFiles;
const triggerFileUpload = () => {
  fileInput.value?.click();
};

let activeIndex = ref(-1);
let menus = [
        {
            title: 'View',
            action: null,
            submenu: [
                {
                    title: 'tbd',
                    action: example
                }, 
            ]
        },
    ];

function example() {
    alert(123);
}

function toggleSubMenu(index: number) {
    index = activeIndex.value == index ? -1 : index;
    activeIndex.value = index;
}

import obbData from '../assets/datasets/GTFS_OP_2025_obb.zip';
import goNortheastData from '../assets/datasets/gonortheast_1747916855.zip'
appInstance.fetchDataFile("ÖBB 2025", obbData);
appInstance.fetchDataFile("GO NORTHEAST 2025", goNortheastData);

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
            <li v-for="dataFile in dataFiles" class="px-1 hover:bg-gray-400" @click="appInstance.handleGtfsUpload(dataFile.data)">
                Load {{dataFile.name}}
            </li>
            </ul>
        </li>
        <li v-for="(menu, index) in menus" :key="index" @click="menu.action">
            <div @click="toggleSubMenu(index+1)" class="px-1 hover:bg-gray-300 " :class="{'bg-gray-300': activeIndex == index+1}">
                {{ menu.title }}
            </div>
            <ul class="absolute z-1 bg-gray-300 rounded-b" v-show="activeIndex == index+1">
                <li class="px-1 hover:bg-gray-400" v-for="(sub, subIndex) in menu.submenu" :key="subIndex" @click="sub.action">
                    {{ sub.title }}
                </li>
            </ul>
        </li>
    </ul>
</nav>
</template>

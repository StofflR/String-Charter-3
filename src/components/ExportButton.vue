<template>
  <div class="flex items-center justify-center mt-4 mx-2">
    <button id="exportButton" @click="appInstance.exportAsSVG()"
            class="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-md transition transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
      Export
      as SVG
    </button>
  </div>
</template>

<script setup lang="ts">
import {appInstance} from "@/AppSettings.ts";
</script>
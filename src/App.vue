<script setup lang="ts">
import Controls from './components/Controls.vue'
import Chart from './components/Chart.vue'
import TopMenu from './components/TopMenu.vue';
</script>

<template>
  <span class="flex-col">
    <TopMenu/>
    <Controls/>
  </span>
  <Chart/>
</template>

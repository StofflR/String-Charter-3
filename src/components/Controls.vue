<script setup lang="ts">
import SliderControls from "@/components/SliderControls.vue";
import ExportButton from "@/components/ExportButton.vue";
import ControlSwitches from "@/components/ControlSwitches.vue";
import DragDropArea from "@/components/DragDropArea.vue";
import RouteSelect from "./RouteSelect.vue";

</script>


<template>
  <div id="container">
    <div id="controls">
      <h1 class="mb-4">String Charter 3</h1>
      <label for="drop-area" class="mt-8">Select a GTFS zip</label>
      <DragDropArea/>
      <SliderControls/>
      <RouteSelect/>
      <ControlSwitches/>
      <ExportButton/>
    </div>
  </div>
</template>

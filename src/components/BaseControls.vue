<script setup lang="ts">
import ControlSwitches from "@/components/ControlSwitches.vue";
import SliderControls from "@/components/SliderControls.vue";
import {appInstance} from "@/AppSettings.ts";
import {watch} from "vue";

let availableRoutes = appInstance.availableRoutes;

function selectRoute(event: Event) {
  if (!event.target || !(event.target instanceof HTMLSelectElement)) return;
  let selectedValue = event.target.value;
  appInstance.selectSingleRoute(selectedValue);
}

watch(appInstance.routesSelected, async (newSelection, oldSelection) => {
  let firstNewRoute = newSelection[0];
  let firstOldRoute = oldSelection[0];
  if (firstNewRoute && firstOldRoute && firstNewRoute !== firstOldRoute) {
    let singleRouteSelect = document.getElementById('single-route-select') as HTMLSelectElement;
    if (singleRouteSelect) {
      singleRouteSelect.value = firstNewRoute;
    }
  }
})

</script>

<template>
  <ControlSwitches class="mr-6"/>
  <div class="w-min flex items-center gap-4 mr-6">
    <label for="route-select" class="text-1xl w-max font-extrabold bg-clip-text drop-shadow-lg mr-4">Available routes:</label>
    <select id="single-route-select" class="form-control p-2 border border-gray-300 rounded-lg"
            @change="selectRoute($event)">
      <option value="" selected disabled>Choose Route:</option>
      <option v-for="item in availableRoutes" :key="item" :value="item"
              class="py-3 px-4">
        {{ item }}
      </option>
    </select>
  </div>
  <SliderControls/>
</template>

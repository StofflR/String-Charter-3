<script lang="ts">
import {ref} from "vue";
import {loadedRoutes, createGraph} from "@/components/Controls.vue";

export default {
  name: 'RouteSelect',
  props: {
    trips: {
      type: Array,
      required: true
    },
    routeNames: {
      type: Array,
      required: true
    },
  }
}
export const routes_selected = ref([]);

export function toggleSelection(route: string) {
  let index = routes_selected.value.indexOf(route);
  if (index === -1)
    routes_selected.value.push(route);
  else
    routes_selected.value.splice(index, 1);
  routeUpdate();
}

export async function routeUpdate(trips: Trip[]) {
  trips = [];

  for (let i = 0; i < routes_selected.value.length; i++) {
    const route = loadedRoutes.find((route) => route.name === routes_selected.value[i]);

    for (let j = 0; j < route?.trips.length; j++) {
      trips.push(route?.trips[j]);
    }
  }

  if (trips)
    createGraph(trips);
}
</script>

<script setup lang="ts">

import {computed, ref} from "vue";
import {generateStringGraph} from "@/string_graph.ts";
import {routeNames} from "@/components/Controls.vue";


function clearRouteFilter(trips: Trip[], routeNames: string[]) {
  routes_selected.value = [];
  routeFilter.value = "";
  showOnlySelected.value = false;
  routeUpdate(trips);
}

let routeFilter = ref('');
let showOnlySelected = ref(false);

const filteredRoutes = computed(() => {
  if (showOnlySelected.value) {
    return routes_selected.value;
  } else {
    return routeNames.value.filter(option =>
        option.toLowerCase().includes(routeFilter.value.toLocaleLowerCase())
    )
  }
});


</script>

<template>
  <label for="route-filter" class="mt-6">Filter routes:</label>
  <input id="rout-filter" v-model="routeFilter"
         class="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">

  <label for="route-select" class="mt-6">Select a route:</label>
  <input type="checkbox" v-model="showOnlySelected"/>Show Selected
  <a @click="clearRouteFilter(trips, routeNames)">Clear</a>
  <div>
    <div id="route-select"
         class="h-100 overflow-scroll block w-full appearance-none bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
      <!-- <option disabled selected value> -- select a route -- </option> -->
      <div @click="toggleSelection(option)" :class="{ 'bg-gray-200': routes_selected }"
           v-for="option in filteredRoutes" :key="option" :value="option"
           class="py-3 px-4 "
      > {{ option }}
      </div>
    </div>
  </div>
</template>


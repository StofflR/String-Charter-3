<template>
  <div class="flex items-center justify-center mt-4 mx-2" id="flip-axis">
    <label for="axis-switch" class="flex items-center cursor-pointer">
      <span class="mr-3 text-gray-700 font-medium">Flip Axis</span>
      <div class="relative">
        <input id="axis-switch" type="checkbox" class="sr-only peer"
               @change="generateStringGraph(trips, flip_axis, compare)" v-model="flip_axis">

        <div class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
        <div
            class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition"></div>
      </div>
    </label>
    <label for="compare-switch" class="ml-6 flex items-center cursor-pointer">
      <span class="mr-3 text-gray-700 font-medium">Compare</span>
      <div class="relative">
        <input id="compare-switch" type="checkbox" class="sr-only peer"
               @change="generateStringGraph(trips, flip_axis, compare)" v-model="compare">
        <div class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
        <div
            class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition"></div>
      </div>
    </label>
  </div>
</template>


<script setup lang="ts">
import {ref} from 'vue';

const flip_axis = ref(false);
const compare = ref(false);
</script>

<script lang="ts">
import {generateStringGraph} from "@/string_graph.js";

export default {
  name: 'ControlSwitches',
  methods: {
    update() {
      this.$emit('update', {
        flip_axis: flip_axis.value,
        compare: compare.value
      });
    }
  },
  props: {
    trips: {
      type: Array,
      required: true
    }
  },
}
</script>
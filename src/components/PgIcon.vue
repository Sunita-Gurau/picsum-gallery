<template>
  <div v-if="svgIcon" class="inline-block align-middle">
    <span :innerHTML="svgIcon" :class="svgFill" class="pg-transition"></span>
  </div>
</template>

<script lang="ts" setup>
import * as Icons from '../Utils/iconUtils'
import { computed } from 'vue'

interface KeyValue {
  [key: string]: string
}

const icons: KeyValue = Icons as KeyValue

type IconType = {
  iconName: string
  svgFill?: string
}

const props = withDefaults(defineProps<IconType>(), {
  svgFill: 'fill-gray-1',
})

const svgIcon = computed<string>(() => {
  return icons[props.iconName]
})
</script>

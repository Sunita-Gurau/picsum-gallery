<template>
  <main>
    <div class="w-full bg-red-500 h-screen">
      <h1>Picsum Gallery</h1>
      {{ picsumImageList }}
    </div>
  </main>
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { getPicsumImageList } from '../api/picsumGalleryApi'
import { makeApiRequest } from '../api/apiHelper'

interface PicsumImageType {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

const picsumImageList = ref<PicsumImageType[]>([])

const fetchPicsumImageList = () => {
  makeApiRequest<PicsumImageType[]>(getPicsumImageList())
    .then((response) => {
      picsumImageList.value = response
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}

onBeforeMount(() => {
  fetchPicsumImageList()
})
</script>

<template>
  <main>
    <div class="w-full h-screen">
      <h1>Picsum Gallery</h1>
      <PaginationBar
        class="pt-3"
        :total-items="100"
        :items-per-page="10"
        :current-page="1"
      ></PaginationBar>
    </div>
  </main>
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { getPicsumImageList } from '../api/picsumGalleryApi'
import { makeApiRequest } from '../api/apiHelper'
import PaginationBar from '@/components/PaginationBar.vue'

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

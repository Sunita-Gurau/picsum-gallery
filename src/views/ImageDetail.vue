<template>
  <section v-if="imageDetails" class="px-2 py-32 bg-white md:px-0">
    <div class="container items-center max-w-6xl px-8 mx-auto xl:px-5">
      <div class="flex flex-wrap items-center">
        <div class="w-full md:w-1/2">
          <h1 class="text-4xl font-extrabold text-gray-900 mb-4">{{ imageDetails.author }}</h1>

          <p class="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl">
            This image captures a stunning moment, showcasing the beauty of nature, architecture, or
            human creativity. It tells a story of inspiration, artistry, and vision, making it
            perfect for evoking emotions or setting a specific atmosphere.
            <br />
            <span class="mt-2">
              Image Dimensions: {{ imageDetails.width }}x{{ imageDetails.height }} pixels.
            </span>
          </p>
        </div>
        <div class="w-full md:w-1/2">
          <div class="w-full h-auto overflow-hidden rounded-md shadow-xl">
            <img :src="imageDetails.download_url" :alt="imageDetails.author" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getImageDetail } from '../api/picsumGalleryApi'
import { makeApiRequest } from '../api/apiHelper'

interface ImageDetail {
  id: number
  author: string
  width: number
  height: number
  download_url: string
}

const route = useRoute()
const imageDetails = ref<ImageDetail | null>(null)

const fetchImageDetail = async (id: number) => {
  try {
    const response = await makeApiRequest<ImageDetail>(getImageDetail({ id: id }))
    imageDetails.value = response
  } catch (error) {
    console.error('Error fetching image details:', error)
  }
}

onMounted(() => {
  const imageId = route.params.imageId ? Number(route.params.imageId) : null
  if (imageId) {
    fetchImageDetail(imageId)
  }
})
</script>

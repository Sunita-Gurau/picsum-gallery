<template>
  <main>
    <div class="w-full h-screen">
      <h1
        class="text-4xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-extrabold text-gray-800 animate-header text-center mt-4"
      >
        Picsum Gallery
      </h1>

      <div class="max-w-[100px] mx-4 flex justify-center items-center">
        <p class="mt-2 pr-2">Limit:</p>
        <PgSelect
          v-model="filterParams.limit"
          name="pageSize"
          height="h-7"
          selectType="normalSelect"
          optionSelected="objectLabelEmitted"
          :options="pageSizeOptions"
          @selected-option="handlePageSizeFilter"
        />
      </div>
      <div
        v-if="isLoading"
        class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 m-3"
      >
        <div v-for="image in 100" :key="image" role="status" class="animate-pulse">
          <div class="flex h-48 items-center justify-center rounded bg-gray-300 dark:bg-gray-700">
            <PgIcon iconName="ImageSkeleton" />
          </div>
        </div>
      </div>
      <div
        v-if="picsumImageList.length"
        class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 m-3"
      >
        <figure
          v-for="image in picsumImageList"
          :key="image.id"
          class="relative group overflow-hidden cursor-pointer"
          @click="handleViewDetail(Number(image.id))"
        >
          <img
            :src="image.download_url"
            :alt="`Image by ${image.author}`"
            loading="lazy"
            class="w-full h-full group-hover:scale-110 group transition-all duration-500"
          />
          <figcaption
            class="flex w-full p-3 absolute -bottom-20 left-0 bg-slate-900/60 text-white justify-between items-center invisible group-hover:bottom-0 group-hover:visible transition-all duration-500"
          >
            <div class="flex flex-col gap-y-2">
              <p class="text-lg font-semibold">{{ image.author }}</p>
            </div>
          </figcaption>
        </figure>
      </div>
      <div v-if="!picsumImageList.length" class="h-80 flex justify-center items-center">
        <div>
          <PgIcon iconName="NoData" svgFill="stroke-gray-400" />
          <p class="text-base text-gray-500 my-4">No data Found.</p>
        </div>
      </div>
      <div v-if="picsumImageList.length" class="flex justify-center items-center">
        <PaginationBar
          class="py-6"
          :total-items="totalImages"
          :items-per-page="filterParams.limit"
          :current-page="filterParams.page"
          @handle-page-changed="handlePageNumber"
        ></PaginationBar>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, watch, watchEffect } from 'vue'
import { getPicsumImageList } from '../api/picsumGalleryApi'
import { makeApiRequest } from '../api/apiHelper'
import PaginationBar from '@/components/PaginationBar.vue'
import PgSelect from '@/components/PgSelect.vue'
import PgIcon from '@/components/PgIcon.vue'
import { useRoute, useRouter } from 'vue-router'

export interface PicsumImageType {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}
interface filterParamsType {
  limit: number
  page: number
}
interface PageSizeOption {
  id: number
  label: string
}

const totalImages = 1000
const $route = useRoute()
const $router = useRouter()
const pageSizeOptions = ref<PageSizeOption[]>([
  { id: 100, label: '100' },
  { id: 200, label: '200' },
  { id: 300, label: '300' },
  { id: 400, label: '400' },
  { id: 500, label: '500' },
])
const isLoading = ref<boolean>(false)

const picsumImageList = ref<PicsumImageType[]>([])
const filterParams = ref<filterParamsType>({
  limit: 100,
  page: 1,
})

const handlePageSizeFilter = (option: { id: number; label: string }) => {
  filterParams.value.limit = Number(option.id)
  filterParams.value.page = 1
}

const handlePageNumber = (page: number) => {
  filterParams.value.page = page
}
const handleViewDetail = (imageId: number) => {
  $router.push({
    name: 'viewImageDetail',
    params: { imageId: imageId },
  })
}

const fetchPicsumImageList = () => {
  isLoading.value = true
  const params = {
    page: filterParams.value.page,
    limit: filterParams.value.limit,
  }
  makeApiRequest<PicsumImageType[]>(getPicsumImageList(params))
    .then((response) => {
      picsumImageList.value = response
    })
    .catch((error) => {
      console.log(error, 'error')
    })
    .finally(() => {
      isLoading.value = false
    })
}

watch(
  () => filterParams.value,
  () => {
    $router.push({
      name: 'picsumGallery',
      query: filterParams.value,
    })
    fetchPicsumImageList()
  },
  { deep: true },
)

watchEffect(() => {
  if ($route.query.page && $route.query.limit) {
    const pageNumber = Number($route.query.page)
    const pageSize = Number($route.query.limit)
    filterParams.value.page = pageNumber
    filterParams.value.limit = pageSize
  } else {
    $router.push({
      name: 'picsumGallery',
      query: filterParams.value,
    })
  }
})

onBeforeMount(() => {
  fetchPicsumImageList()
})
</script>

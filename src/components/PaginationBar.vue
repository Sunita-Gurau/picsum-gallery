<template>
  <div :class="totalPages <= 0 ? 'hidden' : 'flex lg:items-center lg:justify-between justify-end'">
    <div class="flex">
      <button
        :disabled="tempPage === 1"
        class="pagination-btn w-8 h-8 -rotate-90"
        @click="handlePageChange(tempPage - 1)"
      >
        <PgIcon iconName="Arrow" svgFill="stroke-gray-400" />
      </button>

      <button
        v-for="(page, index) in displayedPages"
        :key="index"
        :class="{ active: tempPage === Number(page), ellipsis: page === '...' }"
        class="pagination-btn py-0.5 px-2.5 text-sm font-bold text-gray-3 lg:block hidden"
        @click="handlePageChange(Number(page))"
      >
        {{ page }}
      </button>

      <button
        :disabled="tempPage === totalPages"
        class="pagination-btn w-8 h-8 rotate-90"
        @click="handlePageChange(tempPage + 1)"
      >
        <PgIcon iconName="Arrow" svgFill="stroke-gray-400" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import PgIcon from '@/components/PgIcon.vue'
import { ref, computed, watch } from 'vue'

type PaginationProps = {
  totalItems: number
  itemsPerPage: number
  currentPage: number
}

const props = withDefaults(defineProps<PaginationProps>(), {
  totalItems: 0,
})

const emits = defineEmits<{
  (e: 'handle-page-changed', page: number): void
}>()

const tempPage = ref<number>(props.currentPage)

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage)
})

const displayedPages = computed(() => {
  const maxDisplayedPages = 5

  if (totalPages.value <= maxDisplayedPages) {
    return Array.from({ length: totalPages.value }, (_, index) => index + 1)
  } else {
    const currentPageIndex = tempPage.value - 1
    const halfDisplayedPages = Math.floor(maxDisplayedPages / 2)
    const firstDisplayedPage = Math.max(1, currentPageIndex - halfDisplayedPages + 1)
    const lastDisplayedPage = Math.min(totalPages.value, firstDisplayedPage + maxDisplayedPages - 1)

    const displayedPages = []

    if (firstDisplayedPage > 1) {
      displayedPages.push(1)
      displayedPages.push('...')
    }

    for (let i = firstDisplayedPage; i <= lastDisplayedPage; i++) {
      displayedPages.push(i)
    }

    if (lastDisplayedPage < totalPages.value) {
      if (totalPages.value - lastDisplayedPage === 2) {
        displayedPages.push(totalPages.value - 1)
      } else if (totalPages.value - lastDisplayedPage > 2) {
        displayedPages.push('...')
      }
      displayedPages.push(totalPages.value)
    }

    return displayedPages
  }
})

watch(
  () => props.currentPage,
  (newTempPage) => {
    tempPage.value = newTempPage
  },
)

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    tempPage.value = page
    emits('handle-page-changed', page)
  }
}
</script>

<style scoped>
.pagination-btn {
  margin: 0 0.25rem;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #eee;
  cursor: pointer;
  transition: all 0.5s ease;
}

.pagination-btn:hover {
  background-color: #f8f8f8;
  transition: all 0.5s ease;
}

.pagination-btn[disabled] {
  cursor: not-allowed;
  opacity: 0.7;
}

button.active {
  background-color: #eee;
  pointer-events: none;
}

.ellipsis {
  cursor: default;
  pointer-events: none;
}
</style>

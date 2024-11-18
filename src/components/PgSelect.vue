<template>
  <div :class="[disabled ? 'cursor-not-allowed' : '']">
    {{ svgFillColor }}
    <div class="relative">
      <div class="relative float-label-input" :class="selectTheme === 'gray' ? 'top-0' : 'top-1'">
        <input
          :id="name"
          ref="inputElement"
          type="text"
          :readonly="selectType === 'normalSelect' || (selectType === 'floatSelect' && !search)"
          autocomplete="off"
          :disabled="disabled"
          :value="modelValue && typeof modelValue === 'object' ? modelValue.label : modelValue"
          :placeholder="placeholder"
          class="text-sm leading-normal w-full"
          :class="[
            selectTheme === 'gray'
              ? 'border border-gray-2 !bg-white focus:!outline-none  placeholder:text-gray-4 '
              : 'border border-gray-5 focus:border focus:text-gray-4 focus-visible:border-primary focus:!border-primary focus:!outline-none',
            height,
            selectPaddingStyle,
            inputBorderRadius,
            hasError(props.name) ? '!border-red-500' : '',
            props.disabled
              ? 'cursor-not-allowed placeholder:text-gray-9 bg-gray-3 border-gray-5'
              : 'cursor-text placeholder:text-gray-1 bg-white',
          ]"
          @focus="toggleDropdown"
          @keydown.tab="handleKey('Tab')"
          @keydown.enter.prevent="handleKey('Enter')"
          @keydown.up.prevent="handleKey('Up')"
          @keydown.down.prevent="handleKey('Down')"
          @input="
            selectType === 'floatSelect' && search
              ? handleInput(($event.target as HTMLInputElement).value)
              : null
          "
          @blur="handleDropdownBlur"
        />
        <div
          v-if="selectTheme === 'gray' && props.leftIcon"
          class="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <div>
            <PgIcon :iconName="props.leftIcon" :svgFill="props.svgFillColor" />
          </div>
        </div>
        <label
          v-if="selectType === 'floatSelect'"
          :for="name"
          class="absolute top-2.5 left-2 text-sm text-gray-1 leading-normal pointer-events-none transition duration-200 ease-in-out px-2"
        >
          {{ label }}
        </label>
        <div
          v-if="selectType === 'floatSelect' || selectType === 'normalSelect'"
          class="absolute right-0.5 top-1/2 transform -translate-y-1/2"
          :class="{ 'border-l border-gray-5': selectType === 'floatSelect' }"
        ></div>
        <transition name="list-down">
          <div
            v-if="isDropdownVisible"
            :id="dropdownId"
            :class="[
              block,
              'select-dropdown z-30',
              isDropdownVisible ? '!opacity-100 !visible !transform-none' : '',
              gap,
              placeholder.length < 1 && 'mb-1.5',
              dropDownPosition === 'normal' && dropdownPositionClass,
              dropDownPosition === 'top' && 'dropdown-above',
            ]"
          >
            <div>
              <ul
                role="listbox"
                :class="{
                  [`${props.dropDownHeight} jb-scrollbar`]: dropdownOptions.length,
                }"
                class="overflow-y-auto bg-white border border-gray-5 rounded-lg shadow-md"
              >
                <slot name="optionList" v-bind="{ handleSelectedOption, getOptionLabel }">
                  <li
                    v-for="(option, index) in dropdownOptions"
                    v-show="dropdownOptions.length"
                    ref="optionRefs"
                    :key="index"
                    role="option"
                    class="hover:bg-gray-1 jb-transition text-sm cursor-pointer flex items-center"
                    :class="{
                      'font-bold bg-gray-1': isOptionSelected(option),
                      'bg-gray-1': index === highlightedIndex,
                    }"
                  >
                    <slot :option="option" name="optionData">
                      <div class="flex w-full justify-between items-center">
                        <div
                          class="w-full flex items-center justify-between h-9 px-3"
                          @click.stop="handleSelectedOption(option)"
                        >
                          <p class="text-sm text-secondary-3">
                            {{ getOptionLabel(option) }}
                          </p>
                          <p v-if="dropdownStyle === 'rightContent'" class="text-sm text-gray-1">
                            {{ capitalizeTheFirstLetter(String(getRightContent(option))) }}
                          </p>
                        </div>
                        <div
                          v-if="isDropdownOptionEditable"
                          class="mx-3"
                          @click="handleEditDropdownOption(option)"
                        >
                          <PgIcon iconName="DropdownEditIcon" />
                        </div>
                      </div>
                    </slot>
                  </li>
                </slot>
                <li v-if="!dropdownOptions.length" class="ag-select-element">
                  <slot name="noData">
                    <div class="flex flex-col items-center justify-center h-44">
                      <div>
                        <PgIcon iconName="NoData" />
                      </div>
                      <div class="text-sm text-gray-1 mt-4">No data found</div>
                    </div>
                  </slot>
                </li>
              </ul>
            </div>
          </div>
        </transition>
        <div
          v-if="isDropdownVisible"
          class="fixed inset-0 bg-black opacity-0 z-20"
          @click="toggleDropdown"
        ></div>
      </div>
      <p
        v-if="props.dropdownStyle === 'rightContent'"
        class="right-12 top-1/3 absolute text-gray-1 text-sm"
      >
        {{
          currentOptionSelected
            ? capitalizeTheFirstLetter((currentOptionSelected as DropdownOption).rightContent!)
            : ''
        }}
      </p>
      <div v-if="hasError(props.name) && !disabled" class="flex items-center w-full mt-1">
        <p class="text-error-1 text-xs leading-normal !m-0">
          *
          {{ errorMessage?.[props.name] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import PgIcon from '@/components/PgIcon.vue'
import { nextTick, onMounted, ref, computed, watch } from 'vue'

export interface DropdownOption {
  id?: string | number
  label?: string
  rightContent?: string
  zoomLink?: string
}

export interface DropdownOptionLabel {
  id: number
  dropdownType?: any
  label: string
  active?: boolean
}

type JbSelectProps = {
  options?: string[] | number[] | DropdownOption[] | DropdownOptionLabel[]
  modelValue?: string | number | null | DropdownOption
  gap?: string
  name: string
  placeholder?: string
  label?: string
  search?: boolean
  disabled?: boolean
  height?: string
  block?: string
  selectType?: string
  optionSelected?: string
  errorMessage?: Record<string, string>
  isLoading?: boolean
  selectTheme?: string
  dropDownHeight?: string
  dropdownStyle?: 'normal' | 'rightContent' | 'normalObject'
  dropDownPosition?: string
  isDropdownOptionEditable?: boolean
  addDropdownName?: string
  leftIcon?: string
  svgFillColor?: string
  inputBorderRadius?: string
  isInputtedTextListened?: boolean
  autoSelect?: boolean
}

const props = withDefaults(defineProps<JbSelectProps>(), {
  gap: 'mt-2',
  placeholder: '',
  label: '',
  search: true,
  disabled: false,
  height: 'h-10',
  block: 'w-full',
  selectType: 'floatSelect',
  optionSelected: 'label',
  dropdownStyle: 'normal',
  isLoading: false,
  selectTheme: 'white',
  dropDownHeight: 'max-h-46',
  dropDownPosition: 'normal',
  isDropdownOptionEditable: false,
  addDropdownName: '',
  leftIcon: '',
  svgFillColor: '',
  inputBorderRadius: 'rounded-lg',
  isInputtedTextListened: false,
  autoSelect: false,
})
const currentOptionSelected = ref<string | number | null | DropdownOption>()
const isDropdownVisible = ref<boolean>(false)
const dropdownOptions = ref<string[] | number[] | DropdownOption[] | DropdownOptionLabel[]>([
  ...(props.options as DropdownOption[]),
])
const dropdownPositionClass = ref<string>('')
const dropdownId = ref<string>('dropdown_' + uuidv4().slice(0, 5))
const highlightedIndex = ref<number>(0)
const filteredDropdownOptions = ref<string[] | number[] | DropdownOption[] | DropdownOptionLabel[]>(
  [],
)
const inputElement = ref<HTMLInputElement>()
const optionRefs = ref()
const isAddOrEditDropdownOptionModalOpen = ref<boolean>(false)
const dropdownOption = ref<DropdownOption | DropdownOptionLabel>({})
const addOrEditDropdownOptionModalTitle = ref<string>('')

const hasError = computed(() => (id: string) => props.errorMessage && props.errorMessage[id])

const selectPaddingStyle = computed(() => {
  if (props.selectType === 'floatSelect') {
    return 'pl-4 pr-14'
  }
  return props.selectType === 'normalSelect' && props.leftIcon ? 'pl-4' : 'pl-4'
})

const capitalizeTheFirstLetter = (value: string) => {
  if (value === 'null' || value === 'undefined' || value === undefined) return
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

const emits = defineEmits<{
  (e: 'update:modelValue', option: any): void
  (e: 'selected-option', option: any): void
  (e: 'updateOrSaveDropdown', option: any): void
}>()

const handleDropdownBlur = (event: Event) => {
  if (event && event.target instanceof HTMLInputElement && props.isInputtedTextListened) {
    emits('update:modelValue', event.target.value)
  }
}
const handleKey = (key: string) => {
  if (key === 'Tab' || key === 'Enter') {
    if (key === 'Tab') {
      isDropdownVisible.value = false
    }
    if (highlightedIndex.value >= 0) {
      isDropdownVisible.value = false
      nextTick(() => {
        if (key === 'Enter') {
          handleSelectedOption(dropdownOptions.value[highlightedIndex.value])
          const inputElement1 = inputElement.value
          if (inputElement1) {
            inputElement1.focus()
          }
          isDropdownVisible.value = true
        }
      })
      currentOptionSelected.value = getOptionLabel(dropdownOptions.value[highlightedIndex.value])
    }
  }
  if (key === 'Up' && isDropdownVisible.value) {
    highlightedIndex.value =
      highlightedIndex.value <= 0 ? dropdownOptions.value.length - 1 : highlightedIndex.value - 1
  }
  if (key === 'Down' && isDropdownVisible.value) {
    highlightedIndex.value =
      highlightedIndex.value >= dropdownOptions.value.length - 1 ? 0 : highlightedIndex.value + 1
  }
  const selectedOption = optionRefs.value[highlightedIndex.value]
  if (selectedOption) {
    selectedOption.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }
}

const handleSelectedOption = (option: string | number | object) => {
  highlightedIndex.value = -1
  toggleDropdown()

  if (props.dropdownStyle === 'rightContent') {
    currentOptionSelected.value = {
      label: getOptionLabel(option),
      rightContent: String(getRightContent(option)),
    }
  } else {
    currentOptionSelected.value = getOptionLabel(option)
  }

  if (typeof option === 'object') {
    if (props.optionSelected === 'object') {
      emits('update:modelValue', option)
      emits('selected-option', option)
    }
    if (props.optionSelected === 'objectLabelEmitted') {
      emits('update:modelValue', (option as { label: string }).label)
      emits('selected-option', option)
    }
    if (props.optionSelected === 'optionEmitted') {
      emits('selected-option', option)
    }
    if (props.optionSelected === 'label') {
      emits('update:modelValue', (option as { label: string }).label)
      emits('selected-option', (option as { label: string }).label)
    }
    if (props.optionSelected === 'id') {
      emits('update:modelValue', (option as { id: string | number }).id)
      emits('selected-option', (option as { id: string | number }).id)
    }
  } else {
    emits('update:modelValue', option)
    emits('selected-option', option)
  }
}

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value
  if (
    dropdownOptions.value.length === 0 ||
    dropdownOptions.value.length !== props.options?.length
  ) {
    dropdownOptions.value = props.options ?? []
  }
  if (!isDropdownVisible.value) {
    const inputElement = document.getElementById(props.name)
    if (inputElement) {
      inputElement.blur()
    }
  }
  updateDropdownPosition()
}

const updateDropdownPosition = () => {
  const dropdownContainer = document.querySelector(`#${dropdownId.value}`)
  if (dropdownContainer) {
    const dropdownRect = dropdownContainer.getBoundingClientRect()
    if (dropdownRect.bottom + 250 > window.innerHeight) {
      dropdownPositionClass.value = 'dropdown-above'
    } else {
      dropdownPositionClass.value = ''
    }
  }
}

const getOptionLabel = (option: string | number | object): any => {
  if (typeof option === 'object') {
    return (option as { label: string }).label
  }
  return option as any
}

const getRightContent = (option: string | number | object) => {
  if (typeof option === 'object') {
    return (option as { rightContent: string }).rightContent
  }
  return option
}

const handleInput = (input: string) => {
  if (input.trim() === '') {
    filteredDropdownOptions.value = props.options ?? []
  } else {
    filteredDropdownOptions.value = filterArray(props.options ?? [], input)
    highlightedIndex.value = filteredDropdownOptions.value.length > 0 ? 0 : -1
  }
  dropdownOptions.value = filteredDropdownOptions.value
}

const isOptionSelected = (option: string | number | object) =>
  getOptionLabel(option) === currentOptionSelected.value

const filterArray = (options: any[], searchValue: string) => {
  const searchValueLower = searchValue.toLowerCase()
  if (
    Array.isArray(options) &&
    options.length > 0 &&
    typeof options[0] === 'object' &&
    'label' in options[0]
  ) {
    return options.filter((item) => item.label.toLowerCase().includes(searchValueLower))
  } else {
    return options.filter((item) => String(item).toLowerCase().includes(searchValueLower))
  }
}

const handleEditDropdownOption = (option: any) => {
  dropdownOption.value = option
  addOrEditDropdownOptionModalTitle.value = 'Edit'
  isAddOrEditDropdownOptionModalOpen.value = true
}

watch(
  () => props.options,
  (newOption) => {
    if (props.selectTheme === 'gray' && props.selectType === 'normalSelect') {
      dropdownOptions.value = props.options ? props.options : []
    }
    if (props.autoSelect && newOption !== undefined && newOption.length > 0) {
      currentOptionSelected.value = props.options![0]
      emits('update:modelValue', props.options![0])
      emits('selected-option', props.options![0])
    }
  },
)
watch(
  () => props.modelValue,
  (newOption) => {
    currentOptionSelected.value = newOption
  },
)

onMounted(() => {
  if (props.modelValue) {
    currentOptionSelected.value = props.modelValue
  }
})

defineExpose({
  highlightedIndex,
})
</script>

<style scoped>
.jb-scrollbar::-webkit-scrollbar {
  height: 4px;
}
input[readonly] {
  cursor: pointer;
}
.float-label-input:focus-within label,
.float-label-input input:not(:placeholder-shown) + label {
  transform: translateY(-1.2rem) scale(1);
  background-color: white;
  font-size: 12px !important;
  font-weight: 500;
  color: #909090;
  border-radius: 8px;
}
.float-label-input input:focus + label {
  color: #af9687 !important;
  font-size: 12px !important;
}
.dropdown-above {
  bottom: 100%;
  margin-bottom: 0.5rem;
}

.select-dropdown {
  position: absolute;
  border-radius: 0.5rem;
  background: #fff;
  opacity: 0;
  visibility: hidden;
  transform: translateY(5px);
  transition:
    opacity 0.4s,
    transform 0.4s;
}
</style>

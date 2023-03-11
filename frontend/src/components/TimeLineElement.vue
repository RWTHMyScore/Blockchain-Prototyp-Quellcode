<template>
  <li class="relative mb-6 sm:mb-0 h-full">
    <div class="flex items-center">
      <div
        class="
          flex
          z-10
          justify-center
          items-center
          w-7
          h-7
          rounded-full
          ring-0 ring-white
          sm:ring-8
          shrink-0
        "
        :class="active ? 'bg-accent-200' : 'bg-gray-200'">
        <svg
          class="w-4 h-4"
          :class="active ? 'text-accent-600' : 'text-gray-600'"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clip-rule="evenodd"></path>
        </svg>
      </div>
      <div class="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
    </div>
    <div class="mt-3 sm:pr-8">
      <h3 class="text-lg font-semibold" :class="active ? 'text-gray-900' : 'text-gray-500'">
        {{ title }}
      </h3>
      <time class="block mb-2 text-sm font-normal leading-none text-gray-400">{{
        subtitle
      }}</time>
      <p class="text-base font-normal text-gray-500">
        {{ text }}
      </p>
    </div>
  </li>
</template>

<script>
export default {
  name: "TimeLineElement",
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
</style>

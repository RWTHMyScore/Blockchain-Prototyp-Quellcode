<template>
  <span class="relative inline-flex w-full md:w-auto">
    <a
      type="button"
      class="
        inline-flex
        items-center
        justify-center
        w-full
        px-8
        py-4
        text-base
        font-bold
        leading-6
        text-white
        bg-accent-600
        border border-transparent
        md:w-auto
        hover:bg-accent-500
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-accent-600
        rounded-2xl
        select-none
        cursor-pointer
      "
      @click="onClick"
      >{{ text }}</a
    >
    <span
      v-if="addition !== null"
      class="
        absolute
        top-0
        right-0
        px-2
        py-1
        -mt-3
        -mr-6
        text-xs
        font-medium
        leading-tight
        text-white
        bg-green-400
        rounded-full
        select-none
      "
      >{{ addition }}</span
    >
  </span>
</template>

<script>
export default {
  name: "CustomButton",
  props: {
    text: {
      type: String,
      required: true,
    },
    onClick: {
      type: Function,
      required: true,
    },
    addition: {
      type: String,
      default: null,
    },
  },
};
</script>

<style scoped></style>

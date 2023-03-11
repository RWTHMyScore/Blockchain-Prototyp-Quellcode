<template>
  <span class="relative inline-flex w-full md:w-auto">
    <a
      type="button"
      :class="classes"
      class="
        inline-flex
        items-center
        justify-center
        w-full
        font-bold
        leading-6
        md:w-auto
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-accent-600
        rounded-2xl
        select-none
        cursor-pointer
      "
      @click="onClick"
      >
        <svg
            v-if="useBackArrow"
            class="w-6 h-6 ml-2 mr-2 text-white"
            fill="rgb(64, 127, 183)"
            viewBox="0 0 18 19"
            transform="scale (-1, 1)" transform-origin="center"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
        </svg>
        {{ text }}
    </a>
  </span>
</template>

<script>
export default {
  name: "ButtonTemplate",
  props: {
    text: {
      type: String,
      required: true,
    },
    onClick: {
      type: Function,
      required: true,
    },
    classes: {
      type: String,
      required: false,
      default: null
    },
    useBackArrow: {
      type: Boolean,
      default: false
    }
  },
};
</script>

<style scoped></style>

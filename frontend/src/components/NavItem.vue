<template>
  <router-link
    custom
    :to="href"
    class="
      flex
      items-center
      p-2
      text-base
      font-semibold
      text-gray-600
      rounded-lg
      hover:bg-gray-100
    "
    v-slot="{ isActive, navigate }">
    <a
      :href="href"
      @click="navigate"
      :class="[
        isActive && 'bg-gray-100 text-gray-900',
        !isActive && 'grid justify-items-center',
        'flex min-h-[40px] min-w-[40px]',
      ]"
      v-tooltip.bottom="
        isActive ? '' : { content: text, offset: isActive ? -100 : 0 }
      ">
      <slot :class="[!isActive && 'ml-[20px]', '']"></slot>
      <span v-if="isActive" class="ml-3 whitespace-nowrap text-gray-700">{{
        text
      }}</span>
    </a>
  </router-link>
</template>

<script>
export default {
  name: "NavItem",
  props: {
    text: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
/* Cannot use scoped because the tooltip is build at the bottom of the site html.
Is only a problem, if I use tooltips at another point in the site */

.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  @apply bg-gray-900;
  @apply text-white;
  @apply rounded-lg;
  padding: 5px 10px 7px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  @apply border-gray-900;
  z-index: 1;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[aria-hidden="true"] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden="false"] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}
</style>


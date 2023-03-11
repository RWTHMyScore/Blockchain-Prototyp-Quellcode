
<template>
    <span
        v-if="testCondition"
        class="
        bg-gray-100
        text-gray-800 text-sm
        font-semibold
        mx-2
        px-2.5
        py-2
        rounded
        whitespace-nowrap
        "
        >{{text}}</span
    >
</template>

<script>
export default {
  name: "UserBadge",
  props: {
    text: {
      type: String,
      required: true,
    },
    testCondition: {
        type: Boolean,
        default: false
    },
  },
};
</script>

<style scoped></style>

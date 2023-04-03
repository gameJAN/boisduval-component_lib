<template>
  <i v-if="iconName.includes('upload/')">
    <img :src="$img.appendImgUrl(iconName)" width="16" />
  </i>
  <component
    v-else-if="/^(ios|logo|md)-.*/.test(iconName)"
    :is="iconType"
    :type="iconName"
    :color="iconColor"
    :size="iconSize"
  />
  <component
    v-else-if="/^(glyphicon)-.*/.test(iconName)"
    :is="iconType"
    :color="iconColor"
    :size="iconSize"
    :custom="'glyphicon ' + iconName"
  />
</template>

<script>
import Icons from "./icons.vue";
export default {
  name: "CIcon",
  components: { Icons },
  props: {
    type: {
      type: String,
      required: true,
    },
    color: String,
    size: Number,
  },
  data() {
    return {};
  },
  computed: {
    iconType() {
      return this.type.indexOf("_") === 0 ? "Icons" : "Icon";
    },
    iconName() {
      return this.iconType === "Icons"
        ? this.getCustomIconName(this.type)
        : this.type;
    },
    iconSize() {
      return this.size || (this.iconType === "Icons" ? 12 : undefined);
    },
    iconColor() {
      return this.color || "";
    },
  },
  methods: {
    getCustomIconName(iconName) {
      return iconName.slice(1);
    },
  },
};
</script>

<style></style>

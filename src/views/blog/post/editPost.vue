<script setup lang="ts">
import { ref } from "vue";

const text = ref("");
</script>

<template>
  <v-md-editor v-model="text" height="400px" />
</template>

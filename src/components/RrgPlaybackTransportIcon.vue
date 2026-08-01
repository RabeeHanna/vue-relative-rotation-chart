<script setup lang="ts">
export type RrgPlaybackTransportIconName =
  | 'skip-back'
  | 'play'
  | 'pause'
  | 'skip-forward'
  | 'loop'

defineProps<{
  name: RrgPlaybackTransportIconName
}>()
</script>

<template>
  <svg
    class="rrg-playback__icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      v-if="name === 'skip-back'"
      fill="currentColor"
      d="M6 6h2v12H6V6zm3.5 6L18 18V6L9.5 12z"
    />
    <path
      v-else-if="name === 'play'"
      fill="currentColor"
      d="M8 5v14l11-7L8 5z"
    />
    <template v-else-if="name === 'pause'">
      <path fill="currentColor" d="M6 5h4v14H6V5z" />
      <path fill="currentColor" d="M14 5h4v14h-4V5z" />
    </template>
    <path
      v-else-if="name === 'skip-forward'"
      fill="currentColor"
      d="M6 18V6l8.5 6L6 18zM16 6h2v12h-2V6z"
    />
    <path
      v-else-if="name === 'loop'"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M17 2l4 4-4 4M3 11V9a4 4 0 014-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"
    />
  </svg>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header class="flex justify-center">
    <h1
      class="first-letter:text-yellow-400 first-letter:text-7xl text-6xl tracking-tight font-bold my-4 bg-gradient-to-r from-purple-600 via-orange-500 to-purple-600 text-transparent bg-clip-text">
      Kanbanista
    </h1>
  </header>
  <div class="w-full bg-gradient-to-r from-purple-900 via-orange-500 to-purple-900 h-.5 mb-6"></div>

  <main class="flex flex-col flex-grow mb-6">
    <RouterView />
  </main>
</template>

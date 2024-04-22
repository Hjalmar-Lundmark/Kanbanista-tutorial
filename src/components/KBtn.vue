<script setup lang="ts">
import { Icon } from '@iconify/vue';

withDefaults(defineProps<{
    icon?: string
    iconClasses?: string
    color?: 'primary' | 'warning'
    iconOnly?: boolean
}>(), {
    variant: 'filled',
    color: 'primary',
})

const primaryColors = 'bg-purple-600 border-purple-600 text-white'
const warningColors = 'bg-orange-600 border-orange-600 text-yellow-100'

</script>

<template>
    <button class="relative shadow-none text-base font-semibold gap-2 flex items-center justify-center" :class="[
        color === 'primary' ? primaryColors : warningColors,
        iconOnly ? 'border bg-transparent w-6 h-6 rounded-full hover:bg-white/10 hover:active:bg-white/30 transition-colors duration-200' : 'px-4 py-2 rounded-lg'
    ]">
        <Icon v-if="icon" :icon="icon" :class="iconClasses" />
        <slot />
        <span
            class="absolute transition-opacity duration-300 hover:opacity-15 opacity-0 rounded-lg inset-0 bg-black"></span>
    </button>
</template>

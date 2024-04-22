<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import { computed } from 'vue';
import { usePersistance } from '../persistance';
import type { ITask } from '../types'
import KMarkdown from './KMarkdown.vue'
import KBtn from './KBtn.vue'
import { RouterLink } from 'vue-router';


const props = defineProps<{
    task: ITask
}>()

const avatar = `https://i.pravatar.cc/64?img=${uuidToNumber(props.task.id)}`

function uuidToNumber(uuid: string) {
    //aggregate the char codes of the uuid and return as a number between 0 and 50
    return uuid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 50
}

const createdAt = useTimeAgo(props.task.created)

const ageColorMap = [
    ['text-blue-400', 'bg-blue-500'],
    ['text-green-300', 'bg-green-500'],
    ['text-yellow-300', 'bg-yellow-500'],
    ['text-orange-400', 'bg-orange-600'],
    ['text-red-500', 'bg-red-600'],
]

function ageToColor(from: string | Date, to: string | Date, maxDaysDuration = 14) {
    // Convert dates to milliseconds for easier calculation
    const fromMs = new Date(from).getTime()
    const toMs = new Date(to).getTime()

    // Calculate the difference between the dates in days
    const diffInDays = (toMs - fromMs) / (1000 * 60 * 60 * 24)

    // Calculate the score
    let score = (diffInDays / maxDaysDuration) * 4

    // Ensure the score is within the range 0-4
    score = Math.floor(Math.min(4, Math.max(0, score)))
    return ageColorMap[score]
}

const priority = computed(() => {
    return [
        { label: 'Lowest', icon: 'mdi:chevron-double-down', color: 'text-blue-400' },
        { label: 'Low', icon: 'mdi:chevron-down', color: 'text-green-300' },
        { label: 'Medium', icon: 'mdi:equal', color: 'text-yellow-300' },
        { label: 'High', icon: 'mdi:chevron-up', color: 'text-orange-400' },
        { label: 'Highest', icon: 'mdi:chevron-double-up', color: 'text-red-500' },
    ][props.task.priority]
})

const { taskById } = usePersistance()

function onCyclePriority() {
    const task = taskById(props.task.id)
    if (!task) return console.error('Task not found')

    task.priority = (task.priority + 1) % 5
}

</script>

<template>
    <li class="flex gap-4 bg-slate-800 rounded-md border-slate-800 hover:border-purple-500  border-2.5 transition-all">
        <div :class="ageToColor(task.created, new Date())[1]" class="w-1 rounded-l-md flex-none" />
        <RouterLink :to="{ name: 'edit-task', params: { taskId: task.id } }" class="block w-full group">
            <div class="py-2.5 pr-4 min-w-0 w-full">

                <h3
                    class="line-clamp-3 min-w-0 mb-2 text-base text-gray-200 group-hover:text-purple-500 transition-colors">
                    {{ task.title ?? 'No title' }}
                </h3>

                <div class="relative overflow-hidden max-h-30">
                    <div class="text-[0.5rem] opacity-80 min-w-0">
                        <KMarkdown :md="task.description" />
                    </div>
                    <div class="scrim absolute top-0 w-full h-full" />
                </div>

                <div class="flex justify-between items-center mt-2">
                    <time :class="ageToColor(task.created, new Date())[0]" class="first-letter:capitalize truncate">
                        {{ createdAt }}
                    </time>
                    <div class="flex gap-2">
                        <KBtn icon-only :icon-classes="priority.color" :icon="priority.icon"
                            @click.prevent="onCyclePriority" />
                        <img :key="avatar" :src="avatar" alt="avatar" class="w-6 h-6 rounded-full" />
                    </div>
                </div>
            </div>
        </RouterLink>
    </li>
</template>

<style scoped>
.scrim {
    background-image: linear-gradient(5.5rem, rgb(30 41 59));
}
</style>

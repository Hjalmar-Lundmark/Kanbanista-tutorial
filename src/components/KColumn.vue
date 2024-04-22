<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { TaskStatus } from '../types'
import { dragAndDrop } from "@formkit/drag-and-drop/vue"
import { animations, handleEnd } from "@formkit/drag-and-drop"
import { usePersistance } from '../persistance'
import KTask from '../components/KTask.vue'
import KBtn from '../components/KBtn.vue'


const props = defineProps<{
    title: string
    type: TaskStatus
}>()

const router = useRouter()

const persistance = usePersistance()
const tasks = toRef(persistance, props.type)

const listRef = ref()
dragAndDrop({
    parent: listRef,
    values: tasks,
    group: 'tasks',
    dropZoneClass: "dragging",
    plugins: [animations()],
    handleEnd(e) {
        persistance.update()
        handleEnd(e)
    },
})
</script>

<template>
    <section class="w-xs min-w-0 flex flex-col">
        <div class="flex justify-between">
            <h2 class="text-gray-400 font-medium uppercase text-sm mb-4">
                {{ title }} {{ tasks.length }}
            </h2>
            <KBtn icon-only icon="mdi:plus" @click="router.push({ name: 'create-task', params: { type } })" />
        </div>

        <ul class="flex-grow space-y-3" ref="listRef">
            <KTask :task="task" v-for="task in tasks" :key="task.id" />
        </ul>
    </section>
</template>

<style>
.dragging {
    @apply bg-orange-600;
}
</style>

<script setup lang="ts">
import { usePersistance } from '../persistance'
import { TaskStatus } from '../types'
import KColumn from '../components/KColumn.vue'
import KBtn from '../components/KBtn.vue'

const { reset } = usePersistance()
const columns = [
    { title: "Todo", type: TaskStatus.Todo },
    { title: "In progress", type: TaskStatus.InProgress },
    { title: "Done", type: TaskStatus.Done },
]
</script>

<template>
    <section class="flex flex-col flex-1 px-4">
        <article class="flex gap-4 flex-grow justify-center overflow-hidden">
            <KColumn v-for="column in columns" :key="column.title" :title="column.title" :type="column.type" />
        </article>
        <router-view v-slot="{ Component }">
            <transition>
                <component :is="Component" />
            </transition>
        </router-view>

        <aside class="fixed bottom-6 right-6">
            <KBtn color="warning" @click="reset">Load initial state</KBtn>
        </aside>
    </section>
</template>

<template>
    <div>
        <div class="border mb-3" v-for="(selectedId, index) in selectedIds" :key="selectedId">
            <div class="p-3">
                <span class="mr-2">{{index + 1}}:</span><span>{{lessons.find(lesson => lesson.id == selectedId).title}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "selected-lessons",
        props: {
            lessons: Array,
            selectedIds: Array,
        },
    }
</script>
<template>
    <div id="material-creation" class="container pb-5 mt-4">
        <div class="row mb-4">
            <div class="col-12 border-bottom text-center">
                <h1>{{ pageTitle }}</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-7">
                <div class="shadow p-3">
                    <form method="post" :action="action">
                        <input name="_method" type="hidden" :value="method">
                        <input type="hidden" name="_token" :value="csrf">
                        <input type="hidden" name="user_id" :value="material.user.id">
                        <input
                            type="hidden"
                            name="lessonIds[]"
                            v-for="selectedLessonId in selectedLessonIds"
                            :value="selectedLessonId"
                            :key="selectedLessonId"
                        >
                        <div class="">
                            <label class="material-form-label">
                                <span class="material-form-label-text">タイトル:</span>
                                <input class="material-form-control" type="text" name="title" v-model="material.title" required>
                            </label>
                        </div>
                        <div class="">
                            <label class="material-form-label">
                                <span class="material-form-label-text">価格:</span>
                                <input class="material-form-control" type="number" name="price" v-model="material.price" required>
                            </label>
                        </div>
                        <div class="">
                            <label class="material-form-label">
                                <span class="material-form-label-text">説明文:</span>
                                <textarea id="material-description" class="material-form-control" name="description" v-model="material.description"></textarea>
                            </label>
                        </div>
                        <div id="lesson-selection-text">レッスン選択</div>
                        <div v-for="lesson in material.user.lessons" :key="lesson.name">
                            <label class="lesson-label">
                                <input 
                                    class="lesson-checkbox"
                                    type="checkbox"
                                    v-model="selectedLessonIds"
                                    :value="lesson.id"
                                >
                                {{ lesson.title }}
                            </label>
                        </div>
                        <div class="text-center border-top pt-3">
                            <input class="btn btn-primary" type="submit" :value="submitButtonText">
                        </div>
                    </form>
                </div>
            </div>
            <div class="offset-1 col-4">
                <div class="shadow p-3">
                    <div class="border-bottom pb-1 mb-3">選択したレッスン</div>
                    <selected-lessons 
                        :lessons="material.user.lessons"
                        :selected-ids="selectedLessonIds"
                    ></selected-lessons>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SelectedLessons from "./selected-lessons.vue";
    export default {
        name: "material-form",
        props: {
            material: Object,
            pageTitle: String,
            method: String,
            action: String,
            submitButtonText: String,
        },
        components: {
            SelectedLessons
        },
        data: function() {
            return {
                csrf: document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
                selectedLessonIds: this.material.lessons ?
                    this.material.lessons.sort((a, b) => a.pivot.index - b.pivot.index ).map(lesson => lesson.id) :
                    []
            }
        },
    }
</script>
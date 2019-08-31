<template>
    <div class="file-creation-view-file-item text-center border d-inline-block m-2">
        <div class="w-100 h-75 bg-primary">
            <!-- <img :src="imageUrl"> -->
        </div>
        <div>{{name}}</div>
    </div>
</template>

<script>
    export default {
        name: "file-creation-view-file-item",
        props: {
            imageUrl: String,
            name: String,
        }
    }
</script>
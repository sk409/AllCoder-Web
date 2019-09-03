<template>
    <div>
        <pre @click="onclick">{{answer}}</pre>
    </div>
</template>

<script>
    export default {
        name: "question-item",
        props: {
            answer: String,
        },
        methods: {
            onclick() {
                console.log(this.answer);
            }
            // escape(text) {
            //     if (!text) {
            //         return;
            //     }
            //     return text.replace(/[<>&"'`]/g, function(match) {
            //         const escape = {
            //             '<': '&lt;',
            //             '>': '&gt;',
            //             '&': '&amp;',
            //             '"': '&quot;',
            //             "'": '&#39;',
            //             '`': '&#x60;'
            //         };
            //         return escape[match];
            //     });
            // },
            // nl2br(text) {
            //     if (!text) {
            //         return;
            //     }
            //     return text.replace(/\r?\n/g, "<br>");
            // }
        }
    }
</script>
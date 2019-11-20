<template>
    <div class="w-100 h-100" v-html="marked"></div>
</template>

<script>
import markdownIt from "markdown-it";
import hljs from "highlight.js";
import sanitizer from "markdown-it-sanitizer";
import emoji from "markdown-it-emoji";
import katex from "@iktakahiro/markdown-it-katex";
import sub from "markdown-it-sub";
import ins from "markdown-it-ins";
import mark from "markdown-it-mark";
import footnote from "markdown-it-footnote";
import deflist from "markdown-it-deflist";
import abbr from "markdown-it-abbr";
export default {
    name: "development-reading",
    props: {
        markdownText: {
            type: String,
            required: true
        }
    },
    data: function() {
        return {
            markdownIt: new markdownIt({
                highlight: function(code, lang) {
                    return hljs.highlightAuto(code, [lang]).value;
                },
                html: true,
                linkify: true,
                breaks: true,
                typographer: true
            })
                .use(sanitizer)
                .use(emoji)
                .use(katex, { throwOnError: false, errorColor: " #cc0000" })
                .use(sub)
                .use(ins)
                .use(mark)
                .use(footnote)
                .use(deflist)
                .use(abbr)
        };
    },
    computed: {
        marked() {
            return this.markdownIt.render(this.markdownText);
        }
    }
};
</script>

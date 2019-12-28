export default class MarkdownParser {

    parse(text) {
        text = this.parseHeading(text);
        text = this.parseNewLine(text);
        // text = this.parseSpace(text);
        return text;
    }

    parseHeading(text) {
        const regex = /^([#]{1,6})(.*?)$/gm;
        let match = regex.exec(text);
        while (match) {
            //console.log(match[0]);
            const level = match[1].length;
            const content = match[2];
            text =
                text.substring(0, match.index) +
                `<h${level} style="margin:0;">` + content + `</h${level}>` +
                text.substring(match.index + match[0].length + 1); //直後の改行を無視
            match = regex.exec(text);
        }
        //console.log(text);
        return text;
    }

    parseNewLine(text) {
        return text.replace(/\n/g, "<br>");
    }

    // parseSpace(text) {
    //     return text.replace(/ /g, "&nbsp;");
    // }


}

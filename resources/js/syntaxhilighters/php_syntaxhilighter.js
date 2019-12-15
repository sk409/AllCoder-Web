import Syntaxhilighter from "./syntaxhilighter.js";

export default class PHPSyntaxhilighter extends Syntaxhilighter {
    check(text) {
        const phpRegex = new RegExp(/<\?php/)
        let result = this.exec(phpRegex, text, "rgb(86, 156, 214)");
        if (result) {
            return result;
        }
        const reservedWords = [
            "echo"
        ];
        const reservedWordRegex = new RegExp(reservedWords.join("|"));
        result = this.exec(reservedWordRegex, text, "rgb(219, 219, 169)");
        if (result) {
            return result;
        }
        const stringRegex = new RegExp(/".*?"/);
        result = this.exec(stringRegex, text, "rgb(206, 145, 120)");
        if (result) {
            return result;
        }
        return null
    }
}

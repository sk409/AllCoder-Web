export default class Syntaxhilighter {
    exec(regex, text, color) {
        const match = regex.exec(text);
        if (match) {
            return {
                color: color,
                match
            }
        }
        return null;
    }
}

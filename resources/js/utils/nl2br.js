export default function nl2br(target) {
    const isString = typeof (target) == "string" || target instanceof String;
    if (isString) {
        return target.replace(/\n/g, "<br>");
    } else {
        Array.from(target.childNodes).forEach(childNode => {
            if (childNode.nodeType !== Node.TEXT_NODE) {
                return;
            }
            const text = childNode.textContent;
            childNode.textContent = "";
            const newLineRegex = new RegExp(/\\n|\n/g);
            let match;
            let startIndex = 0;
            while ((match = newLineRegex.exec(text))) {
                const textNode = document.createTextNode(
                    text.substring(startIndex, match.index)
                );
                childNode.parentNode.insertBefore(textNode, childNode);
                const brNode = document.createElement("br");
                childNode.parentNode.insertBefore(brNode, childNode);
                startIndex = match.index + match[0].length;
            }
            const textNode = document.createTextNode(text.substring(startIndex));
            childNode.parentNode.insertBefore(textNode, childNode);
            childNode.remove();
        });
    }
}

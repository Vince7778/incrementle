
export function colorText(text: string, color: string) {
    const span = document.createElement("span");
    span.style.color = color;
    span.innerText = text;
    return span;
}

export function colorVarText(text: string, variable: string) {
    const span = document.createElement("span");
    span.style.color = `var(${variable})`;
    span.innerText = text;
    return span;
}

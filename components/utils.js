export const getTextWidth = (txt, fontSize = '1rem') => {
    const text = document.createElement('span');
    document.body.appendChild(text);

    text.style.font = 'ui-sans-serif';
    text.style.fontSize = fontSize;
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = txt;

    const width = Math.ceil(text.clientWidth);
    document.body.removeChild(text);

    return width
}

export const getTransformTranslate = transform =>
    transform.substring(transform.indexOf('(') + 1, transform.indexOf(')')).split(/[ ,]/).map(d => +d)
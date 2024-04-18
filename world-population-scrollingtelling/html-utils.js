export const addStep = (article, htmlText = '', stepSize = 1) => {
    article
        .append('div')
        .attr('class', 'step')
        .attr('data-step-size', stepSize)
        .append('p')
        .html(htmlText)
}
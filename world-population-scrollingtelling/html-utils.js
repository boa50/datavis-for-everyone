export const addStep = (article, htmlText = '') => {
    article
        .append('div')
        .attr('class', 'step')
        .append('p')
        .html(htmlText)
}
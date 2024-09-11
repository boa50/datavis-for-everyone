export const addSteps = (nSteps, article) => {
    const stepsSizes = {}
    const eventSteps = new Set([])
    for (let i = 0; i < nSteps; i++) {
        if (eventSteps.has(i)) stepsSizes[i] = 2
        else stepsSizes[i] = 1
    }

    for (let i = 0; i < nSteps; i++) addStep(article, '', stepsSizes[i])

    return stepsSizes
}

function addStep(article, htmlText = '', stepSize = 1) {
    article
        .append('div')
        .attr('class', 'step')
        .attr('data-step-size', stepSize)
        .append('p')
        .html(htmlText)
}
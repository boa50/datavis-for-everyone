export const linksHighlight = ({ chart, element, highlightedOpacity }) => {
    element.style('opacity', highlightedOpacity)

    const dataId = element.attr('data-id')
    chart
        .selectAll('.node-link')
        .nodes()
        .forEach(d => {
            const selection = d3.select(d)
            if (selection.attr('data-link-source') == dataId
                || selection.attr('data-link-target') == dataId) {
                selection.style('opacity', highlightedOpacity)
            }
        })
}

export const getNumLinks = (chart, dataPoint) => {
    return chart
        .selectAll('.node-link')
        .nodes()
        .map(d => {
            const selection = d3.select(d)
            return selection.attr('data-link-source') == dataPoint.id
                || selection.attr('data-link-target') == dataPoint.id
        })
        .filter(d => d === true)
        .length
}
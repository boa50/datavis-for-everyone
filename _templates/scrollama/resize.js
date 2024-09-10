import { convertSizeToIntPx } from "../../node_modules/visual-components/index.js"

export const handleResize = (article, scroller, svg) => {
    const steps = article.selectAll('.step')
    const windowHeight = window.innerHeight

    const stepHeight = Math.floor(windowHeight)

    // Dynamic step sizes to facilitate the animation speed control
    steps.each(function () {
        const step = d3.select(this)
        step.style('height', `${stepHeight * step.attr('data-step-size')}px`)
    })

    svg
        .attr('height', `${windowHeight}px`)
        .style('top', '0px')

    d3.select('#outro').style('height', `${stepHeight}px`)

    const visualisationsWidth = window.innerWidth - convertSizeToIntPx(article.select('.step').style('width'))

    scroller.resize()

    return { windowHeight, visualisationsWidth }
}
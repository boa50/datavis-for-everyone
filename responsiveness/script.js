import { getChart } from "../node_modules/visual-components/index.js"

const addChartContainer = (idNum, chartTitle = '') => {
    const chartId = `chart${idNum}`

    d3
        .select('#charts')
        .append('div')
        .attr('class', 'bg-neutral-50 px-4 py-2 rounded-sm')
        .append('div')
        .attr('id', `${chartId}-container`)
        .attr('class', 'aspect-video')
        .call(g =>
            g
                .append('h3')
                .attr('class', 'text-base text-gray-700 font-medium')
                .text(chartTitle)
        )
        .call(g =>
            g
                .append('svg')
                .attr('id', chartId)
        )

    return chartId
}


addChartContainer(1, 'Any Title')

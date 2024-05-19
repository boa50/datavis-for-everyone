import { addHighlightTooltip as addTooltip } from "../../../node_modules/visual-components/index.js"
import { colours } from "../../constants.js"

const getData = () =>
    d3.csv('../data/greenhouse-emissions-food.csv')

export const addChart = chartProps => {
    const { chart, width, height } = chartProps

    getData().then(data => {
        const getTextSize = emissions => Math.sqrt(+emissions) * 5 + 10

        const colour = d3
            .scaleSequential()
            .domain([0, d3.max(data, d => getTextSize(d.emissionsPerKg))])
            .range([`${colours.default}30`, colours.default])

        const draw = words => {
            chart
                .append('g')
                .attr('transform', `translate(${[width / 2, height / 2]})`)
                .selectAll('text')
                .data(words)
                .join('text')
                .attr('class', 'food-word')
                .attr('font-size', d => d.size)
                .attr('font-weight', 500)
                .attr('fill', d => colour(d.size))
                .attr('cursor', 'default')
                .attr('text-anchor', 'middle')
                .attr('transform', d => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
                .text(d => d.text)
        }

        const layout = d3
            .layout.cloud()
            .size([width, height])
            .words(data.map(d => { return { text: d.food, size: getTextSize(d.emissionsPerKg), emissionsPerKg: d.emissionsPerKg } }))
            .padding(1)
            .fontSize(d => d.size)
            .on('end', draw)

        layout.start()

        addTooltip({
            chart,
            htmlText: d => `
            <strong>${d.text}</strong>   
            <div style="display: flex; justify-content: space-between">
                <span>Emissions:&emsp;</span>
                <span>${d3.format('.2f')(d.emissionsPerKg)} (kg of CO₂)</span>
            </div>
            `,
            elements: chart.selectAll('.food-word'),
            initialOpacity: 1,
            chartWidth: width / 3,
            chartHeight: height / 3
        })
    })

}
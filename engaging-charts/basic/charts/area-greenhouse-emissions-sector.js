import { colours } from "../../constants.js"
import { addAxis } from "../../../components/axis/script.js"
import { addLegendV2 as addLegend } from "../../../components/legend/script.js"

const getData = () =>
    d3.csv('../data/greenhouse-emissions.csv')

export const addChart = (chartProps) => {
    const { chart, width, height } = chartProps

    getData().then(data => {
        const x = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([0, width])

        const keys = ['electricityAndHeat', 'transport', 'manufacturingAndConstruction', 'agriculture', 'buildings', 'industry']

        const colour = d3
            .scaleOrdinal()
            .domain(keys)
            .range(d3.schemeTableau10)

        const stackedData = d3
            .stack()
            .keys(keys)
            (data)

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1]) * 1.05])
            .range([height, 0])

        const area = d3
            .area()
            .x(d => x(d.data.year))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))

        chart
            .selectAll('.stacks')
            .data(stackedData)
            .join('path')
            .attr('fill', d => colour(d.key))
            .attr('d', area)

        addAxis({
            chart,
            height,
            width,
            x,
            y,
            xLabel: 'Year',
            yLabel: 'Greenhouse emissions (in tonnes)',
            xFormat: d => d,
            yFormat: d => `${d3.format('.2s')(d).replace('G', ' billion').replace('.0', '')}`,
            colour: colours.axis
        })
    })

}
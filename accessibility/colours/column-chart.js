import { palette, defaultColours as colours } from "../../colours.js"
import { addAxis } from "../../components/axis/script.js"
import { addHighlightTooltip as addTooltip } from "../../components/tooltip/script.js"
import { addLegendV2 as addLegend } from "../../components/legend/script.js"

export const addChart = (chartProps, data, colourPalleteType) => {
    const { chart, width, height, margin } = chartProps
    let colourPalette = Object.values(palette).splice(3)

    switch (colourPalleteType) {
        case 'accessible':
            colourPalette = Object.values(palette).splice(3)
            break;
        case 'accessible-protanopia':
            colourPalette = ['#E6CB19', '#536AAB', '#928112']
            break;
        case 'accessible-deuteranopia':
            colourPalette = ['#FFC142', '#3C6DB2', '#A47A00']
            break;
        case 'accessible-tritanopia':
            colourPalette = ['#FFB8C6', '#007880', '#D7585D']
            break;
        case 'rgb':
            colourPalette = ['#dc2626', '#16a34a', '#2563eb']
            break;
        case 'rgb-protanopia':
            colourPalette = ['#7D713B', '#9C8C45', '#0069DB']
            break;
        case 'rgb-deuteranopia':
            colourPalette = ['#906B1A', '#AB8655', '#0070BC']
            break;
        case 'rgb-tritanopia':
            colourPalette = ['#DB2A2A', '#4898A4', '#007880']
            break;
    }

    colourPalette = colourPalette.map(d => d3.hsl(d).darker(0.1))

    const filteredData = data.filter(d => (d.year >= 2021) && (d.month <= 6))

    const years = [...new Set(filteredData.map(d => d.year))].reverse()

    const x = d3
        .scaleBand()
        .domain([...new Set(filteredData.map(d => d.month))])
        .range([0, width])
        .padding(.15)

    const xSubgroup = d3
        .scaleBand()
        .domain(years)
        .range([0, x.bandwidth()])
        .padding(.1)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, d => d.temperature)])
        .range([height, 0])

    const colour = d3
        .scaleOrdinal()
        .range(colourPalette)
        .domain(years)

    chart
        .selectAll('.data-point')
        .data(filteredData)
        .join('rect')
        .attr('class', 'data-point')
        .attr('transform', d => `translate(${x(d.month)}, 0)`)
        .attr('x', d => xSubgroup(d.year))
        .attr('y', d => y(d.temperature))
        .attr('width', xSubgroup.bandwidth())
        .attr('height', d => height - y(d.temperature))
        .attr('fill', d => colour(d.year))

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        xLabel: 'Month',
        yLabel: 'Temperature (°C)',
        xFormat: d => getMonthName(d, 'short'),
        yNumTicks: 4,
        hideXdomain: true,
        hideYdomain: true,
        colour: colours.axis
    })

    addLegend({
        chart,
        legends: years,
        colours: colour.range(),
        xPos: -margin.left,
        yPos: -margin.top
    })

    addTooltip({
        chart,
        htmlText: d => `
        <strong>${getMonthName(d.month)} ${d.year}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Average temperature:&emsp;</span>
            <span>${d3.format('.2f')(d.temperature)} °C</span>
        </div>
        `,
        elements: chart.selectAll('.data-point'),
        initialOpacity: 1,
        fadedOpacity: 0.5,
        chartWidth: width,
        chartHeight: height
    })
}

function getMonthName(month, type = 'long') {
    return (new Date(1900, month - 1)).toLocaleString('default', { month: type })
}
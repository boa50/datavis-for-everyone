import { getTextWidth, getTransformTranslate } from "../utils.js"

export const adjustColours = (g, colour, hideYdomain = false) => {
    if (hideYdomain) g.select('.domain').attr('stroke', 'transparent')
    else g.select('.domain').attr('stroke', colour)

    g.selectAll('text').attr('fill', colour)
}

export const addAxis = (
    {
        chart,
        height,
        width,
        margin = {},
        x,
        y,
        yRight = undefined,
        xLabel = '',
        yLabel = '',
        yRightLabel = '',
        colour = 'black',
        xFormat = undefined,
        yFormat = undefined,
        yRightFormat = undefined,
        xTickValues = undefined,
        yTickValues = undefined,
        yRightTickValues = undefined,
        hideYdomain = false
    }
) => {
    chart
        .append('g')
        .attr('class', 'x-axis-group')
        .style('font-size', '0.8rem')
        .attr('transform', `translate(0, ${height})`)
        .call(
            d3
                .axisBottom(x)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(xFormat)
                .tickValues(xTickValues)
        )
        .call(g => g
            .append('text')
            .attr('x', width / 2)
            .attr('y', 45)
            .attr('text-anchor', 'middle')
            .text(xLabel))
        .call(g => adjustColours(g, colour))

    chart
        .append('g')
        .attr('class', 'y-axis-group')
        .style('font-size', '0.8rem')
        .call(
            d3
                .axisLeft(y)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(yFormat)
                .tickValues(yTickValues)
        )
        .call(g => {
            let maxTickWidth = 0
            g
                .selectAll('.tick>text')
                .each(d => {
                    if (getTextWidth(d, '0.8rem') > maxTickWidth)
                        maxTickWidth = getTextWidth(d, '0.8rem')
                })
            maxTickWidth += 30

            g
                .append('text')
                .attr('x', -(height / 2))
                .attr('y', -maxTickWidth)
                .attr('transform', 'rotate(270)')
                .attr('text-anchor', 'middle')
                .text(yLabel)
        })
        .call(g => adjustColours(g, colour, hideYdomain))

    if (yRight !== undefined) {
        chart
            .append('g')
            .attr('class', 'yRight-axis-group')
            .style('font-size', '0.8rem')
            .attr('transform', `translate(${width}, 0)`)
            .call(
                d3
                    .axisRight(yRight)
                    .tickSize(0)
                    .tickPadding(10)
                    .tickFormat(yRightFormat)
                    .tickValues(yRightTickValues)
            )
            .call(g => g
                .append('text')
                .attr('x', height / 2)
                .attr('y', -50)
                .attr('transform', 'rotate(90)')
                .attr('text-anchor', 'middle')
                .text(yRightLabel))
            .call(g => adjustColours(g, colour, hideYdomain))
    }
}

const hideOverlappingTicks = (axis, transitionDuration) => {
    const showTick = tick => {
        tick
            .transition('axis-show')
            .duration(transitionDuration)
            .style('opacity', 1)
    }

    axis.selectAll('.tick').each(function () {
        const previousTick = d3.select(this.previousElementSibling)
        if (previousTick.attr('class') === 'tick') {
            const previousTickTxtLength = getTextWidth(previousTick.select('text').text(), '0.9rem')
            const previousTickX = getTransformTranslate(previousTick.attr('transform'))[0]
            const tick = d3.select(this)
            const tickTxtLength = getTextWidth(tick.select('text').text(), '0.9rem')
            const tickX = getTransformTranslate(tick.attr('transform'))[0]

            const hideCondition = (previousTickX + (previousTickTxtLength / 2)) + 4 >= (tickX - (tickTxtLength / 2))

            if (hideCondition) tick.remove()
            else showTick(tick)
        } else {
            showTick(d3.select(this))
        }
    })
}

export const updateXaxis = ({
    chart,
    x,
    format = undefined,
    tickValues = undefined
}) => {
    const axisClass = '.x-axis-group'
    const transitionDuration = 250
    const axis = chart.select(axisClass)
    const colour = axis.selectAll('text').attr('fill')

    axis
        .transition('x-axis-change')
        .call(
            d3
                .axisBottom(x)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(format)
                .tickValues(tickValues)
        )
        .call(g => adjustColours(g, colour))
        .on('start', () => {
            axis
                .selectAll('.tick')
                .transition('x-axis-hide')
                .duration(transitionDuration * 0.1)
                .style('opacity', 0)
        })
        .end()
        .then(() => { hideOverlappingTicks(axis, transitionDuration * 0.9) })
}

export const updateYaxis = ({
    chart,
    y,
    format = undefined,
    hideDomain = false
}) => {
    const colour = chart
        .select('.y-axis-group')
        .selectAll('text').attr('fill')

    chart
        .select('.y-axis-group')
        .transition()
        .call(
            d3
                .axisLeft(y)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(format)
        )
        .call(g => adjustColours(g, colour, hideDomain))
}
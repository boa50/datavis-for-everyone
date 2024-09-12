export const appendFlag = (g, x, y, flagWidth) => {
    g
        .append('image')
        .attr('class', 'country-flag')
        .attr('width', flagWidth)
        .attr('height', y.bandwidth())
        .attr('x', x(0) - flagWidth - 4)
        .attr('y', 0)
        .attr('preserveAspectRatio', 'none')
        .attr('xlink:href', d => `/_data/img/country-flags/${d.code}.webp`)
}
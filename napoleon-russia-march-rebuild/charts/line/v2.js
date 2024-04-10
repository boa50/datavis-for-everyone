export const lineV2 = (chart, data, temperatures, x, ySurvivors, yTemperature) => {
    // Temperatures
    const temperatureColours = d3
        .scaleSequential()
        .domain(d3.extent(temperatures, d => d['temp C']))
        .interpolator(d3.interpolateBlues)

    // const area = d3
    //     .area()
    //     .x(d => x(d.long))
    //     .y0(0)
    //     .y1(720 - 64 - 16)

    // chart
    //     .append('path')
    //     .datum(temperatures)
    //     .attr('fill', d => { console.log(d[0], d.long, d['temp C'], temperatureColours(d['temp C'])); return temperatureColours(d['temp C']) })
    //     .attr('stroke', '#cbd5e1')
    //     .attr('stroke-width', 1)
    //     .attr('fill-opacity', 0.5)
    //     .attr('d', d => area(d))

    // Based on: https://stackoverflow.com/questions/70866817/d3-js-area-filled-with-lineargradient-color-interpolation-bledning-in-chrome
    chart
        .append("linearGradient")
        // .attr("id", 'color-gradient')
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("x2", 1080)
        .selectAll("stop")
        .data(temperatures)
        .join("stop")
        .attr("offset", d => {
            console.log(x(d.long)) / 1080;
            return x(d.long) / 1080;
        })
        .attr("stop-color", d => {
            // return temperatureColours(d['temp C'])
            return 'red'
        })
        .attr('stop-opacity', 0.4);

    // Survivors
    const line = d3
        .line()
        .x(d => x(d.long))
        .y(d => ySurvivors(d.survivors))

    chart
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#54A24B')
        .attr('stroke-width', 1.5)
        .attr('d', d => line(d))
}
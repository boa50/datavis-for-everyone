// Based on https://d3-graph-gallery.com/graph/density_slider.html
let curve, xAxis

const nElements = 1000
const data = []
const meanValue = 5000
const stdev = 10

for (let i = 0; i < nElements; i++) {
    data.push(gaussianRandom(meanValue, stdev))
}


const svgWidth = 700
const svgHeight = 500

const margin = {
    left: 100,
    right: 16,
    top: 16,
    bottom: 16
}
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom

let x = d3.scaleLinear()
    .domain([0, meanValue * 2])
    .range([0, width]);

const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 0.05]);

// Compute kernel density estimation
let kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))
let density = kde(data.map(function (d) { return d }))


export const plotDensityChart = id => {
    const svg = d3
        .select(`#${id}`)
        .attr('width', svgWidth)
        .attr('height', svgHeight)

    const chart = svg
        .append('g')
        .attr('transform', `translate(${[margin.left, margin.top]})`)

    xAxis = chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    chart.append("g")
        .call(d3.axisLeft(y));

    // Plot the area
    curve = chart
        .append('g')
        .append("path")
        .attr("class", "mypath")
        .datum(density)
        .attr("fill", "#69b3a2")
        .attr("opacity", ".8")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(function (d) { return x(d[0]); })
            .y(function (d) { return y(d[1]); })
        );
}

export const updateDensityXAxis = () => {
    x = d3.scaleLinear()
        .domain([0, d3.max(data) > meanValue * 2 ? d3.max(data) : meanValue * 2])
        .range([0, width]);
    xAxis.call(d3.axisBottom(x));
}

export const getDensityStatistics = () => {
    return { mean: d3.mean(data), median: d3.median(data), mode: d3.mode(data) }
}

export const updateDensityData = value => {
    if (data.length > nElements) {
        data.pop()
    }
    data.push(+value)
}

// A function that update the chart when slider is moved?
export const updateDensityChart = () => {
    // recompute density estimation
    kde = kernelDensityEstimator(kernelEpanechnikov(700), x.ticks(40))
    density = kde(data.map(function (d) { return d }))


    // update the chart
    curve
        .datum(density)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(function (d) { return x(d[0]); })
            .y(function (d) { return y(d[1]); })
        );
}


// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean = 0, stdev = 1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

// Function to compute density
function kernelDensityEstimator(kernel, X) {
    return function (V) {
        return X.map(function (x) {
            return [x, d3.mean(V, function (v) { return kernel(x - v); })];
        });
    };
}
function kernelEpanechnikov(k) {
    return function (v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}
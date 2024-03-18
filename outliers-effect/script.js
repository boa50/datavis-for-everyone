const averageValue = document.getElementById('average-value')
const medianValue = document.getElementById('median-value')
const modeValue = document.getElementById('mode-value')
const outlierValue = document.getElementById('outlier-value')


// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean = 0, stdev = 1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

const nElements = 1000
const data = []
const meanValue = 5000
const stdev = 10

for (let i = 0; i < nElements; i++) {
    data.push(gaussianRandom(meanValue, stdev))
}

outlierValue.addEventListener('change', (event) => {
    if (data.length > nElements) {
        data.pop()
    }
    data.push(+event.target.value)

    averageValue.textContent = d3.mean(data)
    medianValue.textContent = d3.median(data)
    modeValue.textContent = d3.mode(data)

    updateChart()
});


export const svgWidth = 700
export const svgHeight = 500

export const margin = {
    left: 100,
    right: 16,
    top: 16,
    bottom: 16
}
export const width = svgWidth - margin.left - margin.right
export const height = svgHeight - margin.top - margin.bottom

const svg = d3
    .select('#chart')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

const chart = svg
    .append('g')
    .attr('transform', `translate(${[margin.left, margin.top]})`)

const x = d3.scaleLinear()
    .domain([0, 10000])
    .range([0, width]);
chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

// add the y Axis
const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 0.05]);
chart.append("g")
    .call(d3.axisLeft(y));

// Compute kernel density estimation
let kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))
let density = kde(data.map(function (d) { return d }))


// Plot the area
const curve = chart
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

// A function that update the chart when slider is moved?
function updateChart(binNumber = 40) {
    // recompute density estimation
    kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(binNumber))
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
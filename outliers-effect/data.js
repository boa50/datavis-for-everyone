export const getData = (nElements = 10, mean = 0, stdev = 1) => {
    const data = []

    for (let i = 0; i < nElements; i++) {
        data.push(gaussianRandom(mean, stdev))
    }

    return data
}

export const updateData = (data = [], value, nElements = 10) => {
    if (data.length > nElements) {
        data.pop()
    }
    data.push(+value)
}

export const getDataStatistics = data => {
    return { mean: d3.mean(data), median: d3.median(data), mode: d3.mode(data) }
}

// Standard Normal variate using Box-Muller transform.
const gaussianRandom = (mean = 0, stdev = 1) => {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}
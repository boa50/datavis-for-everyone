const getData = () =>
    Promise.all([
        d3.csv('./data/population-and-demography.csv')
            .then(d => d.map(v => {
                return {
                    country: v['Country name'],
                    year: v['Year'],
                    population: v['Population']
                }
            })),
        d3.csv('./data/life-expectancy.csv')
            .then(d => d.map(v => {
                return {
                    country: v['Entity'],
                    year: v['Year'],
                    lifeExpectancy: v['Period life expectancy at birth - Sex: all - Age: 0']
                }
            })),
        d3.csv('./data/gdp-per-capita-worldbank.csv')
    ])

const svgWidth = 1080
const svgHeight = 720
const margin = {
    left: 16,
    right: 16,
    top: 16,
    bottom: 16
}
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom

const chart = d3
    .select(`#chart`)
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', `translate(${[margin.left, margin.top]})`)

getData().then(datasets => {
    const population = datasets[0]
    const lifeExpectancy = datasets[1]
    const gdpPerCapita = datasets[2]

    console.log(population);
    console.log(lifeExpectancy);
    console.log(gdpPerCapita);
})
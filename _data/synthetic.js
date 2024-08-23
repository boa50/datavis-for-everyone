export const networkData = async (
    nLinks = 50,
    countriesNames = ['Brazil', 'China', 'Australia', 'Japan', 'Canada',
        'Colombia', 'Germany', 'Spain', 'Portugal', 'South Africa', 'South Korea',
        'Angola', 'Congo', 'Turkey', 'Croatia']
) => {
    const data = {
        nodes: [],
        links: []
    }
    const countriesGeo = await d3.csv('/_data/countries-geo.csv')
    const getRandomCountryIdx = () => Math.floor(Math.random() * countriesNames.length)

    countriesNames.forEach(country => {
        const countryGeo = countriesGeo.filter(d => d.country === country)[0]

        data.nodes.push({
            id: countriesNames.indexOf(country),
            group: countryGeo.continent
        })
    })

    for (let i = 0; i < nLinks; i++) {
        const source = getRandomCountryIdx()
        let target = getRandomCountryIdx()
        while (target === source) target = getRandomCountryIdx()

        data.links.push({
            source,
            target
        })
    }

    return data
}
import { getChart, appendChartContainer, getMargin } from '../node_modules/visual-components/index.js'
import { networkData } from '../_data/synthetic.js'
import { addChart as addColumn } from './charts/column.js'
import { addChart as addChoropleth } from './charts/choropleth.js'
import { addChart as addHeatmap } from './charts/heatmap.js'
import { addChart as addScattermap } from './charts/scattermap.js'
import { addChart as addNetwork } from './charts/network.js'
import { addChart as addConnectionMap } from './charts/connectionmap.js'

const getData = () =>
    Promise.all([
        d3.json('../_data/world.geojson'),
        d3.csv('../_data/gdp-per-capita.csv')
            .then(d => d.map(v => { return { ...v, gdpPerCapita: +v.gdpPerCapita } })),
        d3.csv('../_data/random-geo.csv')
            .then(d => d.map(v => {
                return {
                    latitude: +v.latitude,
                    longitude: +v.longitude,
                    latitude_grp: Math.floor(+v.latitude / 10) * 10,
                    longitude_grp: Math.floor(+v.longitude / 10) * 10
                }
            })),
        networkData(
            50,
            ['Brazil', 'China', 'Australia', 'Japan', 'Canada',
                'Colombia', 'Germany', 'Spain', 'Portugal', 'South Africa', 'South Korea',
                'Angola', 'Congo', 'Turkey', 'Croatia', 'Russia', 'Egypt', 'Mexico',
                'New Zealand', 'Thailand', 'Argentina']
        )
    ])

const theme = 'light'

const columnId = appendChartContainer({ idNum: 1, chartTitle: 'Column to Choropleth', theme })
const choroplethId = appendChartContainer({ idNum: 10, chartTitle: 'Choropleth', theme })
const heatmapId = appendChartContainer({ idNum: 2, chartTitle: 'Heatmap to Points', theme })
const scattermapId = appendChartContainer({ idNum: 20, chartTitle: 'Scatter Map', theme })
const networkId = appendChartContainer({ idNum: 3, chartTitle: 'Network to Linked', theme })
const connectionMapId = appendChartContainer({ idNum: 30, chartTitle: 'Connection Map', theme })

getData().then(datasets => {
    const geoData = datasets[0]
    const gdpPerCapitaData = datasets[1]
    const randomGeo = datasets[2]
    const networkDataset = datasets[3]

    const mapMargin = { left: 0, right: 0, top: 8, bottom: 8 }

    addColumn(
        getChart({ id: columnId, margin: getMargin({ left: 80, bottom: 32 }) }),
        gdpPerCapitaData.filter(d => d.year === '2021'),
        theme
    )

    addChoropleth(
        getChart({ id: choroplethId, margin: mapMargin }),
        gdpPerCapitaData.filter(d => d.year === '2021'),
        geoData,
        theme
    )

    addHeatmap(
        getChart({ id: heatmapId, margin: getMargin({ left: 64, bottom: 50 }) }),
        randomGeo,
        theme
    )

    addScattermap(
        getChart({ id: scattermapId, margin: mapMargin }),
        randomGeo.slice(0, 1000),
        geoData,
        theme
    )

    addNetwork(
        getChart({ id: networkId, margin: { left: 0, right: 0, top: 0, bottom: 0 } }),
        networkDataset,
        theme
    )

    addConnectionMap(
        getChart({ id: connectionMapId, margin: mapMargin }),
        networkDataset,
        geoData,
        theme
    )
})
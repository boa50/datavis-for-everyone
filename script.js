const addLink = (txt, url, dateUpdatedTxt) => {
    const pageLink = document.createElement('a')
    pageLink.className = 'hover:text-sky-700'
    pageLink.href = url
    pageLink.innerHTML = `${txt} (${dateUpdatedTxt})`

    const pageLinkItem = document.createElement('li')
    pageLinkItem.appendChild(pageLink)


    document.getElementById('content-list').appendChild(pageLinkItem)
}

const links = [
    { txt: 'World Population Changes', url: './world-population-scrollingtelling/index.html', dateUpdated: new Date(2024, 3, 21) },
    { txt: 'Deceiving Axis', url: './deceiving-axis/index.html', dateUpdated: new Date(2024, 3, 24) },
    { txt: 'Spurious Correlations', url: './spurious-correlations/index.html', dateUpdated: new Date(2024, 3, 29) },
    { txt: 'Engaging Charts', url: './engaging-charts/basic/index.html', dateUpdated: new Date(2024, 4, 9) },
    { txt: 'Napoleon\'s Moscow Campaign', url: './napoleon-russia-march-rebuild/index.html', dateUpdated: new Date(2024, 3, 12) },
    { txt: 'The Effects of Outliers', url: './outliers-effect/index.html', dateUpdated: new Date(2024, 2, 20) },
    { txt: 'Hidden Information', url: './hidden-information/index.html', dateUpdated: new Date(2024, 5, 20) },
    { txt: 'Accessibility', url: './accessibility/index.html', dateUpdated: new Date(2024, 5, 11) },
    { txt: '3d Charts', url: './charts-3d/index.html', dateUpdated: new Date(2024, 4, 10) },
    { txt: 'The Importance of Annotations', url: './annotations-importance/index.html', dateUpdated: new Date(2024, 4, 20) },
    { txt: 'Same Data, Oposite Perspectives', url: './positive-negative-message/index.html', dateUpdated: new Date(2024, 4, 31) },
    { txt: 'Time Series Misrepresentation', url: './time-series/index.html', dateUpdated: new Date(2024, 5, 7) },
    { txt: 'Responsiveness', url: './responsiveness/index.html', dateUpdated: new Date(2024, 6, 1) },
]

links
    .sort((a, b) => b.dateUpdated - a.dateUpdated)
    .forEach(d => addLink(d.txt, d.url, d.dateUpdated.toISOString().split('T')[0]))
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
    { txt: 'Unemployment Rate', url: './unemployment-rate/index.html', dateUpdated: new Date(2024, 4, 2) },
]

links
    .sort((a, b) => b.dateUpdated - a.dateUpdated)
    .forEach(d => addLink(d.txt, d.url, d.dateUpdated.toISOString().split('T')[0]))
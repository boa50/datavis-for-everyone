const latsLongs = [
    []
]

export const networkData = () => {
    const data = {}


    data.nodes = [
        {
            "id": 1,
            "name": "A"
        },
        {
            "id": 2,
            "name": "B"
        }
    ]
    data.links = [
        {
            "source": 1,
            "target": 2
        },
        {
            "source": 1,
            "target": 5
        }
    ]

    d3.csv('/_data/cities.csv').then(d => { console.log(d) })

    console.log(data);

}
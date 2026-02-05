mapboxgl.accessToken = 'pk.eyJ1IjoibnVyaWFpMiIsImEiOiJjbWt1Ymo2dnQxdjBtM2NweWptZzBlZ3Y2In0.VqeH9DKwcNbbCzvmoan-0w';

function createMap(type) {

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-98, 39],
        zoom: 3.5,
        projection: 'albers'
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {

        if (type === "cases") {

            map.addSource('covid', {
                type: 'geojson',
                data: 'assets/us-covid-2020-counts.json'
            });

            map.addLayer({
                id: 'circles',
                type: 'circle',
                source: 'covid',
                paint: {
                    'circle-color': '#7ec8e3',
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.75,
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['get', 'cases'],
                        1000, 2,
                        10000, 6,
                        50000, 12,
                        200000, 24
                    ]
                }
            });

            map.on('click', 'circles', (e) => {
                const p = e.features[0].properties;
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`<b>${p.county}</b><br>Cases: ${p.cases}`)
                    .addTo(map);
            });

            map.getCanvas().style.cursor = 'pointer';
        }

        if (type === "rates") {

            map.addSource('rates', {
                type: 'geojson',
                data: 'assets/us-covid-2020-rates.json'
            });

            map.addLayer({
                id: 'choropleth',
                type: 'fill',
                source: 'rates',
                paint: {
                    'fill-color': [
                        'step',
                        ['get', 'rates'],
                        '#ffffcc',
                        20, '#ffeda0',
                        40, '#feb24c',
                        60, '#fd8d3c',
                        80, '#f03b20',
                        120, '#bd0026'
                    ],
                    'fill-opacity': 0.85
                }
            });

            map.addLayer({
                id: 'outline',
                type: 'line',
                source: 'rates',
                paint: {
                    'line-color': '#333',
                    'line-width': 0.2
                }
            });

            map.on('click', 'choropleth', (e) => {
                const p = e.features[0].properties;
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`<b>${p.county}</b><br>Death rate: ${p.rates}`)
                    .addTo(map);
            });

            map.getCanvas().style.cursor = 'pointer';
        }

    });
}

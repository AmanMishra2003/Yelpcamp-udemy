// Add your MapTiler Cloud API key to the config
      // (Go to https://cloud.maptiler.com/account/keys/ to get one for free!)
maptilersdk.config.apiKey = maptilertoken;

const mapContainer = document.getElementById('map-container');
const map = new maptilersdk.Map({
    container: mapContainer,
    center: campground.geometry.coordinates,
    zoom: 10,
    style: maptilersdk.MapStyle.STREETS,
    hash: true,
});

new maptilersdk.Marker({
    color: 'blue',
    draggable: true
}).setLngLat(campground.geometry.coordinates).setPopup(
    new maptilersdk.Popup({ offset: 20 })
        .setHTML(
            `<h6>${campground.title}</h6><p>${campground.location}</p>`
        )
).addTo(map);

console.log(campground.geolocation)
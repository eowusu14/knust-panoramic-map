"use strict";
// select dom elements
const geolocatebtn = document.querySelector(".geolocate");
const zoomtolayerbtn = document.querySelector(".zoomtolayer");

var map = L.map("map", {
  center: [6.68, -1.568],
  zoom: 16,
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

// var marker = L.marker([6.675719316464209, -1.57339554758671], {
//   draggable: true,
// }).addTo(map);

// pano = `<iframe src="12.GREAT HALL/Panorama12.html" frameborder="0"></iframe>
// <br><h3>Great Hall</h3>`;

// marker.bindPopup(pano);

const points = L.geoJSON(pointGeoJSON, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, markerStyle());
  },
  // style:
  onEachFeature: showpano,
}).addTo(map);

//style points
function markerStyle() {
  return {
    radius: 5.0,
    opacity: 1,
    color: "rgba(35,35,35,1.0)",
    dashArray: "",
    lineCap: "butt",
    lineJoin: "miter",
    weight: 1,
    fill: true,
    fillOpacity: 1,
    fillColor: "rgba(81, 80, 80,1.0)",
    interactive: true,
  };
}

// display pano on popup
function showpano(feature, layer) {
  feature.layer = layer;

  const pano = `<iframe src="PANO/Panorama${feature.properties["S_N"]}.html" frameborder="0"></iframe> <br> <h3>${feature.properties["Point_Name"]}</h3>`;

  layer.bindPopup(
    pano
    // { maxHeight: 270, maxWidth: 240 }
  );
}

// home
zoomtolayerbtn.addEventListener("click", function () {
  // map.setView([6.676, -1.549], 12.5, { animate: true });
  map.flyTo([6.68, -1.568], 14.5, 800);
});

// geolocate
geolocatebtn.addEventListener("click", toggleGeolocation);

//geolocation
let marker1;
let circle1;
let geolocationActive = false;

function toggleGeolocation() {
  if (geolocationActive) {
    // If geolocationActive, remove marker and circle
    if (marker1) {
      // map.removeLayer(marker1);
      marker1.remove();
      marker1 = null;
    }
    if (circle1) {
      circle1.remove();
      circle1 = null;
    }
  } else {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        function (e) {
          const { latitude, longitude, accuracy } = e.coords;
          marker1 = L.marker([latitude, longitude]).addTo(map);

          circle1 = L.circle([latitude, longitude], {
            radius: accuracy,
            opacity: 0.1,
          }).addTo(map);
          // }
          map.flyTo([latitude, longitude], 18, 800); // fly to location of user
        },

        function (err) {
          if (err.code === 1) {
            alert(`${err.message} \n Please Allow Location Sharing`);
          } else {
            alert(`Error Retrieving Location: ${err.message}`);
          }
        }
      );
  }

  geolocationActive = !geolocationActive;
}

map.on("mousemove", function (e) {
  console.log(e.latlng);
});

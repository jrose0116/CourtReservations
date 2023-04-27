function loadMap(address) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, function (results, status) {
    if (status === "OK") {
      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: results[0].geometry.location,
      });
      let marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
      });
    }
  });
}

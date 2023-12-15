const RenderEmptyGMap = {

  async initMap(): Promise<void> {
    // The location of Tokyo Station
    position = { lat: 35.6812405, lng: 139.7645499 };

    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;


    map = new Map(
      document.getElementById('map') as HTMLElement,
      {
        center: position,
        mapId: 'DEMO_MAP_ID',
        mapTypeControl: false,
        minZoom: 9,
        panControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        zoom: 15,
      }
    );

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    const newMarker = new AdvancedMarkerElement({
      map: map
    });

    map.addListener("click", (event: { latLng: google.maps.LatLngLiteral; }) => {
      newMarker.position = event.latLng;
      newMarker.map = map;
      let latLngJson = JSON.parse(JSON.stringify(event.latLng));
      let markerLat = document.getElementById("markerLat");
      markerLat!.setAttribute("value", latLngJson['lat']);
      let markerLng = document.getElementById("markerLng");
      markerLng!.setAttribute("value", latLngJson['lng']);
      map.setCenter(event.latLng);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => {
          position = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          map.setCenter(position);
        },
        () => {
          console.warn('Failed getting the current location!');
        }
      );
    } else {
      console.warn("Browser doesn't support Geolocation!");
    }
  },
}


// come from ejs
// @ts-ignore
window.onload = (() => RenderEmptyGMap.initMap());
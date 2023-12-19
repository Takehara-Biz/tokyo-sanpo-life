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

    map.addListener("click", async (event: { latLng: google.maps.LatLngLiteral; }) => {
      const latLngJson = JSON.parse(JSON.stringify(event.latLng));
      const lat = latLngJson['lat'];
      const lng = latLngJson['lng'];

      if(lat <= 34.468651 || 37.492991 <= lat){
        alert('緯度が東京から離れすぎています。そこは登録できません。');
        return;
      }
      if(lng <= 138.573217 || 140.936050 <= lng){
        alert('経度が東京から離れすぎています。そこは登録できません。');
        return;
      }

      const postCategorySelect = document.getElementById('postCategory')! as HTMLSelectElement;
      const postCategoryValue = postCategorySelect.options[postCategorySelect.selectedIndex].value;
      console.debug("postCategoryValue : " + postCategoryValue);
      let pinElement = await TslGMapUtil.createPinElement(Number(postCategoryValue));

      newMarker.position = event.latLng;
      newMarker.map = map;
      newMarker.content = pinElement.element;
      
      let markerLat = document.getElementById("markerLat");
      markerLat!.setAttribute("value", lat);
      let markerLng = document.getElementById("markerLng");
      markerLng!.setAttribute("value", lng);
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
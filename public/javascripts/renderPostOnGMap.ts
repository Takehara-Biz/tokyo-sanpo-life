const RenderPostOnGMap = {

  async initMap(post : IPost): Promise<void> {
    position = { lat: post.lat, lng: post.lng };

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
        zoom: 13,
      }
    );

    let markers: google.maps.marker.AdvancedMarkerElement[] = [];

      let contentString = TslGMapUtil.createInfoContent(post);
      position = { lat: post.lat, lng: post.lng };
      let postCategoryId = JSON.parse(JSON.stringify(post.postCategory))['id']
      console.debug("postCategoryId : " + postCategoryId);
      let marker = await TslGMapUtil.createTslMarker(Number(postCategoryId), position);
      marker.map = map;

      marker.addListener('click', function () {
        const info = document.getElementById('info');
        info!.style.display = 'block';
        let contentString = TslGMapUtil.createInfoContent(post);
        info!.innerHTML = contentString;
        map.panTo({ lat: marker.position!.lat as number, lng: marker.position!.lng as number });
      });
      map.addListener('click', function () {
        const info = document.getElementById('info');
        info!.innerHTML = '';
        info!.style.display = 'none';
        const map2 = document.getElementById('map');
        map2!.style.flexGrow = '1';
      });

      markers.push(marker);
  },
}


// come from ejs
// @ts-ignore
window.onload = (() => RenderPostOnGMap.initMap(targetPost));
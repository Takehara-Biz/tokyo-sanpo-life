const UpdatePostPage = {

  async initMap(post: IPost): Promise<void> {
    console.debug('lat ' + post.lat + ", lng " + post.lng);
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

    position = { lat: post.lat, lng: post.lng };
    let postCategoryId = JSON.parse(JSON.stringify(post.postCategory))['id']
    console.debug("postCategoryId : " + postCategoryId);
    let marker = await TslGMapUtil.createTslMarker(Number(postCategoryId), position);
    marker.map = map;
    markers.push(marker);

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

      marker.position = event.latLng;
      marker.map = map;
      marker.content = pinElement.element;
      
      let markerLat = document.getElementById("lat");
      markerLat!.setAttribute("value", lat);
      let markerLng = document.getElementById("lng");
      markerLng!.setAttribute("value", lng);
      map.setCenter(event.latLng);
    });
  },
}


// come from ejs
// @ts-ignore
window.onload = (() => UpdatePostPage.initMap(targetPost));


function validateMap() {
  const latValue = (document.getElementById("lat")! as HTMLInputElement).value;
  const lngValue = (document.getElementById("lng")! as HTMLInputElement).value;
  console.log(latValue + " " + lngValue);
  if (latValue == null || lngValue == null) {
    // marker has not been set yet.
    alert('地図にマーカーをセットしてください。')
    return false;
  }
  return true;
}

function updatePost(event) {
  if (!validateMap()) {
    return;
  }

  event.preventDefault();
  const form = document.querySelector('form')!;
  if (form.checkValidity()) {
    if (!(confirm('本当に変更して良いですか？'))) {
      return;
    }

    const formData = new FormData(form);
    const object = {};
    formData.forEach((value, key) => object[key] = value);
    const json = JSON.stringify(object);
    fetch('/posts/' + formData.get('firestoreDocId'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json
    }).then((response) => {
      TslLogUtil.debug('fetch then');

      setTimeout((() => {
        // if it's too early, old data can be printed..
        window.location.href = '/posts/my-list'
      }), 500);

    }).catch((error) => {
      TslLogUtil.error('fetch error');
      TslLogUtil.error(error);
      window.location.href = '/errors/500';
    });
  } else {
    form.reportValidity();
  }
}
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
      
      let markerLat = document.getElementById("lat");
      markerLat!.setAttribute("value", lat);
      let markerLng = document.getElementById("lng");
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


// The below code is adjust upload photo (reduce image file size and resize and base64 ...)

function adjustUploadPhoto(event) {
  // @ts-ignore
  const file = event.target!.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target!.result as string;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > 400) {
          height *= 400 / width;
          width = 400;
        }
      } else {
        if (height > 300) {
          width *= 300 / height;
          height = 300;
        }
      }
      
      canvas.width = 400;
      canvas.height = 300;

      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (400 - width) / 2, (300 - height) / 2, width, height);

      // 0.5は画質の高さを示す。0.0 ~ 1.0で、数字が大きいほど高画質。
      // 0.5だと、127KB(700px x 467px)のJPEG画像が、17.2KB(400px x 300px)になる。
      const base64String = canvas.toDataURL('image/jpeg', 0.5);
      console.log(base64String);

      let printPhotoDiv = document.getElementById('printPhoto')!;
      printPhotoDiv.innerHTML = '';
      printPhotoDiv.setAttribute('style', 'height:100%;');
      const img1 = new Image();
      img1.src = base64String;
      printPhotoDiv.appendChild(img1);

      let postPhotoBase64Input = document.getElementById('postPhotoBase64')! as HTMLInputElement;
      postPhotoBase64Input.value = base64String;
    };
  };
}
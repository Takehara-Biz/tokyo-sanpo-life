const RenderPostsOnGMap = {
  showCurrentLocation(): void {
    map.setCenter(position);
    RenderPostsOnGMap.showCurrentLocationBackground();
    RenderPostsOnGMap.showCurrentLocationGlyph();
  },
  
  /**
   * 中央の濃い青丸
   */
  showCurrentLocationGlyph(): void {
    if (center !== undefined) {
      center.setMap(null);
    }
    center = new google.maps.Marker({
      position: position,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#115EC3',
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 2,
        scale: 7
      },
    });
  },

  /**
   * 縁の薄い青丸
   */
  showCurrentLocationBackground(): void {
    if (peripheral !== undefined) {
      peripheral.setMap(null);
    }
    peripheral = new google.maps.Circle({
      strokeColor: '#115EC3',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      fillColor: '#115EC3',
      fillOpacity: 0.2,
      map: map,
      center: position,
      radius: 100
    });
  },

  designatedEmojiCountJson : {},
  prepareEmojiPicker(): void {
    document.querySelector('emoji-picker')!.addEventListener('emoji-click', e => {
      // @ts-ignore
      const emoji = e.detail.unicode
      console.log('put ' + emoji);
      document.getElementById('reactionDropdown')!.classList.remove('show');
      createEmojiEval(emoji);
    });
  },

  async initMap(posts : PostDto[]): Promise<void> {
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
        zoom: 13,
      }
    );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => {
          position = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          RenderPostsOnGMap.showCurrentLocation();
        },
        () => {
          console.warn('Failed getting the current location!');
        }
      );
    } else {
      console.warn("Browser doesn't support Geolocation!");
    }


    const showCurrentLocationButton = TslGMapUtil.createShowCurrentLocationButton();
    showCurrentLocationButton.addEventListener('click', function () {
      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => {
          position = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          RenderPostsOnGMap.showCurrentLocation();
        },
        () => {
          console.warn('Failed getting the current location!');
        }
      );
    });
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(showCurrentLocationButton);

    let markers: google.maps.marker.AdvancedMarkerElement[] = [];

    posts.map(async (post: PostDto) => {

      position = { lat: post.lat, lng: post.lng };
      //console.log(JSON.stringify(post.postCategory));
      let postCategoryId = JSON.parse(JSON.stringify(post.postCategory))['id']
      let marker = await TslGMapUtil.createTslMarker(Number(postCategoryId), position);
      marker.map = map;

      marker.addListener('click', async function () {
        const info = document.getElementById('info');
        info!.style.display = 'block';
        let contentString = await (await fetch('/map/post/' + post.firestoreDocId!)).text();
        info!.innerHTML = contentString;
        map.panTo({ lat: marker.position!.lat as number, lng: marker.position!.lng as number });
        RenderPostsOnGMap.prepareEmojiPicker();
        renderEmojiEvalCountSection();
      });
      map.addListener('click', function () {
        const info = document.getElementById('info');
        info!.innerHTML = '';
        info!.style.display = 'none';
        const map2 = document.getElementById('map');
        map2!.style.flexGrow = '1';
      });

      markers.push(marker);
    });
  },
}


// come from ejs
// @ts-ignore
window.onload = (() => RenderPostsOnGMap.initMap(targetPosts));
// Initialize and add the map
let map: google.maps.Map;

function createInfoContent(sanpoContent: SanpoContent): string {
  let commentString = "";
  sanpoContent.sanpoComment.map((comment: SanpoComment) => {
    console.log('aaa' + comment.userName);
    commentString += "<hr /><div>" +
      "<p>" + comment.comment + "</p>" +
      "<p>" + comment.commentDate.toLocaleDateString() + "</p>" +
      "<p>" + comment.userName + "</p>" +
      "</div>"
  })

  let contentString = '<div id="content">' +
    '<h4 id="firstHeading">' + sanpoContent.title + '</h1>' +
    '<div id="bodyContent">' +
    "<img src='" + sanpoContent.imageUrl + "' width='200px' />" +
    "<p>" + sanpoContent.insertDate.toLocaleDateString() + "</p>" +
    "<p>" + sanpoContent.description + "</p>" +
    "</div>" +
    "<div>コメント一覧" + commentString + "</div>" +
    "</div>";
  
  return contentString; 
}

async function initMap(): Promise<void> {
  // The location of Tokyo Station
  let position = { lat: 35.6812405, lng: 139.7645499 };

  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  let center;
  let peripheral;

  map = new Map(
    document.getElementById('map') as HTMLElement,
    {
      
      center: position,
      mapId: 'DEMO_MAP_ID',
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

        map.setCenter(position);

        //縁の薄い青丸
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
      //  中央の濃い青丸
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
      () => {
        console.warn('Failed getting the current location!');
      }
    );
  } else {
    console.warn("Browser doesn't support Geolocation!");
  }


// const locationButton = document.createElement("button");
//   locationButton.textContent = "現在地";
const locationButton = document.createElement("button");
const spanElement = document.createElement("span");
spanElement.innerHTML = 'my_location';
spanElement.classList.add('material-symbols-outlined');
spanElement.style.cssText = 'color: #666666;'
locationButton.appendChild(spanElement);
locationButton.style.cssText = "background-color: white; padding: 8px; border: 0px solid; border-radius: 2px; margin-right: 10px; filter: drop-shadow(0px 0px 1px rgba(0,0,0,0.2));";
  //locationButton.style.cssText = "background-color: red; font-size: 20px;"
  //locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);

  let markers: google.maps.marker.AdvancedMarkerElement[] = [];

  DummyData.map((value: SanpoContent) => {
    
    let contentString = createInfoContent(value);

    position = { lat: value.lat, lng: value.lon };

    // The marker, positioned at Uluru
    let marker = new AdvancedMarkerElement({
      map: map,
      position: position,
      title: value.title
    });

    marker.addListener('click', function () {
      const info = document.getElementById('info');
      info!.style.display = 'block';
      let contentString = createInfoContent(value);
      info!.innerHTML = contentString;
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
}

window.onload=(() => initMap());

// Initialize and add the map
let map: google.maps.Map;
let position: google.maps.LatLng | google.maps.LatLngLiteral;
let center: google.maps.Marker;
let peripheral: google.maps.Circle;




/**
 * Provide utility functions regardless of business logic.
 */

async function createTslMarker(contentTypeEnum: ContentTypeEnum, position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<google.maps.marker.AdvancedMarkerElement> {
  let marker: Promise<google.maps.marker.AdvancedMarkerElement>;
  switch (contentTypeEnum) {
    case ContentTypeEnum.Flower:
      marker = createFlowerMarker(position);
      break;
    case ContentTypeEnum.Landscape:
      marker = createLandscapeMarker(position);
      break;
    case ContentTypeEnum.Cafe:
      marker = createCafeMarker(position);
      break;
    case ContentTypeEnum.Shrine:
      marker = createShrineMarker(position);
      break;
    default:
      marker = createFlowerMarker(position);
      break;
  }
  return marker;
}
async function createFlowerMarker(position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<google.maps.marker.AdvancedMarkerElement> {
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const icon = document.createElement('div');
  icon.innerHTML = '<span class="material-symbols-outlined text-xl">filter_vintage</span>';
  const faPin = new PinElement({
    glyph: icon,
    glyphColor: '#ff0000',
    background: '#ff99cc',
    borderColor: '#ff0000',
  });

  return new AdvancedMarkerElement({
    position: position,
    content: faPin.element,
  });
}
async function createLandscapeMarker(position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<google.maps.marker.AdvancedMarkerElement> {
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const icon = document.createElement('div');
  icon.innerHTML = '<span class="material-symbols-outlined text-xl">landscape</span>';
  const faPin = new PinElement({
    glyph: icon,
    glyphColor: '#33cc00',
    background: '#ccffcc',
    borderColor: '#33cc00',
  });

  return new AdvancedMarkerElement({
    position: position,
    content: faPin.element,
  });
}
async function createCafeMarker(position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<google.maps.marker.AdvancedMarkerElement> {
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const icon = document.createElement('div');
  icon.innerHTML = '<span class="material-symbols-outlined text-xl">local_cafe</span>';
  const faPin = new PinElement({
    glyph: icon,
    glyphColor: '#663300',
    background: '#ffcc99',
    borderColor: '#663300',
  });

  return new AdvancedMarkerElement({
    position: position,
    content: faPin.element,
  });
}
async function createShrineMarker(position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<google.maps.marker.AdvancedMarkerElement> {
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const icon = document.createElement('div');
  icon.innerHTML = '<span class="material-symbols-outlined text-xl">temple_buddhist</span>';
  const faPin = new PinElement({
    glyph: icon,
    glyphColor: '#6600ff',
    background: '#cc99ff',
    borderColor: '#6600ff',
  });

  return new AdvancedMarkerElement({
    position: position,
    content: faPin.element,
  });
}
// private static createObjectMarker(): google.maps.marker.AdvancedMarkerElement {
//   return new AdvancedMarkerElement({
//     map: map,
//     position: position,
//     title: "aaa"
//   });
// }
// private static createBuildingMarker(): google.maps.marker.AdvancedMarkerElement {
//   return new AdvancedMarkerElement({
//     map: map,
//     position: position,
//     title: "aaa"
//   });
// }
// private static createWaterMarker(): google.maps.marker.AdvancedMarkerElement {
//   return new AdvancedMarkerElement({
//     map: map,
//     position: position,
//     title: "aaa"
//   });
// }
// private static createOtherMarker(): google.maps.marker.AdvancedMarkerElement {
//   return new AdvancedMarkerElement({
//     map: map,
//     position: position,
//     title: "aaa"
//   });
// }






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

function createShowCurrentLocationButton(): HTMLButtonElement {
  const locationButton = document.createElement("button");
  const spanElement = document.createElement("span");
  spanElement.innerHTML = 'my_location';
  spanElement.classList.add('material-symbols-outlined');
  spanElement.style.cssText = 'color: #666666;'
  locationButton.appendChild(spanElement);
  locationButton.style.cssText = "background-color: white; padding: 8px; border: 0px solid; border-radius: 2px; margin-right: 10px; filter: drop-shadow(0px 0px 1px rgba(0,0,0,0.2));";
  return locationButton;
}

function showCurrentLocation(): void {
  map.setCenter(position);
  showCurrentLocationBackground();
  showCurrentLocationGlyph();
}

/**
 * 中央の濃い青丸
 */
function showCurrentLocationGlyph(): void {
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
}

/**
 * 縁の薄い青丸
 */
function showCurrentLocationBackground(): void {
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
}

async function initMap(): Promise<void> {
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
        showCurrentLocation();
      },
      () => {
        console.warn('Failed getting the current location!');
      }
    );
  } else {
    console.warn("Browser doesn't support Geolocation!");
  }


  const showCurrentLocationButton = createShowCurrentLocationButton();
  showCurrentLocationButton.addEventListener('click', function () {
    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => {
        position = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        showCurrentLocation();
      },
      () => {
        console.warn('Failed getting the current location!');
      }
    );
  });
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(showCurrentLocationButton);

  let markers: google.maps.marker.AdvancedMarkerElement[] = [];

  DummyData.map(async (sanpoContent: SanpoContent) => {

    let contentString = createInfoContent(sanpoContent);

    position = { lat: sanpoContent.lat, lng: sanpoContent.lon };

    // The marker, positioned at Uluru
    // let marker = new AdvancedMarkerElement({
    //   map: map,
    //   position: position,
    //   title: value.title
    // });
    let marker = await createTslMarker(sanpoContent.contentTypeEnum, position);
    marker.map = map;

    marker.addListener('click', function () {
      const info = document.getElementById('info');
      info!.style.display = 'block';
      let contentString = createInfoContent(sanpoContent);
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
  });
}

window.onload = (() => initMap());
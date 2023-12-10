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
  // The location of Uluru
  let position = { lat: 35.6812405, lng: 139.7645499 };

  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  // The map, centered at Uluru
  map = new Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 13,
      center: position,
      mapId: 'DEMO_MAP_ID',
    }
  );

  let infoWindows: google.maps.InfoWindow[] = [];
  let markers: google.maps.marker.AdvancedMarkerElement[] = [];

  DummyData.map((value: SanpoContent) => {
    
    let contentString = createInfoContent(value);

    let infoWindow = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: "Uluru",
      minWidth: 1000,
    });

    position = { lat: value.lat, lng: value.lon };

    // The marker, positioned at Uluru
    let marker = new AdvancedMarkerElement({
      map: map,
      position: position,
      title: value.title
    });

    marker.addListener('click', function () {
      // infoWindow.open({
      //   anchor: marker,
      //   map: map,
      // });
      const map2 = document.getElementById('map');
      //map2!.style.height = 'calc(100% - 66px - 48px - 200px)';
      const info = document.getElementById('info');
      info!.style.display = 'block';
      let contentString = createInfoContent(value);
      info!.innerHTML = contentString;
    });
    map.addListener('click', function () {
      // infoWindow.open({
      //   anchor: marker,
      //   map: map,
      // });
      const info = document.getElementById('info');
      info!.innerHTML = '';
      info!.style.display = 'none';
      const map2 = document.getElementById('map');
      map2!.style.flexGrow = '1';
    });

    markers.push(marker);
    infoWindows.push(infoWindow);
  });
}

window.onload=(() => initMap());
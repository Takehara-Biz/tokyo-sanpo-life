// Initialize and add the map
let map: google.maps.Map;
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

  let commentString = "";
  let contentString = "";
  let infoWindows: google.maps.InfoWindow[] = [];
  let markers: google.maps.marker.AdvancedMarkerElement[] = [];

  DummyData.map((value: SanpoContent) => {
    commentString = "";
    value.sanpoComment.map((comment: SanpoComment) => {
      console.log('aaa' + comment.userName);
      commentString += "<hr /><div>" +
        "<p>" + comment.comment + "</p>" +
        "<p>" + comment.commentDate.toLocaleDateString() + "</p>" +
        "<p>" + comment.userName + "</p>" +
        "</div>"
    })

    contentString = '<div id="content">' +
      '<h4 id="firstHeading" class="firstHeading">' + value.title + '</h1>' +
      '<div id="bodyContent">' +
      "<img src='" + value.imageUrl + "' width='200px' />" +
      "<p>" + value.insertDate.toLocaleDateString() + "</p>" +
      "<p>" + value.description + "</p>" +
      "</div>" +
      "<div>コメント一覧" + commentString + "</div>" +
      "</div>";

    let infoWindow = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: "Uluru",
    });

    position = { lat: value.lat, lng: value.lon };

    // The marker, positioned at Uluru
    let marker = new AdvancedMarkerElement({
      map: map,
      position: position,
      title: value.title
    });

    marker.addListener('click', function () {
      infoWindow.open({
        anchor: marker,
        map: map,
      });
    });

    markers.push(marker);
    infoWindows.push(infoWindow);
  });
}

window.onload=(() => initMap());
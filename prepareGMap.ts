// Initialize and add the map
let map: google.maps.Map;
async function initMap(): Promise<void> {
  // The location of Uluru
  const position = { lat: 35.6812405, lng: 139.7645499 };

  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  // The map, centered at Uluru
  map = new Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 4,
      center: position,
      mapId: 'DEMO_MAP_ID',
    }
  );

  const contentString1 =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h4 id="firstHeading" class="firstHeading">東京駅</h1>' +
    '<div id="bodyContent">' +
    "<img src='https://media.timeout.com/images/105544832/1372/772/image.webp' width='200px' />" +
    "<p>2023/12/01</p>" +
    "<p>ここが東京駅です！</p>" +
    "</div>" +
    "</div>";
  const contentString2 =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h4 id="firstHeading" class="firstHeading">新宿御苑</h1>' +
    '<div id="bodyContent">' +
    "<img src='https://s3-ap-northeast-1.amazonaws.com/thegate/2021/04/14/11/31/14/shinjukugyoen.jpg' width='200px' />" +
    "<p>2023/12/01</p>" +
    "<p>紅葉が見頃です〜。</p>" +
    "</div>" +
    "</div>";

  const infowindow1 = new google.maps.InfoWindow({
    content: contentString1,
    ariaLabel: "Uluru",
  });

  // The marker, positioned at Uluru
  const marker1 = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: 'Uluru'
  });

  marker1.addListener('click', function () {
    infowindow1.open({
      anchor: marker1,
      map: map,
    });
  });
}

initMap();
  // Initialize and add the map
  let map: google.maps.Map;
  let position: google.maps.LatLng | google.maps.LatLngLiteral;
  let center: google.maps.Marker;
  let peripheral: google.maps.Circle;

/**
 * Provide utility functions regardless of business logic.
 */
const TslGMapUtil = {
  createInfoContent(post: IPost): string {
    let commentString = "";
    post.postComments.map((comment: IPostComment) => {
      commentString += '<hr />' +
        '<div style="width:100%; padding: 10px;">' +
        '<div style="display:flex; justify-content:space-between;">' +
        '<div style="display:flex;">' +
        '<img width="40px" height="40px" src="' + comment.user.iconUrl + '" style="border: 2px solid #ff0099; border-radius:50%" />' +
        '<span style="font-weight:bold; font-family:Kaisai Decol; color:#ff0099; padding-left:10px;">' + comment.user.userName + "</span>" +
        '</div>' +
        '<span style="font-size: small; margin-left:20px;">' + comment.commentDate.toLocaleString("ja-JP") + "</span>" +
        "</div>" +
        "<p>" + comment.comment + "</p>" +
        "</div>"
    })

    let contentString = '<div id="content">' +
      '<div id="bodyContent" style="display:flex; justify-content:space-between;">' +
      "<img src='" + post.imageUrl + "' width='50%' />" +
      '<div style="width:50%; padding:10px;">' +
        '<div style="display:flex;">' +
          '<img width="40px" height="40px" src="' + post.user.iconUrl + '" style="border: 2px solid #ff0099; border-radius:50%" />' +
          '<h4 style="font-weight:bold; font-family:Kaisai Decol; color:#ff0099; padding-left:10px;">' + post.user.userName + '</h4>' +
        '</div>' +
        '<h4 id="firstHeading">' + post.title + '</h4>' +
        '<p style="font-size:small;">' + post.insertDate.toLocaleString("ja-JP") + "</p>" +
      '</div>' + 
      '</div>' + 
      "<p>" + post.description + "</p>" +
      '<div>' + 
      '<p style="margin-top:10px; text-align:center; font-size:small;">コメント</p>' + 
      commentString + 
      "</div>" +
      "</div>";

    return contentString;
  },

  createShowCurrentLocationButton(): HTMLButtonElement {
    const locationButton = document.createElement("button");
    const spanElement = document.createElement("span");
    spanElement.innerHTML = 'my_location';
    spanElement.classList.add('material-symbols-outlined');
    spanElement.style.cssText = 'color: #666666;'
    locationButton.appendChild(spanElement);
    locationButton.style.cssText = "background-color: white; padding: 8px; border: 0px solid; border-radius: 2px; margin-right: 10px; filter: drop-shadow(0px 0px 1px rgba(0,0,0,0.2));";
    return locationButton;
  },

  async createTslMarker(categoryType: CategoryType, position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<google.maps.marker.AdvancedMarkerElement> {
    let marker: Promise<google.maps.marker.AdvancedMarkerElement>;
    const markerDef = MarkerTypeDef.get(categoryType);
    console.log('categoryType:' + categoryType + ", markerDef:" + markerDef);
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    const icon = document.createElement('div');
    icon.innerHTML = '<span class="material-symbols-outlined text-xl">' + markerDef!.iconKeyWord + '</span>';
    const faPin = new PinElement({
      glyph: icon,
      glyphColor: markerDef!.glyphColor,
      background: markerDef!.bgColor,
      borderColor: markerDef!.glyphColor,
    });

    return new AdvancedMarkerElement({
      position: position,
      content: faPin.element,
    });
  },
}
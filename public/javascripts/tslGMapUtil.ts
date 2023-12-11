/**
 * Provide utility functions regardless of business logic.
 */
const TslGMapUtil = {

  createInfoContent(sanpoContent: SanpoContent): string {
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

  async createTslMarker(contentTypeEnum: ContentTypeEnum, position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<google.maps.marker.AdvancedMarkerElement> {
    let marker: Promise<google.maps.marker.AdvancedMarkerElement>;
    const markerDef = MarkerTypeDef.get(contentTypeEnum);
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
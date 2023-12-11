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
    switch (contentTypeEnum) {
      case ContentTypeEnum.Flower:
        marker = this.createFlowerMarker(position);
        break;
      case ContentTypeEnum.Landscape:
        marker = this.createLandscapeMarker(position);
        break;
      case ContentTypeEnum.Cafe:
        marker = this.createCafeMarker(position);
        break;
      case ContentTypeEnum.Shrine:
        marker = this.createShrineMarker(position);
        break;
      default:
        marker = this.createFlowerMarker(position);
        break;
    }
    return marker;
  },
  async createFlowerMarker(position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<google.maps.marker.AdvancedMarkerElement> {
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
  },
  async createLandscapeMarker(position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<google.maps.marker.AdvancedMarkerElement> {
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
  },
  async createCafeMarker(position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<google.maps.marker.AdvancedMarkerElement> {
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
  },
  async createShrineMarker(position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<google.maps.marker.AdvancedMarkerElement> {
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
}
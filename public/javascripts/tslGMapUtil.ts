
// Initialize and add the map
let map: google.maps.Map;
let position: google.maps.LatLng | google.maps.LatLngLiteral;
let center: google.maps.Marker;
let peripheral: google.maps.Circle;

/**
 * Provide utility functions regardless of business logic.
 */
const TslGMapUtil = {

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

  async createTslMarker(postCategoryId: number, position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<google.maps.marker.AdvancedMarkerElement> {
    console.debug('createTslMarker postCategoryId:' + postCategoryId);

    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    let pinElement = await TslGMapUtil.createPinElement(postCategoryId);
    return new AdvancedMarkerElement({
      position: position,
      content: pinElement.element,
    });
  },

  async createPinElement(postCategoryId: number): Promise<google.maps.marker.PinElement> {
    console.debug('createPinElement postCategoryId:' + postCategoryId);

    const markerDef = CategoryIdAndMarkerTypeDefMap.get(postCategoryId);
    const icon = document.createElement('div');
    icon.innerHTML = '<span class="material-symbols-outlined text-xl">' + markerDef!.iconKeyWord + '</span>';


    const { PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    return new PinElement({
      glyph: icon,
      glyphColor: markerDef!.glyphColor,
      background: markerDef!.bgColor,
      borderColor: markerDef!.glyphColor,
      scale: 1.5,
    });
  }
}
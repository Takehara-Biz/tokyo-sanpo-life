
// Initialize and add the map
let map: google.maps.Map;
let position: google.maps.LatLng | google.maps.LatLngLiteral;
let center: google.maps.Marker;
let peripheral: google.maps.Circle;

/**
 * Provide utility functions regardless of business logic.
 */
const TslGMapUtil = {
  commentEJSTemplate: `
    <hr />
    <div style="width:100%; padding: 10px;">
      <div style="display:flex; justify-content:space-between;">
        <div style="display:flex;">
          <img width="40px" height="40px" src="<%= comment.user.iconUrl %>" style="border: 2px solid #ff0099; border-radius:50%" />
          <span style="font-weight:bold; font-family:Kaisai Decol; color:#ff0099; padding-left:10px;"><%= comment.user.userName %></span>
        </div>
        <span style="font-size: small; margin-left:20px;"><%= comment.commentDate.toLocaleString("ja-JP") %></span>
      </div>
      <p class="w-full break-words"><%= comment.comment %></p>
    </div>
  `,
  postEJSTemplate : `
  <div id="content">
    <div id="bodyContent" style="display:flex; justify-content:space-between;">
      <img src='<%= post.imageUrl %>' width='50%' />
      <div style="width:50%; padding:10px;">
        <div style="display:flex;">
          <img width="40px" height="40px" src="<%= post.user.iconUrl %>" style="border: 2px solid #ff0099; border-radius:50%" />
          <h4 style="font-weight:bold; font-family:Kaisai Decol; color:#ff0099; padding-left:10px;"><%= post.user.userName %></h4>
        </div>
        <p style="font-size:small;"><%= post.insertDate.toLocaleString("ja-JP") %></p>
      </div>
    </div>
    <p class="w-full break-words"><%= post.description %></p>
    <div>
      <p style="margin-top:10px; text-align:center; font-size:small;">コメント</p>
      <%- commentString %>
    </div>
    <hr />
            <div class="accordion mt-3" id="accordionExample" style="height:240px;">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <span class="material-symbols-outlined text-accent">
                      add_comment
                    </span>
                    <span class="text-accent">コメントする</span>
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse visible" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    <% if (true) { %>
                      <form>
                        <textarea name="comment" required class="form-control" id="exampleFormControlTextarea1"
                          maxlength="100" rows="3" placeholder="あなたのコメント"></textarea>
                        <button type="submit" class="mt-3 btn w-full text-white bg-accent"
                          style="background-color:#ff0099;">
                          <span class="material-symbols-outlined align-[-6px]" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            upload
                          </span>
                          送信
                        </button>
                      </form>
                      <% } else { %>
                        <div class="grow flex justify-center items-center">
                        <div>
                          <p class="text-center">🥳この機能は、<br />ログインしたら使えるようになります〜。</p>
                          <p class="text-center">ログインまたは新規登録を行うには、<br />右上のユーザアイコンをクリックしてください。</p>
                        </div>
                      </div>
                          <% } %>
                  </div>
                </div>
              </div>
            </div>
  </div>`,
  
  createInfoContent(post: IPost): string {
    let commentString = "";
    post.postComments.map((comment: IPostComment) => {
      // @ts-ignore
      commentString += ejs.render(this.commentEJSTemplate, {comment: comment});
    })
    
    // @ts-ignore
    let contentString = ejs.render(this.postEJSTemplate, {post: post, commentString: commentString});
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
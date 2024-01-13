const UpdateUserIconPage = {

  getBase64Image(img): string {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL("image/png");
    // @ts-ignore
    return dataURL.replace(/^data:image\/?[A-z]*;base64,/);
  },

  initialize() {
    const useDefaultIconButton = document.getElementById('useDefaultIconButton')!;
    useDefaultIconButton.addEventListener('click', function (e) {
      // 要素を取得する
      const img = document.getElementById("defaultIconImg")! as HTMLImageElement;
  
      //canvas要素を生成
      const cvs = document.createElement('canvas');
      const context = cvs.getContext('2d')!;
      cvs.width = img.width;
      cvs.height = img.height;
  
      context.drawImage(img, 0, 0);
  
      //　mime_typeを指定してBase64化する
      const base64String = cvs.toDataURL("image/jpeg", 0.5);

      // @ts-ignore
      //TslLogUtil.debug(base64String);
      // @ts-ignore
      //TslLogUtil.debug("base64length : " + base64String.length);
  
      const preview1 = document.getElementById('preview1')! as HTMLImageElement;
      // previewにセットする
      preview1.src = base64String;
  
      const preview2 = document.getElementById('preview2')! as HTMLImageElement;
      // previewにセットする
      preview2.src = base64String;

      const newUserIconBase64 = document.getElementById("newUserIconBase64")! as HTMLInputElement;
      newUserIconBase64.value = base64String;
    });



    const uploadPhotoInput = document.getElementById('uploadPhoto')!;
    uploadPhotoInput.addEventListener('change', function (e) {
      // @ts-ignore
      const file = e.srcElement!.files[0];

      const fr = new FileReader();
      fr.addEventListener('load', function () {
        let url = fr.result;
        let img = new Image();
        img.src = url as string;
        // そのままだとでかすぎるのでサイズ調整して
        //img.height = 200;
        //img.classList.add('h-40');

        let cropperTargetDiv = document.getElementById('cropperTargetDiv')!;
        cropperTargetDiv.innerHTML = '';
        cropperTargetDiv.appendChild(img);
        UpdateUserIconPage.cropper();
      });
      fr.readAsDataURL(file);
    });
  },


  cropper(): void {
    //let target = document.getElementById('target');
    let target = document.getElementById('cropperTargetDiv')!.firstChild;

    // @ts-ignore
    const cropper = new Cropper(target, {
      aspectRatio: 1,
      viewMode: 1,
      crop: function (event) {
        const canvas = cropper.getCroppedCanvas({
          // width: 100,
          // height: 100,
          fillColor: '#000',
          imageSmoothingEnabled: false,
          imageSmoothingQuality: 'high',
        });
        const roundedCanvas = UpdateUserIconPage.getRoundedCanvas(canvas);

        // @ts-ignore
        //roundedImage.src = roundedCanvas.toDataURL();
      },
    });

    const cropButton = document.getElementById('cropButton')!;
    cropButton.addEventListener('click', function () {
      // トリミングパネル内のcanvasを取得
      const canvas = cropper.getCroppedCanvas()

      // 0.5は画質の高さを示す。0.0 ~ 1.0で、数字が大きいほど高画質。
      // canvasをbase64に変換
      const data = canvas.toDataURL("image/jpeg", 0.5);
      // @ts-ignore
      //TslLogUtil.debug(data);
      // @ts-ignore
      //TslLogUtil.debug("base64length : " + data.length);

      const preview1 = document.getElementById('preview1')! as HTMLImageElement;
      // previewにセットする
      preview1.src = data;

      const preview2 = document.getElementById('preview2')! as HTMLImageElement;
      // previewにセットする
      preview2.src = data;

      const newUserIconBase64 = document.getElementById("newUserIconBase64")! as HTMLInputElement;
      newUserIconBase64.value = data;
    });
  },

  getRoundedCanvas(sourceCanvas): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
  },
}


// come from ejs
// @ts-ignore
window.onload = (() => UpdateUserIconPage.initialize());
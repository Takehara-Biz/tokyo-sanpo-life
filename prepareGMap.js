var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Initialize and add the map
var map;
function initMap() {
    return __awaiter(this, void 0, void 0, function () {
        var position, Map, AdvancedMarkerElement, contentString1, contentString2, infowindow1, marker1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    position = { lat: 35.6812405, lng: 139.7645499 };
                    return [4 /*yield*/, google.maps.importLibrary("maps")];
                case 1:
                    Map = (_a.sent()).Map;
                    return [4 /*yield*/, google.maps.importLibrary("marker")];
                case 2:
                    AdvancedMarkerElement = (_a.sent()).AdvancedMarkerElement;
                    // The map, centered at Uluru
                    map = new Map(document.getElementById('map'), {
                        zoom: 4,
                        center: position,
                        mapId: 'DEMO_MAP_ID',
                    });
                    contentString1 = '<div id="content">' +
                        '<div id="siteNotice">' +
                        "</div>" +
                        '<h4 id="firstHeading" class="firstHeading">東京駅</h1>' +
                        '<div id="bodyContent">' +
                        "<img src='https://media.timeout.com/images/105544832/1372/772/image.webp' width='200px' />" +
                        "<p>2023/12/01</p>" +
                        "<p>ここが東京駅です！</p>" +
                        "</div>" +
                        "</div>";
                    contentString2 = '<div id="content">' +
                        '<div id="siteNotice">' +
                        "</div>" +
                        '<h4 id="firstHeading" class="firstHeading">新宿御苑</h1>' +
                        '<div id="bodyContent">' +
                        "<img src='https://s3-ap-northeast-1.amazonaws.com/thegate/2021/04/14/11/31/14/shinjukugyoen.jpg' width='200px' />" +
                        "<p>2023/12/01</p>" +
                        "<p>紅葉が見頃です〜。</p>" +
                        "</div>" +
                        "</div>";
                    infowindow1 = new google.maps.InfoWindow({
                        content: contentString1,
                        ariaLabel: "Uluru",
                    });
                    marker1 = new AdvancedMarkerElement({
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
                    return [2 /*return*/];
            }
        });
    });
}
initMap();

var Caring_urls = [
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo1002/1/1000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo1004/1/1000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo1003/1/1000/",
  // "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10075/1/1000/", //지역보육 관공서, 관공서명을 부르는 태그네임이 다름
  // "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/tbBabySisulBaseExt/1/1000/", //거점형야간보육어린이집정보, 좌표값이 없고 이름이나 서비스 종류 태그네임도 다름
];

var Medical_urls = [
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10074/1/1000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10074/1001/2000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10074/2001/3000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10074/3001/4000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10074/4001/5000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10074/5001/6000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10074/6001/7000/",
];

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.498004414546934, 127.02770621963765), // 지도의 중심좌표
    level: 8, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

var Caring_positions = [];
var Caring_names = [];
var Caring_seviceCLs = [];
var Caring_addresses = [];
var Caring_siteurls = [];

var Medical_positions = [];
var Medical_names = [];
var Medical_ATDRCs = [];
var Medical_addresses = [];
var Medical_siteurls = [];

async function loadXMLData(apiurl, type) {
  var url = apiurl;
  const response = await fetch(url);
  const xmlString = await response.text();
  const parser = new DOMParser();
  const xmlData = parser.parseFromString(xmlString, "text/xml");
  if (type === "Caring") {
    processCaringXMLData(xmlData);
  } else if (type === "Medical") {
    processMedicalXMLData(xmlData);
  }
}

var geocoder = new kakao.maps.services.Geocoder();

function processCaringXMLData(xmlData) {
  var xValueElements = xmlData.getElementsByTagName("X_CRDNT_VALUE");
  var yValueElements = xmlData.getElementsByTagName("Y_CRDNT_VALUE");
  var BASSADRESElements = xmlData.getElementsByTagName("BASS_ADRES");
  var FCLTYNMElements = xmlData.getElementsByTagName("FCLTY_NM");
  var SVCCLNMElements = xmlData.getElementsByTagName("SVC_CL_NM");
  // var SITEURLElements = xmlData.getElementsByTagName("SITE_URL"); 사이트 url 받는 게 잘 안됨. 저 태그네임이 아니거나 url이 없거나

  for (var i = 0; i < xValueElements.length; i++) {
    var xValue = parseFloat(xValueElements[i].textContent);
    var yValue = parseFloat(yValueElements[i].textContent);

    var apiposition = new kakao.maps.LatLng(yValue, xValue);
    var apiname = FCLTYNMElements[i].textContent;
    var apiseviceCL = SVCCLNMElements[i].textContent;
    var apiBASSADRE = BASSADRESElements[i].textContent;
    // var apisiteurl = SITEURLElements[i].textContent;

    Caring_positions.push(apiposition);
    Caring_names.push(apiname);
    Caring_seviceCLs.push(apiseviceCL);
    Caring_addresses.push(apiBASSADRE);
    // Caring_siteurls.push(apisiteurl);
  }
}

function processMedicalXMLData(xmlData) {
  var xValueElements = xmlData.getElementsByTagName("X_CRDNT_VALUE");
  var yValueElements = xmlData.getElementsByTagName("Y_CRDNT_VALUE");
  var BASSADRESElements = xmlData.getElementsByTagName("BASS_ADRES");
  var nameElements = xmlData.getElementsByTagName("CLTUR_EVENT_ETC_NM");
  var ATDRCElements = xmlData.getElementsByTagName("ATDRC_NM");
  var siteURLElements = xmlData.getElementsByTagName("GUIDANCE_URL");

  for (var i = 0; i < xValueElements.length; i++) {
    var xValue = parseFloat(xValueElements[i].textContent);
    var yValue = parseFloat(yValueElements[i].textContent);

    var apiposition = new kakao.maps.LatLng(yValue, xValue);
    var apiname = nameElements[i].textContent;
    var apiATDRC = ATDRCElements[i].textContent;
    var apiBASSADRE = BASSADRESElements[i].textContent;
    var apisiteurl = siteURLElements[i].textContent;

    Medical_positions.push(apiposition);
    Medical_names.push(apiname);
    Medical_ATDRCs.push(apiATDRC);
    Medical_addresses.push(apiBASSADRE);
    Medical_siteurls.push(apisiteurl);
  }
  console.log("medical");
}

async function loadALLXMLData() {
  for (var i = 0; i < Caring_urls.length; i++) {
    await loadXMLData(Caring_urls[i], "Caring");
    console.log(Caring_urls[i]);
  }
  for (var i = 0; i < Medical_urls.length; i++) {
    await loadXMLData(Medical_urls[i], "Medical");
    console.log(Medical_urls[i]);
  }
}
MakeAllMarkers();

async function MakeAllMarkers() {
  await loadALLXMLData();
  createCaringDataMarkers();
  createStoreMarkers();
  createCarparkMarkers();
}

// 편의점 마커가 표시될 좌표 배열입니다
var storePositions = [
  new kakao.maps.LatLng(37.497535461505684, 127.02948149502778),
  new kakao.maps.LatLng(37.49671536281186, 127.03020491448352),
  new kakao.maps.LatLng(37.496201943633714, 127.02959405469642),
  new kakao.maps.LatLng(37.49640072567703, 127.02726459882308),
  new kakao.maps.LatLng(37.49640098874988, 127.02609983175294),
  new kakao.maps.LatLng(37.49932849491523, 127.02935780247945),
  new kakao.maps.LatLng(37.49996818951873, 127.02943721562295),
];

var markerImageSrc =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/category.png"; // 마커이미지의 주소입니다. 스프라이트 이미지 입니다

(coffeeMarkers = []), // 커피숍 마커 객체를 가지고 있을 배열입니다
  (storeMarkers = []), // 편의점 마커 객체를 가지고 있을 배열입니다
  (carparkMarkers = []); // 주차장 마커 객체를 가지고 있을 배열입니다

// 마커이미지의 주소와, 크기, 옵션으로 마커 이미지를 생성하여 리턴하는 함수입니다
function createMarkerImage(src, size, options) {
  var markerImage = new kakao.maps.MarkerImage(src, size, options);
  return markerImage;
}

var lastInfowindow;

// 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
function createMarker(position, image, name, serviceCL, address) {
  var marker = new kakao.maps.Marker({
    position: position,
    image: image,
  });
  marker.setClickable(true);

  // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
  var iwContent =
    '<div style="padding:20px;"><b>' +
    name +
    "</b><br/>" +
    serviceCL +
    "</b><br/>" +
    address +
    "</div>"; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

  // 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: true,
  });

  // 마커에 클릭이벤트를 등록합니다
  kakao.maps.event.addListener(marker, "click", function () {
    // 마커 위에 인포윈도우를 표시합니다
    console.log("click");
    if (lastInfowindow) {
      lastInfowindow.close();
    }

    infowindow.open(map, marker);
    lastInfowindow = infowindow;
  });

  return marker;
}

async function createCaringDataMarkers() {
  for (var i = 0; i < Caring_positions.length; i++) {
    var imageSize = new kakao.maps.Size(22, 26),
      imageOptions = {
        spriteOrigin: new kakao.maps.Point(10, 0),
        spriteSize: new kakao.maps.Size(36, 98),
      };

    var markerImage = createMarkerImage(
        markerImageSrc,
        imageSize,
        imageOptions
      ),
      marker = createMarker(
        Caring_positions[i],
        markerImage,
        Caring_names[i],
        Caring_seviceCLs[i],
        Caring_addresses[i]
      );

    coffeeMarkers.push(marker);
  }
  changeMarker("coffee");
}

// 커피숍 마커들의 지도 표시 여부를 설정하는 함수입니다
function setCoffeeMarkers(map) {
  for (var i = 0; i < coffeeMarkers.length; i++) {
    coffeeMarkers[i].setMap(map);
  }
}

// 편의점 마커를 생성하고 편의점 마커 배열에 추가하는 함수입니다
function createStoreMarkers() {
  for (var i = 0; i < storePositions.length; i++) {
    var imageSize = new kakao.maps.Size(22, 26),
      imageOptions = {
        spriteOrigin: new kakao.maps.Point(10, 36),
        spriteSize: new kakao.maps.Size(36, 98),
      };

    // 마커이미지와 마커를 생성합니다
    var markerImage = createMarkerImage(
        markerImageSrc,
        imageSize,
        imageOptions
      ),
      marker = createMarker(
        storePositions[i],
        markerImage,
        Caring_names[i],
        Caring_seviceCLs[i],
        Caring_addresses[i]
      );

    // 생성된 마커를 편의점 마커 배열에 추가합니다
    storeMarkers.push(marker);
  }
}

// 편의점 마커들의 지도 표시 여부를 설정하는 함수입니다
function setStoreMarkers(map) {
  for (var i = 0; i < storeMarkers.length; i++) {
    storeMarkers[i].setMap(map);
  }
}

// 주차장 마커를 생성하고 주차장 마커 배열에 추가하는 함수입니다
function createCarparkMarkers() {
  for (var i = 0; i < Medical_positions.length; i++) {
    var imageSize = new kakao.maps.Size(22, 26),
      imageOptions = {
        spriteOrigin: new kakao.maps.Point(10, 72),
        spriteSize: new kakao.maps.Size(36, 98),
      };

    // 마커이미지와 마커를 생성합니다
    var markerImage = createMarkerImage(
        markerImageSrc,
        imageSize,
        imageOptions
      ),
      marker = createMarker(
        Medical_positions[i],
        markerImage,
        Medical_names[i],
        Medical_addresses[i],
        Medical_siteurls[i]
      );

    // 생성된 마커를 주차장 마커 배열에 추가합니다
    carparkMarkers.push(marker);
  }
}

// 주차장 마커들의 지도 표시 여부를 설정하는 함수입니다
function setCarparkMarkers(map) {
  for (var i = 0; i < carparkMarkers.length; i++) {
    carparkMarkers[i].setMap(map);
  }
}

// 카테고리를 클릭했을 때 type에 따라 카테고리의 스타일과 지도에 표시되는 마커를 변경합니다
function changeMarker(type) {
  var coffeeMenu = document.getElementById("coffeeMenu");
  var storeMenu = document.getElementById("storeMenu");
  var carparkMenu = document.getElementById("carparkMenu");

  // 커피숍 카테고리가 클릭됐을 때
  if (type === "coffee") {
    // 커피숍 카테고리를 선택된 스타일로 변경하고
    coffeeMenu.className = "menu_selected";

    // 편의점과 주차장 카테고리는 선택되지 않은 스타일로 바꿉니다
    storeMenu.className = "";
    carparkMenu.className = "";

    // 커피숍 마커들만 지도에 표시하도록 설정합니다
    setCoffeeMarkers(map);
    setStoreMarkers(null);
    setCarparkMarkers(null);
  } else if (type === "store") {
    // 편의점 카테고리가 클릭됐을 때

    // 편의점 카테고리를 선택된 스타일로 변경하고
    coffeeMenu.className = "";
    storeMenu.className = "menu_selected";
    carparkMenu.className = "";

    // 편의점 마커들만 지도에 표시하도록 설정합니다
    setCoffeeMarkers(null);
    setStoreMarkers(map);
    setCarparkMarkers(null);
  } else if (type === "carpark") {
    // 주차장 카테고리가 클릭됐을 때
    console.log(Medical_positions);
    console.log(Medical_names);
    console.log(Medical_siteurls);
    console.log(Medical_addresses);

    // 주차장 카테고리를 선택된 스타일로 변경하고
    coffeeMenu.className = "";
    storeMenu.className = "";
    carparkMenu.className = "menu_selected";

    // 주차장 마커들만 지도에 표시하도록 설정합니다
    setCoffeeMarkers(null);
    setStoreMarkers(null);
    setCarparkMarkers(map);
  }
}

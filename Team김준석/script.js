var Care_urls = [
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo1002/1/1000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo1004/1/1000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo1003/1/1000/",
  // "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10075/1/1000/", //지역보육 관공서, 관공서명을 부르는 태그네임이 다름
  // "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/tbBabySisulBaseExt/1/1000/", //거점형야간보육어린이집정보, 좌표값이 없고 이름이나 서비스 종류 태그네임도 다름
];

var Play_urls = [
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10071/1/1000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10071/1001/2000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10071/2001/3000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10072/1/1000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10072/1001/2000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10073/1/1000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10073/1001/2000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo2001/1/1000/",
  "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo2001/1001/2000/",
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
    center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
    level: 9, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

var Care_positions = [];
var Care_names = [];
var Care_seviceCLs = [];
var Care_addresses = [];
var Care_siteurls = [];

var Play_positions = [];
var Play_names = [];
var Play_ATDRCs = [];
var Play_addresses = [];
var Play_siteurls = [];

var Medical_positions = [];
var Medical_names = [];
var Medical_ATDRCs = [];
var Medical_addresses = [];
var Medical_siteurls = [];
var Medical_TH = [];

async function loadXMLData(apiurl, type) {
  var url = apiurl;
  const response = await fetch(url);
  const xmlString = await response.text();
  const parser = new DOMParser();
  const xmlData = parser.parseFromString(xmlString, "text/xml");
  if (type === "Care") {
    if (
      apiurl ==
      "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo1003/1/1000/"
    ) {
      processCareXMLData(xmlData, 0);
      console.log("url");
    } else {
      processCareXMLData(xmlData, 1);
    }
  } else if (type === "Play") {
    processPlayXMLData(xmlData);
  } else if (type === "Medical") {
    processMedicalXMLData(xmlData);
  }
}

// var geocoder = new kakao.maps.services.Geocoder();

function processCareXMLData(xmlData, urlcheck) {
  var xValueElements = xmlData.getElementsByTagName("X_CRDNT_VALUE");
  var yValueElements = xmlData.getElementsByTagName("Y_CRDNT_VALUE");
  var BASSADRESElements = xmlData.getElementsByTagName("BASS_ADRES");
  var FCLTYNMElements = xmlData.getElementsByTagName("FCLTY_NM");
  var SVCCLNMElements = xmlData.getElementsByTagName("SVC_CL_NM");

  console.log(urlcheck);

  if (urlcheck == 1) {
    var SITEURLElements = xmlData.getElementsByTagName("SITE_URL");
  }

  for (var i = 0; i < xValueElements.length; i++) {
    var xValue = parseFloat(xValueElements[i].textContent);
    var yValue = parseFloat(yValueElements[i].textContent);

    var apiposition = new kakao.maps.LatLng(yValue, xValue);
    var apiname = FCLTYNMElements[i].textContent;
    var apiseviceCL = SVCCLNMElements[i].textContent;
    var apiBASSADRE = BASSADRESElements[i].textContent;
    if (urlcheck == 1) {
      var apisiteurl = SITEURLElements[i].textContent;
    }

    Care_positions.push(apiposition);
    Care_names.push(apiname);
    Care_seviceCLs.push(apiseviceCL);
    Care_addresses.push(apiBASSADRE);
    if (urlcheck == 0) {
      Care_siteurls.push("");
    } else {
      Care_siteurls.push(apisiteurl);
    }
  }
}

function processPlayXMLData(xmlData) {
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

    Play_positions.push(apiposition);
    Play_names.push(apiname);
    Play_ATDRCs.push(apiATDRC);
    Play_addresses.push(apiBASSADRE);
    Play_siteurls.push(apisiteurl);
  }
  console.log("play");
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
    if (apiname.includes("치과")) {
      var haspitaltype = "치과";
    } else if (apiname.includes("안과")) {
      var haspitaltype = "안과";
    } else if (apiname.includes("약국")) {
      var haspitaltype = "약국";
    } else if (apiname.includes("내과")) {
      var haspitaltype = "내과";
    } else if (apiname.includes("이비인후과")) {
      var haspitaltype = "이비인후과";
    } else if (apiname.includes("한의원")) {
      var haspitaltype = "한의원";
    } else if (apiname.includes("피부과")) {
      var haspitaltype = "피부과";
    } else if (apiname.includes("소아과")) {
      var haspitaltype = "소아과";
    } else if (apiname.includes("보건소")) {
      var haspitaltype = "보건소";
    } else if (apiname.includes("가정의학과")) {
      var haspitaltype = "가정의학과";
    } else {
      var haspitaltype = "기타";
    }

    Medical_positions.push(apiposition);
    Medical_names.push(apiname);
    Medical_ATDRCs.push(apiATDRC);
    Medical_addresses.push(apiBASSADRE);
    Medical_siteurls.push(apisiteurl);
    Medical_TH.push(haspitaltype);
  }
  console.log("medical");
}

async function loadALLXMLData() {
  for (var i = 0; i < Care_urls.length; i++) {
    await loadXMLData(Care_urls[i], "Care");
    console.log(Care_urls[i]);
  }
  for (var i = 0; i < Play_urls.length; i++) {
    await loadXMLData(Play_urls[i], "Play");
    console.log(Play_urls[i]);
  }
  for (var i = 0; i < Medical_urls.length; i++) {
    await loadXMLData(Medical_urls[i], "Medical");
    console.log(Medical_urls[i]);
  }
}
MakeAllMarkers();

async function MakeAllMarkers() {
  await loadALLXMLData();
  createCareDataMarkers();
  createPlayMarkers();
  createMedicalMarkers();
}

// var markerimglocal = document.getElementById("myImage"); // 이미지 요소를 선택합니다.

var markerImageSrc =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/category.png"; // 마커이미지의 주소입니다. 스프라이트 이미지 입니다

(CareMarkers = []), // 커피숍 마커 객체를 가지고 있을 배열입니다
  (PlayMarkers = []), // 편의점 마커 객체를 가지고 있을 배열입니다
  (MedicalMarkers = []); // 주차장 마커 객체를 가지고 있을 배열입니다

// 마커이미지의 주소와, 크기, 옵션으로 마커 이미지를 생성하여 리턴하는 함수입니다
function createMarkerImage(src, size, options) {
  var markerImage = new kakao.maps.MarkerImage(src, size, options);
  return markerImage;
}

var lastInfowindow;

// 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
function createMarker(position, image, name, content1, content2) {
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
    content1 +
    "</b><br/>" +
    content2 +
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

function createCareMarker(position, image, name, content1, content2, content3) {
  var marker = new kakao.maps.Marker({
    position: position,
    image: image,
  });
  marker.setClickable(true);

  // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
  var iwContent =
    '<div style="padding:30px;"><b>' +
    name +
    "</b><br/>" +
    content1 +
    "</b><br/>" +
    content2 +
    "</b><br/>" +
    content3 +
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

async function createCareDataMarkers() {
  for (var i = 0; i < Care_positions.length; i++) {
    var imageSize = new kakao.maps.Size(30, 30),
      imageOptions = {
        spriteOrigin: new kakao.maps.Point(10, 0),
        spriteSize: new kakao.maps.Size(10, 10),
      };

    var markerImage = createMarkerImage(
        "logos1/logo.png",
        imageSize,
        imageOptions
      ),
      marker = createCareMarker(
        Care_positions[i],
        markerImage,
        Care_names[i],
        Care_seviceCLs[i],
        Care_addresses[i],
        Care_siteurls[i]
      );

    CareMarkers.push(marker);
  }
  changeMarker("Care");
}

// 커피숍 마커들의 지도 표시 여부를 설정하는 함수입니다
function setCareMarkers(map) {
  for (var i = 0; i < CareMarkers.length; i++) {
    CareMarkers[i].setMap(map);
  }
}

// 편의점 마커를 생성하고 편의점 마커 배열에 추가하는 함수입니다
function createPlayMarkers() {
  for (var i = 0; i < Play_positions.length; i++) {
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
        Play_positions[i],
        markerImage,
        Play_names[i],
        Play_addresses[i],
        Play_siteurls[i]
      );

    // 생성된 마커를 편의점 마커 배열에 추가합니다
    PlayMarkers.push(marker);
  }
}

// 편의점 마커들의 지도 표시 여부를 설정하는 함수입니다
function setPlayMarkers(map) {
  for (var i = 0; i < PlayMarkers.length; i++) {
    PlayMarkers[i].setMap(map);
  }
}

// 주차장 마커를 생성하고 주차장 마커 배열에 추가하는 함수입니다
function createMedicalMarkers() {
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
    MedicalMarkers.push(marker);
  }
}

// 주차장 마커들의 지도 표시 여부를 설정하는 함수입니다
function setMedicalMarkers(map) {
  for (var i = 0; i < MedicalMarkers.length; i++) {
    MedicalMarkers[i].setMap(map);
  }
}

// 카테고리를 클릭했을 때 type에 따라 카테고리의 스타일과 지도에 표시되는 마커를 변경합니다
function changeMarker(type) {
  var CareMenu = document.getElementById("CareMenu");
  var PlayMenu = document.getElementById("PlayMenu");
  var MedicalMenu = document.getElementById("MedicalMenu");

  // 커피숍 카테고리가 클릭됐을 때
  if (type === "Care") {
    // 커피숍 카테고리를 선택된 스타일로 변경하고
    if (lastInfowindow) {
      lastInfowindow.close();
    }

    CareMenu.className = "menu_selected";

    // 편의점과 주차장 카테고리는 선택되지 않은 스타일로 바꿉니다
    PlayMenu.className = "";
    MedicalMenu.className = "";

    // 커피숍 마커들만 지도에 표시하도록 설정합니다
    setCareMarkers(map);
    setPlayMarkers(null);
    setMedicalMarkers(null);
  } else if (type === "Play") {
    if (lastInfowindow) {
      lastInfowindow.close();
    }
    // 편의점 카테고리가 클릭됐을 때

    // 편의점 카테고리를 선택된 스타일로 변경하고
    CareMenu.className = "";
    PlayMenu.className = "menu_selected";
    MedicalMenu.className = "";

    // 편의점 마커들만 지도에 표시하도록 설정합니다
    setCareMarkers(null);
    setPlayMarkers(map);
    setMedicalMarkers(null);
  } else if (type === "Medical") {
    if (lastInfowindow) {
      lastInfowindow.close();
    }
    // 주차장 카테고리가 클릭됐을 때
    console.log(Medical_TH);

    // 주차장 카테고리를 선택된 스타일로 변경하고
    CareMenu.className = "";
    PlayMenu.className = "";
    MedicalMenu.className = "menu_selected";

    // 주차장 마커들만 지도에 표시하도록 설정합니다
    setCareMarkers(null);
    setPlayMarkers(null);
    setMedicalMarkers(map);
  }
}

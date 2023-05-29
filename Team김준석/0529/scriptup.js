// Initialize and display the map
var container = document.getElementById("map");
var options = {
  center: new kakao.maps.LatLng(37.5665, 126.978), // Set the center coordinates
  level: 5, // Set the initial zoom level (1-14)
};
var map = new kakao.maps.Map(container, options);

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

var Care_positions = [];
var Care_names = [];
var Care_seviceCLs = [];
var Care_ATDRCs = [];
var Care_addresses = [];
var Care_siteurls = [];
var Care_AgeSEs = [];

var Play_positions = [];
var Play_names = [];
var Play_types = [];
var Play_ATDRCs = [];
var Play_addresses = [];
var Play_siteurls = [];
var Play_AgeSEs = [];

var Medical_positions = [];
var Medical_names = [];
var Medical_ATDRCs = [];
var Medical_addresses = [];
var Medical_siteurls = [];
var Medical_TH = [];

async function loadXMLData(apiurl, type) {
  var url = apiurl;
  console.log(url);
  const response = await fetch(url);
  const xmlString = await response.text();
  const parser = new DOMParser();
  const xmlData = parser.parseFromString(xmlString, "text/xml");
  if (type === "Care") {
    console.log(type);
    if (
      apiurl ==
      "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo1003/1/1000/"
    ) {
      processCareXMLData(xmlData, 0);
    } else {
      processCareXMLData(xmlData, 1);
    }
  } else if (type === "Play") {
    console.log(type);
    if (
      apiurl ==
        "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo2001/1/1000/" ||
      apiurl ==
        "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo2001/1001/2000/"
    ) {
      processPlayXMLData(xmlData, "문화 행사");
    } else if (
      apiurl ==
        "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10072/1/1000/" ||
      apiurl ==
        "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10072/1001/2000/"
    ) {
      processPlayXMLData(xmlData, "체험 시설");
    } else if (
      apiurl ==
        "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10071/1/1000/" ||
      apiurl ==
        "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10071/1001/2000/" ||
      apiurl ==
        "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10071/2001/3000/"
    ) {
      processPlayXMLData(xmlData, "야외 시설");
    } else if (
      apiurl ==
        "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10073/1/1000/" ||
      apiurl ==
        "http://openapi.seoul.go.kr:8088/596d54785a696d6a37324e42777371/xml/TnFcltySttusInfo10073/1001/2000/"
    ) {
      processPlayXMLData(xmlData, "도서 시설");
    }
  } else if (type === "Medical") {
    console.log(type);
    processMedicalXMLData(xmlData);
  }
}

// var geocoder = new kakao.maps.services.Geocoder();

function processCareXMLData(xmlData, urlcheck) {
  var xValueElements = xmlData.getElementsByTagName("X_CRDNT_VALUE");
  var yValueElements = xmlData.getElementsByTagName("Y_CRDNT_VALUE");
  var BASSADRESElements = xmlData.getElementsByTagName("BASS_ADRES");
  var FCLTYNMElements = xmlData.getElementsByTagName("FCLTY_NM");
  var ATDRCElements = xmlData.getElementsByTagName("ATDRC_NM");
  var SVCCLNMElements = xmlData.getElementsByTagName("SVC_CL_NM");
  var AGEElements = xmlData.getElementsByTagName("AGE_SE_NM");

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
    var apiATDRC = ATDRCElements[i].textContent;
    var apiAge = AGEElements[i].textContent;
    if (apiAge == "초중생") {
      apiAge = "초등학생";
    }
    if (urlcheck == 1) {
      var apisiteurl = SITEURLElements[i].textContent;
    }

    Care_positions.push(apiposition);
    Care_names.push(apiname);
    Care_seviceCLs.push(apiseviceCL);
    Care_ATDRCs.push(apiATDRC);
    Care_addresses.push(apiBASSADRE);
    Care_AgeSEs.push(apiAge);

    if (urlcheck == 0) {
      Care_siteurls.push("");
    } else {
      Care_siteurls.push(apisiteurl);
    }
  }
}

function processPlayXMLData(xmlData, type) {
  var xValueElements = xmlData.getElementsByTagName("X_CRDNT_VALUE");
  var yValueElements = xmlData.getElementsByTagName("Y_CRDNT_VALUE");
  var BASSADRESElements = xmlData.getElementsByTagName("BASS_ADRES");
  var nameElements = xmlData.getElementsByTagName("CLTUR_EVENT_ETC_NM");
  var ATDRCElements = xmlData.getElementsByTagName("ATDRC_NM");
  var siteURLElements = xmlData.getElementsByTagName("GUIDANCE_URL");
  var AGEElements = xmlData.getElementsByTagName("AGE_SE_NM");

  for (var i = 0; i < xValueElements.length; i++) {
    var xValue = parseFloat(xValueElements[i].textContent);
    var yValue = parseFloat(yValueElements[i].textContent);

    var apiposition = new kakao.maps.LatLng(yValue, xValue);
    var apiname = nameElements[i].textContent;
    var apiATDRC = ATDRCElements[i].textContent;
    var apiBASSADRE = BASSADRESElements[i].textContent;
    var apisiteurl = siteURLElements[i].textContent;
    var apiAge = AGEElements[i].textContent;
    if (apiAge == "초중생") {
      apiAge = "초등학생";
    }

    if (type == "문화 행사") {
      var apitype = "문화 행사";
    } else if (type == "야외 시설") {
      var apitype = "야외 시설";
    } else if (type == "체험 시설") {
      if (apiname.includes("공원")) {
        var apitype = "야외 시설";
      } else {
        var apitype = "체험 시설";
      }
    } else if (type == "도서 시설") {
      if (apiname.includes("장난감")) {
        var apitype = "체험 시설";
      } else {
        var apitype = "도서 시설";
      }
    }

    Play_positions.push(apiposition);
    Play_names.push(apiname);
    Play_ATDRCs.push(apiATDRC);
    Play_addresses.push(apiBASSADRE);
    Play_siteurls.push(apisiteurl);
    Play_types.push(apitype);
    Play_AgeSEs.push(apiAge);
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
}

async function loadALLXMLData() {
  for (var i = 0; i < Care_urls.length; i++) {
    await loadXMLData(Care_urls[i], "Care");
  }
  for (var i = 0; i < Play_urls.length; i++) {
    await loadXMLData(Play_urls[i], "Play");
  }
  for (var i = 0; i < Medical_urls.length; i++) {
    await loadXMLData(Medical_urls[i], "Medical");
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

var CareMarkers = [], // 커피숍 마커 객체를 가지고 있을 배열입니다
  PlayMarkers = [], // 편의점 마커 객체를 가지고 있을 배열입니다
  MedicalMarkers = []; // 주차장 마커 객체를 가지고 있을 배열입니다

var CareMarkersState = [];
var PlayMarkersState = [];
var MedicalMarkersState = [];

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
    '<div style="padding:30px;"><b>' +
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

function createMarker3(position, image, name, content1, content2, content3) {
  var marker = new kakao.maps.Marker({
    position: position,
    image: image,
  });
  marker.setClickable(true);

  // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
  var iwContent =
    '<div style="padding:40px;"><b>' +
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
    var imageSize = new kakao.maps.Size(36, 36),
      imageOptions = {
        spriteOrigin: new kakao.maps.Point(0, 0),
        spriteSize: new kakao.maps.Size(36, 36),
      };

    if (Care_seviceCLs[i] == "공동육아방") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672010389168168/469722e4327e9694.png";
    } else if (Care_seviceCLs[i] == "공동육아나눔터") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672010141712424/6fca48fefaae3039.png";
    } else if (Care_seviceCLs[i] == "지역아동센터") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672069977653300/c856fc7b227a8242.png";
    }

    var markerImage = createMarkerImage(
        markerImageaddress,
        imageSize,
        imageOptions
      ),
      marker = createMarker3(
        Care_positions[i],
        markerImage,
        Care_names[i],
        Care_seviceCLs[i],
        Care_addresses[i],
        Care_siteurls[i]
      );

    CareMarkers.push(marker);
    CareMarkersState.push([1, 1, 1]);
  }
  changeMarker("Care");
}

// 커피숍 마커들의 지도 표시 여부를 설정하는 함수입니다
function setAllCareMarkers(map) {
  for (var i = 0; i < CareMarkers.length; i++) {
    CareMarkers[i].setMap(map);
    if (map) {
      CareMarkersState[i] = [1, 1, 1]; // 이거 되나?
    } else {
      CareMarkersState[i] = [0, 0, 0];
    }
  }
}

// 편의점 마커를 생성하고 편의점 마커 배열에 추가하는 함수입니다
function createPlayMarkers() {
  for (var i = 0; i < Play_positions.length; i++) {
    var imageSize = new kakao.maps.Size(36, 36),
      imageOptions = {
        spriteOrigin: new kakao.maps.Point(0, 0),
        spriteSize: new kakao.maps.Size(36, 36),
      };

    if (Play_types[i] == "체험 시설") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672070250274906/5108b472a770941b.png";
    } else if (Play_types[i] == "야외 시설") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672068962631761/98382c0a9be057ae.png";
    } else if (Play_types[i] == "도서 시설") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672011190280243/2eb5e67e1399f40c.png";
    } else if (Play_types[i] == "문화 행사") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672011567771718/9c4d547fc54a5b6f.png";
    }

    // 마커이미지와 마커를 생성합니다
    var markerImage = createMarkerImage(
        markerImageaddress,
        imageSize,
        imageOptions
      ),
      marker = createMarker3(
        Play_positions[i],
        markerImage,
        Play_names[i],
        Play_types[i],
        Play_addresses[i],
        Play_siteurls[i]
      );

    // 생성된 마커를 편의점 마커 배열에 추가합니다
    PlayMarkers.push(marker);
    PlayMarkersState.push([1, 1, 1]);
  }
}

// 편의점 마커들의 지도 표시 여부를 설정하는 함수입니다
function setAllPlayMarkers(map) {
  for (var i = 0; i < PlayMarkers.length; i++) {
    PlayMarkers[i].setMap(map);
    if (map) {
      PlayMarkersState[i] = [1, 1, 1]; // 이거 되나?
    } else {
      PlayMarkersState[i] = [0, 0, 0];
    }
  }
}

// 주차장 마커를 생성하고 주차장 마커 배열에 추가하는 함수입니다
function createMedicalMarkers() {
  for (var i = 0; i < Medical_positions.length; i++) {
    var imageSize = new kakao.maps.Size(36, 36),
      imageOptions = {
        spriteOrigin: new kakao.maps.Point(0, 0),
        spriteSize: new kakao.maps.Size(36, 36),
      };

    if (Medical_TH[i] == "가정의학과") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672009915215912/6c97382ae76165c2.png";
    } else if (Medical_TH[i] == "내과") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672010905075792/e59153ec6b93a865.png";
    } else if (Medical_TH[i] == "보건소") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672011844591696/b55195d45a099e22.png";
    } else if (Medical_TH[i] == "소아과") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672012087865465/88bff098793fd6a0.png";
    } else if (Medical_TH[i] == "안과") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672012381470760/079b82ff4b127257.png";
    } else if (Medical_TH[i] == "약국") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672069239447583/6acc6d09c87ef1a9.png";
    } else if (Medical_TH[i] == "이비인후과") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672069239447583/6acc6d09c87ef1a9.png";
    } else if (Medical_TH[i] == "치과") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672070585831576/b4f006a2c9d8182d.png";
    } else if (Medical_TH[i] == "피부과") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672070959112263/b4baeb25748835e7.png";
    } else if (Medical_TH[i] == "한의원") {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672071303053362/1495d65cab3c39df.png";
    } else {
      var markerImageaddress =
        "https://cdn.discordapp.com/attachments/1111982831011369042/1112672010632441906/11c6de2f5cf519be.png";
    }

    // 마커이미지와 마커를 생성합니다
    var markerImage = createMarkerImage(
        markerImageaddress,
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
    MedicalMarkersState.push([1, 1, 1]);
  }
}

// 주차장 마커들의 지도 표시 여부를 설정하는 함수입니다
function setAllMedicalMarkers(map) {
  for (var i = 0; i < MedicalMarkers.length; i++) {
    MedicalMarkers[i].setMap(map);
    if (map) {
      MedicalMarkersState[i] = [1, 1, 1];
    } else {
      MedicalMarkersState[i] = [0, 0, 0];
    }
  }
}

var current_type = "Care";

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

    current_type = "Care";
    current_category = "지역";
    checkAllbox();

    CareMenu.className = "menu_selected";
    PlayMenu.className = "";
    MedicalMenu.className = "";

    // 편의점과 주차장 카테고리는 선택되지 않은 스타일로 바꿉니다
    PlayMenu.className = "";
    MedicalMenu.className = "";

    // 커피숍 마커들만 지도에 표시하도록 설정합니다
    setAllCareMarkers(map);
    setAllPlayMarkers(null);
    setAllMedicalMarkers(null);
  } else if (type === "Play") {
    if (lastInfowindow) {
      lastInfowindow.close();
    }
    // 편의점 카테고리가 클릭됐을 때

    current_type = "Play";
    current_category = "지역";
    checkAllbox();

    // 편의점 카테고리를 선택된 스타일로 변경하고
    CareMenu.className = "";
    PlayMenu.className = "menu_selected";
    MedicalMenu.className = "";

    // 편의점 마커들만 지도에 표시하도록 설정합니다
    setAllCareMarkers(null);
    setAllPlayMarkers(map);
    setAllMedicalMarkers(null);
  } else if (type === "Medical") {
    if (lastInfowindow) {
      lastInfowindow.close();
    }
    // 주차장 카테고리가 클릭됐을 때
    current_type = "Medical";
    current_category = "지역";
    checkAllbox();

    // 주차장 카테고리를 선택된 스타일로 변경하고
    CareMenu.className = "";
    PlayMenu.className = "";
    MedicalMenu.className = "menu_selected";

    // 주차장 마커들만 지도에 표시하도록 설정합니다
    setAllCareMarkers(null);
    setAllPlayMarkers(null);
    setAllMedicalMarkers(map);
  }
}

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const checklistItems = document.getElementById("checklist-items");
const checkedItems = document.getElementById("checked-items");
const checkedItemsData = new Map();

var current_category = "지역";

const toggleAllButton = document.getElementById("toggleAllButton");
// 전체선택/전체해제 버튼
toggleAllButton.addEventListener("click", toggleAllItems);

button1.addEventListener("click", () => {
  showChecklistItems([
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ]);
  is_all_checked();
  current_category = "지역";
});

button2.addEventListener("click", () => {
  if (current_type == "Care") {
    showChecklistItems(["공동육아방", "지역아동센터", "공동육아나눔터"]);
  } else if (current_type == "Play") {
    showChecklistItems(["체험 시설", "야외 시설", "도서 시설", "문화 행사"]);
  } else if (current_type == "Medical") {
    showChecklistItems([
      "약국",
      "치과",
      "한의원",
      "내과",
      "이비인후과",
      "소아과",
      "가정의학과",
      "안과",
      "피부과",
      "보건소",
      "기타",
    ]);
  }

  is_all_checked();
  current_category = "서비스";
});

button3.addEventListener("click", () => {
  showChecklistItems(["영유아", "유치원생", "초등학생"]);
  is_all_checked();
  current_category = "연령";
});

// Show the checklist items for Button 1 by default
function checkAllbox() {
  if (current_type == "Care") {
    showChecklistItems(["공동육아방", "지역아동센터", "공동육아나눔터"]);
  } else if (current_type == "Play") {
    showChecklistItems(["체험 시설", "야외 시설", "도서 시설", "문화 행사"]);
  } else if (current_type == "Medical") {
    showChecklistItems([
      "약국",
      "치과",
      "한의원",
      "내과",
      "이비인후과",
      "소아과",
      "가정의학과",
      "안과",
      "피부과",
      "보건소",
      "기타",
    ]);
  }
  checkAllItems();
  showChecklistItems(["영유아", "유치원생", "초등학생"]);
  checkAllItems();
  showChecklistItems([
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ]);
  checkAllItems();
}

function showChecklistItems(items) {
  // Clear existing items
  checklistItems.innerHTML = "";

  // Create new checklist items
  items.forEach((item) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const label = document.createElement("label");
    label.textContent = item;

    const listItem = document.createElement("div");
    listItem.appendChild(checkbox);
    listItem.appendChild(label);

    //아이템들 간의 세로 간격 조정
    listItem.style.marginBottom = "15px";

    // Set the checkbox state based on the stored data
    if (checkedItemsData.has(item)) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        addCheckedItem(item);
      } else {
        removeCheckedItem(item);
      }
    });

    checklistItems.appendChild(listItem);
  });

  // Show the checklist items
  checklistItems.classList.add("active");
  checklistItems.classList.add("scrollable");
}

function setCareMarkers(map, category, item) {
  for (var i = 0; i < CareMarkers.length; i++) {
    if (category == "지역") {
      if (Care_ATDRCs[i] == item) {
        if (map) {
          CareMarkersState[i][0] = 1;
          if (CareMarkersState[i][1] && CareMarkersState[i][2]) {
            CareMarkers[i].setMap(map);
          }
        } else {
          CareMarkersState[i][0] = 0;
          CareMarkers[i].setMap(map);
        }
      }
    } else if (category == "서비스") {
      if (Care_seviceCLs[i] == item) {
        if (map) {
          CareMarkersState[i][1] = 1;
          if (CareMarkersState[i][0] && CareMarkersState[i][2]) {
            CareMarkers[i].setMap(map);
          }
        } else {
          CareMarkersState[i][1] = 0;
          CareMarkers[i].setMap(map);
        }
      }
    } else if (category == "연령") {
      if (Care_AgeSEs[i] == item) {
        if (map) {
          CareMarkersState[i][2] = 1;
          if (CareMarkersState[i][0] && CareMarkersState[i][1]) {
            CareMarkers[i].setMap(map);
          }
        } else {
          CareMarkersState[i][2] = 0;
          CareMarkers[i].setMap(map);
        }
      }
    }
  }
}

function setPlayMarkers(map, category, item) {
  for (var i = 0; i < PlayMarkers.length; i++) {
    if (category == "지역") {
      if (Play_ATDRCs[i] == item) {
        if (map) {
          PlayMarkersState[i][0] = 1;
          if (PlayMarkersState[i][1] && PlayMarkersState[i][2]) {
            PlayMarkers[i].setMap(map);
          }
        } else {
          PlayMarkersState[i][0] = 0;
          PlayMarkers[i].setMap(map);
        }
      }
    } else if (category == "서비스") {
      if (Play_types[i] == item) {
        if (map) {
          PlayMarkersState[i][1] = 1;
          if (PlayMarkersState[i][0] && PlayMarkersState[i][2]) {
            PlayMarkers[i].setMap(map);
          }
        } else {
          PlayMarkersState[i][1] = 0;
          PlayMarkers[i].setMap(map);
        }
      }
    } else if (category == "연령") {
      if (Play_AgeSEs[i] == item) {
        if (map) {
          PlayMarkersState[i][2] = 1;
          if (PlayMarkersState[i][0] && PlayMarkersState[i][1]) {
            PlayMarkers[i].setMap(map);
          }
        } else {
          PlayMarkersState[i][2] = 0;
          PlayMarkers[i].setMap(map);
        }
      }
    }
  }
}

function setMedicalMarkers(map, category, item) {
  for (var i = 0; i < MedicalMarkers.length; i++) {
    if (category == "지역") {
      if (Medical_ATDRCs[i] == item) {
        if (map) {
          MedicalMarkersState[i][0] = 1;
          if (MedicalMarkersState[i][1] && MedicalMarkersState[i][2]) {
            MedicalMarkers[i].setMap(map);
          }
        } else {
          MedicalMarkersState[i][0] = 0;
          MedicalMarkers[i].setMap(map);
        }
      }
    } else if (category == "서비스") {
      if (Medical_TH[i] == item) {
        if (map) {
          MedicalMarkersState[i][1] = 1;
          if (MedicalMarkersState[i][0] && MedicalMarkersState[i][2]) {
            MedicalMarkers[i].setMap(map);
          }
        } else {
          MedicalMarkersState[i][1] = 0;
          MedicalMarkers[i].setMap(map);
        }
      }
    } else if (category == "연령") {
      if (Medical_TH[i] == item) {
        if (map) {
          MedicalMarkersState[i][2] = 1;
          if (MedicalMarkersState[i][0] && MedicalMarkersState[i][1]) {
            MedicalMarkers[i].setMap(map);
          }
        } else {
          MedicalMarkersState[i][2] = 0;
          MedicalMarkers[i].setMap(map);
        }
      }
    }
  }
}

function addCheckedItem(item) {
  checkedItemsData.set(item, true);
  is_all_checked();
  console.log(item + "check");
  if (current_type == "Care") {
    setCareMarkers(map, current_category, item);
  } else if (current_type == "Play") {
    setPlayMarkers(map, current_category, item);
  } else if (current_type == "Medical") {
    setMedicalMarkers(map, current_category, item);
  }

  // const checkedItem = document.createElement("div");
  // checkedItem.textContent = item;
  // checkedItems.appendChild(checkedItem);
  // 웹 밑에다가 글자 출력하는거
}

function removeCheckedItem(item) {
  checkedItemsData.delete(item);
  is_all_checked();
  console.log(item + "uncheck");
  if (current_type == "Care") {
    setCareMarkers(null, current_category, item);
  } else if (current_type == "Play") {
    setPlayMarkers(null, current_category, item);
  } else if (current_type == "Medical") {
    setMedicalMarkers(null, current_category, item);
  }

  // const checkedItem = Array.from(checkedItems.children).find(itemElement => itemElement.textContent === item);
  // if (checkedItem) {
  //   checkedItems.removeChild(checkedItem);
  // }
  // 웹 밑에다가 글자 삭제하는거
}

// Function to check all checklist items
function checkAllItems() {
  const checkboxes = checklistItems.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
    const item = checkbox.nextSibling.textContent;
    addCheckedItem(item);
  });
}

// 전체선택&전체해제 버튼

function toggleAllItems() {
  const checkboxes = checklistItems.querySelectorAll("input[type='checkbox']");
  const allChecked = Array.from(checkboxes).every(
    (checkbox) => checkbox.checked
  );

  checkboxes.forEach((checkbox) => {
    checkbox.checked = !allChecked;
    const item = checkbox.nextSibling.textContent;

    if (!allChecked) {
      addCheckedItem(item);
    } else {
      removeCheckedItem(item);
    }
  });

  toggleAllButton.textContent = allChecked ? "전체 선택" : "전체 해제";
}

function is_all_checked() {
  const checkboxes = checklistItems.querySelectorAll("input[type='checkbox']");
  const allChecked = Array.from(checkboxes).every(
    (checkbox) => checkbox.checked
  );

  toggleAllButton.textContent = allChecked ? "전체 해제" : "전체 선택";
}

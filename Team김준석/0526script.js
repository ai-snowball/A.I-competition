// Initialize and display the map
var container = document.getElementById('map');
var options = {
  center: new kakao.maps.LatLng(37.5665, 126.9780), // Set the center coordinates
  level: 5 // Set the initial zoom level (1-14)
};
var map = new kakao.maps.Map(container, options);

// 카테고리 클릭시 전환되는 함수
function toggleItems(categoryId) {
  var items = document.getElementsByClassName('item');
  for (var i = 0; i < items.length; i++) {
    items[i].style.display = 'none';
  }

  var category = document.getElementById(categoryId);
  var categoryItems = category.getElementsByClassName('item');
  for (var j = 0; j < categoryItems.length; j++) {
    categoryItems[j].style.display = 'block';
  }
}



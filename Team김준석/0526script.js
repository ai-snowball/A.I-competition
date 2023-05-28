// Initialize and display the map
var container = document.getElementById('map');
var options = {
  center: new kakao.maps.LatLng(37.5665, 126.9780), // Set the center coordinates
  level: 5 // Set the initial zoom level (1-14)
};
var map = new kakao.maps.Map(container, options);

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const checklistItems = document.getElementById("checklist-items");
const checkedItems = document.getElementById("checked-items");
const checkedItemsData = new Map();

const toggleAllButton = document.getElementById("toggleAllButton");
// 전체선택/전체해제 버튼
toggleAllButton.addEventListener("click", toggleAllItems);

button1.addEventListener("click", () => {
  showChecklistItems(["아이템 1", "아이템 2", "아이템 3"]);
  is_all_checked();
});

button2.addEventListener("click", () => {
  showChecklistItems(["아이템 A", "아이템 B", "아이템 C"]);
  is_all_checked();
});

button3.addEventListener("click", () => {
  showChecklistItems(["테스크 1", "테스크 2", "테스크 3"]);
  is_all_checked();
});

// Show the checklist items for Button 1 by default

showChecklistItems(["아이템 A", "아이템 B", "아이템 C"]);
checkAllItems();
showChecklistItems(["테스크 1", "테스크 2", "테스크 3"]);
checkAllItems();
showChecklistItems(["아이템 1", "아이템 2", "아이템 3"]);
checkAllItems();

function showChecklistItems(items) {
  // Clear existing items
  checklistItems.innerHTML = "";

  // Create new checklist items
  items.forEach(item => {
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
}

function addCheckedItem(item) {
  checkedItemsData.set(item, true);
  is_all_checked();

  // const checkedItem = document.createElement("div");
  // checkedItem.textContent = item;
  // checkedItems.appendChild(checkedItem);
  // 웹 밑에다가 글자 출력하는거
}

function removeCheckedItem(item) {
  checkedItemsData.delete(item);
  is_all_checked();
  // const checkedItem = Array.from(checkedItems.children).find(itemElement => itemElement.textContent === item);
  // if (checkedItem) {
  //   checkedItems.removeChild(checkedItem);
  // }
  // 웹 밑에다가 글자 삭제하는거
}

// Function to check all checklist items
function checkAllItems() {
  const checkboxes = checklistItems.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach(checkbox => {
    checkbox.checked = true;
    const item = checkbox.nextSibling.textContent;
    addCheckedItem(item);
  });
}

// 전체선택&전체해제 버튼

function toggleAllItems() {
  const checkboxes = checklistItems.querySelectorAll("input[type='checkbox']");
  const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

  checkboxes.forEach(checkbox => {
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
  const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

  toggleAllButton.textContent = allChecked ? "전체 해제" : "전체 선택";
}

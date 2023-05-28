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

button1.addEventListener("click", () => {
  showChecklistItems(["Item 1", "Item 2", "Item 3"], ["image1.png", "image2.png", "image3.png"]);
});

button2.addEventListener("click", () => {
  showChecklistItems(["Item A", "Item B", "Item C"], ["imageA.png", "imageB.png", "imageC.png"]);
});

button3.addEventListener("click", () => {
  showChecklistItems(["Task 1", "Task 2", "Task 3"], ["imageTask1.png", "imageTask2.png", "imageTask3.png"]);
});

// Show the checklist items for Button 1 by default
showChecklistItems(["Item A", "Item B", "Item C"], ["imageA.png", "imageB.png", "imageC.png"]);
checkAllItems();
showChecklistItems(["Task 1", "Task 2", "Task 3"], ["imageTask1.png", "imageTask2.png", "imageTask3.png"]);
checkAllItems();
showChecklistItems(["Item 1", "Item 2", "Item 3"], ["image1.png", "image2.png", "image3.png"]);
checkAllItems();

function showChecklistItems(items, images) {
  // Clear existing items
  checklistItems.innerHTML = "";

  // Create new checklist items
  items.forEach((item, index) => {
    const image = document.createElement("img");
    image.src = images[index];
    image.alt = item;

    const listItem = document.createElement("div");
    listItem.appendChild(image);

    // Set the checkbox state based on the stored data
    if (checkedItemsData.has(item)) {
      listItem.classList.add("checked");
    }

    listItem.addEventListener("click", () => {
      toggleCheckedItem(item, listItem);
    });

    checklistItems.appendChild(listItem);
  });

  // Show the checklist items
  checklistItems.classList.add("active");
}

function toggleCheckedItem(item, listItem) {
  if (checkedItemsData.has(item)) {
    removeCheckedItem(item);
    listItem.classList.remove("checked");
  } else {
    addCheckedItem(item);
    listItem.classList.add("checked");
  }
}

function addCheckedItem(item) {
  checkedItemsData.set(item, true);

  const checkedItem = document.createElement("div");
  checkedItem.textContent = item;
  checkedItems.appendChild(checkedItem);
}

function removeCheckedItem(item) {
  checkedItemsData.delete(item);

  const checkedItem = Array.from(checkedItems.children).find(itemElement => itemElement.textContent === item);
  if (checkedItem) {
    checkedItems.removeChild(checkedItem);
  }
}

// Function to check all checklist items
function checkAllItems() {
  const listItems = checklistItems.querySelectorAll("div");
  listItems.forEach(listItem => {
    const item = listItem.firstChild.alt;
    listItem.classList.add("checked");
    addCheckedItem(item);
  });
}

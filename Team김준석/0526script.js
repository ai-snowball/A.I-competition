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
  showChecklistItems(["Item 1", "Item 2", "Item 3"]);
});

button2.addEventListener("click", () => {
  showChecklistItems(["Item A", "Item B", "Item C"]);
});

button3.addEventListener("click", () => {
  showChecklistItems(["Task 1", "Task 2", "Task 3"]);
});

// Show the checklist items for Button 1 by default

showChecklistItems(["Item A", "Item B", "Item C"]);
checkAllItems();
showChecklistItems(["Task 1", "Task 2", "Task 3"]);
checkAllItems();
showChecklistItems(["Item 1", "Item 2", "Item 3"]);
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
  const checkboxes = checklistItems.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach(checkbox => {
    checkbox.checked = true;
    const item = checkbox.nextSibling.textContent;
    addCheckedItem(item);
  });
}

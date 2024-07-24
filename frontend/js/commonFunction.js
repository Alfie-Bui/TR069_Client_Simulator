/**
 * @TODO includes of common function that can use in page and controller, such as
 * + check Error
 * + interact with element
 * + dialog handle
 */

/**
 *
 * @brief: These function to interact with main-menu
 *
 */
function toggleOpenClass(element) {
  // Toggle the "open" class on the clicked <li> element
  element.classList.toggle("open");
}

function home() {
  window.location.href = "main.html";
}

function main_menu_toggle() {
  document.body.classList.toggle("mmc");
  document.body.classList.toggle("mme");
  const collapse = document.getElementById("main-navbar-collapse");
  collapse.classList.toggle("in");
}

/** Alert dialog near footer or HTML file, not at template */
function show_alert_dialog(content) {
  const alert_dialog = document.getElementById("alertDialog");
  document.getElementById("alertDialog_msg").textContent = content;
  alert_dialog.classList.remove("hide");
}

function hide_alert_dialog() {
  const alert_dialog = document.getElementById("alertDialog");
  alert_dialog.classList.add("hide");
}

/**
 *
 * @param {*} pwEye: password eye entity
 * @param {*} inputField: which input field to show or hide when click
 *
 * @brief: to show or hide your password field
 */
function hide_show_pw(pwEye, inputField) {
  if (pwEye.classList.contains("hidepw")) {
    // gonna hide
    inputField.type = "text";

    pwEye.classList.add("showpw");
    pwEye.classList.remove("hidepw");
  } else {
    // gonna show
    inputField.type = "password";

    pwEye.classList.add("hidepw");
    pwEye.classList.remove("showpw");
  }
}

/**
 * @brief: handle delete dialog interact, delete dialog in "deleteDialogTemplate" ./template.js
 *
 * @param {*} remove_element: the entiry want to remove
 * @param {*} h3_content: h3 tag content
 * @param {*} p_content: p tag content
 *
 * @returns: return a promise so you can .then and .catch to decide your next move
 */
function deleteDialogHandle(remove_element, h3_content, p_content) {
  return new Promise((resolve, reject) => {
    const deleteDialog = document.createElement("div");
    deleteDialog.innerHTML = deleteDialogTemplate;

    const cancelBtn = deleteDialog.querySelector("#Cancel");
    const okBtn = deleteDialog.querySelector("#OK");
    deleteDialog.querySelector(
      "#deletedialog .ngdialog-message h3"
    ).textContent = h3_content;
    deleteDialog.querySelector(
      "#deletedialog .ngdialog-message p"
    ).textContent = p_content;

    const deleteElem = deleteDialog.querySelector("#deletedialog");
    deleteElem.classList.remove("hide");

    okBtn.addEventListener("click", () => {
      remove_element.remove(); // remove just on FE
      deleteElem.classList.add("hide");
      resolve();
    });

    cancelBtn.addEventListener("click", () => {
      deleteElem.classList.add("hide");
      reject();
    });

    document.body.appendChild(deleteDialog.firstChild);
  });
}

/**
 * @brief: handle alert dialog interact, alert dialog in "alertDialogTemplate" ./template.js
 *
 * @param {*} p_content: p tag content
 *
 * @returns: return a promise so you can .then and .catch to decide your next move
 *
 */
function alertDialogHandle(p_content) {
  const alertDialog = document.createElement("div");
  alertDialog.innerHTML = alertDialogTemplate;

  const closeBtn = alertDialog.querySelector("#Close");

  alertDialog.querySelector("#alertDialog_msg").textContent = p_content;

  const alertElem = alertDialog.querySelector("#alertDialog");
  alertElem.classList.remove("hide");

  closeBtn.addEventListener("click", () => {
    alertElem.classList.add("hide");
  });

  document.getElementById("alertDialogMark").appendChild(alertDialog);
}

/**
 *
 * @param {*} input: input field entity
 * @param {*} empty_error: empty error message entity
 * @param {*} exceed_error: exceed character message entity
 * @mechanism: to check if error remain, the function (and all checkError function) check if error tag's class list contain "ng-hide"
 *
 * @return true: if no error found
 *         false: if error be trapped
 */
function checkError_inputField(input, empty_error, exceed_error) {
  if (input.value.length === 0) {
    empty_error.classList.remove("ng-hide");
    exceed_error.classList.add("ng-hide");
    return false;
  } else if (input.value.length > parseInt(input.getAttribute("maxlength"))) {
    exceed_error.classList.remove("ng-hide");
    empty_error.classList.add("ng-hide");
    return false;
  } else {
    exceed_error.classList.add("ng-hide");
    empty_error.classList.add("ng-hide");
    return true;
  }
}

/**
 *
 * @brief: Just like check error input field but just for empty
 * @param {*} input
 * @param {*} empty_error
 * @mechanism: to check if error remain, the function (and all checkError function) check if error tag's class list contain "ng-hide"
 *
 * @return true: if no error found
 *         false: if error be trapped
 */
function checkEmpty_inputField(input, empty_error) {
  if (input.value.length === 0) {
    empty_error.classList.remove("ng-hide");
    return false;
  } else {
    empty_error.classList.add("ng-hide");
    return true;
  }
}

/**
 *
 * @param {*} input
 * @param {*} range_error
 * @param {*} empty_error
 *
 * @mechanism: to check if error remain, the function (and all checkError function) check if error tag's class list contain "ng-hide"
 *
 * @return true: if no error found
 *         false: if error be trapped
 */
function checkRange_inputField(input, range_error, empty_error) {
  if (input.value.length === 0) {
    // empty
    empty_error.classList.remove("ng-hide");
    range_error.classList.add("ng-hide");
    return false;
  } else if (
    // value --> check number range
    parseInt(input.value) > parseInt(input.getAttribute("max")) ||
    parseInt(input.value) < parseInt(input.getAttribute("min"))
  ) {
    range_error.classList.remove("ng-hide");
    empty_error.classList.add("ng-hide");
    return false;
  } else {
    range_error.classList.add("ng-hide");
    empty_error.classList.add("ng-hide");
    return true;
  }
}

/**
 * @brief: show error when select field.value got unexspected value
 * @param {*} select: select field entity
 * @param {*} error: error message show
 * @mechanism: to check if error remain, the function (and all checkError function) check if error tag's class list contain "ng-hide"
 *
 * @return true: if no error found
 *         false: if error be trapped
 */
function checkError_selectField(select, error) {
  if (select.value === "?" || select.value === "") {
    error.classList.remove("ng-hide");
    return false;
  } else {
    error.classList.add("ng-hide");
    return true;
  }
}

/**
 *
 * @param {*} value
 * @param {*} pattern
 * @param {*} pattern_error
 * @param {*} empty_error
 *
 * @mechanism: to check if error remain, the function (and all checkError function) check if error tag's class list contain "ng-hide"
 *
 * @return true: if no error found
 *         false: if error be trapped
 */
function checkPattern_inputField(input, pattern, pattern_error, empty_error) {
  if (input.value.length === 0) {
    empty_error.classList.remove("ng-hide");
    pattern_error.classList.add("ng-hide");
    return false;
  }
  if (!pattern.test(input.value)) {
    pattern_error.classList.remove("ng-hide");
    empty_error.classList.add("ng-hide");
    return false;
  } else {
    pattern_error.classList.add("ng-hide");
    empty_error.classList.add("ng-hide");
    return true;
  }
}

/**
 *
 * @param {*} input: input is pasword field
 * @param {*} pattern: new RegExp function (you can convert string pattern to pattern entity by using new RegExp function)
 * @param {*} pattern_error
 * @param {*} empty_error
 * @param {*} lowLimit_error
 * @param {*} upLimit_error
 *
 * @mechanism: to check if error remain, the function (and all checkError function) check if error tag's class list contain "ng-hide"
 *
 * @return true: if no error found
 *         false: if error be trapped
 */
function checkPasswordError_inputField(
  input,
  pattern,
  pattern_error,
  empty_error,
  lowLimit_error,
  upLimit_error
) {
  if (input.value.length === 0) {
    empty_error.classList.remove("ng-hide");
    pattern_error.classList.add("ng-hide");
    lowLimit_error.classList.add("ng-hide");
    upLimit_error.classList.add("ng-hide");
  } else {
    empty_error.classList.add("ng-hide");
    if (!pattern.test(input.value)) {
      pattern_error.classList.remove("ng-hide");
    } else {
      pattern_error.classList.add("ng-hide");
    }
    if (input.value.length < input.getAttribute("min")) {
      lowLimit_error.classList.remove("ng-hide");
    } else {
      lowLimit_error.classList.add("ng-hide");
    }
    if (input.value.length > input.getAttribute("max")) {
      upLimit_error.classList.remove("ng-hide");
    } else {
      upLimit_error.classList.add("ng-hide");
    }
  }
}

/**
 *
 * @param {*} input: @NOTE: input field must has min and max attribute
 * @param {*} min_error
 * @param {*} max_error
 * @param {*} empty_error
 */
function checkMinMaxError_inputField(input, min_error, max_error, empty_error) {
  if (input.value === "") {
    empty_error.classList.remove("ng-hide");
    min_error.classList.add("ng-hide");
    max_error.classList.add("ng-hide");
  } else {
    empty_error.classList.add("ng-hide");
    if (parseInt(input.value) < parseInt(input.getAttribute("min"))) {
      min_error.classList.remove("ng-hide");
    } else {
      min_error.classList.add("ng-hide");
    }
    if (parseInt(input.value) > parseInt(input.getAttribute("max"))) {
      max_error.classList.remove("ng-hide");
    } else {
      max_error.classList.add("ng-hide");
    }
  }
}

/**
 * Check local Storage function & print the capacity of it
 * */
var localStorageSpace = function () {
  var data = "";
  var log;
  console.log("\n");

  log = "Current local storage:\n";

  for (var key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      data += window.localStorage[key];
      log += `\n\t${key} = ${(
        (window.localStorage[key].length * 16) /
        (8 * 1024)
      ).toFixed(2)} KB`;
    }
  }

  log += `${
    data
      ? "\n==> Total space used: " +
        ((data.length * 16) / (8 * 1024)).toFixed(2) +
        " KB"
      : "Empty (0 KB)"
  }`;

  log += `${
    data
      ? "\n==> Approx. space remaining: " +
        (5120 - ((data.length * 16) / (8 * 1024)).toFixed(2)) +
        " KB"
      : "5 MB"
  }`;
  console.log(log);
};

/**
 * Accept Array or multiple input error object
 * @brief: hide all Error (can using querySelectorAll as argument)
 */
function hideError() {
  for (const elem of arguments) {
    if (elem instanceof Array) {
      for (const e of elem) {
        e.classList.add("ng-hide");
      }
    } else {
      elem.classList.add("ng-hide");
    }
  }
}

/**
 *
 * @brief: using it to check error before apply and load data into database
 *
 * @return true: if no error found
 *         false: if error be trapped
 */
function checkError_show() {
  console.log("Check error tag:");
  for (const elem of arguments) {
    console.log(elem);
    if (elem instanceof NodeList) {
      for (const e of elem) {
        if (!e.classList.contains("ng-hide")) {
          console.log(`Error make fail Apply: ${e.outerHTML}`);
          return false;
        }
      }
    } else {
      if (!elem.classList.contains("ng-hide")) {
        console.log(`Error make fail Apply: ${elem.outerHTML}`);
        return false;
      }
    }
  }
  return true;
}

/**
 * Generate a random float
 */
function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

function notifyErrorForSelectElement(selectElement) {
  let notifySuffix = "_notify";
  let errorSpan = document.getElementById(selectElement.id + notifySuffix);
  if (!errorSpan) {
    console.log(selectElement.id + notifySuffix);
    errorSpan = document.createElement("span");
    errorSpan.id = selectElement.id + "_notify";
    errorSpan.style.color = "#ff8b7c";
    // Create span element below select element
    selectElement.parentNode.insertBefore(errorSpan, selectElement.nextSibling);
  }
  errorSpan.innerHTML =
    selectElement.value === "?" ? "* This field is required!" : "";
}

function loadWanInterfaceToSelect(selectElement) {
  // Get WAN interfaces from Local Storage
  const localStorageData = localStorage.getItem("Basic");
  if (!localStorageData) {
    console.error("No WAN interfaces found in Local Storage");
    return;
  }

  try {
    const jsonData = JSON.parse(localStorageData);
    const wanInterfaces = jsonData.WAN.Interfaces;

    // Clear select element before populating with options
    selectElement.innerHTML = "";

    // Create default option
    let defaultOption = document.createElement("option");
    defaultOption.value = "?";
    defaultOption.selected = true;
    defaultOption.label = "Select";
    defaultOption.textContent = "Select";
    selectElement.appendChild(defaultOption);

    if (selectElement.id === "Interface") {
      defaultOption = document.createElement("option");
      defaultOption.value = "br-lan";
      defaultOption.selected = false;
      defaultOption.label = "br-lan";
      defaultOption.textContent = "br-lan";
      selectElement.appendChild(defaultOption);
    }
    // Create and append options for each WAN interface
    wanInterfaces.forEach((interface) => {
      const option = document.createElement("option");
      option.value = interface.Name;
      option.label = interface.Name;
      option.textContent = interface.Name;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(
      "Error parsing WAN interface data from Local Storage:",
      error
    );
  }
}

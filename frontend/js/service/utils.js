const PORT = 8888;
const HOST = "localhost";
const URL_ = `http://localhost:${PORT}`;
const SET_URL = `${URL_}/be_set`;
const GET_URL = `${URL_}/be_get`;

/**
 * Error defination
 */
const NON_OBJ_ERROR = "Fail at creating Request. Payload is not a object";

/**
 * @TODO
 */
function createGETRequest(command, payload, subOption) {
  return new Promise((resolve, reject) => {
    if (typeof payload !== "object") {
      reject(NON_OBJ_ERROR);
    }
    // transfer payload to GET query
    payload.command = command;
    const queryParams = URLSearchParams(payload);
    const url = `${SET_URL}?${queryParams.toString()}`;
    console.log("Send GET request ", url);
    // send request
    fetch(url).then((response) => {
      console.log("Response from Backend ", response);
      resolve(response.json());
    });
  });
}

/**
 * Create GET request to server with payload is the data at body of request
 * @param {*} page    : current page where send request
 * @param {*} command : is COMMAND.<>
 * @param {*} payload : strcuture of payload is
 * {
 *  command:
 *  page:
 *  data: {
 *    <localStorage Data>
 *  }
 * }
 * @returns
 */
function createPOSTRequest(page, command, payload, subOption) {
  return new Promise(async (resolve, reject) => {
    // check if payload at object type
    if (typeof payload !== "object") {
      reject(NON_OBJ_ERROR);
    }

    // pacet the request body
    var data = {};
    data.subOption = subOption;
    data.command = command;
    data.page = page;
    data.data = payload;

    console.log("Send POST request to", SET_URL);
    console.log("Payload POST req", data);

    const option = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    };

    // send request
    const response = await fetch(SET_URL, option);
    const response_data = await response.json();
    console.log(response_data.content);
    response.content = response_data.content;
    resolve(response);
  });
}

/**
 * 
 * @param {*} obj 
 * @returns Object, that independent with original object change
 */
function deepCopyObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function textContentConverting(selectElements, selectedIndex) {
  return selectElements.options[selectedIndex].textContent.trim();
}

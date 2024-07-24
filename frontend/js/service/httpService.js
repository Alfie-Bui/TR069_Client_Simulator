/**
 * HTTP Code
 * @link: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses
 */
const HTTP_OK = 200;
const HTTP_INTERNAL_SERVER_ERROR = 500;

const COMMAND = {
  CONNECT_ACS: "CONNECT_ACS", // send data at Apply action    (FE -> BE & response back)
  SEND_INFORM: "SEND_INFORM", // send inform actively         (FE -> BE, POST)
  USER_CONFIG_DATA: {
    ADD: "USER_CONFIG_DATA_ADD",
    MODIFY: "USER_CONFIG_DATA_MODIFY",
    DELETE: "USER_CONFIG_DATA_DELETE",
    COMPLEX: "USER_CONFIG_DATA_COMPLEX",
  }, // get data  from               (FE -> BE & response back)
};

const httpService = {
  send_GET_Request: function (command, payload) {
    console.log("GET request: command, payload", command, payload);
    try {
      createGETRequest(command, payload).then((response) => {
        console.log(">> ===== Server service done !!!\n");
      });
    } catch (err) {
      console.error(err);
    } finally {
      return;
    }
  },
  send_POST_Request: function (page, command, payload, lsDB_data, subOption, redirect) {
    // block screen by "Please wait"
    const ajaxLoaderSection = document.getElementById("ajaxLoaderSection");
    ajaxLoaderSection.style.display = "block";
    console.log("subOption: ", subOption);

    try {
      createPOSTRequest(page, command, payload, subOption).then((response) => {
        console.log(">> Response from server ", response);

        // Status 200
        if (response.ok) {
          // load data to Local Storage if no error
          if (redirect)
            applyThenStoreToLS(redirect, "Apply", lsDB_data, response.content);
          else
            applyThenStoreToLS(page, "Apply", lsDB_data, response.content);
          ajaxLoaderSection.style.display = "none";
        } else {
          console.error("[ERROR] ", response.statusText);
          ajaxLoaderSection.style.display = "none";
          alert(`Server response: ${response.status} - ${response.statusText}`);
          applyThenStoreToLS(page, "Cancel");
        }
      });
    } catch (err) {
      ajaxLoaderSection.style.display = "none";
      alert("[Error]");
      console.error("[ERROR] ", err);
    } finally {
      return;
    }
  },
};

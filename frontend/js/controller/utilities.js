function loadPage(page, options) {
  let Status = JSON.parse(localStorage.getItem("Status"));
  let Basic = JSON.parse(localStorage.getItem("Basic"));
  let Wifi = JSON.parse(localStorage.getItem("Wifi"));
  let Advanced = JSON.parse(localStorage.getItem("Advanced"));
  let Security = JSON.parse(localStorage.getItem("Security"));
  let Utilities = JSON.parse(localStorage.getItem("Utilities"));
  let VoIP = JSON.parse(localStorage.getItem("VoIP"));
  let Account = JSON.parse(localStorage.getItem("Account"));
  switch (page) {
    case "utilities-diagnostics.html":
      break;
    case "utilities-speed_test.html":
      break;
    case "utilities-system-backup.html":
      break;
    case "utilities-system-log_rule-edit.html":
      console.log(`Load ${page}`, Utilities.System);
      let is_Name_valid = true;
      let is_MaximumSize_valid = true;
      let is_RemoteServer_enabled = true;
      let is_RemoteIP_valid = true;
      let is_PortNo_valid = true;
      let applyBtnOn = false;
      let message = null;

      const ipv4Check =
        /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}$/;

      function applyBtnCheck() {
        if (is_RemoteServer_enabled) {
          applyBtnOn =
            is_Name_valid &&
            is_MaximumSize_valid &&
            is_RemoteIP_valid &&
            is_PortNo_valid
              ? true
              : false;
        } else {
          applyBtnOn = is_Name_valid && is_MaximumSize_valid ? true : false;
        }
        document.querySelector("#Modify").disabled = applyBtnOn ? false : true;
      }

      document.querySelector("#Modify").disabled = !applyBtnOn;

      document.querySelector(
        "#DeviceDeviceInfoVendorLogFile1_X_GTK_Remote"
      ).onchange = () => {
        is_RemoteServer_enabled = document.querySelector(
          "#DeviceDeviceInfoVendorLogFile1_X_GTK_Remote"
        ).checked
          ? true
          : false;
        if (is_RemoteServer_enabled) {
          is_RemoteIP_valid = false;
          is_PortNo_valid = false;
          document.getElementById("RemoteIPPanel").classList.remove("ng-hide");
          document.getElementById("PortNoPanel").classList.remove("ng-hide");
        } else {
          document.getElementById("RemoteIPPanel").classList.add("ng-hide");
          document.getElementById("PortNoPanel").classList.add("ng-hide");
        }
        applyBtnCheck();
        document.querySelector("#Modify").disabled = !applyBtnOn;
      };

      document.querySelector("#Name").value =
        Utilities.System.SystemLogRule.Name;
      document.querySelector("#MaximumSize").value =
        Utilities.System.SystemLogRule.MaximumSize;
      if (
        Utilities.System.SystemLogRule
          .DeviceDeviceInfoVendorLogFile1_X_GTK_Remote
      ) {
        document.querySelector(
          "#DeviceDeviceInfoVendorLogFile1_X_GTK_Remote"
        ).checked = true;
        document.getElementById("RemoteIPPanel").classList.remove("ng-hide");
        document.getElementById("PortNoPanel").classList.remove("ng-hide");
        document.querySelector("#RemoteIP").value = Utilities.System
          .SystemLogRule.DeviceDeviceInfoVendorLogFile1_X_GTK_Remote
          ? Utilities.System.SystemLogRule.RemoteIP
          : "";
        document.querySelector("#PortNo").value = Utilities.System.SystemLogRule
          .DeviceDeviceInfoVendorLogFile1_X_GTK_Remote
          ? Utilities.System.SystemLogRule.PortNo
          : "";
      } else {
        document.querySelector(
          "#DeviceDeviceInfoVendorLogFile1_X_GTK_Remote"
        ).checked = false;
      }

      document.querySelectorAll("input").forEach(function (input) {
        input.onkeyup = function () {
          if (input.value.length > 0) {
            switch (input.id) {
              case "Name":
                is_Name_valid = input.value.length <= 64 ? true : false;
                document.querySelector("#FileNameNotify").innerHTML =
                  is_Name_valid ? "" : "* String length Exceeded the limit: 64";
                break;
              case "MaximumSize":
                if (Number(input.value) < 1) {
                  is_MaximumSize_valid = false;
                  message = "Value must be greater than 1!";
                } else {
                  is_MaximumSize_valid = true;
                  message = "";
                }
                document.querySelector("#FileSizeNotify").innerHTML = message;
                break;
              default:
                if (is_RemoteServer_enabled) {
                  if (input.id === "RemoteIP") {
                    is_RemoteIP_valid = ipv4Check.test(input.value);
                    document.querySelector("#RemoteIPNotify").innerHTML =
                      is_RemoteIP_valid
                        ? ""
                        : "* Invalid pattern , Example IPv4 address :192.168.1.232";
                  } else if (input.id === "PortNo") {
                    if (
                      Number(input.value) < 1024 ||
                      Number(input.value) > 65565
                    ) {
                      is_PortNo_valid = false;
                      message = "* Port value must be in range 1024 - 65565!";
                    } else {
                      is_PortNo_valid = true;
                      message = "";
                    }
                    document.querySelector("#PortNoNotify").innerHTML = message;
                  }
                }
                break;
            }
          } else {
            switch (input.id) {
              case "Name":
                document.querySelector("#FileNameNotify").innerHTML =
                  "* This Field is Required";
                is_Name_valid = false;
                break;
              case "MaximumSize":
                document.querySelector("#FileSizeNotify").innerHTML =
                  "* This Field is Required";
                is_MaximumSize_valid = false;
                break;
              default:
                if (is_RemoteServer_enabled) {
                  if (input.id === "RemoteIP") {
                    document.querySelector("#RemoteIPNotify").innerHTML =
                      "* This Field is Required";
                    is_RemoteIP_valid = false;
                  } else if (input.id === "PortNo") {
                    document.querySelector("#PortNoNotify").innerHTML =
                      "* This Field is Required";
                    is_PortNo_valid = false;
                  }
                }
                break;
            }
          }
          applyBtnCheck();
        };
      });

      document.querySelector("#Modify").addEventListener("click", function () {
        document.querySelectorAll("input").forEach(function (input) {
          if (
            input.id === "Name" ||
            input.id === "MaximumSize" ||
            input.id === "RemoteIP" ||
            input.id === "PortNo"
          ) {
            manageJSONData(
              Utilities,
              `System.SystemLogRule.${input.id}`,
              input.value,
              "add"
            );
          }

          if (input.id === "DeviceDeviceInfoVendorLogFile1_X_GTK_Remote") {
            manageJSONData(
              Utilities,
              `System.SystemLogRule.${input.id}`,
              input.checked,
              "add"
            );
          }
        });
        var cloneData = deepCopyObject(Utilities.System.SystemLogRule);
        console.log(cloneData);
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.MODIFY,
          cloneData,
          Utilities,
          "",
          "utilities-system-log_rule.html"
        );
      });

      break;
    case "utilities-system-log_rule.html":
      console.log(`Load ${page}`, Utilities.System);

      document.querySelector("#FileName").innerHTML =
        Utilities.System.SystemLogRule.Name;
      document.querySelector("#FileSize").innerHTML =
        Utilities.System.SystemLogRule.MaximumSize;
      document.querySelector("#RemoteIP").innerHTML = Utilities.System
        .SystemLogRule.DeviceDeviceInfoVendorLogFile1_X_GTK_Remote
        ? Utilities.System.SystemLogRule.RemoteIP
        : "";
      document.querySelector("#PortNo").innerHTML = Utilities.System
        .SystemLogRule.DeviceDeviceInfoVendorLogFile1_X_GTK_Remote
        ? Utilities.System.SystemLogRule.PortNo
        : "";
      break;
    case "utilities-system-time.html":
      console.log(`Load ${page}`, Utilities.SystemTime);

      var timeZoneLocation = document.getElementById("X_GTK_TimeZoneLocation");
      var formattedTime;
      document.querySelector("#NTPServer1").value =
        Utilities.SystemTime.NTPServer1;
      document.querySelector("#NTPServer2").value =
        Utilities.SystemTime.NTPServer2;
      document.querySelector("#NTPServer3").value =
        Utilities.SystemTime.NTPServer3;
      document.querySelector("#NTPServer4").value =
        Utilities.SystemTime.NTPServer4;
      document.querySelector("#NTPServer5").value =
        Utilities.SystemTime.NTPServer5;
      document.querySelector("#X_GTK_TimeZoneLocation").value =
        Utilities.SystemTime.X_GTK_TimeZoneLocation;
      document.querySelector("#DeviceTime_Enable").checked =
        Utilities.SystemTime.DeviceTime_Enable;
      document.querySelector("#Modify").onclick = function () {
        Utilities.SystemTime.NTPServer1 =
          document.querySelector("#NTPServer1").value;
        Utilities.SystemTime.NTPServer2 =
          document.querySelector("#NTPServer2").value;
        Utilities.SystemTime.NTPServer3 =
          document.querySelector("#NTPServer3").value;
        Utilities.SystemTime.NTPServer4 =
          document.querySelector("#NTPServer4").value;
        Utilities.SystemTime.NTPServer5 =
          document.querySelector("#NTPServer5").value;
        Utilities.SystemTime.X_GTK_TimeZoneLocation = document.querySelector(
          "#X_GTK_TimeZoneLocation"
        ).value;
        Utilities.SystemTime.DeviceTime_Enable =
          document.querySelector("#DeviceTime_Enable").checked;

        var cloneData = deepCopyObject(Utilities.SystemTime);
        cloneData.X_GTK_TimeZoneLocation = textContentConverting(timeZoneLocation, Utilities.SystemTime.X_GTK_TimeZoneLocation);
        cloneData.formattedTime = formattedTime;
        console.log(cloneData);
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.MODIFY,
          cloneData,
          Utilities,
          "",
        );
      };
      document.querySelector("#Cancel").onclick = function () {
        window.location.href = "utilities-system-time.html";
      };
      function updateClock() {
        // Get the current time
        var currentTime = new Date();
        var year = currentTime.getFullYear();
        var month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
        var day = ("0" + currentTime.getDate()).slice(-2);
        var hours = ("0" + currentTime.getHours()).slice(-2);
        var minutes = ("0" + currentTime.getMinutes()).slice(-2);
        var seconds = ("0" + currentTime.getSeconds()).slice(-2);
        formattedTime =
          year +
          "-" +
          month +
          "-" +
          day +
          "T" +
          hours +
          ":" +
          minutes +
          ":" +
          seconds +
          "Z";
        document.getElementById("CurrentLocalTime").innerHTML = formattedTime;
      }

      // Update the clock every second
      setInterval(updateClock, 1000);
      updateClock();
      break;
    case "utilities-system-user_mgnt-edit.html":
      let is_DeviceUsersUser2OldPassword_valid = false;
      let is_DeviceUsersUser2Password_valid = false;
      let changePWDBtnOn = false;

      function set_changePWDBtnOn() {
        changePWDBtnOn =
          is_DeviceUsersUser2OldPassword_valid &&
          is_DeviceUsersUser2Password_valid
            ? true
            : false;
        document.querySelector("#Modify").disabled = changePWDBtnOn
          ? false
          : true;
      }

      document.querySelector("#Modify").disabled = !changePWDBtnOn;

      document.querySelectorAll("input").forEach(function (input) {
        input.onkeyup = function () {
          if (input.value.length > 0) {
            switch (input.id) {
              case "DeviceUsersUser2OldPassword":
                if (input.value !== Account.Password) {
                  document.querySelector(
                    "#DeviceUsersUser2OldPasswordNotify"
                  ).innerHTML = "* Wrong old password";
                  is_DeviceUsersUser2OldPassword_valid = false;
                } else {
                  document.querySelector(
                    "#DeviceUsersUser2OldPasswordNotify"
                  ).innerHTML = "";
                  is_DeviceUsersUser2OldPassword_valid = true;
                }
                break;
              case "DeviceUsersUser2Password":
                if (input.value === Account.Password) {
                  document.querySelector(
                    "#DeviceUsersUser2PasswordNotify"
                  ).innerHTML =
                    "* New password must be different from old password";
                  is_DeviceUsersUser2Password_valid = false;
                } else {
                  document.querySelector(
                    "#DeviceUsersUser2PasswordNotify"
                  ).innerHTML = "";
                  is_DeviceUsersUser2Password_valid = true;
                }
                break;
              default:
                break;
            }
          } else {
            switch (input.id) {
              case "DeviceUsersUser2OldPassword":
                document.querySelector(
                  "#DeviceUsersUser2OldPasswordNotify"
                ).innerHTML = "* This Field is Required";
                is_DeviceUsersUser2OldPassword_valid = false;
                break;
              case "DeviceUsersUser2Password":
                document.querySelector(
                  "#DeviceUsersUser2PasswordNotify"
                ).innerHTML = "* This Field is Required";
                is_DeviceUsersUser2Password_valid = false;
                break;
              default:
                break;
            }
          }
          set_changePWDBtnOn();
        };
      });

      document.querySelector("#Modify").onclick = () => {
        Account.Password = document.querySelector(
          "#DeviceUsersUser2Password"
        ).value;
        var cloneData = deepCopyObject(Account);
        console.log(cloneData);
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.MODIFY,
          cloneData,
          Account,
          "",
          "utilities-system-user_mgnt.html"
        );
        }
      break;
    case "utilities-system-user_mgnt.html":
      break;
    case "utilities-update_fw.html":
      document.getElementById("FirmwareName").textContent = SIMULATOR_VERSION;
      break;
    default:
      console.log(`Load ${page} fail --- no available page`);
      return;
  }
}

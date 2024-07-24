function loadPage(page, options) {
  let Status = JSON.parse(localStorage.getItem("Status"));
  let Basic = JSON.parse(localStorage.getItem("Basic"));
  let Wifi = JSON.parse(localStorage.getItem("Wifi"));
  let Advanced = JSON.parse(localStorage.getItem("Advanced"));
  let Security = JSON.parse(localStorage.getItem("Security"));
  let Utilities = JSON.parse(localStorage.getItem("Utilities"));
  let VoIP = JSON.parse(localStorage.getItem("VoIP"));
  var curTimeTarget = "";
  var daysOfTheWeekChanged = false;

  switch (page) {
    case "security-firewall.html":
      console.log(`Load ${page}`, Security.Firewall);

      const enableFirewall = document.getElementById("DeviceFirewall_Enable");
      var applyBtn = document.getElementById("Apply");
      const switches = ["Telnet", "SSH", "HTTPS", "ICMP"];

      function toggleSwitch(id) {
        const switchElement = document.getElementById(id);
        switchElement.classList.toggle("gemtek-switch-on");
        switchElement.classList.toggle("gemtek-switch-off");
      }

      function fillData() {
        enableFirewall.checked = Security.Firewall.EnableFirewall;
        switches.forEach((switchID) => {
          const switchElement = document.getElementById(switchID);
          const serviceEnabled =
            Security.Firewall.Services["Enable" + switchID];
          switchElement.checked = serviceEnabled;
          switchElement.classList.toggle("gemtek-switch-on", serviceEnabled);
          switchElement.classList.toggle("gemtek-switch-off", !serviceEnabled);
        });
      }

      function initEvent() {
        switches.forEach((switchID) => {
          document
            .getElementById(switchID)
            .addEventListener("click", function () {
              toggleSwitch(switchID);
            });
        });

        enableFirewall.addEventListener("change", function () {
          console.log("Enable Firewall Settings changed:", this.checked);
        });
      }

      fillData();
      initEvent();

      applyBtn.addEventListener("click", () => {
        Security.Firewall.EnableFirewall = enableFirewall.checked;
        switches.forEach((switchID) => {
          Security.Firewall.Services["Enable" + switchID] = document
            .getElementById(switchID)
            .classList.contains("gemtek-switch-on");
        });

        console.log("Security settings updated:", Security);
        // applyThenStoreToLS("security-firewall.html", "Apply", Security);

        // create body for post request
        var cloneData = deepCopyObject(Security.Firewall);
        console.log("Data sent: Security.Firewall", cloneData);
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.MODIFY,
          cloneData,
          Security,
          ""
        );
      });

      break;
    case "security-parental_control_settings.html":
      console.log(`Load ${page}`, Security.ParentalControl);

      var enableParentalControl = document.getElementById(
        "DeviceFirewallX_GTK_ParentalControl_Enable"
      );
      var permitRadio = document.getElementById("permit");
      var denyRadio = document.getElementById("deny");
      var applyBtn = document.getElementById("Apply");

      var fillDataSettings = () => {
        enableParentalControl.checked =
          Security.ParentalControl.ParentalControlSettings.EnableParentalControl;
        if (
          Security.ParentalControl.ParentalControlSettings.DefaultAction === "1"
        ) {
          permitRadio.checked = true;
        } else {
          denyRadio.checked = true;
        }
      };

      fillDataSettings();

      applyBtn.addEventListener("click", () => {
        Security.ParentalControl.ParentalControlSettings.EnableParentalControl =
          enableParentalControl.checked;
        permitRadio.checked
          ? (Security.ParentalControl.ParentalControlSettings.DefaultAction =
            "1")
          : (Security.ParentalControl.ParentalControlSettings.DefaultAction =
            "0");
        console.log(
          "Parental Control settings updated:",
          Security.ParentalControl.ParentalControlSettings
        );

        /* Create body for post request */
        var cloneData = deepCopyObject(Security.ParentalControl.ParentalControlSettings);
        cloneData.DefaultAction = cloneData.DefaultAction == 1? true: false;
        console.log(cloneData);
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.MODIFY,
          cloneData,
          Security,
          ""
        );
      });

      break;
    case "security-parental_control-devControl-add.html":
      console.log(`Load ${page}`, Security.ParentalControl);

      var oldLength = Security.ParentalControl.DeviceUnderParentalControl.Rules.length;
      var subOption;
      var filledData;
      var addFlag = false;
      if (Security.ParentalControl.DeviceUnderParentalControl.onEdit === "") {
        addFlag = true;
        filledData = {
          EnableParentalControlRule: false,
          PolicyName: "",
          ParentalControlType: "url",
          MACAddress: "",
          TimeStart: "",
          TimeEnd: "",
          DaysOfTheWeek: "",
          Target: "Accept",
          DataForm: [], /* Depend on ParentalControlType: url, ipaddress or port Form */
        };
      } else {
        filledData =
          Security.ParentalControl.DeviceUnderParentalControl.Rules.filter(
            (obj) =>
              obj.PolicyName ===
              Security.ParentalControl.DeviceUnderParentalControl.onEdit
          )[0];

        for (var i = 0; i < Security.ParentalControl.DeviceUnderParentalControl.Rules.length; i++) {
          if (Security.ParentalControl.DeviceUnderParentalControl.onEdit === Security.ParentalControl.DeviceUnderParentalControl.Rules[i].PolicyName) {
            subOption = i;
          }
        }
        console.log(
          `Load ${page} -- Edit ${filledData.PolicyName}}\n${JSON.stringify(
            filledData
          )}`
        );
      }

      var EnableParentalControlRule = document.getElementById("props_Enable");
      var PolicyName = document.getElementById("PolicyName");
      var ParentalControlType = document.getElementById("ParentalControlType");
      var MACAddress = document.getElementById("MACAddress");
      var TimeStart = document.getElementById("TimeStart");
      var TimeEnd = document.getElementById("TimeEnd");
      var Target = document.getElementById("Target");
      var ParentalControlDaysOfTheWeek = document.getElementById("ParentalControlDaysOfTheWeek");
      var listItems = document.querySelectorAll(".weekdayslist li");
      var addUrlList = document.getElementById("AddUrlList");
      var inputFieldUrlList = document.getElementById("input_field_url_list");
      var bodyUrlData = document.getElementById("bodyUrlData");
      var addIpAddressList = document.getElementById("AddIpAddressList");
      var inputFieldIpAddressList = document.getElementById("input_field_ipaddress_list");
      var bodyIpAddressData = document.getElementById("bodyIpAddressData");
      var addPortList = document.getElementById("AddPortList");
      var inputFieldPortList = document.getElementById("input_field_port_list");
      var bodyPortData = document.getElementById("bodyPortData");

      listItems.forEach(function (item) {
        item.addEventListener("click", function () {
          daysOfTheWeekChanged = true;
          this.classList.toggle("active");
          updateHiddenInput();
        });
      });

      function updateHiddenInput() {
        var activeDays = document.querySelectorAll(".weekdayslist li.active");
        if (activeDays.length === 0) {
          document.getElementById("empty_weekdays_list").classList.remove("ng-hide");
        } else {
          document.getElementById("empty_weekdays_list").classList.add("ng-hide");
        }
        var selectedDays = [];
        activeDays.forEach(function (day) {
          selectedDays.push(day.textContent);
          ParentalControlDaysOfTheWeek.value = selectedDays.join(",");
        });
      }

      $('#ParentalControlType').off('change').on('change', function () {
        var selectedType = $(this).val();
        $('.form-section').hide();
        $('#' + selectedType + 'Form').show();
        console.log("selectedType", selectedType);
        if (selectedType === "url") {
          var old_element = document.getElementById("AddUrlList");
          var new_element = old_element.cloneNode(true);
          old_element.parentNode.replaceChild(new_element, old_element);
          addUrlListHandler = new_element.addEventListener("click", () => {
            console.log("from updateHiddenInputURL");
            addDataFormList(selectedType, "");
          });
        } else if (selectedType === "ipaddress") {
          var old_element = document.getElementById("AddIpAddressList");
          var new_element = old_element.cloneNode(true);
          old_element.parentNode.replaceChild(new_element, old_element);
          addIpAddressListHandler = new_element.addEventListener("click", () => {
            console.log("from updateHiddenInputIP");
            addDataFormList(selectedType, "");
          });
        } else if (selectedType === "port") {
          var old_element = document.getElementById("AddPortList");
          var new_element = old_element.cloneNode(true);
          old_element.parentNode.replaceChild(new_element, old_element);
          addPortListHandler = new_element.addEventListener("click", () => {
            console.log("from updateHiddenInputPORT");
            addDataFormList(selectedType, "");
          });
        }
      });


      var addDataFormList = function (parentalControlType, elem) {
        if (parentalControlType === "url") {
          const tr = inputFieldUrlList.content.cloneNode(true);
          const urlInput = tr.querySelector(".url_input");

          const deleteRow = tr.querySelector(".Delete");
          const empty_error = tr.querySelector(".empty_url_error");
          const pattern_error = tr.querySelector(".format_url_error");
          urlInput.value = elem;
          checkPattern_inputField(
            urlInput,
            URL_PATTERN,
            pattern_error,
            empty_error
          );
          urlInput.addEventListener("input", () => {
            checkPattern_inputField(
              urlInput,
              URL_PATTERN,
              pattern_error,
              empty_error
            );
          });
          deleteRow.addEventListener("click", () => {
            var row = deleteRow.closest("tr");
            deleteDialogHandle(
              row,
              "Delete",
              "Are you sure you want to delete ?"
            );
          });
          bodyUrlData.append(tr);
        } else if (parentalControlType === "ipaddress") {
          const tr = inputFieldIpAddressList.content.cloneNode(true);
          const ipAddressInput = tr.querySelector(".ip_address_input");
          const deleteRow = tr.querySelector(".DeleteIpAddressList");
          const empty_error = tr.querySelector(".empty_ip_address_error");
          const pattern_error = tr.querySelector(".format_ip_address_error");
          ipAddressInput.value = elem;
          checkPattern_inputField(
            ipAddressInput,
            new RegExp(IPv4_PATTERN),
            pattern_error,
            empty_error
          );
          ipAddressInput.addEventListener("input", () => {
            checkPattern_inputField(
              ipAddressInput,
              new RegExp(IPv4_PATTERN),
              pattern_error,
              empty_error
            );
          });
          deleteRow.addEventListener("click", () => {
            var row = deleteRow.closest("tr");
            deleteDialogHandle(
              row,
              "Delete",
              "Are you sure you want to delete ?"
            );
          });
          bodyIpAddressData.append(tr);
        } else if (parentalControlType === "port") {
          const tr = inputFieldPortList.content.cloneNode(true);
          const portInput = tr.querySelector(".port_input");
          const deleteRow = tr.querySelector(".DeletePortList");
          const empty_error = tr.querySelector(".empty_port_error");
          const pattern_error = tr.querySelector(".format_port_error");
          portInput.value = elem;
          checkPattern_inputField(
            portInput,
            PORT_PATTERN,
            pattern_error,
            empty_error
          );
          portInput.addEventListener("input", () => {
            checkPattern_inputField(
              portInput,
              PORT_PATTERN,
              pattern_error,
              empty_error
            );
          });
          deleteRow.addEventListener("click", () => {
            var row = deleteRow.closest("tr");
            deleteDialogHandle(
              row,
              "Delete",
              "Are you sure you want to delete ?"
            );
          });
          bodyPortData.append(tr);
        }
      };

      function fillDataAdd() {
        EnableParentalControlRule.checked =
          filledData.EnableParentalControlRule;
        PolicyName.value = filledData.PolicyName;
        ParentalControlType.value = filledData.ParentalControlType;
        MACAddress.value = filledData.MACAddress;
        TimeStart.value = filledData.TimeStart;
        TimeEnd.value = filledData.TimeEnd;
        Target.value = filledData.Target;
        if (!addFlag) {
          var listItems = document.querySelectorAll(".weekdayslist li");
          const daysArray = filledData.DaysOfTheWeek.split(",").map((day) =>
            day.trim()
          );
          const filteredArray = daysArray.filter((day) => day !== "");
          console.log(filteredArray);
          const dayToNumber = {
            Su: 0,
            Mo: 1,
            Tu: 2,
            We: 3,
            Th: 4,
            Fr: 5,
            Sa: 6,
          };
          const numberArray = filteredArray.map((day) => dayToNumber[day]);
          console.log(numberArray);
          numberArray.forEach(function (index) {
            listItems[index].classList.toggle("active");
          });

          $('.form-section').hide();
          $('#' + filledData.ParentalControlType + 'Form').show();

          for (const elem of filledData.DataForm) {
            addDataFormList(filledData.ParentalControlType, elem);
          }
        } else {
          checkEmpty_inputField(
            ParentalControlDaysOfTheWeek,
            document.getElementById("empty_weekdays_list")
          );
        }
        checkEmpty_inputField(
          PolicyName,
          document.getElementById("empty_policy_name_error")
        );
        checkEmpty_inputField(
          TimeStart,
          document.getElementById("empty_start_time_error")
        );
        checkEmpty_inputField(
          TimeEnd,
          document.getElementById("empty_end_time_error")
        );
      }

      fillDataAdd();

      function open_dtBox(id) {
        curTimeTarget = id;
        const dtpicker = document.getElementById("dtBox");
        dtpicker.style.display = "block";
      }

      TimeStart.addEventListener("click", function () {
        open_dtBox(this.id);
      });

      TimeEnd.addEventListener("click", function () {
        open_dtBox(this.id);
      });

      function initEventPT() {
        const hour_up = document.getElementById("hour_up");
        const hour_down = document.getElementById("hour_down");
        const hour = document.getElementById("hour");
        const minute_up = document.getElementById("minute_up");
        const minute_down = document.getElementById("minute_down");
        const minute = document.getElementById("minute");
        const startTimeInput = document.getElementById("TimeStart");
        const endTimeInput = document.getElementById("TimeEnd");
        const setButton = document.querySelector(".dtpicker-buttonSet");

        hour_up.addEventListener("click", () => {
          hour.value = (parseInt(hour.value) + 1) % 24;
          updateTimeDisplay(); // Update the time display when hour changes
        });

        hour_down.addEventListener("click", () => {
          hour.value = (parseInt(hour.value) - 1 + 24) % 24;
          updateTimeDisplay(); // Update the time display when hour changes
        });

        minute_up.addEventListener("click", () => {
          minute.value = (parseInt(minute.value) + 1) % 60;
          updateTimeDisplay(); // Update the time display when minute changes
        });

        minute_down.addEventListener("click", () => {
          minute.value = (parseInt(minute.value) - 1 + 60) % 60;
          updateTimeDisplay(); // Update the time display when minute changes
        });

        setButton.addEventListener("click", () => {
          const hourValue = hour.value.padStart(2, "0");
          const minuteValue = minute.value.padStart(2, "0");
          console.log(`User input: ${hourValue}:${minuteValue}`);
          if (curTimeTarget === "TimeStart") {
            startTimeInput.value = `${hourValue}:${minuteValue}`;
            document.getElementById("empty_start_time_error").classList.add("ng-hide");
          } else if (curTimeTarget === "TimeEnd") {
            endTimeInput.value = `${hourValue}:${minuteValue}`;
            document.getElementById("empty_end_time_error").classList.add("ng-hide");
          }
        });

        function updateTimeDisplay() {
          const hourValue = hour.value.padStart(2, "0");
          const minuteValue = minute.value.padStart(2, "0");
          const timeDisplay = document.querySelector(".dtpicker-value");
          timeDisplay.textContent = `${hourValue}:${minuteValue}`;
          console.log(`Time updated: ${hourValue}:${minuteValue}`);
        }

        PolicyName.addEventListener("input", () => {
          checkEmpty_inputField(
            PolicyName,
            document.getElementById("empty_policy_name_error")
          );
        });
        MACAddress.addEventListener("input", () => {
          const macAddress = MACAddress.value.trim();
          const validateMACAddress = (macAddress) => {
            const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
            return macRegex.test(macAddress);
          };

          if (macAddress === '') {
            document.getElementById("mac_address_format_error").classList.add('ng-hide');
          } else {
            const isValidMAC = validateMACAddress(macAddress);
            if (isValidMAC) {
              document.getElementById("mac_address_format_error").classList.add('ng-hide');
            } else {
              document.getElementById("mac_address_format_error").classList.remove('ng-hide');
            }
          }
        });

        console.log("ParentalControlType.value", ParentalControlType.value);
        if (ParentalControlType.value === "url") {
          addUrlList.addEventListener("click", () => {
            addDataFormList(ParentalControlType.value, "");
          });
        } else if (ParentalControlType.value === "ipaddress") {
          addIpAddressList.addEventListener("click", () => {
            addDataFormList(ParentalControlType.value, "");
          });
        } else if (ParentalControlType.value === "port") {
          addPortList.addEventListener("click", () => {
            addDataFormList(ParentalControlType.value, "");
          });
        }
      }

      initEventPT();

      document.getElementById("Apply").addEventListener("click", () => {
        var checkErrorDataFormTable = false;
        if (ParentalControlType.value === "url") {
          checkErrorDataFormTable = checkError_show(document.querySelectorAll(".commonErrorUrl"));
        } else if (ParentalControlType.value === "ipaddress") {
          checkErrorDataFormTable = checkError_show(document.querySelectorAll(".commonErrorIp"));
        } else if (ParentalControlType.value === "port") {
          checkErrorDataFormTable = checkError_show(document.querySelectorAll(".commonErrorPort"));
        }
        if (checkError_show(document.querySelectorAll(".commonError")) && checkErrorDataFormTable) {
          filledData.EnableParentalControlRule =
            EnableParentalControlRule.checked;
          filledData.PolicyName = PolicyName.value;
          filledData.ParentalControlType = ParentalControlType.value;
          filledData.MACAddress = MACAddress.value;
          filledData.TimeStart = TimeStart.value;
          filledData.TimeEnd = TimeEnd.value;
          filledData.Target = Target.value;
          if (daysOfTheWeekChanged) {
            filledData.DaysOfTheWeek = ParentalControlDaysOfTheWeek.value;
            daysOfTheWeekChanged = false;
          }

          var inputFields;
          if (filledData.ParentalControlType === "url") {
            inputFields = document.querySelectorAll('#urlForm input[name="url"]');
          } else if (filledData.ParentalControlType === "ipaddress") {
            inputFields = document.querySelectorAll('#ipaddressForm input[name="ip"]');
          } else if (filledData.ParentalControlType === "port") {
            inputFields = document.querySelectorAll('#portForm input[name="port"]');
          }

          var inputValues = [];
          filledData.DataForm = [];
          inputFields.forEach(function (inputField) {
            var value = inputField.value;
            inputValues.push(value);
            filledData.DataForm.push(value);
          });
          console.log("Input values:", inputValues);
          if (addFlag === true)
            Security.ParentalControl.DeviceUnderParentalControl.Rules.push(
              filledData
            );

          /* Create body for post request */
          var cloneData = deepCopyObject(Security.ParentalControl.DeviceUnderParentalControl.Rules);
          if (addFlag === true) {
            subOption = oldLength;
            cloneData[parseInt(subOption)].DaysOfTheWeek = cloneData[parseInt(subOption)].DaysOfTheWeek
            .replace(/\s+/g, '')
            .replace(/,\n/g, ',');
            httpService.send_POST_Request(
              page,
              COMMAND.USER_CONFIG_DATA.ADD,
              cloneData[parseInt(subOption)],
              Security,
              subOption,
              "security-parental_control-devControl.html"
            );
          } else {
            cloneData[parseInt(subOption)].DaysOfTheWeek = cloneData[parseInt(subOption)].DaysOfTheWeek
            .replace(/\s+/g, '')
            .replace(/,\n/g, ',');
            httpService.send_POST_Request(
              page,
              COMMAND.USER_CONFIG_DATA.MODIFY,
              cloneData[parseInt(subOption)],
              Security,
              subOption,
              "security-parental_control-devControl.html"
            );
          }
          console.log(cloneData);
        }
      });

      document.getElementById("Cancel").addEventListener("click", () => {
        daysOfTheWeekChanged = false;
        applyThenStoreToLS("security-parental_control-devControl.html", "Cancel");
      });
      break;
    case "security-parental_control-devControl.html":
      console.log(
        `Load ${page}`,
        Security.ParentalControl.DeviceUnderParentalControl
      );

      var tbody = document.getElementById("bodyData");
      var ruleElem = document.getElementById("ruleTemplate");
      var addBtn = document.getElementById("Add");

      var fillDevControlData = () => {
        for (const elem of Security.ParentalControl.DeviceUnderParentalControl
          .Rules) {
          const tr = ruleElem.content.cloneNode(true);
          const policyName = tr.querySelector(".policyName");
          const parentalControlType = tr.querySelector(".parentalControlType");
          const macAddress = tr.querySelector(".macAddress");
          const timeStartEnd = tr.querySelector(".timeStartEnd");
          const access = tr.querySelector(".Access");
          const daysOfTheWeek = tr.querySelector(".daysOfTheWeek");
          const statusParentalControlRule = tr.querySelector(
            ".statusParentalControlRule"
          );

          const editBtn = tr.querySelector(".editBtn");
          const deleteBtn = tr.querySelector(".deleteBtn");

          elem.EnableParentalControlRule
            ? statusParentalControlRule.classList.add("gemtek-enabled")
            : statusParentalControlRule.classList.add("gemtek-disabled");
          policyName.textContent = elem.PolicyName;
          parentalControlType.textContent = checkParentalControlType(
            elem.ParentalControlType
          );
          macAddress.textContent = elem.MACAddress;
          timeStartEnd.textContent = elem.TimeStart + " - " + elem.TimeEnd;
          daysOfTheWeek.textContent = elem.DaysOfTheWeek;
          if (elem.Target === "Accept") {
            access.innerHTML =
              '<span class="gemtek-permit">' + access.innerHTML + "</span>";
          } else if (elem.Target === "Drop") {
            access.innerHTML =
              '<span class="gemtek-deny">' + access.innerHTML + "</span>";
          }

          editBtn.addEventListener("click", () => {
            Security.ParentalControl.DeviceUnderParentalControl.onEdit =
              elem.PolicyName;
            applyThenStoreToLS(
              "security-parental_control-devControl-add.html",
              "Apply",
              Security
            );
          });

          deleteBtn.addEventListener("click", () => {
            if (window.confirm("Are you sure you want to Delete ?")) {
              Security.ParentalControl.DeviceUnderParentalControl.Rules.splice(
                parseInt(deleteBtn.closest("tr").rowIndex - 1),
                1
              );
              var cloneData = deepCopyObject(Security.ParentalControl.DeviceUnderParentalControl.Rules);
              var subOption = parseInt(deleteBtn.closest("tr").rowIndex - 1)
              cloneData.forEach(function(rule) {
                rule.DaysOfTheWeek = rule.DaysOfTheWeek.trim().split(/\s*,\s*/).map(day => day.trim()).join(',');
              });
              console.log(cloneData);
              httpService.send_POST_Request(
                page,
                COMMAND.USER_CONFIG_DATA.DELETE,
                cloneData,
                Security,
                subOption
              );
            }
          });
          tbody.appendChild(tr);
        }
      };
      var checkParentalControlType = function (parentalControlType) {
        switch (parentalControlType) {
          case "url":
            return "URL";
          case "ipaddress":
            return "IP Address";
          case "port":
            return "Port";
          default:
            return "";
        }
      };

      fillDevControlData();

      addBtn.addEventListener("click", () => {
        Security.ParentalControl.DeviceUnderParentalControl.onEdit = "";
        applyThenStoreToLS(
          "security-parental_control-devControl-add.html",
          "Apply",
          Security
        );
      });

      break;
    default:
      console.log(`Load ${page} fail --- no available page`);
      return;
  }
}

function loadPage(page, options) {
  let Status = JSON.parse(localStorage.getItem("Status"));
  let Basic = JSON.parse(localStorage.getItem("Basic"));
  let Wifi = JSON.parse(localStorage.getItem("Wifi"));
  let Advanced = JSON.parse(localStorage.getItem("Advanced"));
  let Security = JSON.parse(localStorage.getItem("Security"));
  let Utilities = JSON.parse(localStorage.getItem("Utilities"));
  let VoIP = JSON.parse(localStorage.getItem("VoIP"));
  switch (page) {
    case "basic-lan-dev_connected.html":
      console.log(`Load ${page}`, Basic.LAN.DeviceConnected);

      var filledData = Basic.LAN.DeviceConnected;

      var tbody = document.getElementById("bodyData");
      var devConTemplate = document.getElementById("devCon");
      var refreshBtn = document.getElementById("Refresh");

      for (const elem of filledData) {
        const tr = devConTemplate.content.cloneNode(true);

        tr.querySelector(".hostName").textContent = elem.HostName;
        tr.querySelector(".MACaddr").textContent = elem.MACAddress;
        tr.querySelector(".IPaddr").textContent = elem.IPAddress;

        tbody.appendChild(tr);
      }

      refreshBtn.addEventListener("click", () => {
        applyThenStoreToLS(page, "Cancel");
      });
      break;
    case "basic-lan-ipv4Config.html":
      console.log(`Load ${page}`, Basic.LAN.IPv4Configuration);

      var filledData = Basic.LAN.IPv4Configuration;
      var oldLength = Basic.LAN.IPv4Configuration.IPAddressReservation.length;

      var devIPAddr = document.getElementById("IPAddress");
      var subnetMask = document.getElementById("SubnetMask");
      var dhcpMode = document.getElementById("DHCPMode");
      var beginAddr = document.getElementById("MinAddress");
      var endAddr = document.getElementById("MaxAddress");
      var leaseTime = document.getElementById("LeaseTime");
      var addBtn = document.getElementById("AddBtn");
      var tbody = document.getElementById("bodyData");

      var addIPForm = document.getElementById("add_ip_addr_reservation");
      var ip_addForm = document.getElementById("Yiaddr");
      var mac_addForm = document.getElementById("Chaddr");
      var confirm_addForm = document.getElementById("Confirm");
      var cancel_addForm = document.getElementById("Destroy");

      var tbody = document.getElementById("bodyData");
      var rowElemTemplate = document.getElementById("rowElem");

      // fill data
      var fillData = function () {
        devIPAddr.value = filledData.DeviceIPAddress;
        subnetMask.value = filledData.SubnetMask;
        dhcpMode.value = filledData.DHCPMode;
        beginAddr.value = filledData.BeginAddress;
        endAddr.value = filledData.EndAddress;
        leaseTime.value = filledData.LeaseTime;

        for (const elem of filledData.IPAddressReservation) {
          add_IPReservation(elem.MAC, elem.IP);
        }
      };

      var add_IPReservation = (mac, ip) => {
        const tr = rowElemTemplate.content.cloneNode(true);

        const rowForm = tr.querySelector(".rowform");

        const macField = tr.querySelector(".rowMAC");
        const ipField = tr.querySelector(".rowIP");
        const editBtn = tr.querySelector(".editBtn");
        const deleteBtn = tr.querySelector(".deleteBtn");
        const editConfirm = tr.querySelector(".editConfirm");
        const editCancel = tr.querySelector(".editCancel");

        // on Edit
        const allEditWrap = tr.querySelectorAll(".editable-wrap");
        const macEdit = tr.querySelector(".macEdit");
        const ipEdit = tr.querySelector(".ipEdit");
        const macError = tr.querySelector(".macError");
        const ipError = tr.querySelector(".ipError");

        const formBtns = tr.querySelector(".form-buttons");
        const btns = tr.querySelector(".buttons");

        // fill data
        macField.textContent = mac;
        ipField.textContent = ip;

        // init event
        const macEditHandler = function () {
          if (
            !new RegExp("^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$").test(
              macEdit.value.trim()
            )
          )
            macError.classList.remove("ng-hide");
          else macError.classList.add("ng-hide");
        };

        const ipEditHandler = function () {
          if (
            !new RegExp(
              "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
            ).test(ipEdit.value.trim())
          )
            ipError.classList.remove("ng-hide");
          else ipError.classList.add("ng-hide");
        };

        rowForm.addEventListener("submit", (event) => {
          event.preventDefault();
        });

        editBtn.addEventListener("click", () => {
          macField.style.visibility = "hidden";
          ipField.style.visibility = "hidden";
          for (const editWrap of allEditWrap) {
            editWrap.classList.remove("ng-hide");
          }
          formBtns.classList.remove("ng-hide");
          btns.classList.add("ng-hide");

          // event for 2 input field
          macEdit.addEventListener("input", macEditHandler);
          macEdit.value = mac;

          ipEdit.addEventListener("input", ipEditHandler);
          ipEdit.value = ip;
        });

        deleteBtn.addEventListener("click", () => {
          deleteDialogHandle(
            deleteBtn.closest("tr"),
            "Delete ip address",
            "Are you sure you want to Delete ?"
          );
        });

        editConfirm.addEventListener("click", function () {
          //check Error at MAC & IP field
          if (checkError_show(macError, ipError)) {
            macField.style.visibility = "visible";
            ipField.style.visibility = "visible";
            for (const editWrap of allEditWrap) {
              editWrap.classList.add("ng-hide");
            }
            formBtns.classList.add("ng-hide");
            btns.classList.remove("ng-hide");

            //update value
            macField.textContent = macEdit.value;
            ipField.textContent = ipEdit.value;
            macField.style.visibility = "visible";
            ipField.style.visibility = "visible";

            // remove event
            macEdit.removeEventListener("input", macEditHandler);
            ipEdit.removeEventListener("input", ipEditHandler);
          }
        });

        editCancel.addEventListener("click", () => {
          macField.style.visibility = "visible";
          ipField.style.visibility = "visible";
          for (const editWrap of allEditWrap) {
            editWrap.classList.add("ng-hide");
          }
          formBtns.classList.add("ng-hide");
          btns.classList.remove("ng-hide");

          // remove event
          macEdit.removeEventListener("input", macEditHandler);
          ipEdit.removeEventListener("input", ipEditHandler);
        });

        tbody.appendChild(tr);
      };

      var initEvent = function () {
        devIPAddr.addEventListener("input", () => {
          checkPattern_inputField(
            devIPAddr,
            new RegExp(devIPAddr.getAttribute("pattern")),
            document.getElementById("devIP_invalid_error"),
            document.getElementById("devIP_empty_error")
          );
        });

        subnetMask.addEventListener("input", () => {
          checkPattern_inputField(
            subnetMask,
            new RegExp(subnetMask.getAttribute("pattern")),
            document.getElementById("subnet_invalid_error"),
            document.getElementById("subnet_empty_error")
          );
        });

        dhcpMode.addEventListener("change", () => {
          checkError_selectField(
            dhcpMode,
            document.getElementById("dhcp_select_error")
          );
        });

        beginAddr.addEventListener("input", () => {
          checkPattern_inputField(
            beginAddr,
            new RegExp(beginAddr.getAttribute("pattern")),
            document.getElementById("begin_invalid_error"),
            document.getElementById("begin_empty_error")
          );
        });

        endAddr.addEventListener("input", () => {
          checkPattern_inputField(
            endAddr,
            new RegExp(endAddr.getAttribute("pattern")),
            document.getElementById("end_invalid_error"),
            document.getElementById("end_empty_error")
          );
        });

        leaseTime.addEventListener("change", () => {
          checkError_selectField(
            leaseTime,
            document.getElementById("lease_select_error")
          );
        });

        addBtn.addEventListener("click", () => {
          addIPForm.classList.remove("ng-hide");
          tbody.classList.remove("hiderow");
          tbody.classList.add("showrow");

          checkPattern_inputField(
            ip_addForm,
            new RegExp(ip_addForm.getAttribute("apattern")),
            document.getElementById("addIP_invalid_error"),
            document.getElementById("addIP_empty_error")
          );
          checkPattern_inputField(
            mac_addForm,
            new RegExp(mac_addForm.getAttribute("apattern")),
            document.getElementById("addMAC_invalid_error"),
            document.getElementById("addMAC_empty_error")
          );
        });

        ip_addForm.addEventListener("input", () => {
          checkPattern_inputField(
            ip_addForm,
            new RegExp(ip_addForm.getAttribute("apattern")),
            document.getElementById("addIP_invalid_error"),
            document.getElementById("addIP_empty_error")
          );
        });

        mac_addForm.addEventListener("input", () => {
          checkPattern_inputField(
            mac_addForm,
            new RegExp(mac_addForm.getAttribute("apattern")),
            document.getElementById("addMAC_invalid_error"),
            document.getElementById("addMAC_empty_error")
          );
        });

        // Confirm or cancel Add IP reservation
        confirm_addForm.addEventListener("click", () => {
          if (checkError_show(document.querySelectorAll(".add_error"))) {
            var newIPReser = {
              MAC: mac_addForm.value,
              IP: ip_addForm.value,
            };

            filledData.IPAddressReservation.push(newIPReser);

            // hide add panel
            addIPForm.classList.add("ng-hide");
            tbody.classList.add("hiderow");
            tbody.classList.remove("showrow");

            // reset value input field and append IP table
            mac_addForm.value = "";
            ip_addForm.value = "";
            add_IPReservation(newIPReser.MAC, newIPReser.IP);
          } else {
            console.log("Add new IP reservation fail");
          }
        });

        cancel_addForm.addEventListener("click", () => {
          addIPForm.classList.add("ng-hide");
          tbody.classList.add("hiderow");
          tbody.classList.remove("showrow");
        });
      };

      // fill data to FE
      fillData();

      // init event fot element inside FE
      initEvent();

      // test if start, end & device IP is valid (on same network address)
      function testIPvalid(dev_IP, start_IP, end_IP, subnetmask) {
        var ipComponents = dev_IP.split(".");
        var startComponents = start_IP.split(".");
        var endComponents = end_IP.split(".");
        var subnetComponents = subnetmask.split(".");
        /**
         * Test in range 1 --> 254
         */
        if (
          parseInt(ipComponents[3]) <= 0 ||
          parseInt(ipComponents[3]) >= 255 ||
          parseInt(startComponents[3]) <= 0 ||
          parseInt(startComponents[3]) >= 255 ||
          parseInt(endComponents[3]) <= 0 ||
          parseInt(endComponents[3]) >= 255
        ) {
          alertDialogHandle(
            "Invalid Device IP address, Begin address or End address!"
          );
          return false;
        }

        /**
         * Method: IP AND subnetmask === start_IP AND subnetmask === end_IP AND subnetmask --> at the same network
         */
        for (var i = 0; i < ipComponents.length; i++) {
          if (
            (parseInt(ipComponents[i]) & parseInt(subnetComponents[i])) !=
              (parseInt(startComponents[i]) & parseInt(subnetComponents[i])) ||
            (parseInt(ipComponents[i]) & parseInt(subnetComponents[i])) !=
              (parseInt(endComponents[i]) & parseInt(subnetComponents[i])) ||
            (parseInt(startComponents[i]) & parseInt(subnetComponents[i])) !=
              (parseInt(endComponents[i]) & parseInt(subnetComponents[i]))
          ) {
            alertDialogHandle(
              `Invalid Begin or End IP address!. The IP address pool is ${devIPAddr.value}. Please enter your desired IP address again!`
            );
            return false;
          }
        }
        return true;
      }

      document.getElementById("Modify").addEventListener("click", () => {
        // check if error on page, true --> no error (filter all erroe except add_error class)
        if (checkError_show(document.querySelectorAll(".checkerror"))) {
          if (
            testIPvalid(
              devIPAddr.value,
              beginAddr.value,
              endAddr.value,
              subnetMask.value
            ) === false
          ) {
            return;
          }
          filledData.DeviceIPAddress = devIPAddr.value;
          filledData.SubnetMask = subnetMask.value;
          filledData.DHCPMode = dhcpMode.value;
          filledData.BeginAddress = beginAddr.value;
          filledData.EndAddress = endAddr.value;
          filledData.LeaseTime = leaseTime.value;
          filledData.IPAddressReservation = []; // clear
          for (const elem of tbody.getElementsByTagName("tr")) {
            const value = elem.innerText.split("\t");
            // console.log(elem);
            filledData.IPAddressReservation.push({
              MAC: value[0],
              IP: value[1],
            });
          }
          //applyThenStoreToLS(page, "Apply", Basic);
          // create body for post request
          var cloneData = deepCopyObject(Basic.LAN.IPv4Configuration);
          var subOption = oldLength;
          cloneData.DHCPMode = dhcpMode.options[dhcpMode.selectedIndex].text;
          secondConvert = [3600, 86400, 604800];
          cloneData.LeaseTime = secondConvert[parseInt(cloneData.LeaseTime)];
          console.log("Data sent: Basic.LAN.IPv4", cloneData);
          httpService.send_POST_Request(
            page,
            COMMAND.USER_CONFIG_DATA.COMPLEX,
            cloneData,
            Basic,
            subOption
          );
        } else {
          console.log("Apply fail");
        }
      });

      document.getElementById("Cancel").addEventListener("click", () => {
        applyThenStoreToLS(page, "Cancel");
      });
      break;
    case "basic-lan-ipv6Config.html":
      console.log(`Load ${page}`, Basic.LAN.IPv6Configuration);

      var filledData = Basic.LAN.IPv6Configuration;

      // init variable
      var enable = document.getElementById("Enable");
      var autoConfigMode = document.getElementById("X_GTK_IPv6_LANMode");
      var prefix = document.getElementById("Prefixes");
      var primaryDNSv6 = document.getElementById("X_GTK_PRI_DNSv6");
      var secondDNSv6 = document.getElementById("X_GTK_SEC_DNSv6");
      var domainName = document.getElementById("X_GTK_V6_DOMAIN_NAME");

      var fillData = () => {
        filledData.Enable
          ? enable.classList.add("checked")
          : enable.classList.remove("checked");
        autoConfigMode.value = filledData.AutoConfigurationMode;
        prefix.value = filledData.Prefix;
        primaryDNSv6.value = filledData.PrimaryDNSv6;
        secondDNSv6.value = filledData.SecondaryDNSv6;
        domainName.value = filledData.DomainName;
      };

      var initEvent = () => {
        autoConfigMode.addEventListener("change", () => {
          checkError_selectField(
            autoConfigMode,
            document.getElementById("select_error")
          );
        });

        prefix.addEventListener("input", () => {
          checkPattern_inputField(
            prefix,
            new RegExp(prefix.getAttribute("pattern")),
            document.getElementById("prefix_invalid_error"),
            document.getElementById("prefix_empty_error")
          );
        });

        primaryDNSv6.addEventListener("input", () => {
          checkPattern_inputField(
            primaryDNSv6,
            new RegExp(primaryDNSv6.getAttribute("pattern")),
            document.getElementById("priDNSv6_invalid_error"),
            document.getElementById("priDNSv6_empty_error")
          );
        });

        secondDNSv6.addEventListener("input", () => {
          var pattern = new RegExp(secondDNSv6.getAttribute("pattern"));
          if (!pattern.test(secondDNSv6.value)) {
            document
              .getElementById("seDNSv6_invalid_error")
              .classList.remove("ng-hide");
          } else {
            document
              .getElementById("seDNSv6_invalid_error")
              .classList.add("ng-hide");
          }
        });
      };

      // fill Data to FE
      fillData();

      // init event for elem of FE
      initEvent();

      // Apply & Cancel button
      document.getElementById("Modify").addEventListener("click", () => {
        if (checkError_show(document.querySelectorAll(".error"))) {
          filledData.Enable = enable.classList.contains("checked");
          filledData.AutoConfigurationMode = autoConfigMode.value;
          filledData.Prefix = prefix.value;
          filledData.PrimaryDNSv6 = primaryDNSv6.value;
          filledData.SecondaryDNSv6 = secondDNSv6.value;
          filledData.DomainName = domainName.value;
          // applyThenStoreToLS(page, "Apply", Basic);
          // create body for post request
          var cloneData = deepCopyObject(Basic.LAN.IPv6Configuration);
          cloneData.AutoConfigurationMode =
            autoConfigMode.options[autoConfigMode.selectedIndex].text;
          console.log("Data sent: Basic.LAN.IPv6Configuration", cloneData);
          httpService.send_POST_Request(
            page,
            COMMAND.USER_CONFIG_DATA.MODIFY,
            cloneData,
            Basic,
            ""
          );
        } else {
          console.log("Apply fail");
        }
      });

      document.getElementById("Cancel").addEventListener("click", () => {
        applyThenStoreToLS(page, "Cancel");
      });
      break;
    case "basic-registration_ID.html":
      console.log(`Load ${page}`, Basic.LAN.RegistrationID);

      patternRegex = /^[A-Z0-9]{12}$/;
      document.querySelector("button.gemtek-btn-primary").disabled = true;
      document.querySelector("#RegID").value =
        Basic.RegistrationID.RegistrationID;
      // check registratin ID is valid or not
      document.querySelector("#RegID").onkeyup = function () {
        if (document.querySelector("#RegID").value.length > 0) {
          if (patternRegex.test(document.querySelector("#RegID").value)) {
            // valid PONID
            document.querySelector("#RegIDNotify").innerHTML = "";
            document.querySelector(
              "button.gemtek-btn-primary"
            ).disabled = false;
          } else {
            // invalid PONID
            document.querySelector("#RegIDNotify").innerHTML =
              "* Invalid registration ID, i.e INTC92002035";
          }
        } else {
          document.querySelector("button.gemtek-btn-primary").disabled = true;
          document.querySelector("#RegIDNotify").innerHTML =
            "* This field is required.";
        }
      };
      // get set data to local storage
      document
        .querySelector("button.gemtek-btn-primary")
        .addEventListener("click", function () {
          Basic.RegistrationID.RegistrationID =
            document.querySelector("#RegID").value;
          // applyThenStoreToLS(page, "Apply", Basic);
          // create body for post request
          var cloneData = deepCopyObject(Basic.RegistrationID);
          httpService.send_POST_Request(
            page,
            COMMAND.USER_CONFIG_DATA.MODIFY,
            cloneData,
            Basic,
            ""
          );
          document.querySelector("#RegID").value =
            Basic.RegistrationID.RegistrationID;
        });
      document
        .querySelector("button.gemtek-btn-normal")
        .addEventListener("click", function () {
          applyThenStoreToLS(page, "Cancel", Basic);
        });
      document.querySelector("#RegIDNotify").innerHTML = "";
      break;
    case "basic-wan-addWAN.html":
      console.log(`Load ${page}`, Basic.WAN);
      var filledData = {};
      var addNew_flag = false;
      var oldLength = Basic.WAN.Interfaces.length;

      function refreshData(iname) {
        return {
          Name: iname,
          SelectionMode: "ETH",
          ConnectionType: "DHCP",
          VLAN: "", // if empty --> false
          MacCloning: "",
          // Static connection type option
          IPAddressStatic: "",
          SubnetMask: "",
          GatewayAddressStatic: "",
          IPv4DNSServer: [],
          // DHCP connection type option
          Option60: "",
          Option61: "",
          Option125: "",
          // PPPoE connection type option
          Username: "",
          Password: "",
          MTUSize: "",
          IPAddress: "192.168.99.51",
          DefaultGateway: "192.168.99.1",
          Actions: false,
          /** IPv6 information */
          EnableIPv6: true,
          IPv6: {
            // main WAN --> IPv6
            IPv6Address: "2222::382f:e77d:b85e:4d2f",
            v6DefaultGateway: "fe80::e0:92ff:fe00:141",
            //
            AddressingType: "DHCPv6",
            PrefixMode: "", // if empty --> disable "Enable PD" checkbox
            PrefixAddress: "",
            PrimaryTime: "",
            ValidTime: "",
            // DHCP v6 Connection type option
            Option16_1: "",
            Option16_2: "",
            Option1: "",
            Option17: "",
            // Static v6 Connection type option
            IPv6AddressStatic: "",
            Prefix: "",
            v6GatewayAddressStatic: "",
            IPv6DNSServer: [],
          },
        };
      }

      /** Take data from Loca Storage, corresponds to Add or Edit */
      if (Basic.WAN.onEdit !== "") {
        // if edit --> Load from Local Storage
        filledData = Basic.WAN.Interfaces.filter(
          (obj) => obj.Name === Basic.WAN.onEdit
        )[0];
        console.log(`Load ${page} -- Edit ${filledData.Name}}`, filledData);
      } else {
        // if add New interface --> make prototype
        addNew_flag = true;
        var current_wan_interfaces = Basic.WAN.Interfaces.map((obj) =>
          obj.Name.replace(/_.*_/, "_")
        );
        var remain_in_pool = WAN_INTERFACE_POOL.filter(
          (cinterface) => !current_wan_interfaces.includes(cinterface)
        ); // retrieve available interfaces name
        filledData = refreshData(remain_in_pool[0]);
        console.log(
          `Load ${page} -- Add ${filledData.Name}}\n${JSON.stringify(
            filledData
          )}`
        );
      }

      /** Common */
      var selectionMode = document.getElementById("SelectionMode");
      var connectionType = document.getElementById("ConnectionType");

      var enableVLAN = document.getElementById("EnableVLAN");
      var vlan = document.getElementById("VLANShow");
      var vlan_input = document.getElementById("VLANID");

      var macCloingEnable = document.getElementById("MacCloningEnable");
      var macAddress = document.getElementById("MacCloningShow");
      var macAddress_input = document.getElementById("MACAddress");

      var enableDefaultGW = document.getElementById("EnableDefaultGateway");

      /** V6 common */
      var enablev6 = document.getElementById("EnableIPv6");
      var addressType = document.getElementById("AddressType");
      var enablepd = document.getElementById("EnablePD");
      var prefixMode = document.getElementById("ipv6_prefix_select");
      var prefixAddress = document.getElementById("PrefixAddress");
      var primaryTime = document.getElementById("PrimaryTime");
      var validTime = document.getElementById("ValidTime");

      /** Static Connection Type */
      // IPv4
      var static_panel = document.getElementById("Static_panel");
      var ipaddressStatic = document.getElementById("IPAddressStatic");
      var subnetMask = document.getElementById("SubnetMask");
      var gatewayStatic = document.getElementById("GatewayIPAddress");
      var addv4DNS = document.getElementById("Add");
      var v4DNSlist = document.getElementById("bodyData");
      var v4dnsElem = document.getElementById("rowElement");

      // IPv6
      var staticv6_panel = document.getElementById("Staticv6_panel");
      var ipaddressStaticv6 = document.getElementById("IPv6Address");
      var prefixStaticv6 = document.getElementById("IPv6Prefix");
      var gatewayStaticv6 = document.getElementById("IPv6GW");
      var addv6DNS = document.getElementById("Addv6");
      var v6DNSlist = document.getElementById("v6bodyData");
      var v6dnsElem = document.getElementById("v6rowElement");

      /** DHCP Connection Type */
      // IPv4
      var dhcp_panel = document.getElementById("DHCP_panel");

      var enableOption60 = document.getElementById("EnableOption60");
      var option60 = document.getElementById("Option60");
      var option60_input = document.getElementById("VendorClassID");

      var enableOption61 = document.getElementById("EnableOption61");
      var option61 = document.getElementById("Option61");
      var option61_input = document.getElementById("ClientID");

      var enableOption125 = document.getElementById("EnableOption125");
      var option125 = document.getElementById("Option125");
      var option125_input = document.getElementById("EnterpriseNumber");

      // IPv6
      var dhcpv6_panel = document.getElementById("DHCPv6_panel");

      var enableOption16 = document.getElementById("EnableOption16");
      var option16 = document.getElementById("Option16");
      var option16_1_input = document.getElementById("Option16_1_input");
      var option16_2_input = document.getElementById("Option16_2_input");

      var enableOption1 = document.getElementById("EnableOption1");
      var option1 = document.getElementById("Option1");
      var option1_input = document.getElementById("Option1_input");

      var enableOption17 = document.getElementById("EnableOption17");
      var option17 = document.getElementById("Option17");
      var option17_input = document.getElementById("Option17_input");

      /** PPPoE Connection Type */
      var pppoe_panel = document.getElementById("PPPoE_panel");
      var pppoe_username = document.getElementById("pppoe_username");
      var pppoe_password = document.getElementById("pppoe_password");
      var pppoe_pwdEye = document.getElementById("pwd_eye_ppoe_password");
      var pppoe_mtu_size = document.getElementById("pppoe_mtu_size");

      /* init event con common field */
      var setup = function () {
        enableVLAN.addEventListener("click", () => {
          enableVLAN.checked != enableVLAN.checked;
          if (enableVLAN.checked == true) {
            vlan.classList.remove("ng-hide");
            vlan_input.value = filledData.VLAN;
            checkRange_inputField(
              vlan_input,
              document.getElementById("exceed_error_vlan"),
              document.getElementById("empty_error_vlan")
            );
          } else {
            vlan.classList.add("ng-hide");
          }
        });

        vlan_input.addEventListener("input", () => {
          checkRange_inputField(
            vlan_input,
            document.getElementById("exceed_error_vlan"),
            document.getElementById("empty_error_vlan")
          );
        });

        macCloingEnable.addEventListener("change", () => {
          macCloingEnable.checked != macCloingEnable.checked;
          if (macCloingEnable.checked == true) {
            macAddress.classList.remove("ng-hide");
            macAddress_input.value = filledData.MacCloning;
            checkEmpty_inputField(
              macAddress_input,
              document.getElementById("empty_error_mac")
            );
          } else {
            macAddress.classList.add("ng-hide");
          }
        });

        macAddress_input.addEventListener("input", () => {
          checkPattern_inputField(
            macAddress_input,
            new RegExp(MAC_PATTERN),
            document.getElementById("pattern_error_mac"),
            document.getElementById("empty_error_mac")
          );
        });
      };

      var setupv6 = function () {
        enablev6.addEventListener("click", () => {
          enablev6.checked != enablev6.checked;
          if (enablev6.checked === true) {
            document
              .getElementById("v6AddressType")
              .classList.remove("ng-hide");
            document
              .getElementById("v6PrefixSetting")
              .classList.remove("ng-hide");
          } else {
            document.getElementById("v6AddressType").classList.add("ng-hide");
            document.getElementById("v6PrefixSetting").classList.add("ng-hide");
          }
          handleConnectionType(connectionType.value, false);
        });

        enablepd.addEventListener("click", () => {
          enablepd.checked != enablepd.checked;
          if (enablepd.checked === true) {
            document.getElementById("pd_panel").classList.remove("ng-hide");
            if (prefixMode.value === "Manual") {
              document
                .getElementById("manual_prefix_mode_panel")
                .classList.remove("ng-hide");
            } else {
              document
                .getElementById("manual_prefix_mode_panel")
                .classList.add("ng-hide");
            }
          } else {
            document.getElementById("pd_panel").classList.add("ng-hide");
            document
              .getElementById("manual_prefix_mode_panel")
              .classList.add("ng-hide");
          }
        });

        prefixMode.addEventListener("change", () => {
          if (prefixMode.value === "Manual") {
            document
              .getElementById("manual_prefix_mode_panel")
              .classList.remove("ng-hide");

            checkPattern_inputField(
              prefixAddress,
              new RegExp(IPv6_PREFIX_ADDR_PATTERN),
              document.getElementById("pattern_error_prefix"),
              document.getElementById("empty_error_prefix")
            );

            checkRange_inputField(
              primaryTime,
              document.getElementById("range_error_primaryTime"),
              document.getElementById("empty_error_primaryTime")
            );

            checkRange_inputField(
              validTime,
              document.getElementById("range_error_validTime"),
              document.getElementById("empty_error_validTime")
            );
          } else {
            document
              .getElementById("manual_prefix_mode_panel")
              .classList.add("ng-hide");
          }
        });

        prefixAddress.addEventListener("input", () => {
          checkPattern_inputField(
            prefixAddress,
            new RegExp(IPv6_PREFIX_ADDR_PATTERN),
            document.getElementById("pattern_error_prefix"),
            document.getElementById("empty_error_prefix")
          );
        });

        primaryTime.addEventListener("input", () => {
          checkRange_inputField(
            primaryTime,
            document.getElementById("range_error_primaryTime"),
            document.getElementById("empty_error_primaryTime")
          );
        });

        validTime.addEventListener("input", () => {
          checkRange_inputField(
            validTime,
            document.getElementById("range_error_validTime"),
            document.getElementById("empty_error_validTime")
          );
        });
      };

      /** Connection Type */
      var addDNSServer = function (ipversion, elem) {
        if (ipversion === "IPv4") {
          const tr = v4dnsElem.content.cloneNode(true);
          const dnsServer = tr.querySelector(".DNSServer");

          const deleteRow = tr.querySelector(".Delete");
          const empty_error = tr.querySelector(".EmptyError");
          const pattern_error = tr.querySelector(".PatternError");

          dnsServer.value = elem;
          checkPattern_inputField(
            dnsServer,
            new RegExp(IPv4_PATTERN),
            pattern_error,
            empty_error
          );

          dnsServer.addEventListener("input", () => {
            checkPattern_inputField(
              dnsServer,
              new RegExp(IPv4_PATTERN),
              pattern_error,
              empty_error
            );
          });

          deleteRow.addEventListener("click", () => {
            var row = deleteRow.closest("tr");
            deleteDialogHandle(
              row,
              "Delete DNS Server",
              "Are you sure you want to Delete ?"
            );
          });

          v4DNSlist.appendChild(tr);
        } else {
          const tr = v6dnsElem.content.cloneNode(true);
          const dnsServer = tr.querySelector(".DNSServerv6");

          const deleteRow = tr.querySelector(".Deletev6");

          const empty_error = tr.querySelector(".EmptyErrorv6");
          const pattern_error = tr.querySelector(".PatternErrorv6");

          dnsServer.value = elem;
          checkPattern_inputField(
            dnsServer,
            new RegExp(IPv6_PATTERN),
            pattern_error,
            empty_error
          );

          dnsServer.addEventListener("input", () => {
            checkPattern_inputField(
              dnsServer,
              new RegExp(IPv6_PATTERN),
              pattern_error,
              empty_error
            );
          });

          deleteRow.addEventListener("click", () => {
            var row = deleteRow.closest("tr");
            deleteDialogHandle(
              row,
              "Delete DNS Server",
              "Are you sure you want to Delete ?"
            );
          });

          v6DNSlist.appendChild(tr);
        }
      };

      var handleConnectionType = function (
        connection_type,
        loadData_from_LocalStorage
      ) {
        // apply UI with corresponding Connection Type & fill data from Local Storage
        if (connection_type == "Static") {
          dhcp_panel.classList.add("ng-hide");
          static_panel.classList.remove("ng-hide");
          pppoe_panel.classList.add("ng-hide");

          if (loadData_from_LocalStorage === true) {
            ipaddressStatic.value = filledData.IPAddressStatic;
            subnetMask.value = filledData.SubnetMask;
            gatewayStatic.value = filledData.GatewayAddressStatic;
            v4DNSlist.innerHTML = ""; // clear after fill data

            if (!addNew_flag) {
              for (const elem of filledData.IPv4DNSServer) {
                addDNSServer("IPv4", elem);
              }
            }
          }
          checkPattern_inputField(
            ipaddressStatic,
            new RegExp(IPv4_PATTERN),
            document.getElementById("pattern_error_ip"),
            document.getElementById("empty_error_ip")
          );
          checkPattern_inputField(
            subnetMask,
            new RegExp(SUBNET_PATTERN),
            document.getElementById("pattern_error_subnet"),
            document.getElementById("empty_error_subnet")
          );
          checkPattern_inputField(
            gatewayStatic,
            new RegExp(IPv4_PATTERN),
            document.getElementById("pattern_error_gw"),
            document.getElementById("empty_error_gw")
          );

          // Enable IPv6
          if (enablev6.checked === true) {
            staticv6_panel.classList.remove("ng-hide");
            dhcpv6_panel.classList.add("ng-hide");

            if (loadData_from_LocalStorage === true) {
              ipaddressStaticv6.value = filledData.IPv6.IPv6AddressStatic;
              prefixStaticv6.value = filledData.IPv6.Prefix;
              gatewayStaticv6.value = filledData.IPv6.v6GatewayAddressStatic;
              v6DNSlist.innerHTML = ""; // clear after fill data
              if (!addNew_flag) {
                for (const elem of filledData.IPv6.IPv6DNSServer) {
                  addDNSServer("IPv6", elem);
                }
              }
            } else {
              ipaddressStaticv6.value = "";
              prefixStaticv6.value = "";
              gatewayStaticv6.value = "";
              v6DNSlist.innerHTML = ""; // clear after fill data
            }
            checkPattern_inputField(
              ipaddressStaticv6,
              new RegExp(IPv6_PATTERN),
              document.getElementById("pattern_error_ipv6Address"),
              document.getElementById("empty_error_ipv6Address")
            );
            checkRange_inputField(
              prefixStaticv6,
              document.getElementById("range_error_ipv6Prefix"),
              document.getElementById("empty_error_ipv6Prefix")
            );
            checkPattern_inputField(
              gatewayStaticv6,
              new RegExp(IPv6_PATTERN),
              document.getElementById("pattern_error_ipv6GW"),
              document.getElementById("empty_error_ipv6GW")
            );
          } else {
            staticv6_panel.classList.add("ng-hide");
          }
        } else if (connection_type == "DHCP") {
          dhcp_panel.classList.remove("ng-hide");
          static_panel.classList.add("ng-hide");
          pppoe_panel.classList.add("ng-hide");

          if (loadData_from_LocalStorage === true) {
            if (filledData.Option60 !== "") {
              enableOption60.checked = true;
              option60.classList.remove("ng-hide");
              option60_input.value = filledData.Option60;
              checkEmpty_inputField(
                option60_input,
                document.getElementById("empty_error_option60")
              );
            } else {
              // enableOption60.checked = false;
              option60.classList.add("ng-hide");
            }

            if (filledData.Option61 !== "") {
              enableOption61.checked = true;
              option61.classList.remove("ng-hide");
              option61_input.value = filledData.Option61;
              checkEmpty_inputField(
                option61_input,
                document.getElementById("empty_error_option61")
              );
            } else {
              enableOption61.checked = false;
              option61.classList.add("ng-hide");
            }

            if (filledData.Option125 !== "") {
              enableOption125.checked = true;
              option125.classList.remove("ng-hide");
              option125_input.value = filledData.Option125;
              checkEmpty_inputField(
                option125_input,
                document.getElementById("empty_error_option125")
              );
            } else {
              enableOption125.checked = false;
              option125.classList.add("ng-hide");
            }
          }
          // Enable IPv6
          if (enablev6.checked === true) {
            dhcpv6_panel.classList.remove("ng-hide");
            staticv6_panel.classList.add("ng-hide");

            if (loadData_from_LocalStorage) {
              if (
                filledData.IPv6.Option16_1 !== "" &&
                filledData.IPv6.Option16_2 !== ""
              ) {
                enableOption16.checked = true;
                option16.classList.remove("ng-hide");
                option16_1_input.value = filledData.IPv6.Option16_1;
                option16_2_input.value = filledData.IPv6.Option16_2;
                checkEmpty_inputField(
                  option16_1_input,
                  document.getElementById("empty_error_option16_1")
                );
                checkEmpty_inputField(
                  option16_2_input,
                  document.getElementById("empty_error_option16_2")
                );
              } else {
                enableOption16.checked = false;
                option16.classList.add("ng-hide");
              }

              if (filledData.IPv6.Option1 !== "") {
                enableOption1.checked = true;
                option1.classList.remove("ng-hide");
                option1_input.value = filledData.IPv6.Option1;
                checkEmpty_inputField(
                  option1_input,
                  document.getElementById("empty_error_option1")
                );
              } else {
                enableOption1, (checked = false);
                option1.classList.add("ng-hide");
              }

              if (filledData.IPv6.Option17 !== "") {
                enableOption17.checked = true;
                option17.classList.remove("ng-hide");
                option17_input.value = filledData.IPv6.Option17;
                checkEmpty_inputField(
                  option17_input,
                  document.getElementById("empty_error_option17")
                );
              } else {
                enableOption17.checked = false;
                option17.classList.add("ng-hide");
              }
            }
          } else {
            dhcpv6_panel.classList.add("ng-hide");
          }
        } else if (connection_type == "PPPoE") {
          pppoe_panel.classList.remove("ng-hide");
          dhcp_panel.classList.add("ng-hide");
          static_panel.classList.add("ng-hide");

          if (loadData_from_LocalStorage) {
            pppoe_username.value = filledData.Username;
            pppoe_password.value = filledData.Password;
            pppoe_mtu_size.value = filledData.MTUSize;
          }
          checkEmpty_inputField(
            pppoe_username,
            document.getElementById("empty_error_pppoe_username")
          );
          checkEmpty_inputField(
            pppoe_password,
            document.getElementById("empty_error_pppoe_password")
          );
          checkRange_inputField(
            pppoe_mtu_size,
            document.getElementById("range_error_pppoe_mtu_size"),
            document.getElementById("empty_error_pppoe_mtu_size")
          );
        } else {
          console.log("Error, Connection Type select is not available");
        }
      };

      var setupConnectionType = function () {
        /* Init event for each Connection type */
        // Static option setup
        ipaddressStatic.addEventListener("input", () => {
          checkPattern_inputField(
            ipaddressStatic,
            new RegExp(IPv4_PATTERN),
            document.getElementById("pattern_error_ip"),
            document.getElementById("empty_error_ip")
          );
        });

        subnetMask.addEventListener("input", () => {
          checkPattern_inputField(
            subnetMask,
            new RegExp(SUBNET_PATTERN),
            document.getElementById("pattern_error_subnet"),
            document.getElementById("empty_error_subnet")
          );
        });

        gatewayStatic.addEventListener("input", () => {
          checkPattern_inputField(
            gatewayStatic,
            new RegExp(IPv4_PATTERN),
            document.getElementById("pattern_error_gw"),
            document.getElementById("empty_error_gw")
          );
        });

        addv4DNS.addEventListener("click", () => {
          addDNSServer("IPv4", "");
        });

        // v6 Static option setup
        ipaddressStaticv6.addEventListener("input", () => {
          checkPattern_inputField(
            ipaddressStaticv6,
            new RegExp(IPv6_PATTERN),
            document.getElementById("pattern_error_ipv6Address"),
            document.getElementById("empty_error_ipv6Address")
          );
        });

        prefixStaticv6.addEventListener("input", () => {
          checkRange_inputField(
            prefixStaticv6,
            document.getElementById("range_error_ipv6Prefix"),
            document.getElementById("empty_error_ipv6Prefix")
          );
        });

        gatewayStaticv6.addEventListener("input", () => {
          checkPattern_inputField(
            gatewayStaticv6,
            new RegExp(IPv6_PATTERN),
            document.getElementById("pattern_error_ipv6GW"),
            document.getElementById("empty_error_ipv6GW")
          );
        });

        addv6DNS.addEventListener("click", () => {
          addDNSServer("IPv6", "");
        });

        // DHCP option setup
        enableOption60.addEventListener("change", () => {
          enableOption60.checked != enableOption60.checked;
          if (enableOption60.checked == true) {
            option60.classList.remove("ng-hide");
            checkEmpty_inputField(
              option60_input,
              document.getElementById("empty_error_option60")
            );
          } else {
            option60.classList.add("ng-hide");
          }
        });

        enableOption61.addEventListener("change", () => {
          enableOption61.checked != enableOption61.checked;
          if (enableOption61.checked == true) {
            option61.classList.remove("ng-hide");
            checkEmpty_inputField(
              option61_input,
              document.getElementById("empty_error_option61")
            );
          } else {
            option61.classList.add("ng-hide");
          }
        });

        enableOption125.addEventListener("change", () => {
          enableOption125.checked != enableOption125.checked;
          if (enableOption125.checked == true) {
            option125.classList.remove("ng-hide");
            checkEmpty_inputField(
              option125_input,
              document.getElementById("empty_error_option125")
            );
          } else {
            option125.classList.add("ng-hide");
          }
        });

        option60_input.addEventListener("input", () => {
          checkEmpty_inputField(
            option60_input,
            document.getElementById("empty_error_option60")
          );
        });

        option61_input.addEventListener("input", () => {
          checkEmpty_inputField(
            option61_input,
            document.getElementById("empty_error_option61")
          );
        });

        option125_input.addEventListener("input", () => {
          checkEmpty_inputField(
            option125_input,
            document.getElementById("empty_error_option125")
          );
        });

        // v6 DHCP
        enableOption16.addEventListener("click", () => {
          enableOption16.checked != enableOption16.checked;
          if (enableOption16.checked === true) {
            option16.classList.remove("ng-hide");
            checkEmpty_inputField(
              option16_1_input,
              document.getElementById("empty_error_option16_1")
            );
            checkEmpty_inputField(
              option16_2_input,
              document.getElementById("empty_error_option16_2")
            );
          } else {
            option16.classList.add("ng-hide");
          }
        });

        enableOption1.addEventListener("click", () => {
          enableOption1.checked != enableOption1.checked;
          if (enableOption1.checked === true) {
            option1.classList.remove("ng-hide");
            checkEmpty_inputField(
              option1_input,
              document.getElementById("empty_error_option1")
            );
          } else {
            option1.classList.add("ng-hide");
          }
        });

        enableOption17.addEventListener("click", () => {
          enableOption17.checked != enableOption17.checked;
          if (enableOption17.checked === true) {
            option17.classList.remove("ng-hide");
            checkEmpty_inputField(
              option17_input,
              document.getElementById("empty_error_option17")
            );
          } else {
            option17.classList.add("ng-hide");
          }
        });

        option16_1_input.addEventListener("input", () => {
          checkEmpty_inputField(
            option16_1_input,
            document.getElementById("empty_error_option16_1")
          );
        });

        option16_2_input.addEventListener("input", () => {
          checkEmpty_inputField(
            option16_2_input,
            document.getElementById("empty_error_option16_2")
          );
        });

        option17_input.addEventListener("input", () => {
          checkEmpty_inputField(
            option17_input,
            document.getElementById("empty_error_option17")
          );
        });

        option1_input.addEventListener("input", () => {
          checkEmpty_inputField(
            option1_input,
            document.getElementById("empty_error_option1")
          );
        });

        // PPPoE option setup
        pppoe_username.addEventListener("input", () => {
          checkEmpty_inputField(
            pppoe_username,
            document.getElementById("empty_error_pppoe_username")
          );
        });

        pppoe_password.addEventListener("input", () => {
          checkEmpty_inputField(
            pppoe_password,
            document.getElementById("empty_error_pppoe_password")
          );
        });

        pppoe_pwdEye.addEventListener("click", () => {
          hide_show_pw(pppoe_pwdEye, pppoe_password);
        });

        pppoe_mtu_size.addEventListener("input", () => {
          checkRange_inputField(
            pppoe_mtu_size,
            document.getElementById("range_error_pppoe_mtu_size"),
            document.getElementById("empty_error_pppoe_mtu_size")
          );
        });

        connectionType.addEventListener("change", () => {
          handleConnectionType(connectionType.value);
        });
      };

      /** Fill data into FE */
      var fillData = function () {
        selectionMode.value = filledData.SelectionMode;

        connectionType.value = filledData.ConnectionType;

        if (filledData.DefaultGateway !== "") enableDefaultGW.checked = true;
        else enableDefaultGW.checked = false;

        if (filledData.VLAN !== "") {
          enableVLAN.checked = true;
          vlan.classList.remove("ng-hide");
          vlan_input.value = filledData.VLAN;
          checkEmpty_inputField(
            vlan_input,
            document.getElementById("empty_error_vlan")
          );
        } else {
          enableVLAN.checked = false;
        }

        if (filledData.MacCloning !== "") {
          macCloingEnable.checked = true;
          macAddress.classList.remove("ng-hide");
          macAddress_input.value = filledData.MacCloning;
          checkEmpty_inputField(
            macAddress_input,
            document.getElementById("empty_error_mac")
          );
        } else {
          macCloingEnable.checked = false;
        }

        if (filledData.EnableIPv6 === true) {
          enablev6.checked = true;
          document.getElementById("v6AddressType").classList.remove("ng-hide");
          document
            .getElementById("v6PrefixSetting")
            .classList.remove("ng-hide");
          addressType.value = filledData.IPv6.AddressingType;

          if (filledData.IPv6.PrefixMode !== "") {
            enablepd.checked = true;
            document.getElementById("pd_panel").classList.remove("ng-hide");

            prefixMode.value = filledData.IPv6.PrefixMode;
            // enable PD if option is Auto or Manual
            if (filledData.IPv6.PrefixMode === "Manual") {
              document
                .getElementById("manual_prefix_mode_panel")
                .classList.remove("ng-hide");

              prefixAddress.value = filledData.IPv6.PrefixAddress;
              checkPattern_inputField(
                prefixAddress,
                new RegExp(IPv6_PREFIX_ADDR_PATTERN),
                document.getElementById("pattern_error_prefix"),
                document.getElementById("empty_error_prefix")
              );

              primaryTime.value = filledData.IPv6.PrimaryTime;
              checkRange_inputField(
                primaryTime,
                document.getElementById("range_error_primaryTime"),
                document.getElementById("empty_error_primaryTime")
              );

              validTime.value = filledData.IPv6.ValidTime;
              checkRange_inputField(
                validTime,
                document.getElementById("range_error_validTime"),
                document.getElementById("empty_error_validTime")
              );
            } else {
              // Auto
              document
                .getElementById("manual_prefix_mode_panel")
                .classList.add("ng-hide");
            }
          } else {
            enablepd.checked = false;
            document.getElementById("pd_panel").classList.add("ng-hide");
          }
        } else {
          enablev6.checked = false;
          document.getElementById("v6AddressType").classList.add("ng-hide");
          document.getElementById("v6PrefixSetting").classList.add("ng-hide");
        }
        handleConnectionType(connectionType.value, true);
      };

      /** declare variable of tag and add event listerner for them */
      setup();
      setupv6();
      setupConnectionType();
      // fill data into FE
      fillData();

      /** Button Cancel and Apply */
      var cancelBtn = document.getElementById("Cancel");
      var applyBtn = document.getElementById("Apply");

      /** At Cancel and Apply */
      cancelBtn.addEventListener("click", () => {
        applyThenStoreToLS("basic-wan-ipv4.html", "Cancel");
      });

      applyBtn.addEventListener("click", () => {
        filledData = refreshData(filledData.Name);
        var static_apply_flag = true;
        var dhcp_apply_flag = true;
        var pppoe_apply_flag = true;
        var common_apply_flag = true;

        var elemAfterChange;
        if (!addNew_flag) {
          // if edit
          elemAfterChange = Basic.WAN.Interfaces.find(
            (obj) => obj.Name === filledData.Name
          );
        } else {
          // add new WAN interface
          elemAfterChange = filledData;
        }

        elemAfterChange.Name = filledData.Name;
        elemAfterChange.SelectionMode = selectionMode.value;
        elemAfterChange.ConnectionType = connectionType.value;
        elemAfterChange.Actions = false; // Status UP after Apply

        /** Check Error at common field */
        if (enableVLAN.checked === true) {
          elemAfterChange.VLAN = vlan_input.value;
          if (/_.*_/.test(elemAfterChange.Name)) {
            elemAfterChange.Name = filledData.Name.replace(
              /_.*_/,
              `_${vlan_input.value}_`
            );
          } else {
            elemAfterChange.Name = filledData.Name.replace(
              "_",
              `_${vlan_input.value}_`
            );
          }
          common_apply_flag &= checkError_show(
            document.querySelectorAll(".vlan_error")
          );
        } else {
          elemAfterChange.VLAN = "";
        }

        if (macCloingEnable.checked === true) {
          elemAfterChange.MacCloning = macAddress_input.value;
          common_apply_flag &= checkError_show(
            document.querySelectorAll(".macCloning_error")
          );
        } else {
          elemAfterChange.MacCloning = "";
        }

        // check v6
        if (enablev6.checked === true) {
          elemAfterChange.EnableIPv6 = true;
          elemAfterChange.IPv6.AddressingType = addressType.value;
          if (enablepd.checked) {
            if (prefixMode.value === "Manual") {
              elemAfterChange.IPv6.PrefixAddress = prefixAddress.value;
              elemAfterChange.IPv6.PrimaryTime = parseInt(primaryTime.value);
              elemAfterChange.IPv6.ValidTime = parseInt(validTime.value);
              checkError_show(document.querySelectorAll(".v6_common_error"));
            }
            elemAfterChange.IPv6.PrefixMode = prefixMode.value;
          }
        } else {
          elemAfterChange.EnableIPv6 = false;
          elemAfterChange.IPv6.AddressingType = "DHCPv6";
          elemAfterChange.IPv6.PrefixMode = "";
          elemAfterChange.IPv6.PrefixAddress = "";
          elemAfterChange.IPv6.PrimaryTime = "";
          elemAfterChange.IPv6.ValidTime = "";
        }

        function generateIPv6WANAddress() {
          // Generate eight 16-bit hexadecimal blocks
          const blocks = Array.from({ length: 8 }, () =>
            Math.floor(Math.random() * 0xffff)
          );

          // Format the blocks into an IPv6 address
          const ipv6Address = blocks
            .map((block) => block.toString(16))
            .join(":");

          return ipv6Address;
        }

        switch (connectionType.value) {
          case "Static":
            static_apply_flag &= checkError_show(
              document.querySelectorAll(".static_error")
            );

            // check v6
            if (enablev6.checked === true) {
              static_apply_flag &= checkError_show(
                document.querySelectorAll(".staticv6_error")
              );
            }
            console.log(
              `Case Static Connection: common_apply_flag = ${common_apply_flag}, static_apply_flag = ${static_apply_flag}`
            );

            if (common_apply_flag && static_apply_flag) {
              //check if Static IP address already use
              for (const elem of Basic.WAN.Interfaces) {
                if (
                  elem.IPAddress === ipaddressStatic.value &&
                  elem.VLAN === vlan_input.value
                ) {
                  alertDialogHandle(
                    "IP address has already existed on other WAN interface. Please try a new one !"
                  );
                  return;
                }
              }

              // if no error --> wrap data in the page to store
              elemAfterChange.IPAddress = ipaddressStatic.value;
              elemAfterChange.IPAddressStatic = ipaddressStatic.value;
              elemAfterChange.SubnetMask = subnetMask.value;
              elemAfterChange.GatewayAddressStatic = gatewayStatic.value;

              elemAfterChange.IPv4DNSServer = []; // clear
              for (const elem of v4DNSlist.querySelectorAll(".DNSServer")) {
                elemAfterChange.IPv4DNSServer.push(elem.value);
              }

              // v6 fill
              elemAfterChange.EnableIPv6 = enablev6.checked;
              if (enablev6.checked === true) {
                // validate IPv6, at case Multicast or 0::0
                if (
                  INVALID_IPv6_MULTICAST.test(ipaddressStaticv6.value) ||
                  INVALID_IPv6_NOIP.test(ipaddressStaticv6.value) ||
                  INVALID_IPv6_MULTICAST.test(gatewayStaticv6.value) ||
                  INVALID_IPv6_NOIP.test(gatewayStaticv6.value)
                ) {
                  console.log(
                    "Invalid IPv6 address, not accept 0::0 or Multicast"
                  );
                  elemAfterChange.IPv6.IPv6Address = "";
                  elemAfterChange.IPv6.IPv6AddressStatic = "";
                  elemAfterChange.IPv6.Prefix = "";
                  elemAfterChange.IPv6.v6GatewayAddressStatic = "";
                } else {
                  elemAfterChange.IPv6.IPv6Address = ipaddressStaticv6.value;
                  elemAfterChange.IPv6.IPv6AddressStatic =
                    ipaddressStaticv6.value;
                  elemAfterChange.IPv6.Prefix = parseInt(prefixStaticv6.value);
                  elemAfterChange.IPv6.v6GatewayAddressStatic =
                    gatewayStaticv6.value;
                }
                elemAfterChange.IPv6.IPv6DNSServer = [];
                for (const elem of v6DNSlist.querySelectorAll(".DNSServerv6")) {
                  elemAfterChange.IPv6.IPv6DNSServer.push(elem.value);
                }
              }

              if (enableDefaultGW.checked === true) {
                var ipComponents = ipaddressStatic.value.split(".");
                ipComponents[3] = "1";
                elemAfterChange.DefaultGateway = ipComponents.join("."); // <3 first octets>.1

                // v6 Default GW
                elemAfterChange.IPv6.v6DefaultGateway =
                  "fe80::e0:92ff:fe00:141";
              } else {
                elemAfterChange.DefaultGateway = "";
                elemAfterChange.IPv6.v6DefaultGateway = "";
              }
            } else {
              console.log("Basic.WAN.addWAN: Apply Static fail");
              return;
            }
            break;
          case "DHCP":
            // v4
            if (enableOption60.checked === true) {
              elemAfterChange.Option60 = option60_input.value;
              dhcp_apply_flag &= checkError_show(
                document.getElementById("empty_error_option60")
              );
            } else {
              elemAfterChange.Option60 = "";
            }

            if (enableOption61.checked === true) {
              elemAfterChange.Option61 = option61_input.value;
              dhcp_apply_flag &= checkError_show(
                document.getElementById("empty_error_option61")
              );
            } else {
              elemAfterChange.Option61 = "";
            }

            if (enableOption125.checked === true) {
              elemAfterChange.Option125 = option125_input.value;
              dhcp_apply_flag &= checkError_show(
                document.getElementById("empty_error_option125")
              );
            } else {
              elemAfterChange.Option125 = "";
            }

            // v6
            if (enablev6.checked === true) {
              if (enableOption16.checked === true) {
                elemAfterChange.IPv6.Option16_1 = option16_1_input.value;
                elemAfterChange.IPv6.Option16_2 = option16_2_input.value;
                dhcp_apply_flag &= checkError_show(
                  document.getElementById("empty_error_option16_1"),
                  document.getElementById("empty_error_option16_2")
                );
              } else {
                elemAfterChange.IPv6.Option16_1 = "";
                elemAfterChange.IPv6.Option16_2 = "";
              }

              if (enableOption1.checked === true) {
                elemAfterChange.IPv6.Option1 = option1_input.value;
                dhcp_apply_flag &= checkError_show(
                  document.getElementById("empty_error_option1")
                );
              } else {
                elemAfterChange.IPv6.Option1 = "";
              }

              if (enableOption17.checked === true) {
                elemAfterChange.IPv6.Option17 = option17_input.value;
                dhcp_apply_flag &= checkError_show(
                  document.getElementById("empty_error_option17")
                );
              } else {
                elemAfterChange.IPv6.Option17 = "";
              }
            }

            console.log(
              `Case DHCP Connection: common_apply_flag = ${common_apply_flag}, dhcp_apply_flag = ${dhcp_apply_flag}`
            );

            if (common_apply_flag && dhcp_apply_flag) {
              // if add new interface --> create new IP, else on Edit, no change IP address
              if (addNew_flag || vlan_input.value !== elemAfterChange.VLAN) {
                function genIPv4() {
                  // if no error --> wrap data in the page to store
                  var hostPart = Math.floor(Math.random() * 254) + 1; // Generates a random integer between 1 and 254
                  if (enableVLAN.checked === true)
                    // gen IP address by hash VLAN
                    return (elemAfterChange.IPAddress = `${
                      parseInt(vlan_input.value / 1024) + 172
                    }.${parseInt(vlan_input.value / 254) + 168}.${
                      vlan_input.value % 254
                    }.${hostPart}`); // IP at C class
                  return `192.168.99.${hostPart.toString()}`;
                }
                var valid_IPv4 = "";
                var dupCount = 0; // count duplicate, (dupCount = 1 mean it duplicate to itself, so actual duplicate when dupCount = 2)

                do {
                  valid_IPv4 = genIPv4();
                  dupCount = 0;
                  //check if IP address already use
                  for (const elem of Basic.WAN.Interfaces) {
                    // check duplicate IP on same VLAN
                    if (
                      elem.IPAddress === valid_IPv4 &&
                      elem.VLAN === vlan_input.value
                    ) {
                      dupCount += 1;
                    }
                  }
                } while (2 === dupCount);

                elemAfterChange.IPAddress = valid_IPv4;
                elemAfterChange.IPv6.IPv6Address = generateIPv6WANAddress();
              }

              if (enableDefaultGW.checked === true) {
                // if default gateway v4
                elemAfterChange.DefaultGateway = "192.168.99.1";
                if (enableVLAN.checked === true) {
                  var currentIP = elemAfterChange.IPAddress.split(".");
                  currentIP[3] = "1"; // because we create IP of VLAN at C class
                  elemAfterChange.DefaultGateway = currentIP.join(".");
                }
                // v6
                elemAfterChange.IPv6.v6DefaultGateway =
                  "fe80::e0:92ff:fe00:141";
              }
            } else {
              console.log("Basic.WAN.addWAN: Apply DHCP fail");
              return;
            }
            break;
          case "PPPoE":
            pppoe_apply_flag &= checkError_show(
              document.querySelectorAll(".pppoe_error")
            );
            if (common_apply_flag && pppoe_apply_flag) {
              // if no error --> wrap data in the page to store
              var hostPart = Math.floor(Math.random() * 254) + 1; // Generates a random integer between 1 and 254

              elemAfterChange.IPAddress = `192.168.99.${hostPart.toString()}`;
              elemAfterChange.IPv6.IPv6Address = generateIPv6WANAddress();
              console.log(`${elemAfterChange.VLAN} --- ${vlan_input.value}`);

              console.log(`${elemAfterChange.VLAN} --- ${vlan_input.value}`);
              if (enableVLAN.checked === true)
                // try to gen unique IP address (but relate to VLAN as a hash)
                elemAfterChange.IPAddress = `${
                  parseInt(vlan_input.value / 1024) + 172
                }.${parseInt(vlan_input.value / 254) + 168}.${
                  vlan_input.value % 254
                }.${hostPart}`;

              if (enableDefaultGW.checked === true) {
                // if default gateway
                elemAfterChange.DefaultGateway = "192.168.99.1";
                if (enableVLAN.checked === true)
                  elemAfterChange.DefaultGateway =
                    elemAfterChange.IPAddress.replace(`${hostPart}`, "1");

                // v6
                elemAfterChange.IPv6.v6DefaultGateway =
                  "fe80::e0:92ff:fe00:141";
              }
              elemAfterChange.Username = pppoe_username.value;
              elemAfterChange.Password = pppoe_password.value;
              elemAfterChange.MTUSize = parseInt(pppoe_mtu_size.value);
            } else {
              console.log("Basic.WAN.addWAN: Apply PPPoE fail");
              return;
            }
            break;
          default:
            console.log(
              "Some thing wrong in Connection Type. Check it out !!!"
            );
            return;
        }
        if (addNew_flag) {
          // if Add button --> push new element instead of modify
          var tempIndex = -1;
          for (var i = 0; i < Basic.WAN.Interfaces.length; i++) {
            if (
              parseInt(elemAfterChange.Name.match(/\d+$/g)[0]) >
              parseInt(Basic.WAN.Interfaces[i].Name.match(/\d+$/g)[0])
            ) {
              tempIndex = i;
            }
          }
          if (tempIndex === -1)
            Basic.WAN.Interfaces.splice(0, 0, elemAfterChange);
          else Basic.WAN.Interfaces.splice(tempIndex + 1, 0, elemAfterChange);
        }

        // clear DefaultGW of the other (v4 & v6)
        if (enableDefaultGW.checked === true) {
          for (const elem of Basic.WAN.Interfaces) {
            if (elem.Name !== elemAfterChange.Name) elem.DefaultGateway = "";
          }
          for (const elem of Basic.WAN.Interfaces) {
            if (elem.Name !== elemAfterChange.Name)
              elem.IPv6.v6DefaultGateway = "";
          }
        } else {
          elemAfterChange.DefaultGateway = "";
          elemAfterChange.IPv6.v6DefaultGateway = "";
        }

        var redirect;
        Basic.WAN.atv6Config
          ? (redirect = "basic-wan-ipv6.html")
          : (redirect = "basic-wan-ipv4.html");
        var cloneData = deepCopyObject(Basic.WAN.Interfaces);
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.COMPLEX,
          cloneData,
          Basic,
          oldLength,
          redirect
        );
      });
      break;
    case "basic-wan-ipv4.html":
      console.log(`Load ${page}`, Basic.WAN.Interfaces);

      var oldLength = Basic.WAN.Interfaces.length;

      var bodyData = document.getElementById("bodyData");
      var addBtn = document.getElementById("Add");
      var rowElement = document.getElementById("rowElement");

      for (const [index, elem] of Basic.WAN.Interfaces.entries()) {
        const tr = rowElement.content.cloneNode(true);

        tr.querySelector("tr").setAttribute("index", index);
        const nameCell = tr.querySelector(".NameCell");
        const connectiomTypeCell = tr.querySelector(".ConnectiomTypeCell");
        const iPAddressCell = tr.querySelector(".IPAddressCell");
        const statusCell = tr.querySelector(".StatusCell");
        const defaultGatewayCell = tr.querySelector(".DefaultGatewayCell");
        const actionConnectCell = tr.querySelector(".ActionConnectCell");
        const imgActionConnectCell = tr.querySelector(".imgActionConnectCell");
        const editBtn = tr.querySelector(".EditBtn");
        const deleteBtn = tr.querySelector(".DeleteBtn");

        // fill data
        nameCell.textContent = elem.Name;
        connectiomTypeCell.textContent = elem.SelectionMode;
        iPAddressCell.textContent = elem.IPAddress;
        if (elem.Actions === false) {
          statusCell.classList.add("gemtek-status-up");
          statusCell.classList.add("gemtek-status-up-text");
          imgActionConnectCell.src = "images/icons/icon-1/disconnect.svg";
          actionConnectCell.checked = false;
        } else {
          statusCell.classList.add("gemtek-status-down");
          statusCell.classList.add("gemtek-status-down-text");
          imgActionConnectCell.src = "images/icons/icon-1/connect.svg";
          actionConnectCell.checked = true;
        }
        defaultGatewayCell.textContent = elem.DefaultGateway;

        // Add click event for them
        actionConnectCell.addEventListener("click", () => {
          var clickElemName = actionConnectCell
            .closest("tr")
            .innerText.split("\t")[0]; // Name of clicked element
          console.log(clickElemName);
          var clickElem = Basic.WAN.Interfaces.find(
            (obj) => obj.Name === clickElemName
          );
          clickElem.Actions = !clickElem.Actions;
          var index = Basic.WAN.Interfaces.indexOf(clickElem);
          actionConnectCell.checked = !actionConnectCell.checked;
          var cloneData = deepCopyObject(Basic.WAN.Interfaces[index]);
          httpService.send_POST_Request(
            page,
            COMMAND.USER_CONFIG_DATA.MODIFY,
            cloneData,
            Basic,
            index
          );
        });

        editBtn.addEventListener("click", () => {
          Basic.WAN.onEdit = elem.Name;
          Basic.WAN.atv6Config = false;
          applyThenStoreToLS("basic-wan-addWAN.html", "Apply", Basic);
        });

        deleteBtn.addEventListener("click", () => {
          if (bodyData.getElementsByTagName("tr").length === 1) {
            alertDialogHandle("Cannot delete all WAN interfaces");
          } else {
            var row = deleteBtn.closest("tr");
            deleteDialogHandle(
              row,
              "Delete WAN IPv4",
              "Are you sure you want to delete ?"
            )
              .then(() => {
                // if true --> delete (OK button is pressed)
                Basic.WAN.Interfaces.splice(
                  parseInt(deleteBtn.closest("tr").getAttribute("index")),
                  1
                );
                console.log(Basic.WAN.Interfaces);
                var cloneData = deepCopyObject(Basic.WAN.Interfaces);
                httpService.send_POST_Request(
                  page,
                  COMMAND.USER_CONFIG_DATA.COMPLEX,
                  cloneData,
                  Basic,
                  oldLength
                );
              })
              .catch(() => {});
          }
        });

        // append table
        bodyData.appendChild(tr);
      }

      addBtn.addEventListener("click", () => {
        Basic.WAN.onEdit = "";
        Basic.WAN.atv6Config = false;
        if (Basic.WAN.Interfaces.length >= WAN_INTERFACE_POOL.length) {
          alertDialogHandle("Maximum settings limit has been exceeded");
        } else {
          applyThenStoreToLS("basic-wan-addWAN.html", "Apply", Basic);
        }
      });
      break;
    case "basic-wan-ipv6.html":
      console.log(`Load ${page}`, Basic.WAN.Interfaces);
      var bodyData = document.getElementById("bodyData");
      var addBtn = document.getElementById("Add");
      var rowElement = document.getElementById("rowElement");

      for (const elem of Basic.WAN.Interfaces) {
        if (elem.EnableIPv6 === true) {
          const tr = rowElement.content.cloneNode(true);

          const nameCell = tr.querySelector(".NameCell");
          const connectiomTypeCell = tr.querySelector(".ConnectiomTypeCell");
          const iPAddressCell = tr.querySelector(".IPAddressCell");
          const statusCell = tr.querySelector(".StatusCell");
          const defaultGatewayCell = tr.querySelector(".DefaultGatewayCell");
          const editBtn = tr.querySelector(".EditBtn");
          const deleteBtn = tr.querySelector(".DeleteBtn");

          // fill data
          nameCell.textContent = elem.Name;
          connectiomTypeCell.textContent = elem.SelectionMode;
          iPAddressCell.textContent = elem.IPv6.IPv6Address;
          defaultGatewayCell.textContent = elem.IPv6.v6DefaultGateway;

          if (elem.Actions === false) {
            statusCell.classList.add("gemtek-status-up");
            statusCell.classList.add("gemtek-status-up-text");
          } else {
            statusCell.classList.add("gemtek-status-down");
            statusCell.classList.add("gemtek-status-down-text");
          }

          editBtn.addEventListener("click", () => {
            Basic.WAN.onEdit = elem.Name;
            Basic.WAN.atv6Config = true;
            applyThenStoreToLS("basic-wan-addWAN.html", "Apply", Basic);
          });

          deleteBtn.addEventListener("click", () => {
            if (Basic.WAN.Interfaces.length === 1) {
              alertDialogHandle("Cannot delete all WAN interfaces");
            } else {
              var row = deleteBtn.closest("tr");
              deleteDialogHandle(
                row,
                "Delete WAN IPv6",
                "Are you sure you want to delete ?"
              )
                .then(() => {
                  // if true --> delete (OK button is pressed)
                  Basic.WAN.Interfaces = Basic.WAN.Interfaces.filter(
                    (obj) =>
                      obj.Name !==
                      row.innerText
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean)[0]
                  );
                  applyThenStoreToLS("basic-wan-ipv6.html", "Apply", Basic);
                })
                .catch(() => {});
            }
          });

          // append table
          bodyData.appendChild(tr);
        }
        // else {
        //   console.log(`${elem.Name} interface does not have IPv6 config`);
        // }
      }

      addBtn.addEventListener("click", () => {
        Basic.WAN.onEdit = "";
        Basic.WAN.atv6Config = true;
        if (Basic.WAN.Interfaces.length >= WAN_INTERFACE_POOL.length) {
          alertDialogHandle("Maximum settings limit has been exceeded");
        } else {
          applyThenStoreToLS("basic-wan-addWAN.html", "Apply", Basic);
        }
      });
      break;
    default:
      console.log(`Load ${page} fail --- no available page`);
      return;
  }
}

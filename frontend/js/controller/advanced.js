function loadPage(page, options) {
  // load data from local storage
  let Status = JSON.parse(localStorage.getItem("Status"));
  let Basic = JSON.parse(localStorage.getItem("Basic"));
  let Wifi = JSON.parse(localStorage.getItem("Wifi"));
  let Advanced = JSON.parse(localStorage.getItem("Advanced"));
  let Security = JSON.parse(localStorage.getItem("Security"));
  let Utilities = JSON.parse(localStorage.getItem("Utilities"));
  let VoIP = JSON.parse(localStorage.getItem("VoIP"));

  function getInterfaceObject(interfaceName) {
    if (interfaceName === "br-lan") {
      return "Device.IP.Interface.0";
    }

    var interfaces = Basic.WAN.Interfaces;
    for (var i = 0; i < interfaces.length; i++) {
      if (interfaces[i].Name === interfaceName) {
        return `Device.IP.Interface.${i + 1}`;
      }
    }
  }

  switch (page) {
    case "advanced-alg.html":
      console.log(`Load ${page}`, Advanced.ALG);
      var ftp = document.getElementById("DeviceNATX_GTK_ALG_FTP");
      var tftp = document.getElementById("DeviceNATX_GTK_ALG_TFTP");
      var h323 = document.getElementById("DeviceNATX_GTK_ALG_H323");
      var sip = document.getElementById("DeviceNATX_GTK_ALG_SIP");
      var pptp = document.getElementById("DeviceNATX_GTK_ALG_PPTP");
      var l2tp = document.getElementById("DeviceNATX_GTK_ALG_L2TP");
      var ipsec = document.getElementById("DeviceNATX_GTK_ALG_IPSec");

      var algApplyBtn = document.getElementById("ALGModify");
      var algCancelBtn = document.getElementById("ALGCancel");

      // fill data
      if (Advanced.ALG.EnableFTPALG) ftp.checked = true;
      if (Advanced.ALG.EnableTFTPALG) tftp.checked = true;
      if (Advanced.ALG.EnableH323ALG) h323.checked = true;
      if (Advanced.ALG.EnableSIPALG) sip.checked = true;
      if (Advanced.ALG.EnablePPTPPassthrough) pptp.checked = true;
      if (Advanced.ALG.EnableL2TPPassthrough) l2tp.checked = true;
      if (Advanced.ALG.EnableIPSecPassthrough) ipsec.checked = true;

      // apply click event
      algApplyBtn.addEventListener("click", () => {
        Advanced.ALG.EnableFTPALG = ftp.checked;
        Advanced.ALG.EnableTFTPALG = tftp.checked;
        Advanced.ALG.EnableH323ALG = h323.checked;
        Advanced.ALG.EnableSIPALG = sip.checked;
        Advanced.ALG.EnablePPTPPassthrough = pptp.checked;
        Advanced.ALG.EnableL2TPPassthrough = l2tp.checked;
        Advanced.ALG.EnableIPSecPassthrough = ipsec.checked;
        var cloneData = deepCopyObject(Advanced.ALG);
        console.log(cloneData);
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.MODIFY,
          cloneData,
          Advanced,
          ""
        );
      });

      algCancelBtn.addEventListener("click", () => {
        applyThenStoreToLS("advanced-alg.html", algCancelBtn.value);
      });
      break;
    case "advanced-ddns.html":
      console.log(`Load ${page}`, Advanced.DDNS);
      var enableDDNS = document.getElementById("EnableDDNS");
      var serviceProvider = document.getElementById("Server");
      var localWAN = document.getElementById("Interface");
      var username = document.getElementById("Username");
      var password = document.getElementById("Password");
      var domainName = document.getElementById("Name");

      var pwdEye = document.getElementById("pwdEye");
      var ddnsApplyBtn = document.getElementById("DDNSModify");
      var ddnsCancelBtn = document.getElementById("DDNSCancel");

      // fill data
      enableDDNS.checked = Advanced.DDNS.EnableDDNS;
      if (enableDDNS.checked) {
        document
          .getElementById("connectionStatusOn")
          .classList.remove("ng-hide");
        document.getElementById("connectionStatusOff").classList.add("ng-hide");
      } else {
        document
          .getElementById("connectionStatusOff")
          .classList.remove("ng-hide");
        document.getElementById("connectionStatusOn").classList.add("ng-hide");
      }
      ``;
      serviceProvider.value = Advanced.DDNS.ServiceProvider;

      // load WAN interface from Basic --> WAN --> IPv4
      var countOptionValue = 1;
      for (const elem of Basic.WAN.Interfaces) {
        const option = document.createElement("option");
        option.text = elem.Name;
        option.value = countOptionValue;
        countOptionValue += 1;
        localWAN.appendChild(option);
      }

      localWAN.value = Advanced.DDNS.LocalWanInterface;
      username.value = Advanced.DDNS.Username;
      password.value = Advanced.DDNS.Password;
      domainName.value = Advanced.DDNS.DomainName;

      /** Add required field event trigger */
      serviceProvider.addEventListener("input", () => {
        checkError_selectField(
          serviceProvider,
          document.getElementById("empty_error_server")
        );
      });

      localWAN.addEventListener("input", () => {
        checkError_selectField(
          localWAN,
          document.getElementById("empty_error_interface")
        );
      });

      username.addEventListener("input", () => {
        checkError_inputField(
          username,
          document.getElementById("empty_error_username"),
          document.getElementById("exceed_error_username")
        );
      });

      password.addEventListener("input", () => {
        checkError_inputField(
          password,
          document.getElementById("empty_error_password"),
          document.getElementById("exceed_error_password")
        );
      });

      domainName.addEventListener("input", () => {
        checkEmpty_inputField(
          domainName,
          document.getElementById("empty_error_domainName")
        );
      });

      pwdEye.addEventListener("click", () => {
        hide_show_pw(pwdEye, password);
      });

      // event on Apply and CancelConnectionType
      ddnsApplyBtn.addEventListener("click", () => {
        if (checkError_show(document.querySelectorAll(".error"))) {
          Advanced.DDNS.EnableDDNS = enableDDNS.checked;
          Advanced.DDNS.ServiceProvider = serviceProvider.value;
          Advanced.DDNS.LocalWanInterface = localWAN.value;
          Advanced.DDNS.Username = username.value;
          Advanced.DDNS.Password = password.value;
          Advanced.DDNS.DomainName = domainName.value;
          var cloneData = deepCopyObject(Advanced.DDNS);
          cloneData.LocalWanInterface = getInterfaceObject(textContentConverting(localWAN, Advanced.DDNS.LocalWanInterface));
          cloneData.ServiceProvider = Advanced.DDNS.ServiceProvider;
          console.log(cloneData);
          httpService.send_POST_Request(
            page,
            COMMAND.USER_CONFIG_DATA.MODIFY,
            cloneData,
            Advanced,
            ""
          );
        }
        console.log("Advanced.DDNS: Apply fail");
      });

      ddnsCancelBtn.addEventListener("click", () => {
        applyThenStoreToLS("advanced-ddns.html", ddnsCancelBtn.value);
      });

      break;
    case "advanced-device_management.html":
      console.log(`Load ${page}`, Advanced.DeviceManagement);
      var enaCWMP = document.getElementById(
        "DeviceManagementServer_EnableCWMP"
      );
      var localWANInterfaceSelect = document.getElementById("X_GTK_Interface");
      var acsUrl = document.getElementById("URL");
      var acsUsername = document.getElementById("Username");
      var acsPassword = document.getElementById(
        "DeviceManagementServerPassword"
      );
      var connectionRequestURL = document.getElementById(
        "ConnectionRequestURL"
      );

      var pwd_Eye = document.getElementById("icon_pw");
      var connectionReqUsername = document.getElementById(
        "ConnectionRequestUsername"
      );
      var connectionReqPwd = document.getElementById(
        "DeviceManagementServerConnectionRequestPassword"
      );
      var pwdEye2 = document.getElementById("icon_pw_2");
      var enaPerodic = document.getElementById(
        "DeviceManagementServer_PeriodicInformEnable"
      );
      var perocdicInterval = document.getElementById("PeriodicInformInterval");

      var initEvent = () => {
        pwd_Eye.addEventListener("click", () => {
          hide_show_pw(pwd_Eye, acsPassword);
        });

        pwdEye2.addEventListener("click", () => {
          hide_show_pw(pwdEye2, connectionReqPwd);
        });

        perocdicInterval.addEventListener("input", () => {
          checkMinMaxError_inputField(
            perocdicInterval,
            document.getElementById("lowLimit_error"),
            document.getElementById("upLimit_error"),
            document.getElementById("invalid_error")
          );
        });

        localWANInterfaceSelect.addEventListener("change", () => {
          checkError_selectField(
            localWANInterfaceSelect,
            document.getElementById("select_error")
          );
        });
      };

      // fill data
      var fillData = () => {
        enaCWMP.checked = Advanced.DeviceManagement.EnaCWMP;

        let countValue = 0;
        for (const elem of Basic.WAN.Interfaces) {
          var optionElement = document.createElement("option");
          optionElement.value = countValue; // as value, corresponds to index of itself in SSIDs array
          countValue += 1;
          optionElement.label = elem.Name;
          optionElement.textContent = elem.Name;
          localWANInterfaceSelect.appendChild(optionElement);
        }
        localWANInterfaceSelect.value =
          Advanced.DeviceManagement.LocalWANInterface;

        acsUrl.value = Advanced.DeviceManagement.ACSURL;
        acsUsername.value = Advanced.DeviceManagement.ACSUsername;
        acsPassword.value = Advanced.DeviceManagement.ACSPassword;
        connectionRequestURL.value =
          Advanced.DeviceManagement.ConnectionReqURL || "";
        connectionReqUsername.value =
          Advanced.DeviceManagement.ConnectionReqUsername;
        connectionReqPwd.value = Advanced.DeviceManagement.ConnectionReqPasword;
        enaPerodic.checked = Advanced.DeviceManagement.EnaPerodic;
        perocdicInterval.value = Advanced.DeviceManagement.PerodicInterval;
      };

      initEvent();
      fillData();

      // Send Inform actively
      document.getElementById("SendInform").addEventListener("click", () => {
        if (checkError_show(document.querySelectorAll(".error"))) {
          Advanced.DeviceManagement.EnaCWMP = enaCWMP.checked;
          Advanced.DeviceManagement.LocalWANInterface =
            localWANInterfaceSelect.value;
          Advanced.DeviceManagement.ACSURL = acsUrl.value;
          Advanced.DeviceManagement.ACSUsername = acsUsername.value;
          Advanced.DeviceManagement.ACSPassword = acsPassword.value;
          Advanced.DeviceManagement.ConnectionReqUsername =
            connectionReqUsername.value;
          Advanced.DeviceManagement.ConnectionReqPasword =
            connectionReqPwd.value;
          Advanced.DeviceManagement.EnaPerodic = enaPerodic.checked;
          Advanced.DeviceManagement.PerodicInterval = perocdicInterval.value;

          // create body for post request
          var cloneData = Object.assign({}, Advanced.DeviceManagement);
          cloneData.LocalWANInterface =
            Basic.WAN.Interfaces[parseInt(cloneData.LocalWANInterface)].Name; // mapping value with actual Interface
          var subOption = "";
          // connect ACS server
          httpService.send_POST_Request(
            page,
            COMMAND.SEND_INFORM,
            cloneData,
            Advanced,
            subOption
          );
        }
      });

      // Apply and Cancel button
      document.getElementById("Modify").addEventListener("click", () => {
        if (checkError_show(document.querySelectorAll(".error"))) {
          Advanced.DeviceManagement.EnaCWMP = enaCWMP.checked;
          Advanced.DeviceManagement.LocalWANInterface =
            localWANInterfaceSelect.value;
          Advanced.DeviceManagement.ACSURL = acsUrl.value;
          Advanced.DeviceManagement.ACSUsername = acsUsername.value;
          Advanced.DeviceManagement.ACSPassword = acsPassword.value;
          Advanced.DeviceManagement.ConnectionReqUsername =
            connectionReqUsername.value;
          Advanced.DeviceManagement.ConnectionReqPasword =
            connectionReqPwd.value;
          Advanced.DeviceManagement.EnaPerodic = enaPerodic.checked;
          Advanced.DeviceManagement.PerodicInterval = perocdicInterval.value;

          // create body for post request
          var cloneData = Object.assign({}, Advanced.DeviceManagement);
          cloneData.LocalWANInterface =
            Basic.WAN.Interfaces[parseInt(cloneData.LocalWANInterface)].Name; // mapping value with actual Interface
          var subOption = "";
          // connect ACS server
          httpService.send_POST_Request(
            page,
            COMMAND.CONNECT_ACS,
            cloneData,
            Advanced,
            subOption
          );
        } else {
          console.log("Apply fail");
        }
      });

      document.getElementById("Cancel", () => {
        applyThenStoreToLS(page, "Cancel");
      });
      break;
    case "advanced-dmz.html":
      console.log(`Load ${page}`, Advanced.DMZ);

      var enaDMZ = document.getElementById("DeviceNATX_GTK_DMZ_Enable");
      var ipAddr = document.getElementById("IPAddress");
      var ipError = document.getElementById("invalid_ip_error");

      // fill data
      enaDMZ.checked = Advanced.DMZ.EnableDMZ;
      ipAddr.value = Advanced.DMZ.IPAddr;

      document.getElementById("Cancel").addEventListener("click", () => {
        applyThenStoreToLS("advanced-dmz.html", "Cancel");
      });

      function testIPvalid(input_IP, dev_IP, start_IP, end_IP, subnetmask) {
        var ipComponents = dev_IP.split(".");
        var subnetComponents = subnetmask.split(".");
        var inputComponents = input_IP.split(".");

        /**
         * Method: IP AND subnetmask === deviceIP AND subnetmask --> at the same network
         */
        for (var i = 0; i < ipComponents.length; i++) {
          if (
            (parseInt(ipComponents[i]) & parseInt(subnetComponents[i])) !=
            (parseInt(inputComponents[i]) & parseInt(subnetComponents[i]))
          ) {
            ipError.textContent =
              "Invalid DMZ IP address, please check device IP and Subnet Mask";
            return false;
          }
        }
        // pass Network address pattern --> test range IP
        var startComponents = start_IP.split(".");
        var endComponents = end_IP.split(".");

        if (
          parseInt(startComponents[3]) > parseInt(inputComponents[3]) ||
          parseInt(endComponents[3]) < parseInt(inputComponents[3])
        ) {
          ipError.textContent = `Invalid DMZ IP address, valid range for IP address from: ${start_IP} to ${end_IP}`;
          return false;
        }
        return true;
      }

      function errorHandleDMZIP() {
        if (
          testIPvalid(
            ipAddr.value.toString(),
            Basic.LAN.IPv4Configuration.DeviceIPAddress,
            Basic.LAN.IPv4Configuration.BeginAddress,
            Basic.LAN.IPv4Configuration.EndAddress,
            Basic.LAN.IPv4Configuration.SubnetMask
          )
        ) {
          ipError.classList.add("ng-hide");
        } else {
          ipError.classList.remove("ng-hide");
        }
      }

      ipAddr.addEventListener("input", () => {
        errorHandleDMZIP();
      });

      document.getElementById("Apply").addEventListener("click", () => {
        errorHandleDMZIP();

        if (checkError_show(ipError)) {
          Advanced.DMZ.EnableDMZ = enaDMZ.checked;
          Advanced.DMZ.IPAddr = ipAddr.value;
          var cloneData = deepCopyObject(Advanced.DMZ);
          console.log(cloneData);
          httpService.send_POST_Request(
            page,
            COMMAND.USER_CONFIG_DATA.MODIFY,
            cloneData,
            Advanced,
            ""
          );
        } else {
          console.log("Apply fail");
        }
      });
      break;
    case "advanced-multicast-ipv4Setting.html":
      console.log(`Load ${page}`, Advanced.Multicast);

      var fastLeave = document.getElementById(
        "DeviceX_GTK_McastIGMPParameters_FastLeaveStatus"
      );
      var groupQInterval = document.getElementById("QueryRespInterval");
      var groupLInterval = document.getElementById("LastMemQueryInterval");
      var groupLCount = document.getElementById("LastMemQueryCount");

      var fillData = () => {
        fastLeave.checked = Advanced.Multicast.FastLeave;
        groupQInterval.value = Advanced.Multicast.GroupQInterval;
        groupLInterval.value = Advanced.Multicast.GroupLInterval;
        groupLCount.value = Advanced.Multicast.GroupLCount;
      };

      var initEvent = () => {
        groupQInterval.addEventListener("input", () => {
          checkEmpty_inputField(
            groupQInterval,
            document.getElementById("invalid_groupQInterval_error")
          );
        });

        groupLInterval.addEventListener("click", () => {
          checkEmpty_inputField(
            groupLInterval,
            document.getElementById("invalid_groupLInterval_error")
          );
        });

        groupLCount.addEventListener("input", () => {
          checkEmpty_inputField(
            groupLCount,
            document.getElementById("invalid_groupLCount_error")
          );
        });
      };

      fillData();
      initEvent();

      document.getElementById("Cancel").addEventListener("click", () => {
        applyThenStoreToLS("advanced-multicast-ipv4Setting.html", "Cancel");
      });

      document.getElementById("Modify").addEventListener("click", () => {
        if (checkError_show(document.querySelectorAll(".error"))) {
          Advanced.Multicast.FastLeave = fastLeave.checked;
          Advanced.Multicast.GroupQInterval = groupQInterval.value;
          Advanced.Multicast.GroupLInterval = groupLInterval.value;
          Advanced.Multicast.GroupLCount = groupLCount.value;

          // applyThenStoreToLS(
          //   "advanced-multicast-ipv4Setting.html",
          //   "Apply",
          //   Advanced
          // );

          // create body for post request
          var cloneData = deepCopyObject(Advanced.Multicast);
          httpService.send_POST_Request(
            page,
            COMMAND.USER_CONFIG_DATA.MODIFY,
            cloneData,
            Advanced,
            ""
          );
        }
      });

      break;
    case "advanced-multicast.html":
      console.log(`Load ${page}`, Advanced.Multicast);
      var igmpProxy = document.getElementById(
        "DeviceX_GTK_McastIGMPParameters_ProxyStatus"
      );
      var snooping = document.getElementById(
        "DeviceX_GTK_McastIGMPParameters_SnoopingStatus"
      );
      var upstreamList = document.getElementById(
        "DeviceX_GTK_Mcast_UpStreamIntrfName"
      );
      var downStreamList = document.getElementById(
        "DeviceX_GTK_Mcast_DownStreamIntrf"
      );

      var upElemTemplate = document.getElementById("up_element_template");
      var downElemTemplate = document.getElementById("down_element_template");
      var numberOfWAN = Basic.WAN.Interfaces.length;

      var fillData = () => {
        igmpProxy.checked = Advanced.Multicast.IGMPProxy;
        snooping.checked = Advanced.Multicast.Snooping;

        console.log(`Number of WAN interfaces: ${numberOfWAN}`);
        for (let i = 0; i < numberOfWAN; i++) {
          const clone = upElemTemplate.content.cloneNode(true);

          clone.firstElementChild.childNodes[1].id = i;
          clone.firstElementChild.childNodes[2].htmlFor = i;

          clone.firstElementChild.childNodes[1].checked =
            Advanced.Multicast.UpstreamInterface[i];
          clone.firstElementChild.childNodes[2].textContent =
            Basic.WAN.Interfaces[i].Name;

          upstreamList.appendChild(clone);
        }

        // for (const elem of Advanced.Multicast.DownStreamInterface) {
        document.getElementById("DownStreamIntrf1").checked =
          Advanced.Multicast.DownStreamInterface[0];
        // }
      };

      fillData();

      document.getElementById("Cancel").addEventListener("click", () => {
        applyThenStoreToLS("advanced-multicast.html", "Cancel");
      });

      document.getElementById("Modify").addEventListener("click", () => {
        // get data
        Advanced.Multicast.IGMPProxy = igmpProxy.checked;
        Advanced.Multicast.Snooping = snooping.checked;

        Advanced.Multicast.UpstreamInterface.length = 0;
        for (var i = 0; i < numberOfWAN; i++) {
          Advanced.Multicast.UpstreamInterface.push(
            document.getElementById(i).checked
          );
        }

        console.log(` Apply: ${JSON.stringify(Advanced.Multicast)}`);
        Advanced.Multicast.DownStreamInterface.length = 0;
        Advanced.Multicast.DownStreamInterface.push(
          document.getElementById("DownStreamIntrf1").checked
        );

        // applyThenStoreToLS("advanced-multicast.html", "Apply", Advanced);

        // create body for post request
        var cloneData = deepCopyObject(Advanced.Multicast);
        cloneData.UpstreamInterface = [];
        cloneData.DownStreamInterface = [];
        for (const index in Advanced.Multicast.UpstreamInterface){
          Advanced.Multicast.UpstreamInterface[index] ? cloneData.UpstreamInterface.push(Basic.WAN.Interfaces[index].Name) : "";
        }
        Advanced.Multicast.DownStreamInterface[0] ? cloneData.DownStreamInterface.push("br-lan") : "";
        httpService.send_POST_Request(
        page,
        COMMAND.USER_CONFIG_DATA.MODIFY,
        cloneData,
        Advanced,
        ""
        );
      });
      break;
    case "advanced-port_mapping-add.html":
      console.log(`Load ${page}`, Advanced.PortMapping);
      var oldLength = Advanced.PortMapping.data.length;
      var subOption;
      var isAddRule = false;
      if (Advanced.PortMapping.onEdit != "") {
        filledData = Advanced.PortMapping.data.find(
          (obj) => obj.NameOfRule === Advanced.PortMapping.onEdit
        );
        for (var i = 0; i < Advanced.PortMapping.data.length; i++) {
          if (Advanced.PortMapping.onEdit === Advanced.PortMapping.data[i].NameOfRule) {
            subOption = i;
          }
        }
      } else {
        isAddRule = true;
        filledData = {
          NameOfRule: "",
          Enable: true,
          IPv4: "",
          Interface: "?",
          PortRange: [null, null],
          Protocol: "TCP",
          IPAddr: "",
          Port: "",
        };
      }
      console.log("filledData", filledData);

      var nameOfRule = document.getElementById("portAddRuleName");
      var enableRule = document.getElementById(
        "DeviceNATPortMapping_Enableresponsestatus"
      );
      var ipv4 = document.getElementById("host");
      var showSelectInterface = document.getElementById("showSelectInterface");
      var interfaceSelect = document.getElementById("virtualinreface");
      var allInterfaceCheck = document.getElementById(
        "DeviceNATPortMapping_AllInterfaces"
      );
      var startPort = document.getElementById("startport");
      var endPort = document.getElementById("endportrange");
      var protocolSelect = document.getElementById("virtualprotocol");
      var IPaddr = document.getElementById("client");
      var port = document.getElementById("internalport");

      var fillData = function () {
        nameOfRule.value = filledData.NameOfRule;
        enableRule.checked = filledData.Enable;
        ipv4.value = filledData.IPv4;

        for (const elem of Basic.WAN.Interfaces) {
          var optionElement = document.createElement("option");
          optionElement.value = elem.Name; // as value, corresponds to index of itself in SSIDs array
          optionElement.label = elem.Name;
          optionElement.textContent = elem.Name;
          interfaceSelect.appendChild(optionElement);
        }

        if (filledData.Interface == "All") {
          allInterfaceCheck.checked = true;
          showSelectInterface.classList.add("ng-hide");
          document
            .getElementById("interface_select_error")
            .classList.add("ng-hide");
          console.log(
            document.getElementById("interface_select_error").classList
          );
        } else {
          showSelectInterface.classList.remove("ng-hide");
          interfaceSelect.value = filledData.Interface;
          checkError_selectField(
            interfaceSelect,
            document.getElementById("interface_select_error")
          );
        }
        startPort.value = filledData.PortRange[0];
        endPort.value = filledData.PortRange[1];
        protocolSelect.value = filledData.Protocol;
        IPaddr.value = filledData.IPAddr;
        port.value = filledData.Port;

        // check Error (in case add so need to check empty)
        checkPattern_inputField(
          nameOfRule,
          new RegExp(nameOfRule.getAttribute("pattern")),
          document.getElementById("invalid_name_error"),
          document.getElementById("empty_name_error")
        );

        checkPattern_inputField(
          ipv4,
          new RegExp(ipv4.getAttribute("pattern")),
          document.getElementById("invalid_ipv4_error"),
          document.getElementById("empty_ipv4_error")
        );

        checkMinMaxError_inputField(
          startPort,
          document.getElementById("min_start_error"),
          document.getElementById("max_start_error"),
          document.getElementById("empty_start_error")
        );

        checkMinMaxError_inputField(
          endPort,
          document.getElementById("min_end_error"),
          document.getElementById("max_end_error"),
          document.getElementById("empty_end_error")
        );

        checkPattern_inputField(
          IPaddr,
          new RegExp(IPaddr.getAttribute("pattern")),
          document.getElementById("invalid_ipaddr_error"),
          document.getElementById("empty_ipaddr_error")
        );

        checkMinMaxError_inputField(
          port,
          document.getElementById("min_port_error"),
          document.getElementById("max_port_error"),
          document.getElementById("empty_port_error")
        );
      };

      // init event on element
      var initEvent = function () {
        nameOfRule.addEventListener("input", () => {
          document
            .getElementById("duplicate_name_error")
            .classList.add("ng-hide");
          checkPattern_inputField(
            nameOfRule,
            new RegExp(nameOfRule.getAttribute("pattern")),
            document.getElementById("invalid_name_error"),
            document.getElementById("empty_name_error")
          );
        });

        ipv4.addEventListener("input", () => {
          checkPattern_inputField(
            ipv4,
            new RegExp(ipv4.getAttribute("pattern")),
            document.getElementById("invalid_ipv4_error"),
            document.getElementById("empty_ipv4_error")
          );
        });

        interfaceSelect.addEventListener("change", () => {
          checkError_selectField(
            interfaceSelect,
            document.getElementById("interface_select_error")
          );
        });

        startPort.addEventListener("input", () => {
          document.getElementById("portRangeInvalid").classList.add("ng-hide");
          checkMinMaxError_inputField(
            startPort,
            document.getElementById("min_start_error"),
            document.getElementById("max_start_error"),
            document.getElementById("empty_start_error")
          );
        });

        endPort.addEventListener("input", () => {
          document.getElementById("portRangeInvalid").classList.add("ng-hide");
          checkMinMaxError_inputField(
            endPort,
            document.getElementById("min_end_error"),
            document.getElementById("max_end_error"),
            document.getElementById("empty_end_error")
          );
        });

        IPaddr.addEventListener("input", () => {
          checkPattern_inputField(
            IPaddr,
            new RegExp(IPaddr.getAttribute("pattern")),
            document.getElementById("invalid_ipaddr_error"),
            document.getElementById("empty_ipaddr_error")
          );
        });

        port.addEventListener("input", () => {
          checkMinMaxError_inputField(
            port,
            document.getElementById("min_port_error"),
            document.getElementById("max_port_error"),
            document.getElementById("empty_port_error")
          );
        });

        allInterfaceCheck.addEventListener("change", () => {
          if (allInterfaceCheck.checked == true) {
            showSelectInterface.classList.add("ng-hide");
            document
              .getElementById("interface_select_error")
              .classList.add("ng-hide");
          } else {
            checkError_selectField(
              interfaceSelect,
              document.getElementById("interface_select_error")
            );
            showSelectInterface.classList.remove("ng-hide");
          }
        });
      };

      // first fill data into FE
      fillData();

      // init event on each element
      initEvent();

      document.getElementById("Close").addEventListener("click", () => {
        applyThenStoreToLS("advanced-port_mapping.html", "Cancel");
      });

      function verifyRule() {
        const currentRules = Advanced.PortMapping.data.filter(
          (obj) => obj.NameOfRule !== Advanced.PortMapping.onEdit
        );
        console.log("Current rule: ", currentRules);
        // step 1: check name
        // check name of rule if it is duplicated
        for (const elem of currentRules) {
          if (nameOfRule.value === elem.NameOfRule) {
            document
              .getElementById("duplicate_name_error")
              .classList.remove("ng-hide");
            console.log("Check rule false Step 1");
            return false;
          }
        }

        // step 2: check Port range && interface && protocol
        //check port range
        if (parseInt(endPort.value) < parseInt(startPort.value)) {
          document
            .getElementById("portRangeInvalid")
            .classList.remove("ng-hide");
          return false;
        }
        var onPageInterface;
        allInterfaceCheck.checked
          ? (onPageInterface = "All")
          : (onPageInterface = interfaceSelect.value);
        for (const elem of currentRules) {
          if (
            elem.PortRange[0] == startPort.value.toString() &&
            elem.PortRange[1] == endPort.value.toString() &&
            elem.Interface === onPageInterface &&
            elem.Protocol === protocolSelect.value
          ) {
            document
              .getElementById("duplicate_name_error")
              .classList.remove("ng-hide");
            console.log("Check rule false Step 2");
            return false;
          }
        }

        // step 3: check all infor
        for (const elem of currentRules) {
          if (
            nameOfRule.value === elem.NameOfRule &&
            elem.PortRange[0] === startPort.value.toString() &&
            elem.PortRange[1] === endPort.value.toString() &&
            elem.Interface === onPageInterface &&
            elem.IPv4 === ipv4.value &&
            elem.IPAddr === IPaddr.value &&
            elem.Port === port.value.toString() &&
            elem.Protocol === protocolSelect.value
          ) {
            document
              .getElementById("duplicate_name_error")
              .classList.remove("ng-hide");
            console.log("Check rule false Step 3");
            return false;
          }
        }
        document
          .getElementById("duplicate_name_error")
          .classList.add("ng-hide");
        return true;
      }

      document.getElementById("Apply").addEventListener("click", () => {
        if (
          verifyRule() &&
          checkError_show(document.querySelectorAll(".error"))
        ) {
          filledData.NameOfRule = nameOfRule.value;
          filledData.Enable = enableRule.checked;
          filledData.IPv4 = ipv4.value;

          if (allInterfaceCheck.checked == true) {
            filledData.Interface = "All";
          } else {
            filledData.Interface = interfaceSelect.value;
          }
          filledData.PortRange[0] = startPort.value;
          filledData.PortRange[1] = endPort.value;
          filledData.IPAddr = IPaddr.value;
          filledData.Port = port.value;

          if (isAddRule) {
            Advanced.PortMapping.data.push(filledData);
            subOption = oldLength;

          }
          var cloneData = deepCopyObject(Advanced.PortMapping.data);
          if (filledData.Interface === "All") {
            cloneData[subOption].Interface = "All";
          } else {
            cloneData[subOption].Interface = getInterfaceObject(interfaceSelect.value);
          }
          if (isAddRule) {
            httpService.send_POST_Request(
              page,
              COMMAND.USER_CONFIG_DATA.ADD,
              cloneData[parseInt(subOption)],
              Advanced,
              subOption,
              "advanced-port_mapping.html"
            );
          } else {
            httpService.send_POST_Request(
              page,
              COMMAND.USER_CONFIG_DATA.MODIFY,
              cloneData[parseInt(subOption)],
              Advanced,
              subOption,
              "advanced-port_mapping.html"
            );
          }
          console.log(cloneData);
        } else {
          console.log("Apply fail");
        }
      });
      break;
    case "advanced-port_mapping.html":
      console.log(`Load ${page}`, Advanced.PortMapping);

      var filledData = Advanced.PortMapping.data;

      var addBtn = document.getElementById("Device.NAT.PortMapping");
      var tbody = document.getElementById("bodyData");
      var rowElem = document.getElementById("rowElem");

      // fill data
      for (const [index, elem] of filledData.entries()) {
        const tr = rowElem.content.cloneNode(true);
        tr.querySelector("tr").setAttribute("index", index);

        elem.Enable
          ? tr.querySelector(".enable").classList.add("gemtek-enabled")
          : tr.querySelector(".enable").classList.add("gemtek-disabled");
        tr.querySelector(".name").textContent = elem.NameOfRule;
        tr.querySelector(".interface").textContent = elem.Interface;
        tr.querySelector(".remote").textContent = elem.IPv4;
        tr.querySelector(".startPort").textContent = elem.PortRange[0];
        tr.querySelector(".endPort").textContent = elem.PortRange[1];
        tr.querySelector(".internalPort").textContent = elem.Port;
        tr.querySelector(".protocol").textContent = elem.Protocol;
        tr.querySelector(".lan").textContent = elem.IPAddr;

        const editBtn = tr.querySelector(".editBtn");
        const deleteBtn = tr.querySelector(".deleteBtn");

        editBtn.addEventListener("click", () => {
          Advanced.PortMapping.onEdit = editBtn
            .closest("tr")
            .querySelector(".name")
            .textContent.trim();
          applyThenStoreToLS(
            "advanced-port_mapping-add.html",
            "Apply",
            Advanced
          ); // do not need modify anything so Cancel is make sense
        });

        deleteBtn.addEventListener("click", () => {
          var deletedRow = deleteBtn.closest("tr");
          var index = deleteBtn.closest("tr").getAttribute("index");
          deleteDialogHandle(
            deletedRow,
            "Delete Port Rule",
            "Are you sure you want to Delete ?"
          )
            .then(() => {
              filledData.splice(deletedRow.rowIndex - 1, 1); // the name of column is index 0
              var cloneData = deepCopyObject(Advanced.PortMapping.data);
              var subOption = index;
              console.log(cloneData);
              httpService.send_POST_Request(
                page,
                COMMAND.USER_CONFIG_DATA.DELETE,
                cloneData,
                Advanced,
                subOption
              );
            })
            .catch(() => {
              console.log("Cancel delete");
            });
        });

        tbody.appendChild(tr);
      }

      // init event
      addBtn.addEventListener("click", () => {
        Advanced.PortMapping.onEdit = "";
        applyThenStoreToLS("advanced-port_mapping-add.html", "Apply", Advanced);
      });

      break;
    case "advanced-port_triggering-add.html":
      console.log(`Load ${page}`, Advanced.PortTriggering);

      var oldLength = Advanced.PortTriggering.Rules.length;
      var filledData;
      var addFlag = false;
      if (Advanced.PortTriggering.onEdit === "") {
        addFlag = true;
        filledData = {
          EnaRule: true,
          TrigerPort: "",
          TrigerPortRange: "",
          TrigerProtocol: "0",
          IncomingPort: "",
          IncomingPortRange: "",
          IncomingProtocol: "0",
        };
      } else {
        filledData =
          Advanced.PortTriggering.Rules[
          parseInt(Advanced.PortTriggering.onEdit)
          ];
      }

      console.log(`filledData: ${JSON.stringify(filledData)}`);

      var enaRule = document.getElementById(
        "DeviceNATX_GTK_PortTriggering_Enable"
      );
      var triggerPort = document.getElementById("TriggerPort");
      var triggerPortRange = document.getElementById("TriggerPortEndRange");
      var triggerProtocol = document.getElementById("TriggerProtocol");
      var incomingPort = document.getElementById("OpenPort");
      var incomingPortRange = document.getElementById("OpenPortEndRange");
      var incomingPortProtocol = document.getElementById("OpenProtocol");

      var fillData = () => {
        enaRule.checked = filledData.EnaRule;
        triggerPort.value = filledData.TrigerPort;
        triggerPortRange.value = filledData.TrigerPortRange;
        triggerProtocol.value = filledData.TrigerProtocol;
        incomingPort.value = filledData.IncomingPort;
        incomingPortRange.value = filledData.IncomingPortRange;
        incomingPortProtocol.value = filledData.IncomingProtocol;

        // check errror in case it's Add new
        checkMinMaxError_inputField(
          triggerPort,
          document.getElementById("lowLimit_triggerPort_error"),
          document.getElementById("upLimit_triggerPort_error"),
          document.getElementById("invalid_triggerPort_error")
        );
        checkMinMaxError_inputField(
          triggerPortRange,
          document.getElementById("lowLimit_triggerRange_error"),
          document.getElementById("upLimit_triggerRange_error"),
          document.getElementById("invalid_triggerRange_error")
        );
        checkMinMaxError_inputField(
          incomingPort,
          document.getElementById("lowLimit_incoming_error"),
          document.getElementById("upLimit_incoming_error"),
          document.getElementById("invalid_incoming_error")
        );
        checkMinMaxError_inputField(
          incomingPortRange,
          document.getElementById("lowLimit_incomingRange_error"),
          document.getElementById("upLimit_incomingRange_error"),
          document.getElementById("invalid_incomingRange_error")
        );
      };

      var initEvent = () => {
        triggerPort.addEventListener("input", () => {
          checkMinMaxError_inputField(
            triggerPort,
            document.getElementById("lowLimit_triggerPort_error"),
            document.getElementById("upLimit_triggerPort_error"),
            document.getElementById("invalid_triggerPort_error")
          );
        });

        triggerPortRange.addEventListener("input", () => {
          checkMinMaxError_inputField(
            triggerPortRange,
            document.getElementById("lowLimit_triggerRange_error"),
            document.getElementById("upLimit_triggerRange_error"),
            document.getElementById("invalid_triggerRange_error")
          );
        });

        incomingPort.addEventListener("input", () => {
          checkMinMaxError_inputField(
            incomingPort,
            document.getElementById("lowLimit_incoming_error"),
            document.getElementById("upLimit_incoming_error"),
            document.getElementById("invalid_incoming_error")
          );
        });

        incomingPortRange.addEventListener("input", () => {
          checkMinMaxError_inputField(
            incomingPortRange,
            document.getElementById("lowLimit_incomingRange_error"),
            document.getElementById("upLimit_incomingRange_error"),
            document.getElementById("invalid_incomingRange_error")
          );
        });
      };

      fillData();
      initEvent();

      // apply & cancel button
      document.getElementById("Close").addEventListener("click", () => {
        applyThenStoreToLS("advanced-port_triggering.html", "Cancel");
      });

      document.getElementById("Add").addEventListener("click", () => {
        if (checkError_show(document.querySelectorAll(".error"))) {
          // take data
          filledData.EnaRule = enaRule.checked;
          filledData.TrigerPort = triggerPort.value;
          filledData.TrigerPortRange = triggerPortRange.value;
          filledData.TrigerProtocol = triggerProtocol.value;
          filledData.IncomingPort = incomingPort.value;
          filledData.IncomingPortRange = incomingPortRange.value;
          filledData.IncomingProtocol = incomingPortProtocol.value;

          if (addFlag === true) Advanced.PortTriggering.Rules.push(filledData);

          var subOption;
          var cloneData = deepCopyObject(Advanced.PortTriggering.Rules);
          cloneData.forEach((dataItem, index) => {
            dataItem.TrigerProtocol = textContentConverting(
              triggerProtocol,
              dataItem.TrigerProtocol
            );
            dataItem.IncomingProtocol = textContentConverting(
              incomingPortProtocol,
              dataItem.IncomingProtocol
            );
          });
          console.log(cloneData);
          if (addFlag === true) {
            subOption = oldLength;
            httpService.send_POST_Request(
              page,
              COMMAND.USER_CONFIG_DATA.ADD,
              cloneData[parseInt(subOption)],
              Advanced,
              subOption,
              "advanced-port_triggering.html"
            );
          } else {
            subOption = Advanced.PortTriggering.onEdit;
            httpService.send_POST_Request(
              page,
              COMMAND.USER_CONFIG_DATA.MODIFY,
              cloneData[parseInt(subOption)],
              Advanced,
              subOption,
              "advanced-port_triggering.html"
            );
          }
        } else {
          console.log("Apply fail");
        }
      });
      break;
    case "advanced-port_triggering.html":
      console.log(`Load ${page}`, Advanced.PortTriggering);

      var tbody = document.getElementById("bodyData");
      var ruleElem = document.getElementById("ruleTemplate");

      var fillData = () => {
        for (const [index, elem] of Advanced.PortTriggering.Rules.entries()) {
          const tr = ruleElem.content.cloneNode(true);
          tr.querySelector("tr").setAttribute("index", index);

          const enaRule = tr.querySelector(".enaRule");
          const triggerPort = tr.querySelector(".triggerPort");
          const triggerRange = tr.querySelector(".triggerRange");
          const triggerProtocol = tr.querySelector(".triggerProtocol");
          const incoming = tr.querySelector(".incoming");
          const incomingRage = tr.querySelector(".incomingRange");
          const incomingProtocol = tr.querySelector(".incomingProtocol");

          const editBtn = tr.querySelector(".editBtn");
          const deleteBtn = tr.querySelector(".deleteBtn");

          elem.EnaRule
            ? enaRule.classList.add("gemtek-enabled")
            : enaRule.classList.add("gemtek-disabled");
          triggerPort.textContent = elem.TrigerPort;
          triggerRange.textContent = elem.TrigerPortRange;
          if (elem.TrigerProtocol == "0") triggerProtocol.textContent = "TCP";
          else triggerProtocol.textContent = "UDP";

          incoming.textContent = elem.IncomingPort;
          incomingRage.textContent = elem.IncomingPortRange;
          if (elem.IncomingProtocol == "0")
            incomingProtocol.textContent = "TCP";
          else incomingProtocol.textContent = "UDP";

          editBtn.addEventListener("click", () => {
            var index = editBtn.closest("tr").getAttribute("index");
            Advanced.PortTriggering.onEdit = parseInt(index);
            applyThenStoreToLS(
              "advanced-port_triggering-add.html",
              "Apply",
              Advanced
            );
          });

          deleteBtn.addEventListener("click", () => {
            var index = deleteBtn.closest("tr").getAttribute("index");
            if (window.confirm("Are you sure you want to Delete ?")) {
              Advanced.PortTriggering.Rules.splice(
                parseInt(index), // because the first line is text of name
                1
              );
              var cloneData = deepCopyObject(Advanced.PortTriggering.Rules);
              var subOption = index;
              page = "advanced-port_triggering.html";
              console.log(cloneData);
              httpService.send_POST_Request(
                page,
                COMMAND.USER_CONFIG_DATA.DELETE,
                cloneData,
                Advanced,
                subOption
              );
            }
          });

          tbody.appendChild(tr);
        }
      };

      document
        .getElementById("Device.NAT.X_GTK_PortTriggering")
        .addEventListener("click", () => {
          Advanced.PortTriggering.onEdit = "";
          applyThenStoreToLS(
            "advanced-port_triggering-add.html",
            "Apply",
            Advanced
          );
        });

      fillData();
      break;
    case "advanced-static_routing.html":
      console.log(`Load ${page}`, Advanced.StaticRouting);
      var oldLength = Advanced.StaticRouting.StaticRoutingConfiguration.NumberOfEntries;
      // Function to create a new table row with the provided data
      function createNewRow(data, option, idx) {
        // Create a new table row
        let newRow = document.createElement("tr");
        newRow.className = "ng-scope";
        if (option == "ipv6") {
          let cellEn = document.createElement("td");
          cellEn.className = "no-padding-hr ng-scope";
          let spanEn = document.createElement("span");
          spanEn.className = "gemtek-enabled";
          cellEn.appendChild(spanEn);
          newRow.appendChild(cellEn);
        }
        // Add table cells with data
        for (let key in data) {
          let cell = document.createElement("td");
          cell.className = "no-padding-hr ng-scope";
          let span = document.createElement("span");
          span.textContent = data[key];
          cell.appendChild(span);
          newRow.appendChild(cell);
        }
        // Add the delete button cell
        let deleteCell = document.createElement("td");
        deleteCell.className = "no-padding-hr ng-scope";
        let deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-xs table-btn no-margin";
        deleteButton.setAttribute("name", "delete");
        deleteButton.value = option;
        deleteButton.onclick = function () {
          // if (
          //   (Advanced.StaticRouting.StaticRoutingConfiguration
          //     .NumberOfEntries === "1" &&
          //     deleteButton.value === "ipv4") ||
          //   (Advanced.StaticRouting.IPv6StaticRoutingConfiguration
          //     .NumberOfEntries === "1" &&
          //     deleteButton.value === "ipv6")
          // ) {
          //   alertDialogHandle("Cannot delete all static routing rules");
          //   return;
          // }
          document.getElementById("deletedialog").classList.remove("hide");
          document.getElementById("deletedialog").value = idx.toString();
        };
        let deleteImg = document.createElement("img");
        deleteImg.setAttribute("src", "images/icons/icon-1/delete.svg");
        deleteButton.appendChild(deleteImg);
        deleteCell.appendChild(deleteButton);
        // Add the delete dialog cell (hidden initially)
        let deleteDialogCell = document.createElement("td");
        // ... (Add the content of the delete dialog cell as needed)
        // Append cells to the row
        newRow.appendChild(deleteCell);
        newRow.appendChild(deleteDialogCell);
        return newRow;
      }

      let numberOfEntries = Number(
        Advanced.StaticRouting.StaticRoutingConfiguration.NumberOfEntries
      );
      for (let index = 0; index < numberOfEntries; index++) {
        let newStaticRoute = {
          ip: Advanced.StaticRouting.StaticRoutingConfiguration[index]
            .DestIPAddress,
          subnet:
            Advanced.StaticRouting.StaticRoutingConfiguration[index]
              .DestSubnetMask,
          gateway:
            Advanced.StaticRouting.StaticRoutingConfiguration[index]
              .GatewayIPAddress,
        };
        document
          .querySelector("#bodyData")
          .appendChild(createNewRow(newStaticRoute, "ipv4", index));
      }

      document.querySelector("#OK").onclick = () => {
        document.getElementById("deletedialog").classList.add("hide");
        let delIdx = document.getElementById("deletedialog").value;
        manageJSONData(
          Advanced,
          `StaticRouting.StaticRoutingConfiguration.${delIdx}`,
          null,
          "delete"
        );
        Advanced.StaticRouting.StaticRoutingConfiguration.NumberOfEntries = (
          Number(
            Advanced.StaticRouting.StaticRoutingConfiguration.NumberOfEntries
          ) - 1
        ).toString();

        /* Create body for post request */
        const cloneData = [];
        for (const key in Advanced.StaticRouting.StaticRoutingConfiguration) {
          if (typeof Advanced.StaticRouting.StaticRoutingConfiguration[key] == "object")
            cloneData.push(Advanced.StaticRouting.StaticRoutingConfiguration[key]);
        }
        var subOption = delIdx;
        console.log(cloneData);
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.DELETE,
          cloneData,
          Advanced,
          subOption,
          "advanced-static_routing.html"
        );
      };

      break;
    case "advanced-static_routing-add.html":
      loadWanInterfaceToSelect(document.querySelector("#Interface"));
      console.log(`Load ${page}`, Advanced.StaticRouting);

      let destIPValid = false;
      let destSubmaskValid = false;
      let destGWValid = false;
      let ifValid = false;
      let applyBtnOn = false;
      let ipv4RouteIdx = Number(
        Advanced.StaticRouting.StaticRoutingConfiguration.NumberOfEntries
      );

      function applyBtnCheck() {
        applyBtnOn =
          destGWValid && destSubmaskValid && destIPValid && ifValid
            ? true
            : false;
        document.querySelector("#Add").disabled = applyBtnOn ? false : true;
      }

      ipv4Regex =
        /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}$/;
      document.querySelector("#Add").disabled = true;
      document.querySelectorAll("input").forEach(function (input) {
        input.onkeyup = function () {
          if (input.value.length > 0) {
            if (ipv4Regex.test(input.value)) {
              switch (input.id) {
                case "DestIPAddress":
                  document.querySelector("#DestIPNotify").innerHTML = "";
                  destIPValid = true;
                  break;
                case "DestSubnetMask":
                  document.querySelector("#subMaskNotify").innerHTML = "";
                  destSubmaskValid = true;
                  break;
                default:
                  document.querySelector("#gatewayNotify").innerHTML = "";
                  destGWValid = true;
                  break;
              }
            } else {
              switch (input.id) {
                case "DestIPAddress":
                  destIPValid = false;
                  document.querySelector("#DestIPNotify").innerHTML =
                    "Invalid pattern , Example IPv4 address :192.168.1.232";
                  break;
                case "DestSubnetMask":
                  destSubmaskValid = false;
                  document.querySelector("#subMaskNotify").innerHTML =
                    "Invalid Subnet Mask! Examples: 255.X.X.X / 254.0.0.0 / 252.0.0.0 / 248.0.0.0 / 240.0.0.0 / 224.0.0.0 / 192.0.0.0 / 128.0.0.0 ...";
                  break;
                default:
                  destGWValid = false;
                  document.querySelector("#gatewayNotify").innerHTML =
                    "Invalid pattern , Example IPv4 address :192.168.1.1";
                  break;
              }
            }
          } else {
            switch (input.id) {
              case "DestIPAddress":
                document.querySelector("#DestIPNotify").innerHTML =
                  "* This Field is Required";
                destIPValid = false;
                break;
              case "DestSubnetMask":
                document.querySelector("#subMaskNotify").innerHTML =
                  "* This Field is Required";
                destSubmaskValid = false;
                break;
              default:
                document.querySelector("#gatewayNotify").innerHTML =
                  "* This Field is Required";
                destGWValid = false;
                break;
            }
          }
          applyBtnCheck();
        };
      });

      notifyErrorForSelectElement(document.getElementById("Interface"));
      document.querySelector("#Interface").onchange = function () {
        ifValid =
          document.querySelector("#Interface").value !== "?" ? true : false;
        notifyErrorForSelectElement(document.getElementById("Interface"));
        applyBtnCheck();
      };

      // get data from input and store data to DB
      document.querySelector("#Add").addEventListener("click", function () {
        var oldLength = Advanced.StaticRouting.StaticRoutingConfiguration.NumberOfEntries;
        document.querySelectorAll("input").forEach(function (input) {
          if (
            input.id === "DestIPAddress" ||
            input.id === "DestSubnetMask" ||
            input.id === "GatewayIPAddress"
          ) {
            manageJSONData(
              Advanced,
              `StaticRouting.StaticRoutingConfiguration.${ipv4RouteIdx.toString()}.${input.id
              }`,
              input.value,
              "add"
            );
          }
        });
        ipv4RouteIdx++;
        Advanced.StaticRouting.StaticRoutingConfiguration.NumberOfEntries =
          ipv4RouteIdx.toString();

        /* Create body for post request */
        var cloneData = deepCopyObject(Advanced.StaticRouting.StaticRoutingConfiguration);
        var subOption = oldLength;
        cloneData[subOption].Interface = getInterfaceObject(document.querySelector("#Interface").value);
        console.log(cloneData);
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.ADD,
          cloneData,
          Advanced,
          subOption,
          "advanced-static_routing.html"
        );
      });

      break;
    case "advanced-static_routing-ipv6Config.html":
      console.log(`Load ${page}`, Advanced.StaticRouting);

      var oldLength = Advanced.StaticRouting.IPv6StaticRoutingConfiguration.NumberOfEntries;
      let numberOfEntriesv6 = Number(
        Advanced.StaticRouting.IPv6StaticRoutingConfiguration.NumberOfEntries
      );
      for (let index = 0; index < numberOfEntriesv6; index++) {
        let newStaticRoutev6 = {
          ip: Advanced.StaticRouting.IPv6StaticRoutingConfiguration[index]
            .DestIPPrefix,
          gateway:
            Advanced.StaticRouting.IPv6StaticRoutingConfiguration[index]
              .NextHop,
        };
        document
          .querySelector("#bodyDatav6")
          .appendChild(createNewRow(newStaticRoutev6, "ipv6", index));
      }

      document.querySelector("#OKv6").onclick = () => {
        document.getElementById("deletedialog").classList.add("hide");
        let delIdx = document.getElementById("deletedialog").value;
        manageJSONData(
          Advanced,
          `StaticRouting.IPv6StaticRoutingConfiguration.${delIdx}`,
          null,
          "delete"
        );
        Advanced.StaticRouting.IPv6StaticRoutingConfiguration.NumberOfEntries =
          (
            Number(
              Advanced.StaticRouting.IPv6StaticRoutingConfiguration
                .NumberOfEntries
            ) - 1
          ).toString();

        /* Create body for post request */
        const cloneData = [];
        for (const key in Advanced.StaticRouting.IPv6StaticRoutingConfiguration) {
          if (typeof Advanced.StaticRouting.IPv6StaticRoutingConfiguration[key] == "object")
            cloneData.push(Advanced.StaticRouting.IPv6StaticRoutingConfiguration[key]);
        }
        var subOption = delIdx;
        console.log(cloneData);
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.DELETE,
          cloneData,
          Advanced,
          subOption,
          "advanced-static_routing-ipv6Config.html"
        );
      };
      break;
    case "advanced-static_routing-ipv6Config-add.html":
      console.log(`Load ${page}`, Advanced.StaticRouting);
      loadWanInterfaceToSelect(document.querySelector("#Interface"));

      let destIPValidv6 = false;
      let destGWValidv6 = false;
      let ifValidv6 = false;
      let applyBtnOnv6 = false;
      let ipv6RouteIdx = Number(
        Advanced.StaticRouting.IPv6StaticRoutingConfiguration.NumberOfEntries
      );

      function applyBtnCheckv6() {
        applyBtnOnv6 =
          destGWValidv6 && destIPValidv6 && ifValidv6 ? true : false;
        document.querySelector("#Addv6").disabled = applyBtnOnv6 ? false : true;
      }

      const ipv6Regex =
        /^\s*((([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:))|(([0-9a-fA-F]{1,4}:){6}(:[0-9a-fA-F]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-fA-F]{1,4}:){5}(((:[0-9a-fA-F]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-fA-F]{1,4}:){4}(((:[0-9a-fA-F]{1,4}){1,3})|((:[0-9a-fA-F]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-fA-F]{1,4}:){3}(((:[0-9a-fA-F]{1,4}){1,4})|((:[0-9a-fA-F]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-fA-F]{1,4}:){2}(((:[0-9a-fA-F]{1,4}){1,5})|((:[0-9a-fA-F]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-fA-F]{1,4}:){1}(((:[0-9a-fA-F]{1,4}){1,6})|((:[0-9a-fA-F]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-fA-F]{1,4}){1,7})|((:[0-9a-fA-F]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
      document.querySelector("#Addv6").disabled = true;
      document.querySelectorAll("input").forEach(function (input) {
        input.onkeyup = function () {
          if (input.value.length > 0) {
            if (ipv6Regex.test(input.value)) {
              switch (input.id) {
                case "DestIPPrefix":
                  document.querySelector("#DestIPPrefixNotify").innerHTML = "";
                  destIPValidv6 = true;
                  break;
                default:
                  document.querySelector("#nextHopNotify").innerHTML = "";
                  destGWValidv6 = true;
                  break;
              }
            } else {
              switch (input.id) {
                case "DestIPPrefix":
                  destIPValidv6 = false;
                  document.querySelector("#DestIPPrefixNotify").innerHTML =
                    "Invalid pattern, Example IPv6 address: 2001:0db8:85a3:0000:0000:8a2e:0370:7334";
                  break;
                default:
                  destGWValidv6 = false;
                  document.querySelector("#nextHopNotify").innerHTML =
                    "Invalid pattern, Example IPv6 address: 2001:0db8:85a3:0000:0000:8a2e:0370:7334";
                  break;
              }
            }
          } else {
            switch (input.id) {
              case "DestIPPrefix":
                document.querySelector("#DestIPPrefixNotify").innerHTML =
                  "* This Field is Required";
                destIPValidv6 = false;
                break;
              default:
                document.querySelector("#nextHopNotify").innerHTML =
                  "* This Field is Required";
                destGWValidv6 = false;
                break;
            }
          }
          applyBtnCheckv6();
        };
      });

      notifyErrorForSelectElement(document.getElementById("Interface"));
      document.querySelector("#Interface").onchange = function () {
        ifValidv6 =
          document.querySelector("#Interface").value !== "?" ? true : false;
        notifyErrorForSelectElement(document.getElementById("Interface"));
        applyBtnCheckv6();
      };

      // get data from input and store data to DB
      document.querySelector("#Addv6").addEventListener("click", function () {
        var oldLength = Advanced.StaticRouting.IPv6StaticRoutingConfiguration.NumberOfEntries;
        document.querySelectorAll("input").forEach(function (input) {
          if (input.id === "DestIPPrefix" || input.id === "NextHop") {
            manageJSONData(
              Advanced,
              `StaticRouting.IPv6StaticRoutingConfiguration.${ipv6RouteIdx.toString()}.${input.id
              }`,
              input.value,
              "add"
            );
          }
        });
        ipv6RouteIdx++;
        Advanced.StaticRouting.IPv6StaticRoutingConfiguration.NumberOfEntries =
          ipv6RouteIdx.toString();
        /* Create body for post request */
        var cloneData = deepCopyObject(Advanced.StaticRouting.IPv6StaticRoutingConfiguration);
        var subOption = oldLength;
        cloneData[subOption].Interface = getInterfaceObject(document.querySelector("#Interface").value);
        console.log(cloneData);
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.ADD,
          cloneData,
          Advanced,
          subOption,
          "advanced-static_routing-ipv6Config.html"
        );
      });

      break;
    case "advanced-upnp.html":
      console.log(`Load ${page}`, Advanced.UPnP);

      var enaUPnP = document.getElementById("DeviceUPnPDevice_Enable");

      // fill data
      Advanced.UPnP.EnaUPnP
        ? enaUPnP.classList.add("checked")
        : enaUPnP.classList.remove("checked");

      // event
      enaUPnP.addEventListener("click", () => {
        enaUPnP.classList.toggle("checked");
      });

      // Apply and Cancel
      document.getElementById("Cancel").addEventListener("click", () => {
        applyThenStoreToLS(page, "Cancel");
      });

      document.getElementById("Modify").addEventListener("click", () => {
        Advanced.UPnP.EnaUPnP = enaUPnP.classList.contains("checked");
        var cloneData = deepCopyObject(Advanced.UPnP);
        console.log(cloneData);
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.MODIFY,
          cloneData,
          Advanced,
          "",
        );
      });
      break;
    case "advanced-vpn.html":
      console.log(`Load ${page}`, Advanced.vpn);
      function createIpsecRow(data, index) {
        // Create <tr> element
        var tr = document.createElement("tr");
        tr.classList.add("ng-scope");
        // Iterate through data and create <td> elements
        for (var key in data) {
          var td = document.createElement("td");
          td.classList.add("no-padding-hr", "ng-scope");

          var span = document.createElement("span");
          if (key === "openwrtipsecremote_enabled") {
            if (data[key] === "on") {
              span.classList.add("gemtek-enabled");
            } else {
              span.classList.add("gemtek-disabled");
            }
          } else {
            // Create <span> element for non-array data
            var span = document.createElement("span");
            span.classList.add("ng-binding", "ng-scope");
            span.textContent = data[key];
          }
          td.appendChild(span);
          tr.appendChild(td);
        }
        // Create buttons and append to the last <td>
        var lastTd = document.createElement("td");
        lastTd.classList.add("no-padding-hr", "ng-scope");
        var editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-xs", "table-btn-txt");
        editButton.setAttribute("name", "edit");
        editButton.setAttribute("id", "openwrt.ipsec.remote.1");
        editButton.addEventListener("click", function () {
          manageJSONData(
            Advanced,
            `vpn.openwrtipsecremote.${index.toString()}.status`,
            "onchanging",
            "add"
          );
          applyThenStoreToLS(page, "Apply", Advanced);
          window.location.href = "advanced-vpn-add.html";
        });
        editButton.innerHTML = '<img src="images/icons/icon-1/edit.svg" />';
        lastTd.appendChild(editButton);

        var deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-xs", "table-btn", "no-margin");
        deleteButton.setAttribute("popupinfo", "openwrtipsecremote");
        deleteButton.setAttribute("name", "delete");
        deleteButton.setAttribute("id", "openwrt.ipsec.remote.1");
        deleteButton.addEventListener("click", function () {
          document.getElementById("deletedialog").classList.remove("hide");
          document.getElementById("deletedialog").value = index.toString();
        });
        deleteButton.innerHTML = '<img src="images/icons/icon-1/delete.svg" />';
        lastTd.appendChild(deleteButton);

        // Append last <td> to <tr>
        tr.appendChild(lastTd);

        // Return the created <tr> element
        return tr;
      }

      let numberOfTunnel = Number(
        Advanced.vpn.openwrtipsecremote.NumberOfEntries
      );
      for (let index = 0; index < numberOfTunnel; index++) {
        let tunnelInfo = {
          openwrtipsecremote_enabled:
            Advanced.vpn.openwrtipsecremote[index].openwrtipsecremote_enabled,
          tunnel_name: Advanced.vpn.openwrtipsecremote[index].tunnel_name,
          acceptable_kmp: Advanced.vpn.openwrtipsecremote[index].acceptable_kmp,
          conn_ifname: Advanced.vpn.openwrtipsecremote[index].conn_ifname,
          remote_ip: Advanced.vpn.openwrtipsecremote[index].remote_ip,
          src: Advanced.vpn.openwrtipsecremote[index].src,
          dst: Advanced.vpn.openwrtipsecremote[index].dst,
        };
        document
          .querySelector("#bodyData")
          .appendChild(createIpsecRow(tunnelInfo, index));
      }

      document.querySelector("#OK").onclick = () => {
        document.getElementById("deletedialog").classList.add("hide");
        let delIdx = document.getElementById("deletedialog").value;
        manageJSONData(
          Advanced,
          `vpn.openwrtipsecremote.${delIdx}`,
          null,
          "delete"
        );
        Advanced.vpn.openwrtipsecremote.NumberOfEntries = (
          Number(Advanced.vpn.openwrtipsecremote.NumberOfEntries) - 1
        ).toString();

        // convert format
        const result = [];
        for (const key in Advanced.vpn.openwrtipsecremote) {
          if (typeof Advanced.vpn.openwrtipsecremote[key] == "object")
            result.push(Advanced.vpn.openwrtipsecremote[key]);
        }
        var cloneData = deepCopyObject(result);
        // applyThenStoreToLS(page, "Apply", Advanced);
        // create body for post request
        httpService.send_POST_Request(
          page,
          COMMAND.USER_CONFIG_DATA.DELETE,
          cloneData,
          Advanced,
          Number(delIdx)
        );
      };

      break;
    case "advanced-vpn-add.html":
      console.log(`Load ${page}`, Advanced.vpn);
      loadWanInterfaceToSelect(document.querySelector("#conn_ifname"));
      let is_tunnel_name_valid = false;
      let is_openwrtipsecremotepre_shared_key_valid = false;
      let is_acceptable_kmp_valid = false;
      let is_conn_ifname_valid = false;
      let is_remote_ip_valid = false;
      let is_src_valid = false;
      let is_dst_valid = false;
      let is_kmp_enc_alg_valid = false;
      let is_kmp_hash_alg_valid = false;
      let is_kmp_dh_group_valid = false;
      let is_encryption_algorithm_valid = false;
      let is_hash_algorithm_valid = false;
      let is_enc_dh_group_valid = false;
      let is_ipsec_sa_lifetime_time_valid = false;
      let ipsec_apply_btn_on = false;
      let is_edit_ipsec = false;
      let edit_tunnel_idx = -1;
      let tunnel_idx = Number(Advanced.vpn.openwrtipsecremote.NumberOfEntries);
      const ipv4Regex1 =
        /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}$/;
      const isValidSubnet = (subnet) =>
        /^(\d{1,3}\.){3}\d{1,3}\/(0|1\d|2[0-9]|3[0-2])$/.test(subnet) &&
        subnet
          .split("/")
          .every((val, index) =>
            index === 0 ? /^(\d{1,3}\.){3}\d{1,3}$/.test(val) : true
          );
      const isNumberGreaterThanOne = (value) =>
        typeof value === "number" && value > 1;

      for (let index = 0; index < tunnel_idx; index++) {
        if (Advanced.vpn.openwrtipsecremote[index].status !== "unchanged") {
          // edit ipsec tunnel
          is_edit_ipsec = true;
          edit_tunnel_idx = index;
          document.querySelector("#openwrtipsecremote_enabled").checked =
            Advanced.vpn.openwrtipsecremote[index]
              .openwrtipsecremote_enabled === "on"
              ? true
              : false;
          document.querySelector("#tunnel_name").value =
            Advanced.vpn.openwrtipsecremote[index].tunnel_name;
          document.querySelector("#openwrtipsecremotepre_shared_key").value =
            Advanced.vpn.openwrtipsecremote[
              index
            ].openwrtipsecremotepre_shared_key;
          document.querySelector("#acceptable_kmp").value =
            Advanced.vpn.openwrtipsecremote[index].acceptable_kmp;
          document.querySelector("#conn_ifname").value =
            Advanced.vpn.openwrtipsecremote[index].conn_ifname;
          document.querySelector("#remote_ip").value =
            Advanced.vpn.openwrtipsecremote[index].remote_ip;
          document.querySelector("#src").value =
            Advanced.vpn.openwrtipsecremote[index].src;
          document.querySelector("#dst").value =
            Advanced.vpn.openwrtipsecremote[index].dst;
          document.querySelector("#kmp_enc_alg").value =
            Advanced.vpn.openwrtipsecremote[index].kmp_enc_alg;
          document.querySelector("#kmp_hash_alg").value =
            Advanced.vpn.openwrtipsecremote[index].kmp_hash_alg;
          document.querySelector("#kmp_dh_group").value =
            Advanced.vpn.openwrtipsecremote[index].kmp_dh_group;
          document.querySelector("#encryption_algorithm").value =
            Advanced.vpn.openwrtipsecremote[index].encryption_algorithm;
          document.querySelector("#hash_algorithm").value =
            Advanced.vpn.openwrtipsecremote[index].hash_algorithm;
          document.querySelector("#enc_dh_group").value =
            Advanced.vpn.openwrtipsecremote[index].enc_dh_group;
          document.querySelector("#ipsec_sa_lifetime_time").value =
            Advanced.vpn.openwrtipsecremote[index].ipsec_sa_lifetime_time;
          Advanced.vpn.openwrtipsecremote[index].status = "unchanged";
          localStorage.setItem("Advanced", JSON.stringify(Advanced));
        }
      }

      if (is_edit_ipsec) {
        is_tunnel_name_valid = true;
        is_openwrtipsecremotepre_shared_key_valid = true;
        is_acceptable_kmp_valid = true;
        is_conn_ifname_valid = true;
        is_remote_ip_valid = true;
        is_src_valid = true;
        is_dst_valid = true;
        is_kmp_enc_alg_valid = true;
        is_kmp_hash_alg_valid = true;
        is_kmp_dh_group_valid = true;
        is_encryption_algorithm_valid = true;
        is_hash_algorithm_valid = true;
        is_enc_dh_group_valid = true;
        is_ipsec_sa_lifetime_time_valid = true;
        ipsec_apply_btn_on = true;
        is_edit_ipsec = true;
      } else {
        document.querySelector("#tunnel_name_notify").innerHTML =
          "* This Field is Required";
        document.querySelector(
          "#openwrtipsecremotepre_shared_key_notify"
        ).innerHTML = "* This Field is Required";
        document.querySelector("#remote_ip_notify").innerHTML =
          "* This Field is Required";
        document.querySelector("#src_notify").innerHTML =
          "* This Field is Required";
        document.querySelector("#dst_notify").innerHTML =
          "* This Field is Required";
        document.querySelector("#ipsec_sa_lifetime_time_notify").innerHTML =
          "* This Field is Required";
      }

      function ipsec_apply_btn_Check() {
        ipsec_apply_btn_on =
          is_tunnel_name_valid &&
            is_openwrtipsecremotepre_shared_key_valid &&
            is_acceptable_kmp_valid &&
            is_conn_ifname_valid &&
            is_remote_ip_valid &&
            is_src_valid &&
            is_dst_valid &&
            is_kmp_enc_alg_valid &&
            is_kmp_hash_alg_valid &&
            is_kmp_dh_group_valid &&
            is_encryption_algorithm_valid &&
            is_hash_algorithm_valid &&
            is_enc_dh_group_valid &&
            is_ipsec_sa_lifetime_time_valid
            ? true
            : false;

        document.querySelector("#Add").disabled = !ipsec_apply_btn_on;
      }

      document.querySelector("#Add").disabled = !ipsec_apply_btn_on;

      function input_valid_check(input) {
        if (input.value.length > 0) {
          switch (input.id) {
            case "tunnel_name":
              is_tunnel_name_valid = true;
              document.querySelector("#tunnel_name_notify").innerHTML = "";
              break;
            case "openwrtipsecremotepre_shared_key":
              is_openwrtipsecremotepre_shared_key_valid = true;
              document.querySelector(
                "#openwrtipsecremotepre_shared_key_notify"
              ).innerHTML = "";
              break;
            case "remote_ip":
              is_remote_ip_valid = ipv4Regex1.test(input.value);
              document.querySelector("#remote_ip_notify").innerHTML =
                is_remote_ip_valid
                  ? ""
                  : "* Invalid pattern , Example IPv4 address :192.168.1.232";
              break;
            case "src":
              is_src_valid = isValidSubnet(input.value);
              document.querySelector("#src_notify").innerHTML = is_src_valid
                ? ""
                : "* Subnet in classless format only eg: 192.168.1.0/24";
              break;
            case "dst":
              is_dst_valid = isValidSubnet(input.value);
              document.querySelector("#dst_notify").innerHTML = is_dst_valid
                ? ""
                : "* Subnet in classless format only eg: 192.168.6.0/24";
              break;
            case "ipsec_sa_lifetime_time":
              is_ipsec_sa_lifetime_time_valid = isNumberGreaterThanOne(
                Number(input.value)
              );
              document.querySelector(
                "#ipsec_sa_lifetime_time_notify"
              ).innerHTML = is_ipsec_sa_lifetime_time_valid
                  ? ""
                  : "* Value must be greater than or equal to 1";
              break;
          }
        } else {
          switch (input.id) {
            case "tunnel_name":
              document.querySelector("#tunnel_name_notify").innerHTML =
                "* This Field is Required";
              is_tunnel_name_valid = false;
              break;
            case "openwrtipsecremotepre_shared_key":
              document.querySelector(
                "#openwrtipsecremotepre_shared_key_notify"
              ).innerHTML = "* This Field is Required";
              is_openwrtipsecremotepre_shared_key_valid = false;
              break;
            case "remote_ip":
              document.querySelector("#remote_ip_notify").innerHTML =
                "* This Field is Required";
              is_remote_ip_valid = false;
              break;
            case "src":
              document.querySelector("#src_notify").innerHTML =
                "* This Field is Required";
              is_src_valid = false;
              break;
            case "dst":
              document.querySelector("#dst_notify").innerHTML =
                "* This Field is Required";
              is_dst_valid = false;
              break;
            case "ipsec_sa_lifetime_time":
              document.querySelector(
                "#ipsec_sa_lifetime_time_notify"
              ).innerHTML = "* This Field is Required";
              is_ipsec_sa_lifetime_time_valid = false;
              break;
            default:
              break;
          }
        }
        ipsec_apply_btn_Check();
      }

      document.querySelectorAll("input").forEach(function (input) {
        input.onkeyup = function () {
          input_valid_check(input);
        };
      });

      document.querySelectorAll("select").forEach(function (select) {
        // After reloading pages, check select field to notify suitable message
        notifyErrorForSelectElement(select);
        // After select changing, check select field to notify suitable message
        select.onchange = () => {
          switch (select.id) {
            case "acceptable_kmp":
              is_acceptable_kmp_valid = select.value !== "?" ? true : false;
              notifyErrorForSelectElement(select);
              break;
            case "conn_ifname":
              is_conn_ifname_valid = select.value !== "?" ? true : false;
              notifyErrorForSelectElement(select);
              break;
            case "kmp_enc_alg":
              is_kmp_enc_alg_valid = select.value !== "?" ? true : false;
              notifyErrorForSelectElement(select);
              break;
            case "kmp_hash_alg":
              is_kmp_hash_alg_valid = select.value !== "?" ? true : false;
              notifyErrorForSelectElement(select);
              break;
            case "kmp_dh_group":
              is_kmp_dh_group_valid = select.value !== "?" ? true : false;
              notifyErrorForSelectElement(select);
              break;
            case "encryption_algorithm":
              is_encryption_algorithm_valid =
                select.value !== "?" ? true : false;
              notifyErrorForSelectElement(select);
              break;
            case "hash_algorithm":
              is_hash_algorithm_valid = select.value !== "?" ? true : false;
              notifyErrorForSelectElement(select);
              break;
            case "enc_dh_group":
              is_enc_dh_group_valid = select.value !== "?" ? true : false;
              notifyErrorForSelectElement(select);
              break;
            default:
              break;
          }
          ipsec_apply_btn_Check();
        };
      });

      // get data from input and store data to DB
      document.querySelector("#Add").addEventListener("click", function () {
        if (is_edit_ipsec) {
          tunnel_idx = edit_tunnel_idx;
        }
        manageJSONData(
          Advanced,
          `vpn.openwrtipsecremote.${tunnel_idx.toString()}.status`,
          "unchanged",
          "add"
        );
        document.querySelectorAll("input").forEach(function (input) {
          if (
            input.id === "tunnel_name" ||
            input.id === "openwrtipsecremotepre_shared_key" ||
            input.id === "remote_ip" ||
            input.id === "src" ||
            input.id === "dst" ||
            input.id === "ipsec_sa_lifetime_time"
          ) {
            manageJSONData(
              Advanced,
              `vpn.openwrtipsecremote.${tunnel_idx.toString()}.${input.id}`,
              input.value,
              "add"
            );
          } else if (input.id === "openwrtipsecremote_enabled") {
            if (input.checked === true) {
              manageJSONData(
                Advanced,
                `vpn.openwrtipsecremote.${tunnel_idx.toString()}.openwrtipsecremote_enabled`,
                "on",
                "add"
              );
            } else {
              manageJSONData(
                Advanced,
                `vpn.openwrtipsecremote.${tunnel_idx.toString()}.openwrtipsecremote_enabled`,
                "off",
                "add"
              );
            }
          }
        });
        document.querySelectorAll("select").forEach(function (select) {
          if (
            select.id === "acceptable_kmp" ||
            select.id === "conn_ifname" ||
            select.id === "kmp_enc_alg" ||
            select.id === "kmp_hash_alg" ||
            select.id === "kmp_dh_group" ||
            select.id === "encryption_algorithm" ||
            select.id === "hash_algorithm" ||
            select.id === "enc_dh_group"
          ) {
            manageJSONData(
              Advanced,
              `vpn.openwrtipsecremote.${tunnel_idx.toString()}.${select.id}`,
              select.value,
              "add"
            );
          }
        });
        if (!is_edit_ipsec) {
          tunnel_idx++;
          Advanced.vpn.openwrtipsecremote.NumberOfEntries =
            tunnel_idx.toString();
          is_edit_ipsec = false;
          tunnel_idx--;
          command = COMMAND.USER_CONFIG_DATA.ADD;
        } else {
          command = COMMAND.USER_CONFIG_DATA.MODIFY;
        }
        // create body for post request
        var cloneData = deepCopyObject(Advanced.vpn.openwrtipsecremote[tunnel_idx]);
        console.log(`Data sent: Advanced.vpn.openwrtipsecremote.${tunnel_idx}`, cloneData);
        console.log(Advanced);
        httpService.send_POST_Request(
          page,
          command,
          cloneData,
          Advanced,
          tunnel_idx,
          "advanced-vpn.html" // redirect
        );
        // store data to DB
        // applyThenStoreToLS(page, "Apply", Advanced);
        // back to ipv4 static routing table
        // window.location.href = "advanced-vpn.html";
      });
      break;
    default:
      console.log(`Load ${page} fail --- no available page`);
      return;
  }
}

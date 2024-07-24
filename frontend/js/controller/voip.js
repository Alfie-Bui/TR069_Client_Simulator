function loadPage(page, options) {
  let Status = JSON.parse(localStorage.getItem("Status"));
  let Basic = JSON.parse(localStorage.getItem("Basic"));
  let Wifi = JSON.parse(localStorage.getItem("Wifi"));
  let Advanced = JSON.parse(localStorage.getItem("Advanced"));
  let Security = JSON.parse(localStorage.getItem("Security"));
  let Utilities = JSON.parse(localStorage.getItem("Utilities"));
  let VoIP = JSON.parse(localStorage.getItem("VoIP"));
  switch (page) {
    case "voip-config.html":
      console.log(`Load ${page}`, VoIP);

      var enableSIPALG = document.getElementById("DeviceNATX_GTK_ALG_SIP");
      var selectElement = document.getElementById("X_GTK_Interface");
      var telephoneNumber = document.getElementById("X_GTK_TelephoneNumber");
      var registarAddress = document.getElementById("X_GTK_RegistarAddress");
      var authenticationID = document.getElementById("X_GTK_AuthenticationID");
      var password = document.getElementById("DeviceX_GTK_VoIPX_GTK_Password");
      var registarPort = document.getElementById("X_GTK_RegistarPort");
      var SIPProxy = document.getElementById("X_GTK_SIPProxy");
      var SIPProxyPort = document.getElementById("X_GTK_SIPProxyPort");
      var outboundProxy = document.getElementById("X_GTK_OutboundProxy");
      var outboundProxyPort = document.getElementById(
        "X_GTK_OutboundProxyPort"
      );
      var wanInterfaces = Basic.WAN.Interfaces;
      const fields = [
        { element: telephoneNumber, errorMessageId: "empty_telephone_number" },
        { element: registarAddress, errorMessageId: "empty_registar_address" },
        { element: authenticationID, errorMessageId: "empty_authenication_id" },
        { element: password, errorMessageId: "empty_password" },
        { element: registarPort, errorMessageId: "empty_registar_port" },
        { element: SIPProxy, errorMessageId: "empty_sip_proxy" },
        { element: SIPProxyPort, errorMessageId: "empty_sip_proxy_port" },
        { element: outboundProxy, errorMessageId: "empty_outbound_proxy" },
        {
          element: outboundProxyPort,
          errorMessageId: "empty_outbound_proxy_port",
        },
      ];

      function fillData() {
        enableSIPALG.checked = Advanced.ALG.EnableSIPALG;
        telephoneNumber.value = VoIP.TelephoneNumber;
        registarAddress.value = VoIP.RegistarAddress;
        authenticationID.value = VoIP.AuthenticationID;
        password.value = VoIP.Password;
        registarPort.value = VoIP.RegistarPort;
        SIPProxy.value = VoIP.SIPProxy;
        SIPProxyPort.value = VoIP.SIPProxyPort;
        outboundProxy.value = VoIP.OutboundProxy;
        outboundProxyPort.value = VoIP.OutboundProxyPort;

        selectElement.innerHTML = "";
        let countValue = 0;
        wanInterfaces.forEach((interface) => {
          var optionElement = document.createElement("option");
          optionElement.textContent = interface.Name;
          optionElement.value =
            countValue; /* as value, corresponds to index of itself in SSIDs array */
          countValue++;
          optionElement.setAttribute("data-label", interface.Name);
          selectElement.appendChild(optionElement);
        });
        selectElement.value = VoIP.Interface;

        fields.forEach(({ element, errorMessageId }) => {
          checkEmpty_inputField(
            element,
            document.getElementById(errorMessageId)
          );
        });
      }

      function initEvent() {
        fields.forEach((field) => {
          field.element.addEventListener("input", () => {
            checkEmpty_inputField(
              field.element,
              document.getElementById(field.errorMessageId)
            );
          });
          checkEmpty_inputField(
            field.element,
            document.getElementById(field.errorMessageId)
          );
        });
      }

      fillData();
      initEvent();

      document.getElementById("Apply").addEventListener("click", () => {
        if (checkError_show(document.querySelectorAll(".error"))) {
          VoIP.EnableSIPALG = enableSIPALG.checked;
          VoIP.TelephoneNumber = telephoneNumber.value;
          VoIP.RegistarAddress = registarAddress.value;
          VoIP.AuthenticationID = authenticationID.value;
          VoIP.Password = password.value;
          VoIP.RegistarPort = registarPort.value;
          VoIP.SIPProxy = SIPProxy.value;
          VoIP.SIPProxyPort = SIPProxyPort.value;
          VoIP.OutboundProxy = outboundProxy.value;
          VoIP.OutboundProxyPort = outboundProxyPort.value;
          VoIP.Interface = selectElement.value;
          var cloneData = deepCopyObject(VoIP);
          var interfaceObj = textContentConverting(selectElement, VoIP.Interface);
          for (var i = 0; i < Basic.WAN.Interfaces.length; i++) {
            if (Basic.WAN.Interfaces[i].Name === interfaceObj) {
              cloneData.Interface = `Device.IP.Interface.${i + 1}`;
            }
          }
          console.log(cloneData);
          httpService.send_POST_Request(
            page,
            COMMAND.USER_CONFIG_DATA.MODIFY,
            cloneData,
            VoIP,
            ""
          );
        }
      });

      break;
    default:
      console.log(`Load ${page} fail --- no available page`);
      return;
  }
}

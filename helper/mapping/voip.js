"use strict";

/**
 * @NOTE Mapping template:
 *          [Object, Writable, Value, Value type]
 *      Ex: ["true", "false", lsData.ACSURL, "xsd::string"]
 */

/**
 * @brief Mapping Local Storage data from Advanced category
 * @param {*} command   : command from FE
 * @param {*} page      : which page
 * @param {*} lsData    : data from Local Storage
 * @param {*} subOption    : 
 *        ADD      : the OLD LENGTH of the array data before Apply or the NEXT INDEX (depend on how you like to index the mapping data model)
 *        MODIFY   : the modified index
 *        DELETE   : the OLD LENGTH of the array data before Apply
 *        COMPLEX  : the OLD LENGTH of the array data before Apply
 */
function mapping(command, page, lsData, subOption) {
  console.log("\n=== helper.mapping.voip.mapping() ===");
  console.log("\lsData = \n", lsData);
  var returnVal = {};
  switch (page) {
    case "voip-config.html":
      returnVal = {
        "Device.NAT.X_GTK_ALG.SIP":                         ["false", "true", lsData.EnableSIPALG, "xsd:boolean"],
        "Device.X_GTK_VoIP.X_GTK_TelephoneNumber":          ["false", "true", lsData.TelephoneNumber, "xsd:unsignedInt"],
        "Device.X_GTK_VoIP.X_GTK_RegistarAddress":          ["false", "true", lsData.RegistarAddress, "xsd:string"],
        "Device.X_GTK_VoIP.X_GTK_RegistarPort":             ["false", "true", lsData.RegistarPort, "xsd:unsignedInt"],
        "Device.X_GTK_VoIP.X_GTK_AuthenticationID":         ["false", "true", lsData.AuthenticationID, "xsd:unsignedInt"],
        "Device.X_GTK_VoIP.X_GTK_Password":                 ["false", "true", lsData.Password, "xsd:string"],
        "Device.X_GTK_VoIP.X_GTK_SIPProxy":                 ["false", "true", lsData.SIPProxy, "xsd:string"],
        "Device.X_GTK_VoIP.X_GTK_SIPProxyPort":             ["false", "true", lsData.SIPProxyPort, "xsd:unsignedInt"],
        "Device.X_GTK_VoIP.X_GTK_OutboundProxy":            ["false", "true", lsData.OutboundProxy, "xsd:string"],
        "Device.X_GTK_VoIP.X_GTK_OutboundProxyPort":        ["false", "true", lsData.OutboundProxyPort, "xsd:unsignedInt"],
        "Device.X_GTK_VoIP.X_GTK_Interface":                ["false", "true", lsData.Interface, "xsd:string"]
      };
      break;
    default:
      throw `[ERROR] ${page} is not available`;
  }
  console.log("Mapping data: ", returnVal);
  return returnVal;
}

module.exports = { mapping };

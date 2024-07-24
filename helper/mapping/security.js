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
  console.log("\n=== helper.mapping.security.mapping() ===");
  console.log("\lsData = \n", lsData);
  var returnVal = {};
  switch (page) {
    case "security-firewall.html":
      returnVal = {
        "Device.Firewall.Enable"                        : ["false", "true", lsData.EnableFirewall, "xsd::boolean"],
        "Device.Firewall.Chain.1.Rule.1.Enable"         : ["false", "true", lsData.Services.EnableTelnet, "xsd::boolean"],
        "Device.Firewall.Chain.1.Rule.2.Enable"         : ["false", "true", lsData.Services.EnableSSH, "xsd::boolean"],
        "Device.Firewall.Chain.1.Rule.3.Enable"         : ["false", "true", lsData.Services.EnableHTTPS, "xsd::boolean"],
        "Device.Firewall.Chain.1.Rule.4.Enable"         : ["false", "true", lsData.Services.EnableICMP, "xsd::boolean"],
      };
      break;
    case "security-parental_control_settings.html":
      returnVal = {
        "Device.Firewall.X_GTK_ParentalControl.":               ["true", "false", "", ""],
        "Device.Firewall.X_GTK_ParentalControl.Enable":         ["false", "true", lsData.EnableParentalControl.toString(), "xsd:boolean"],
        "Device.Firewall.X_GTK_ParentalControl.DefaultAction":  ["false", "true", lsData.DefaultAction.toString(), "xsd:boolean"]
      };
      break;
    case "security-parental_control-devControl-add.html":
      var complexPrefixes = ["Device.Firewall.X_GTK_ParentalControl.Rule"];
      var dbIndex = parseInt(subOption) + 1;
      returnVal[`${complexPrefixes[0]}.${dbIndex}`]               = ["true", "false", "", ""];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.Enable`]        = ["false", "true", lsData.EnableParentalControlRule.toString(), "xsd:boolean"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.PolicyName`]    = ["false", "true", lsData.PolicyName, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.MACAddress`]    = ["false", "true", lsData.MACAddress, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.Type`]          = ["false", "true", lsData.ParentalControlType, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.List`]          = ["false", "true", lsData.DataForm.join(","), "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.TimeStart`]     = ["false", "true", lsData.TimeStart, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.TimeEnd`]       = ["false", "true", lsData.TimeEnd, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.Target`]        = ["false", "true", lsData.Target, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.DaysOfTheWeek`] = ["false", "true", lsData.DaysOfTheWeek, "xsd:string"];
      break;
    case "security-parental_control-devControl.html":
      returnVal.DELETE = [`Device.Firewall.X_GTK_ParentalControl.Rule.${parseInt(subOption) + 1}`];
      break;
    default:
      throw `[ERROR] ${page} is not available`;
  }
  console.log("Mapping data: ", returnVal);
  return returnVal;
}

module.exports = { mapping };

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
  console.log("\n=== helper.mapping.utilities.mapping() ===");
  console.log("\lsData = \n", lsData);
  var returnVal = {};
  switch (page) {
    case "utilities-diagnostics.html":
      break;
    case "utilities-speed_test.html":
      break;
    case "utilities-system-backup.html":
      break;
    case "utilities-system-log_rule-edit.html":
      returnVal = {
        "Device.DeviceInfo.VendorLogFile.1.Name":               ["false", "true", lsData.Name, "xsd:string"],
        "Device.DeviceInfo.VendorLogFile.1.MaximumSize":        ["false", "true", lsData.MaximumSize, "xsd:unsignedInt"],
        "Device.DeviceInfo.VendorLogFile.1.X_GTK_IPAddress":    ["false", "true", lsData.RemoteIP, "xsd:string"],
        "Device.DeviceInfo.VendorLogFile.1.X_GTK_Port":         ["false", "true", lsData.PortNo, "xsd:string"],
        "Device.DeviceInfo.VendorLogFile.1.X_GTK_Remote":       ["false", "true", lsData.DeviceDeviceInfoVendorLogFile1_X_GTK_Remote, "xsd:boolean"]
      };
      break;
    case "utilities-system-log_rule.html":
      break;
    case "utilities-system-time.html":
      returnVal = {
        "Device.Time.Enable":                 ["false", "true", lsData.DeviceTime_Enable, "xsd:boolean"],
        "Device.Time.Status":                 ["false", "false", "", "xsd:string"],
        "Device.Time.NTPServer1":             ["false", "true", lsData.NTPServer1, "xsd:string"],
        "Device.Time.NTPServer2":             ["false", "true", lsData.NTPServer2, "xsd:string"],
        "Device.Time.NTPServer3":             ["false", "true", lsData.NTPServer3, "xsd:string"],
        "Device.Time.NTPServer4":             ["false", "true", lsData.NTPServer4, "xsd:string"],
        "Device.Time.NTPServer5":             ["false", "true", lsData.NTPServer5, "xsd:string"],
        "Device.Time.CurrentLocalTime":       ["false", "false", lsData.formattedTime, "dateTime"],
        "Device.Time.X_GTK_TimeZoneLocation": ["false", "true", lsData.X_GTK_TimeZoneLocation, "xsd:string"]
      };
      break;
    case "utilities-system-user_mgnt-edit.html":
      returnVal = {
        "Device.Users.User.1.Username": ["false", "true", lsData.UserName, "xsd::string"],
        "Device.Users.User.1.Password": ["false", "true", lsData.Password, "xsd::string"],
      };
      break;
    case "utilities-system-user_mgnt.html":
      break;
    case "utilities-update_fw.html":
      break;
    default:
      throw `[ERROR] ${page} is not available`;
  }
  console.log("Mapping data: ", returnVal);
  return returnVal;
}

module.exports = { mapping };

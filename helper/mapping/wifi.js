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
  var returnVal = {};
  switch (page) {
    case "wifi-2_4G-config.html":
      var complexPrefixes = ["Device.WiFi.SSID", "Device.WiFi.AccessPoint", "Device.WiFi.Radio"];
      var dbIndex;
      for (const key in lsData) {
        dbIndex = parseInt(key) + 1;
        // "Device.WiFi.SSID",
        returnVal[`${complexPrefixes[0]}.${dbIndex}.LowerLayers`]                 = ["false", "true", "Device.WiFi.Radio.1", "xsd:string"];
        returnVal[`${complexPrefixes[0]}.${dbIndex}.Name`]                        = ["false", "false", "wlan0.1", "xsd:string"];
        returnVal[`${complexPrefixes[0]}.${dbIndex}.SSID`]                        = ["false", "true", lsData[key].Configuration.SSID, "xsd:string"];
        // "Device.WiFi.AccessPoint"
        returnVal[`${complexPrefixes[1]}.${dbIndex}.IsolationEnable`]             = ["false", "true", lsData[key].Configuration.APIsolation.toString(), "xsd:boolean"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.MaxAssociatedDevices`]        = ["false", "true", lsData[key].Maxconnected, "xsd:unsignedInt"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.SSIDAdvertisementEnabled`]    = ["false", "true", lsData[key].Configuration.AdvertiseSSID.toString(), "xsd:boolean"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.SSIDReference`]               = ["false", "true", `Device.WiFi.SSID.${parseInt(key)}`, "xsd:string"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.Security`]                    = ["true", "false", "", ""];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.Security.KeyPassphrase`]      = ["false", "true", lsData[key].Configuration.Passphrase, "xsd:string"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.Security.ModeEnabled`]        = ["false", "true", lsData[key].Configuration.SecurityType, "xsd:string"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.Security.ModesSupported`]     = ["false", "false", "None,WEP-64,WEP-128,WPA-Personal,WPA2-Personal,WPA-WPA2-Personal,WPA-Enterprise,WPA2-Enterprise,WPA-WPA2-Enterprise", "xsd:string"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.Security.RekeyingInterval`]   = ["false", "true", lsData[key].RekeyInterval, "xsd:unsignedInt"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.Security.X_LANTIQ_COM_Vendor_ModesSupported`] = ["false", "false", "WPA3-Personal,WPA2-WPA3-Personal", "xsd:string"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.UAPSDEnable`]                 = ["false", "true", lsData[key].Configuration.WMMPS.toString(), "xsd:boolean"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.WMMCapability`]               = ["false", "true", lsData[key].Configuration.WMM.toString(), "xsd:boolean"];
        // "Device.WiFi.Radio"
        returnVal[`${complexPrefixes[2]}.${dbIndex}.AutoChannelEnable`]           = ["false", "true", lsData[key].Configuration.AutoChannel.toString(), "xsd:boolean"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.Channel`]                     = ["false", "true", lsData[key].Configuration.Channel, "xsd:unsignedInt"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.OperatingChannelBandwidth`]   = ["false", "true", lsData[key].Configuration.ChannelBandwidth, "xsd:unsignedInt"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.OperatingStandards`]          = ["false", "true", lsData[key].Configuration.OperationMode, "xsd:string"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.BeaconPeriod`]                = ["false", "true", lsData[key].Configuration.BeaconInterval, "xsd:unsignedInt"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.CoexEnabled`]                 = ["false", "true", lsData[key].Configuration.EnableCoExistence.toString(), "xsd:boolean"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.DTIMPeriod`]                  = ["false", "true", lsData[key].Configuration.DTIM, "xsd:unsignedInt"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.Enable`]                      = ["false", "true", lsData[key].Configuration.EnableRadio.toString(), "xsd:boolean"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.OperatingFrequencyBand`]      = ["false", "true", "2.4GHz", "xsd:string"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.TransmitPower`]               = ["false", "true", lsData[key].Configuration.PowerScale, "xsd:int"];
      }
      break;
    case "wifi-2_4G-mac_filtering.html":
      var complexPrefixes = ["Device.WiFi.AccessPoint"];
      var dbIndex;
      for (const key in lsData) {
        dbIndex = parseInt(key) + 1;
        returnVal[`${complexPrefixes[0]}.${dbIndex}.X_LANTIQ_COM_Vendor.MACAddressControlList`] = ["false", "true", lsData[key].MACFiltering.MACAddressFilter.join(','), "xsd:string"];
        returnVal[`${complexPrefixes[0]}.${dbIndex}.X_LANTIQ_COM_Vendor.MACAddressControlMode`] = ["false", "true", lsData[key].MACFiltering.ACLMode.toString(), "xsd:string"];
      }
      break;
    case "wifi-2_4G-ssids.html":
      var complexPrefixes = ["Device.WiFi.SSID", "Device.WiFi.AccessPoint", "Device.WiFi.Radio"];
      returnVal.complexPrefix = complexPrefixes;
      returnVal.complexPart = {};
      returnVal.complexPartLength = lsData.length;
      var dbIndex;
      for (var key in lsData) {
        dbIndex = parseInt(key) + 1;
        // "Device.WiFi.SSID"
        if (key != 0) {
          returnVal.complexPart[`${complexPrefixes[0]}.${dbIndex}`]               = ["true", "false", "", ""];
        }
        returnVal.complexPart[`${complexPrefixes[0]}.${dbIndex}.LowerLayers`]   = ["false", "true", "Device.WiFi.Radio.1", "xsd::string"];
        returnVal.complexPart[`${complexPrefixes[0]}.${dbIndex}.Name`]          = ["false", "false", "wlan0.1", "xsd::string"];
        returnVal.complexPart[`${complexPrefixes[0]}.${dbIndex}.SSID`]          = ["false", "true", lsData[key].Configuration.SSID, "xsd::string"];
        returnVal.complexPart[`${complexPrefixes[0]}.${dbIndex}.X_LANTIQ_COM_Vendor_BridgeName`] = ["false", "true", lsData[key].BridgeName, "xsd::string"];
        // "Device.WiFi.AccessPoint"
        if (parseInt(key) !== 0) {
          returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}`]                     = ["true", "true", "", ""];
          returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security`]            = ["true", "false", "", ""];
          returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.WPS`]                 = ["true", "false", "", ""];
          returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.X_GTK_Vendor`]        = ["true", "false", "", ""];
          returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.X_LANTIQ_COM_Vendor`] = ["true", "false", "", ""];
        }
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.IsolationEnable`]                           = ["false", "true", lsData[key].Configuration.APIsolation.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.MaxAssociatedDevices`]                      = ["false", "true", lsData[key].Maxconnected, "xsd:unsignedInt"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.SSIDAdvertisementEnabled`]                  = ["false", "true", lsData[key].Configuration.AdvertiseSSID.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.SSIDReference`]                             = ["false", "true", `Device.WiFi.SSID.${dbIndex}`, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security`]                                  = ["true", "false", "", ""];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security.KeyPassphrase`]                    = ["false", "true", lsData[key].Configuration.Passphrase, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security.ModeEnabled`]                      = ["false", "true", lsData[key].Configuration.SecurityType, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security.ModesSupported`]                   = ["false", "false", `"None,WEP-64,WEP-128,WPA-Personal,WPA2-Personal,WPA-WPA2-Personal,WPA-Enterprise,WPA2-Enterprise,WPA-WPA2-Enterprise"`, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security.RekeyingInterval`]                 = ["false", "true", lsData[key].RekeyInterval, "xsd:unsignedInt"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security.X_LANTIQ_COM_Vendor_ModesSupported`] = ["false", "false", `"WPA3-Personal,WPA2-WPA3-Personal"`, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.UAPSDEnable`]                               = ["false", "true", lsData[key].Configuration.WMMPS.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.WMMCapability`]                             = ["false", "true", lsData[key].Configuration.WMM.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.WPS.Enable`]                                = ["false", "true", lsData[key].WPSEnabled.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.X_GTK_Vendor.WaveWDSMode`]                  = ["false", "true", "Disabled", "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.X_GTK_Vendor.WaveWDSPeers`]                 = ["false", "true", "", "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.X_LANTIQ_COM_Vendor.MACAddressControlList`] = ["false", "true", "", "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.X_LANTIQ_COM_Vendor.MACAddressControlMode`] = ["false", "true", "Disabled", "xsd:string"];
        // "Device.WiFi.Radio", take the Config from Default SSID (.1.)
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.AutoChannelEnable`]           = ["false", "true", lsData[0].Configuration.AutoChannel.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.Channel`]                     = ["false", "true", lsData[0].Configuration.Channel, "xsd:unsignedInt"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.OperatingStandards`]          = ["false", "true", lsData[0].Configuration.OperationMode, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.BeaconPeriod`]                = ["false", "true", lsData[0].Configuration.BeaconInterval, "xsd:unsignedInt"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.CoexEnabled`]                 = ["false", "true", lsData[0].Configuration.EnableCoExistence.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.DTIMPeriod`]                  = ["false", "true", lsData[0].Configuration.DTIM, "xsd:unsignedInt"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.Enable`]                      = ["false", "true", lsData[0].Configuration.EnableRadio.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.OperatingFrequencyBand`]      = ["false", "true", "2.4GHz", "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.TransmitPower`]               = ["false", "true", lsData[0].Configuration.PowerScale, "xsd:int"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.OperatingStandards`]          = ["false", "true", lsData[0].Configuration.OperationMode, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.OperatingChannelBandwidth`]   = ["false", "true", lsData[0].Configuration.ChannelBandwidth, "xsd:unsignedInt"];
      }
      break;
    case "wifi-2_4G-statistics.html":
      break;
    case "wifi-2_4G-wds.html":
      var complexPrefixes = ["Device.WiFi.AccessPoint"];
      var dbIndex;
      for (const key in lsData) {
        dbIndex = parseInt(key) + 1;
        returnVal[`${complexPrefixes[0]}.${dbIndex}.X_GTK_Vendor`]              = ["true", "false", "", ""];
        returnVal[`${complexPrefixes[0]}.${dbIndex}.X_GTK_Vendor.WaveWDSMode`]  = ["false", "true", lsData[key].WDS.WDSMode.toString(), "xsd:string"];
        returnVal[`${complexPrefixes[0]}.${dbIndex}.X_GTK_Vendor.WaveWDSPeers`] = ["false", "true", lsData[key].WDS.MACAddress.join(','), "xsd:string"];
      }
      break;
    case "wifi-2_4G-wps.html":
      break;
    case "wifi-5G-config.html":
      var complexPrefixes = ["Device.WiFi.SSID", "Device.WiFi.AccessPoint", "Device.WiFi.Radio"];
      var dbIndex;
      for (const key in lsData) {
        dbIndex = parseInt(key) + 5;
        // "Device.WiFi.SSID"
        returnVal[`${complexPrefixes[0]}.${dbIndex}.LowerLayers`]                 = ["false", "true", "Device.WiFi.Radio.5", "xsd:string"];
        returnVal[`${complexPrefixes[0]}.${dbIndex}.Name`]                        = ["false", "false", "wlan2.2", "xsd:string"];
        returnVal[`${complexPrefixes[0]}.${dbIndex}.SSID`]                        = ["false", "true", lsData[key].Configuration.SSID, "xsd:string"];
        // "Device.WiFi.AccessPoint"
        returnVal[`${complexPrefixes[1]}.${dbIndex}.IsolationEnable`]             = ["false", "true", lsData[key].Configuration.APIsolation.toString(), "xsd:boolean"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.MaxAssociatedDevices`]        = ["false", "true", lsData[key].Maxconnected, "xsd:unsignedInt"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.SSIDAdvertisementEnabled`]    = ["false", "true", lsData[key].Configuration.AdvertiseSSID.toString(), "xsd:boolean"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.SSIDReference`]               = ["false", "true", `Device.WiFi.SSID.${dbIndex}`, "xsd:string"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.Security.KeyPassphrase`]      = ["false", "true", lsData[key].Configuration.Passphrase, "xsd:string"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.Security.ModeEnabled`]        = ["false", "true", lsData[key].Configuration.SecurityType, "xsd:string"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.Security.ModesSupported`]     = ["false", "false", "None,WEP-64,WEP-128,WPA-Personal,WPA2-Personal,WPA-WPA2-Personal,WPA-Enterprise,WPA2-Enterprise,WPA-WPA2-Enterprise", "xsd:string"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.Security.RekeyingInterval`]   = ["false", "true", lsData[key].RekeyInterval, "xsd:unsignedInt"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.Security.X_LANTIQ_COM_Vendor_ModesSupported`] = ["false", "false", "WPA3-Personal,WPA2-WPA3-Personal", "xsd:string"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.UAPSDEnable`]                 = ["false", "true", lsData[key].Configuration.WMMPS.toString(), "xsd:boolean"];
        returnVal[`${complexPrefixes[1]}.${dbIndex}.WMMCapability`]               = ["false", "true", lsData[key].Configuration.WMM.toString(), "xsd:boolean"];
        // "Device.WiFi.Radio"
        returnVal[`${complexPrefixes[2]}.${dbIndex}.AutoChannelEnable`]           = ["false", "true", lsData[key].Configuration.AutoChannel.toString(), "xsd:boolean"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.Channel`]                     = ["false", "true", lsData[key].Configuration.Channel, "xsd:unsignedInt"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.OperatingChannelBandwidth`]   = ["false", "true", lsData[key].Configuration.ChannelBandwidth, "xsd:unsignedInt"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.BeaconPeriod`]                = ["false", "true", lsData[key].Configuration.BeaconInterval, "xsd:unsignedInt"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.DTIMPeriod`]                  = ["false", "true", lsData[key].Configuration.DTIM, "xsd:unsignedInt"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.Enable`]                      = ["false", "true", lsData[key].Configuration.EnableRadio.toString(), "xsd:boolean"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.OperatingFrequencyBand`]      = ["false", "true", "5GHz", "xsd:string"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.TransmitPower`]               = ["false", "true", lsData[key].Configuration.PowerScale, "xsd:int"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.OperatingStandards`]          = ["false", "true", lsData[key].Configuration.OperationMode, "xsd:string"];
        returnVal[`${complexPrefixes[2]}.${dbIndex}.IEEE80211hEnabled`]           = ["false", "true", lsData[key].Configuration.UseDFSChannels, "xsd:boolean"];
      }
      break;
    case "wifi-5G-mac_filter.html":
      var complexPrefixes = ["Device.WiFi.AccessPoint"];
      var dbIndex;
      for (const key in lsData) {
        dbIndex = parseInt(key) + 5;
        returnVal[`${complexPrefixes[0]}.${dbIndex}.X_LANTIQ_COM_Vendor.MACAddressControlList`] = ["false", "true", lsData[key].MACFiltering.MACAddressFilter.join(','), "xsd:string"];
        returnVal[`${complexPrefixes[0]}.${dbIndex}.X_LANTIQ_COM_Vendor.MACAddressControlMode`] = ["false", "true", lsData[key].MACFiltering.ACLMode.toString(), "xsd:string"];
      }
      break;
    case "wifi-5G-ssids.html":
      var complexPrefixes = ["Device.WiFi.SSID", "Device.WiFi.AccessPoint", "Device.WiFi.Radio"];
      returnVal.complexPrefix = complexPrefixes;
      returnVal.complexPart = {};
      returnVal.complexPartLength = Object.keys(lsData).length + 4;
      var dbIndex;
      for (const key in lsData) {
        dbIndex = parseInt(key) + 5;
        // "Device.WiFi.SSID"
        if (key != 0) {
          returnVal.complexPart[`${complexPrefixes[0]}.${dbIndex}`]           = ["true", "false", "", ""];
        }
        returnVal.complexPart[`${complexPrefixes[0]}.${dbIndex}.LowerLayers`] = ["false", "true", "Device.WiFi.Radio.5", "xsd::string"];
        returnVal.complexPart[`${complexPrefixes[0]}.${dbIndex}.Name`]        = ["false", "false", "wlan2.2", "xsd::string"];
        returnVal.complexPart[`${complexPrefixes[0]}.${dbIndex}.SSID`]        = ["false", "true", lsData[key].Configuration.SSID, "xsd::string"];
        returnVal.complexPart[`${complexPrefixes[0]}.${dbIndex}.X_LANTIQ_COM_Vendor_BridgeName`] = ["false", "true", lsData[key].BridgeName, "xsd::string"];
        // "Device.WiFi.AccessPoint"
        if (key != 0) {
          returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}`]                     = ["true", "false", "", ""];
          returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security`]            = ["true", "false", "", ""];
          returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.WPS`]                 = ["true", "false", "", ""];
          returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.X_GTK_Vendor`]        = ["true", "false", "", ""];
          returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.X_LANTIQ_COM_Vendor`] = ["true", "false", "", ""];
        }
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.IsolationEnable`]                           = ["false", "true", lsData[key].Configuration.APIsolation.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.MaxAssociatedDevices`]                      = ["false", "true", lsData[key].Maxconnected, "xsd:unsignedInt"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.SSIDAdvertisementEnabled`]                  = ["false", "true", lsData[key].Configuration.AdvertiseSSID.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.SSIDReference`]                             = ["false", "true", `Device.WiFi.SSID.${dbIndex}`, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security.KeyPassphrase`]                    = ["false", "true", lsData[key].Configuration.Passphrase, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security.ModeEnabled`]                      = ["false", "true", lsData[key].Configuration.SecurityType, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security.ModesSupported`]                   = ["false", "false", `"None,WEP-64,WEP-128,WPA-Personal,WPA2-Personal,WPA-WPA2-Personal,WPA-Enterprise,WPA2-Enterprise,WPA-WPA2-Enterprise"`, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security.RekeyingInterval`]                 = ["false", "true", lsData[key].RekeyInterval, "xsd:unsignedInt"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.Security.X_LANTIQ_COM_Vendor_ModesSupported`] = ["false", "false", `"WPA3-Personal,WPA2-WPA3-Personal"`, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.UAPSDEnable`]                               = ["false", "true", lsData[key].Configuration.WMMPS.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.WMMCapability`]                             = ["false", "true", lsData[key].Configuration.WMM.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.WPS.Enable`]                                = ["false", "true", lsData[key].WPSEnabled.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.X_GTK_Vendor.WaveWDSMode`]                  = ["false", "true", "Disabled", "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.X_GTK_Vendor.WaveWDSPeers`]                 = ["false", "true", "", "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.X_LANTIQ_COM_Vendor.MACAddressControlList`] = ["false", "true", "", "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[1]}.${dbIndex}.X_LANTIQ_COM_Vendor.MACAddressControlMode`] = ["false", "true", "Disabled", "xsd:string"];
        // "Device.WiFi.Radio", take the Config from Default SSID (.5.)
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.AutoChannelEnable`]           = ["false", "true", lsData[0].Configuration.AutoChannel.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.Channel`]                     = ["false", "true", lsData[0].Configuration.Channel, "xsd:unsignedInt"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.OperatingChannelBandwidth`]   = ["false", "true", lsData[0].Configuration.ChannelBandwidth, "xsd:unsignedInt"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.BeaconPeriod`]                = ["false", "true", lsData[0].Configuration.BeaconInterval, "xsd:unsignedInt"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.DTIMPeriod`]                  = ["false", "true", lsData[0].Configuration.DTIM, "xsd:unsignedInt"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.Enable`]                      = ["false", "true", lsData[0].Configuration.EnableRadio.toString(), "xsd:boolean"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.OperatingFrequencyBand`]      = ["false", "true", "5GHz", "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.TransmitPower`]               = ["false", "true", lsData[0].Configuration.PowerScale, "xsd:int"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.OperatingStandards`]          = ["false", "true", lsData[0].Configuration.OperationMode, "xsd:string"];
        returnVal.complexPart[`${complexPrefixes[2]}.${dbIndex}.IEEE80211hEnabled`]           = ["false", "true", lsData[0].Configuration.UseDFSChannels, "xsd:boolean"];
      }
      break;
    case "wifi-5G-statistics.html":
      break;
    case "wifi-5G-wds.html":
      var complexPrefixes = ["Device.WiFi.AccessPoint"];
      var dbIndex;
      for (const key in lsData) {
        dbIndex = parseInt(key) + 5;
        returnVal[`${complexPrefixes[0]}.${dbIndex}.X_GTK_Vendor`]              = ["true", "false", "", ""];
        returnVal[`${complexPrefixes[0]}.${dbIndex}.X_GTK_Vendor.WaveWDSMode`]  = ["false", "true", lsData[key].WDS.WDSMode.toString(), "xsd:string"];
        returnVal[`${complexPrefixes[0]}.${dbIndex}.X_GTK_Vendor.WaveWDSPeers`] = ["false", "true", lsData[key].WDS.MACAddress.join(','), "xsd:string"];
      }
      break;
    case "wifi-5G-wps.html":
      break;
    case "wifi-guest_access-add.html":
      var prefixes = ["Device.X_GTK_GuestAccess.Rule"];
      var dbIndex = parseInt(subOption) + 1;
      returnVal[`${prefixes[0]}.${dbIndex}`]            = ["true", "false", "", ""];
      returnVal[`${prefixes[0]}.${dbIndex}.SSIDName`]   = ["false", "true", lsData.SSID, "xsd::string"];
      returnVal[`${prefixes[0]}.${dbIndex}.Radio`]      = ["false", "true", lsData.WirelessBand == "0" ? "radio0" : "radio1", "xsd::string"];
      switch (lsData.SecurityType) {
        case "0":
          returnVal[`${prefixes[0]}.${dbIndex}.ModeEnabled`]     = ["false", "true", "None", "xsd::string"];
          break;
        case "1":
          returnVal[`${prefixes[0]}.${dbIndex}.ModeEnabled`]      = ["false", "true", "WPA-Personal", "xsd::string"];
          break;
        case "2":
          returnVal[`${prefixes[0]}.${dbIndex}.ModeEnabled`]      = ["false", "true", "WPA2-Personal", "xsd::string"];
          break;
        case "3":
          returnVal[`${prefixes[0]}.${dbIndex}.ModeEnabled`]      = ["false", "true", "WPA-WPA2-Personal", "xsd::string"];
          break;
        case "4":
          returnVal[`${prefixes[0]}.${dbIndex}.ModeEnabled`]      = ["false", "true", "WEP-64", "xsd::string"];
          break;
        case "5":
          returnVal[`${prefixes[0]}.${dbIndex}.ModeEnabled`]      = ["false", "true", "WEP-128", "xsd::string"];
          break;
        default:
          throw `[ERROR] ${lsData.SecurityType} is not supported`;
      }
      returnVal[`${prefixes[0]}.${dbIndex}.KeyPassphrase`]    = ["false", "true", lsData.Passphrase, "xsd::string"];
      returnVal[`${prefixes[0]}.${dbIndex}.WEPKey`]           = ["false", "true", lsData.Passphrase, "xsd::string"];
      returnVal[`${prefixes[0]}.${dbIndex}.RekeyingInterval`] = ["false", "true", lsData.RekeyInterval, "xsd::string"];
      returnVal[`${prefixes[0]}.${dbIndex}.GuestIsolation`]   = ["false", "true", lsData.GuestIsolation, "xsd::boolean"];

      if (command === "USER_CONFIG_DATA_ADD") {
        returnVal.UPDATE = {};
        returnVal.UPDATE["Device.X_GTK_GuestAccess.RuleNumberOfEntries"] = ["false", "false", dbIndex, "xsd::unsignedInt"];
      }
      break;
    case "wifi-guest_access.html":
      switch (command) {
        case "USER_CONFIG_DATA_DELETE":
          returnVal.DELETE = [`Device.X_GTK_GuestAccess.Rule.${parseInt(subOption) + 1}`];
          returnVal.UPDATE = {};
          returnVal.UPDATE["Device.X_GTK_GuestAccess.RuleNumberOfEntries"] = ["false", "false", lsData.length, "xsd::unsignedInt"];
          break;
        case "USER_CONFIG_DATA_MODIFY":
          returnVal["Device.X_GTK_GuestAccess.Enable"] = ["false", "true", lsData.EnableGuestAccess, "xsd:boolean"];
          break;
        default:
          throw `[ERROR] ${command} is not supported to handle at ${page} mapping`;
      }
      break;
    default:
      throw `[ERROR] ${page} is not available`;
  }
  return returnVal;
}

module.exports = { mapping };

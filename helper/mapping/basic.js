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
  console.log(`== helper.mapping.basic, mapping for ${page} with subOption: ${subOption} ===`);
  switch (page) {
    case "basic-lan-dev_connected.html":
      // for (const index in lsData) {
      //   if (lsData.hasOwnProperty(index)) {
      //     const element = lsData[index];
      //     const obj = `Device.Hosts.Host.${index}`;
      //     returnVal[`${obj}`]             = ["true", "false", "", ""];
      //     returnVal[`${obj}.HostName`]    = ["false", "true", element.HostName, "xsd::string"];
      //     returnVal[`${obj}.PhysAddress`] = ["false", "true", element.MACAddress, "xsd::string"];
      //     returnVal[`${obj}.IPAddress`]   = ["false", "true", element.IPAddress, "xsd::string"];
      //   }
      // }
      break;
    case "basic-lan-ipv4Config.html":
      var complexPrefix = ["Device.DHCPv4.Server.Pool.1.StaticAddress"];
      returnVal = {
        "Device.IP.Interface.1.IPv4Address.1.IPAddress" : ["false", "true", lsData.DeviceIPAddress, "xsd::string"],
        "Device.IP.Interface.1.IPv4Address.1.SubnetMask": ["false", "true", lsData.SubnetMask, "xsd::string"],
        "Device.DHCPv4.Server.Pool.1.Enable"            : ["false", "true", lsData.DHCPMode, "xsd::string"],
        "Device.DHCPv4.Server.Pool.1.MinAddress"        : ["false", "true", lsData.BeginAddress, "xsd::string"],
        "Device.DHCPv4.Server.Pool.1.MaxAddress"        : ["false", "true", lsData.EndAddress, "xsd::string"],
        "Device.DHCPv4.Server.Pool.1.LeaseTime"         : ["false", "true", lsData.LeaseTime, "xsd::string"],
      };
      returnVal.complexPart = {};
      returnVal.complexPrefix = complexPrefix;
      returnVal.complexPart[`${complexPrefix[0]}`] = ["true", "true", "", "xsd::string"];
      returnVal.complexPartLength = lsData.IPAddressReservation.length;
      lsData.IPAddressReservation.forEach((element, index) => {
        const obj = `${complexPrefix[0]}.${index + 1}`;
        returnVal.complexPart[`${obj}`]           = ["true", "true", "", "xsd::string"];
        returnVal.complexPart[`${obj}.Chaddr`]    = ["false", "true", element.MAC, "xsd::string"];
        returnVal.complexPart[`${obj}.Yiaddr`]    = ["false", "true", element.IP, "xsd::string"];
      });
      break;
    case "basic-lan-ipv6Config.html":
      returnVal = {
        "Device.X_GTK_IPv6.Enable"                      : ["false", "true", lsData.Enable, "xsd::boolean"],
        "Device.X_GTK_IPv6.LANMode"                     : ["false", "true", lsData.AutoConfigurationMode, "xsd::string"],
        "Device.IP.ULAPrefix"                           : ["false", "true", lsData.Prefix, "xsd::string"],
        "Device.X_GTK_IPv6.X_GTK_PRI_DNSv6"             : ["false", "true", lsData.PrimaryDNSv6, "xsd::string"],
        "Device.X_GTK_IPv6.X_GTK_SEC_DNSv6"             : ["false", "true", lsData.SecondaryDNSv6, "xsd::string"],
        "Device.X_GTK_IPv6.Domain"                      : ["false", "true", lsData.DomainName, "xsd::string"],
      };
      break;
    case "basic-registration_ID.html":
      returnVal = {
        "Device.X_GTK_RegID.RegID"                      : ["false", "true", lsData.RegistrationID, "xsd:string"],
      };
      break;
    case "basic-wan-addWAN.html":
    case "basic-wan-ipv4.html":
    case "basic-wan-ipv6.html":
      if (command == "USER_CONFIG_DATA_COMPLEX"){
        var complexPrefix = ["Device.IP.Interface", "Device.DNS.Client.Server.IPv4", "Device.DNS.Client.Server.IPv6", "Device.Ethernet.VLANTermination", "Device.Ethernet.Link", "Device.PPP.Interface"]
        returnVal.complexPart = {};
        returnVal.complexPrefix = complexPrefix;
        returnVal.complexPartLength = lsData.length;

        returnVal[`Device.Ethernet.LinkNumberOfEntries`] = ["false", "false", lsData.length, "xsd::unsignedInt"];
        for (var i = 0; i < lsData.length; i++){
          var dbIndex = i + 1;
          // Device.IP.Interface
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}`]                      = ["true", "true", "", ""];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.Name`]                 = ["false", "true", lsData[i].Name, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.Alias`]                = ["false", "true", `cpe-IPIface-${dbIndex}`, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.Enable`]               = ["false", "true", `true`, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.Status`]               = ["false", "true", lsData[i].Actions ? "Down" : "Up", "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.LowerLayers`]          = ["false", "true", `${complexPrefix[3]}.${dbIndex}`, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_WAN_HW_Mode`]    = ["false", "true", lsData[i].SelectionMode, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DefaultGateway`] = ["false", "true", lsData[i].DefaultGateway ? "true" : "false", "xsd::boolean"];

          // Device.Ethernet.Link
          returnVal.complexPart[`${complexPrefix[4]}.${dbIndex}`]                        = ["true", "true", "", ""];
          returnVal.complexPart[`${complexPrefix[4]}.${dbIndex}.Alias`]                  = ["false", "true", `cpe-EthLink-${dbIndex}`, "xsd::string"];
          if (lsData[i].SelectionMode === "ETH") // Ethernet --> ethermet + Optical simu just only one
            returnVal.complexPart[`${complexPrefix[4]}.${dbIndex}.LowerLayers`]            = ["false", "true", "Device.Ethernet.Interface.1", "xsd::string"];
          else // PON (Optical)
            returnVal.complexPart[`${complexPrefix[4]}.${dbIndex}.LowerLayers`]            = ["false", "true", "Device.Optical.Interface.1", "xsd::string"];
          returnVal.complexPart[`${complexPrefix[4]}.${dbIndex}.MACAddress`]             = ["false", "true", lsData[i].MacCloning, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[4]}.${dbIndex}.Name`]                   = ["false", "true", lsData[i].Name, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[4]}.${dbIndex}.Status`]                 = ["false", "true", lsData[i].Actions ? "Down" : "Up", "xsd::unsignedInt"];
          returnVal.complexPart[`${complexPrefix[4]}.${dbIndex}.X_INTEL_COM_MACCloning`] = ["false", "true", lsData[i].MacCloning ? "true" : "false", "xsd::unsignedInt"];

          // Device.Ethernet.VLANTermination
          returnVal.complexPart[`${complexPrefix[3]}.${dbIndex}`]        = ["true", "true", "", ""];
          returnVal.complexPart[`${complexPrefix[3]}.${dbIndex}.Enable`] = ["false", "true", lsData[i].VLAN ? "true" : "false", "xsd::boolean"];
          returnVal.complexPart[`${complexPrefix[3]}.${dbIndex}.VLANID`] = ["false", "true", lsData[i].VLAN, "xsd::unsignedInt"];

          // Device.IP.Interface (continue)
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv4Address`]                     = ["true", "false", "", ""];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv4Address.1`]                   = ["true", "false", "", ""];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv4Address.1.AddressingType`]    = ["false", "true", lsData[i].ConnectionType, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv4Address.1.Alias`]             = ["false", "true", `cpe-${dbIndex}`, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv4Address.1.X_GTK_Description`] = ["false", "false", lsData[i].ConnectionType, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv4AddressNumberOfEntries`]      = ["false", "false", "1", "xsd::unsignedInt"];

          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Enable`]                      = ["false", "true", lsData[i].EnableIPv6, "xsd::boolean"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Address`]                     = ["true", "false", "", ""];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Address.1`]                   = ["true", "false", "", ""];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Address.1.Alias`]             = ["false", "true", `cpe-${dbIndex}`, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Address.1.Origin`]            = ["false", "true", lsData[i].IPv6.AddressingType, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Prefix.1.Enable`]             = ["false", "true", lsData[i].IPv6.PrefixMode ? "true" : "false", "xsd::boolean"]
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Prefix.1.Origin`]             = ["false", "true", lsData[i].IPv6.PrefixMode, "xsd::string"]
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Prefix.1.Prefix`]             = ["false", "true", lsData[i].IPv6.PrefixAddress, "xsd::string"]
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Prefix.1.PreferredLifetime`]  = ["false", "true", lsData[i].IPv6.PrimaryTime, "xsd::string"]
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Prefix.1.ValidLifetime`]      = ["false", "true", lsData[i].IPv6.ValidTime, "xsd::string"]

          /* Static */
          // Device.DNS.Client.Server
          var dnsListv4 = lsData[i].IPv4DNSServer.join(",");
          var dnsListv6 = lsData[i].IPv6.IPv6DNSServer.join(",");
          // v4
          if (lsData[i].ConnectionType === "Static"){
            returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv4Address.1.IPAddress`]        = ["false", "true", lsData[i].IPAddressStatic, "xsd::string"];
            returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv4Address.1.GatewayIPAddress`] = ["false", "true", lsData[i].GatewayAddressStatic, "xsd::string"];
            returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Address.1.IPAddress`]        = ["false", "true", lsData[i].IPv6.IPv6AddressStatic, "xsd::string"];
            returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Address.1.NextHop`]          = ["false", "true", lsData[i].IPv6.v6GatewayAddressStatic, "xsd::string"];
          } else {
            returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Address.1.IPAddress`]        = ["false", "true", lsData[i].IPv6.IPv6Address, "xsd::string"];
            returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Address.1.NextHop`]          = ["false", "true", lsData[i].IPv6.v6DefaultGateway, "xsd::string"];
            returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv4Address.1.IPAddress`]        = ["false", "true", lsData[i].IPAddress, "xsd::string"];
            returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv4Address.1.GatewayIPAddress`] = ["false", "true", lsData[i].DefaultGateway, "xsd::string"];
          }
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv4Address.1.SubnetMask`] = ["false", "true", lsData[i].SubnetMask, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.IPv6Address.1.Prefix`]     = ["false", "true", lsData[i].IPv6.Prefix, "xsd::string"];
          // DNS list v4
          returnVal.complexPart[`${complexPrefix[1]}.${dbIndex}`]               = ["true", "true", "", ""];
          returnVal.complexPart[`${complexPrefix[1]}.${dbIndex}.DNSServer`]     = ["false", "true", dnsListv4, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[1]}.${dbIndex}.Interface`]     = ["false", "true", `${complexPrefix[0]}.${dbIndex}`, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[1]}.${dbIndex}.Status`]        = ["false", "true", "Enabled", "xsd::string"];
          // DNS list v6
          returnVal.complexPart[`${complexPrefix[2]}.${dbIndex}`]               = ["true", "true", "", ""];
          returnVal.complexPart[`${complexPrefix[2]}.${dbIndex}.DNSServer`]     = ["false", "true", dnsListv6, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[2]}.${dbIndex}.Interface`]     = ["false", "true", `${complexPrefix[0]}.${dbIndex}`, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[2]}.${dbIndex}.Status`]        = ["false", "true", "Enabled", "xsd::string"];

          /* DHCP */
          // DHCPv4 config
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv4Option`]                        =["true", "true", lsData[i].Option60 ? "true" : "false", ""];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv4Option.X_GTK_ClientID`]         =["false", "true", lsData[i].Option61, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv4Option.X_GTK_EnableOption125`]  =["false", "true", lsData[i].Option125 ? "true" : "false", "xsd::boolean"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv4Option.X_GTK_EnableOption60`]   =["false", "true", lsData[i].Option60 ? "true" : "false", "xsd::boolean"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv4Option.X_GTK_EnableOption61`]   =["false", "true", lsData[i].Option61 ? "true" : "false", "xsd::boolean"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv4Option.X_GTK_EnterpriseNumber`] =["false", "true", lsData[i].Option125, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv4Option.X_GTK_VendorClassID`]    =["false", "true", lsData[i].Option60, "xsd::string"];
          // DHCPv6 config
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv6Option`]                        =["true", "true", lsData[i].IPv6.Option60 ? "true" : "false", ""];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv6Option.X_GTK_DUIDLLT`]          =["false", "true", lsData[i].IPv6.Option60 ? "true" : "false", "xsd::boolean"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv6Option.X_GTK_DUIDType`]         =["false", "true", "LLT", "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv6Option.X_GTK_EnableOption1`]    =["false", "true", lsData[i].IPv6.Option1 ? "true" : "false", "xsd::boolean"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv6Option.X_GTK_EnableOption16`]   =["false", "true", (lsData[i].IPv6.Option16_1 && lsData[i].IPv6.Option16_1) ? "true" : "false", "xsd::boolean"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv6Option.X_GTK_EnableOption17`]   =["false", "true", lsData[i].IPv6.Option17 ? "true" : "false", "xsd::boolean"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv6Option.X_GTK_EnterpriseNumber`] =["false", "true", lsData[i].IPv6.Option16_1, "xsd::string"];
          returnVal.complexPart[`${complexPrefix[0]}.${dbIndex}.X_GTK_DHCPv6Option.X_GTK_VendorClassID`]    =["false", "true", lsData[i].IPv6.Option16_2 ? "true" : "false", "xsd::string"];

          /* PPPOE */
          // Device.PPP.Interface
          returnVal.complexPart[`${complexPrefix[5]}.${dbIndex}`]            = ["true", "false", "", ""];
          returnVal.complexPart[`${complexPrefix[5]}.${dbIndex}.Username`]   = ["false", "true", lsData[i].Username, "xsd:string"];
          returnVal.complexPart[`${complexPrefix[5]}.${dbIndex}.Password`]   = ["false", "true", lsData[i].Password, "xsd:string"];
          returnVal.complexPart[`${complexPrefix[5]}.${dbIndex}.MaxMRUSize`] = ["false", "true", lsData[i].MTUSize, "xsd:unsignedInt"];
        }
      }  else if (command  == "USER_CONFIG_DATA_MODIFY"){
        returnVal[`Device.IP.Interface.${subOption + 1}.Status`] = ["false", "true", lsData.Actions ? "Down" : "Up", "xsd::string"];
      }
      break;
    default:
      throw `[ERROR] ${page} is not available`;
  }
  console.log(returnVal);
  return returnVal;
}

module.exports = { mapping };

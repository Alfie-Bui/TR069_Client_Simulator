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
  console.log("\n=== helper.mapping.advanced.mapping() ===");
  console.log("\lsData = \n", lsData);
  var returnVal = {};
  switch (page) {
    case "advanced-alg.html":
      returnVal = {
        "Device.NAT.X_GTK_ALG.TFTP"             : ["false", "true", lsData.EnableTFTPALG, "xsd:boolean"],
        "Device.NAT.X_GTK_ALG.FTP"              : ["false", "true", lsData.EnableFTPALG, "xsd:boolean"],
        "Device.NAT.X_GTK_ALG.SIP"              : ["false", "true", lsData.EnableSIPALG, "xsd:boolean"],
        "Device.NAT.X_GTK_ALG.H323"             : ["false", "true", lsData.EnableH323ALG, "xsd:boolean"],
        "Device.NAT.X_GTK_ALG.PPTP"             : ["false", "true", lsData.EnablePPTPPassthrough, "xsd:boolean"],
        "Device.NAT.X_GTK_ALG.L2TP"             : ["false", "true", lsData.EnableL2TPPassthrough, "xsd:boolean"],
        "Device.NAT.X_GTK_ALG.IPSec"            : ["false", "true", lsData.EnableIPSecPassthrough, "xsd:boolean"],
      };
      break;
    case "advanced-ddns.html":
      returnVal = {
        "Device.DynamicDNS.Client.1.Status"         : ["false", "false", lsData.EnableDDNS === true? "Enabled" : "Disabled", "xsd:string"],
        "Device.DynamicDNS.Client.1.Enable"         : ["false", "true", lsData.EnableDDNS, "xsd:boolean"],
        "Device.DynamicDNS.Client.1.Server"         : ["false", "true", `Device.DynamicDNS.Server.${lsData.ServiceProvider}`, "xsd:string"],
        "Device.DynamicDNS.Client.1.Interface"      : ["false", "true", lsData.LocalWanInterface, "xsd:string"],
        "Device.DynamicDNS.Client.1.Username"       : ["false", "true", lsData.Username, "xsd:string"],
        "Device.DynamicDNS.Client.1.Password"       : ["false", "true", lsData.Password, "xsd:string"],
        "Device.DynamicDNS.Client.1.Hostname.1.Name": ["false", "true", lsData.DomainName, "xsd:string"],
      };
      break;
    case "advanced-device_management.html":
      returnVal = {
        "Device.ManagementServer.EnableCWMP"                : ["false", "true", lsData.EnaCWMP, "xsd::string"],
        "Device.ManagementServer.URL"                       : ["false", "true", lsData.ACSURL, "xsd::string"],
        "Device.ManagementServer.Username"                  : ["false", "true", lsData.ACSUsername, "xsd::string"],
        "Device.ManagementServer.Password"                  : ["false", "true", lsData.ACSPassword, "xsd::string"],
        "Device.ManagementServer.PeriodicInformEnable"      : ["false", "true", lsData.EnaPerodic, "xsd::string"],
        "Device.ManagementServer.PeriodicInformInterval"    : ["false", "true", lsData.PerodicInterval, "xsd::string"],
        "Device.ManagementServer.X_GTK_Interface"           : ["false", "true", lsData.LocalWANInterface, "xsd::string"],
        "Device.ManagementServer.ConnectionRequestUsername" : ["false", "true", lsData.ConnectionReqUsername, "xsd::string"],
        "Device.ManagementServer.ConnectionRequestPassword" : ["false", "true", lsData.ConnectionReqPasword, "xsd::string"],
      };
      break;
    case "advanced-dmz.html":
      returnVal = {
        "Device.NAT.X_GTK_DMZ.Enable": ["false", "true", lsData.EnableDMZ.toString(), "xsd:boolean"],
        "Device.NAT.X_GTK_DMZ.IPAddress": ["false", "true", lsData.IPAddr, "xsd::string"],
      };
      break;
    case "advanced-multicast-ipv4Setting.html":
      returnVal = {
        "Device.X_GTK_Mcast.IGMPParameters.FastLeaveStatus"     : ["false", "true", lsData.FastLeave, "xsd:boolean"],
        "Device.X_GTK_Mcast.IGMPParameters.QueryRespInterval"   : ["false", "true", lsData.GroupQInterval, "xsd:unsignedInt"],
        "Device.X_GTK_Mcast.IGMPParameters.LastMemQueryInterval": ["false", "true", lsData.GroupLInterval, "xsd:unsignedInt"],
        "Device.X_GTK_Mcast.IGMPParameters.LastMemQueryCount"   : ["false", "true", lsData.GroupLCount, "xsd:unsignedInt"]
      }
      break;
    case "advanced-multicast.html":
      returnVal = {
        "Device.X_GTK_Mcast.UpStreamIntrfName"                  : ["false", "true", lsData.UpstreamInterface.length == 0 ? "None" : lsData.UpstreamInterface.join(","), "xsd:string"],
        "Device.X_GTK_Mcast.DownStreamIntrf"                    : ["false", "true", lsData.DownStreamInterface.length == 0 ? "None" : lsData.DownStreamInterface[0], "xsd:string"],
        "Device.X_GTK_Mcast.IGMPParameters.SnoopingStatus"      : ["false", "true", lsData.Snooping, "xsd:boolean"],
        "Device.X_GTK_Mcast.IGMPParameters.ProxyStatus"         : ["false", "true", lsData.IGMPProxy, "xsd:boolean"],
      };
      break;
    case "advanced-port_mapping-add.html":
      var complexPrefixes = ["Device.NAT.PortMapping"];
      var dbIndex = parseInt(subOption) + 1;
      returnVal[`${complexPrefixes[0]}.${dbIndex}`]                     = ["true", "true", "", ""];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.Enable`]              = ["false", "true", lsData.Enable.toString(), "xsd:boolean"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.RemoteHost`]          = ["false", "true", lsData.IPv4, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.ExternalPort`]        = ["false", "true", lsData.PortRange[0], "xsd:unsignedInt"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.ExternalPortEndRange`]= ["false", "true", lsData.PortRange[1], "xsd:unsignedInt"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.InternalPort`]        = ["false", "true", lsData.Port, "xsd:unsignedInt"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.Protocol`]            = ["false", "true", lsData.Protocol, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.InternalClient`]      = ["false", "true", lsData.IPAddr, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.Description`]         = ["false", "true", lsData.NameOfRule, "xsd:string"];
      if (lsData.Interface === "All") {
        returnVal[`${complexPrefixes[0]}.${dbIndex}.AllInterfaces`]       = ["false", "true", "true", "xsd:boolean"];
        returnVal[`${complexPrefixes[0]}.${dbIndex}.X_GTK_INTERFACE`]     = ["false", "true", "", "xsd:string"];
      } else {
        returnVal[`${complexPrefixes[0]}.${dbIndex}.AllInterfaces`]       = ["false", "true", "false", "xsd:boolean"];
        returnVal[`${complexPrefixes[0]}.${dbIndex}.X_GTK_INTERFACE`]     = ["false", "true", lsData.Interface, "xsd:string"];
      }
      break;
    case "advanced-port_mapping.html":
      returnVal.DELETE = [`Device.NAT.PortMapping.${parseInt(subOption) + 1}`];
      break;
    case "advanced-port_triggering-add.html":
      var complexPrefixes = ["Device.NAT.X_GTK_PortTriggering"];
      var dbIndex = parseInt(subOption) + 1;
      returnVal[`${complexPrefixes[0]}.${dbIndex}`]                     = ["true", "true", "", ""];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.Enable`]              = ["false", "true", lsData.EnaRule.toString(), "xsd:boolean"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.TriggerPort`]         = ["false", "true", lsData.TrigerPort, "xsd:unsignedInt"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.TriggerProtocol`]     = ["false", "true", lsData.TrigerProtocol, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.TriggerPortEndRange`] = ["false", "true", lsData.TrigerPortRange, "xsd:unsignedInt"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.OpenPort`]            = ["false", "true", lsData.IncomingPort, "xsd:unsignedInt"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.OpenPortEndRange`]    = ["false", "true", lsData.IncomingPortRange, "xsd:unsignedInt"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.OpenProtocol`]        = ["false", "true", lsData.IncomingProtocol, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${dbIndex}.Alias`]               = ["false", "true", `cpe-${dbIndex}`, "xsd:string"];
      break;
    case "advanced-port_triggering.html":
      returnVal.DELETE = [`Device.NAT.X_GTK_PortTriggering.${parseInt(subOption) + 1}`];
      break;
    case "advanced-static_routing-add.html":
      var complexPrefixes = ["Device.Routing.Router.1.IPv4Forwarding"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}`]                     = ["true", "true", "", ""];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.StaticRoute`]         = ["false", "true", "false", "xsd:boolean"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.DestIPAddress`]       = ["false", "true", lsData[subOption].DestIPAddress, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.DestSubnetMask`]      = ["false", "true", lsData[subOption].DestSubnetMask, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.GatewayIPAddress`]    = ["false", "true", lsData[subOption].GatewayIPAddress, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.Interface`]           = ["false", "true", lsData[subOption].Interface, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.Enable`]              = ["false", "true", "true", "xsd:boolean"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.Alias`]               = ["false", "false", `cpe-${parseInt(subOption) + 1}`, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.Status`]              = ["false", "false", "Enabled", "xsd:string"];
      break;
    case "advanced-static_routing-ipv6Config-add.html":
      var complexPrefixes = ["Device.Routing.Router.1.IPv6Forwarding"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}`]                     = ["true", "true", "", ""];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.DestIPPrefix`]        = ["false", "true", lsData[subOption].DestIPPrefix, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.NextHop`]             = ["false", "true", lsData[subOption].NextHop, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.Interface`]           = ["false", "true", lsData[subOption].Interface, "xsd:string"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.Enable`]              = ["false", "true", "true", "xsd:boolean"];
      returnVal[`${complexPrefixes[0]}.${parseInt(subOption) + 1}.Origin`]              = ["false", "false", "DHCPv6", "xsd:string"];
      break;
    case "advanced-static_routing-ipv6Config.html":
      returnVal.DELETE = [`Device.Routing.Router.1.IPv6Forwarding.${parseInt(subOption) + 1}`];
      break;
    case "advanced-static_routing.html":
      returnVal.DELETE = [`Device.Routing.Router.1.IPv4Forwarding.${parseInt(subOption) + 1}`];
      break;
    case "advanced-upnp.html":
      returnVal = {
        "Device.UPnP.Device.Enable": ["false", "true", lsData.EnaUPnP, "xsd:boolean"],
      };
      break;
    case "advanced-vpn-add.html":
      var ipsecIdx = parseInt(subOption) + 1;
      var ipsecPrefix = ["Device.X_GTK_IPSec.Tunnel"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}`]                                      = ["true", "true", "", ""];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.Enable`]                               = ["false", "true", lsData.openwrtipsecremote_enabled === 'on' ? 'true' : 'false', "xsd:boolean"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.TunnelName`]                           = ["false", "true", lsData.tunnel_name, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.SharedKey`]                            = ["false", "true", lsData.openwrtipsecremotepre_shared_key, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.SercurityPolicy`]                      = ["false", "true", lsData.acceptable_kmp, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.Interface`]                            = ["false", "true", lsData.conn_ifname, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.RemoteIP`]                             = ["false", "true", lsData.remote_ip, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.LocalSubnet`]                          = ["false", "true", lsData.src, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.RemoteSubnet`]                         = ["false", "true", lsData.dst, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.P1_EncryptionAligorithms`]             = ["false", "true", lsData.kmp_enc_alg, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.P1_HashAligorithms`]                   = ["false", "true", lsData.kmp_hash_alg, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.P1_DHGroup`]                           = ["false", "true", lsData.kmp_dh_group, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.P2_EncryptionAligorithms`]             = ["false", "true", lsData.encryption_algorithm, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.P2_HashAligorithms`]                   = ["false", "true", lsData.hash_algorithm, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.P2_DHGroup`]                           = ["false", "true", lsData.enc_dh_group, "xsd:string"];
      returnVal[`${ipsecPrefix[0]}.${ipsecIdx}.P2_LifeTime`]                          = ["false", "true", lsData.ipsec_sa_lifetime_time, "xsd:string"];
      if (command === "USER_CONFIG_DATA_ADD") {
        returnVal.UPDATE = {};
        returnVal.UPDATE["Device.X_GTK_IPSec.TunnelNumberOfEntries"] = ["false", "false", ipsecIdx.toString(), "xsd::unsignedInt"];
      }
      break;
    case "advanced-vpn.html":
      returnVal.DELETE = [`Device.X_GTK_IPSec.Tunnel.${parseInt(subOption) + 1}`];
      returnVal.UPDATE = {};
      returnVal.UPDATE["Device.X_GTK_IPSec.TunnelNumberOfEntries"] = ["false", "false", lsData.length.toString(), "xsd::unsignedInt"];
      break;
    default:
      throw `[ERROR] ${page} is not available`;
  }
  console.log("Mapping data: ", returnVal);
  return returnVal;
}

module.exports = { mapping };

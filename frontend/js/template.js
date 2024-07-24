/**
 *
 * @NOTE Change Version to refresh database in case you have any update at database
 *
 */

const SIMULATOR_VERSION =
  "GemtekACSClient_t03_20Jun24"; /* Release version and tag tracking */

/**
 *
 * ===== Template data (at init it will load template data to local store then fill in HTML file)
 *
 */
const template = {
  Status: {
    Status: {
      Manufacturer: "Gemtek",
      SerialNumber: "BWT230512002202",
      ModelName: "TB-362",
      HardwareVersion: "PRX300 rev 1.2, PRX321-HGU-11AX",
      SubnetMask: "255.255.255.0",
      PrimaryDNS: "8.8.8.8",
      SecondaryDNS: "8.8.4.4",
      MACAddress: "4c:ba:7d:a7:55:22",
    },
  },
  Basic: {
    WAN: {
      onEdit: "", // if empty --> Add button instead of Edit button
      atv6Config: false,
      Interfaces: [
        {
          Name: "ANI0_wan8",
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
        },
      ],
    },
    LAN: {
      IPv4Configuration: {
        DeviceIPAddress: "192.168.1.1",
        SubnetMask: "255.255.255.0",
        DHCPMode: 0,
        BeginAddress: "192.168.1.2",
        EndAddress: "192.168.1.254",
        LeaseTime: 1,
        IPAddressReservation: [],
      },
      IPv6Configuration: {
        Enable: true,
        AutoConfigurationMode: 2,
        Prefix: "fd00::",
        PrimaryDNSv6: "fd00::1",
        SecondaryDNSv6: "",
        DomainName: "gemtek.com",
      },
      DeviceConnected: [
        {
          HostName: "DESKTOP-DL2F1BS",
          MACAddress: "ac:1a:3d:91:fc:cb",
          IPAddress: "192.168.1.2",
        },
        {
          HostName: "DESKTOP-ABS145B",
          MACAddress: "77:1a:3d:43:2e:cb",
          IPAddress: "192.168.1.15",
        },
      ],
    },
    RegistrationID: {
      RegistrationID: "",
    },
  },
  Wifi: {
    "2.4G": {
      SSIDs: [
        {
          WPSEnabled: false,
          RekeyInterval: "3600",
          Maxconnected: "255",
          BridgeName: "br-lan",
          Configuration: {
            EnableRadio: true,
            AutoChannel: true,
            OperationMode: "bgnax",
            Channel: 1,
            ChannelBandwidth: "Auto",
            AdvertiseSSID: true,
            WMM: true,
            WMMPS: true,
            APIsolation: false,
            SSID: "GEMTEK",
            SecurityType: "WPA2-Personal",
            Passphrase: "wifi_password",
            DTIM: 2,
            BeaconInterval: 100,
            PowerScale: 12,
            EnableCoExistence: true,
          },
          WDS: {
            WDSMode: "Disabled",
            MACAddress: [],
          },
          MACFiltering: {
            ACLMode: "Disabled",
            MACAddressFilter: [],
          },
        },
      ],
    },
    "5G": {
      SSIDs: [
        {
          WPSEnabled: false,
          RekeyInterval: "3600",
          Maxconnected: "255",
          BridgeName: "br-lan",
          Configuration: {
            EnableRadio: true,
            AutoChannel: true,
            UseDFSChannels: true,
            OperationMode: "a",
            Channel: 36,
            ChannelBandwidth: 4,
            AdvertiseSSID: true,
            WMM: true,
            WMMPS: true,
            APIsolation: false,
            SSID: "GEMTEK5G",
            SecurityType: "WPA2-Personal",
            Passphrase: "wifi_password2",
            DTIM: 2,
            BeaconInterval: 100,
            PowerScale: 12,
          },
          WDS: {
            WDSMode: "Disabled",
            MACAddress: [],
          },
          MACFiltering: {
            ACLMode: "Disabled",
            MACAddressFilter: [],
          },
        },
      ],
    },
    GuestAccess: {
      onEdit: "", // if empty --> Add button instead of Edit button
      EnableGuestAccess: true,
      Interfaces: [],
    },
  },
  Advanced: {
    ALG: {
      EnableFTPALG: true,
      EnableTFTPALG: true,
      EnableH323ALG: true,
      EnableSIPALG: true,
      EnablePPTPPassthrough: true,
      EnableL2TPPassthrough: true,
      EnableIPSecPassthrough: true,
    },
    DDNS: {
      EnableDDNS: true,
      ServiceProvider: 1,
      LocalWanInterface: 1,
      Username: "your_username",
      Password: "your_password",
      DomainName: "yourhost.example.com",
    },
    DMZ: {
      EnableDMZ: false,
      IPAddr: "0.0.0.0",
    },
    DeviceManagement: {
      EnaCWMP: true,
      LocalWANInterface: 0,
      ACSURL: "http://192.168.99.100:7547",
      ACSUsername: "admin",
      ACSPassword: "admin",
      ConnectionReqURL: "",
      ConnectionReqUsername: "admin",
      ConnectionReqPasword: "admin",
      EnaPerodic: true,
      PerodicInterval: 86400,
    },
    Multicast: {
      IGMPProxy: true,
      Snooping: true,
      UpstreamInterface: [],
      DownStreamInterface: [true],
      // IPv4 Advanced
      FastLeave: true,
      GroupQInterval: 10,
      GroupLInterval: 2,
      GroupLCount: 2,
    },
    PortTriggering: {
      onEdit: "",
      Rules: [],
    },
    PortMapping: {
      onEdit: "",
      data: [],
    },
    UPnP: {
      EnaUPnP: false,
    },
    StaticRouting: {
      StaticRoutingConfiguration: {
        NumberOfEntries: "0",
        0: {
          DestIPAddress: "",
          DestSubnetMask: "",
          GatewayIPAddress: "",
          Interface: "",
        },
      },
      IPv6StaticRoutingConfiguration: {
        NumberOfEntries: "0",
        0: {
          DestIPPrefix: "",
          NextHop: "",
          Interface: "",
        },
      },
    },
    vpn: {
      openwrtipsecremote: {
        NumberOfEntries: "1",
        0: {
          openwrtipsecremote_enabled: "on",
          tunnel_name: "gemtek",
          openwrtipsecremotepre_shared_key: "password",
          acceptable_kmp: "ikev1",
          conn_ifname: "ANI0_wan8",
          remote_ip: "27.72.192.226",
          src: "192.168.1.0/24",
          dst: "192.168.6.0/24",
          kmp_enc_alg: "aes128",
          kmp_hash_alg: "md5",
          kmp_dh_group: "modp768",
          encryption_algorithm: "aes128",
          hash_algorithm: "md5",
          enc_dh_group: "modp768",
          ipsec_sa_lifetime_time: "120",
          status: "unchanged",
        },
      },
    },
  },
  Security: {
    Firewall: {
      EnableFirewall: true,
      Services: {
        EnableTelnet: true,
        EnableSSH: true,
        EnableHTTPS: true,
        EnableICMP: true,
      },
    },
    ParentalControl: {
      ParentalControlSettings: {
        EnableParentalControl: true,
        DefaultAction: "0" /* 1: permit, 0: deny */,
      },
      DeviceUnderParentalControl: {
        onEdit: "",
        Rules: [],
      },
    },
  },
  VoIP: {
    Interface: 0,
    TelephoneNumber: "2310",
    RegistarAddress: "10.20.55.13",
    AuthenticationID: "2310",
    Password: "2310",
    RegistarPort: "5060",
    SIPProxy: "0.0.0.0",
    SIPProxyPort: "5060",
    OutboundProxy: "0.0.0.0",
    OutboundProxyPort: "5060",
  },
  Utilities: {
    System: {
      SystemLogRule: {
        Name: "messages",
        MaximumSize: "1000",
        DeviceDeviceInfoVendorLogFile1_X_GTK_Remote: false,
        RemoteIP: "192.168.1.5",
        PortNo: "9999",
      },
    },
    SystemTime: {
      DeviceTime_Enable: true,
      NTPServer1: "0.asia.pool.ntp.org",
      NTPServer2: "1.asia.pool.ntp.org",
      NTPServer3: "2.asia.pool.ntp.org",
      NTPServer4: "3.asia.pool.ntp.org",
      NTPServer5: "0.north-america.pool.ntp.org",
      X_GTK_TimeZoneLocation: 221, // Asia/HoChiMinh
    },
  },
  Account: {
    UserName: "admin",
    Password: "admin",
  },
};

/**
 * Deploy template to localStorage
 */

/**
 * Test query
 */
// for (let key in template)
// {
//   console.log(key.toString());
//   console.log(template["Wifi"]["2.4G"]);
// }

/**
 *
 * Dialog template
 *
 */
const deleteDialogTemplate =
  '<div id="deletedialog" class="ngdialog ngdialog-theme-default dialogwidth800 hide"> \
  <div class="ngdialog-overlay"></div> \
  <div class="ngdialog-content"> \
    <div class="ngdialog-message"> \
      <img src="images/icons/icon-1/deletedialog.svg" /> \
      <h3></h3> \
      <p class="ng-binding"></p> \
    </div> \
    <div class="ngdialog-buttons"> \
      <button type="button" class="ngdialog-button gemtek-btn-normal ng-binding" id="Cancel">Cancel</button> \
      <button type="button" class="ngdialog-button gemtek-btn-danger ng-binding" id="OK">Ok</button> \
    </div> \
  </div> \
</div>';

const alertDialogTemplate =
  '<div id="alertDialog" class="ngdialog ngdialog-theme-default dialogwidth800">\
  <div class="ngdialog-overlay"></div>\
  <div class="ngdialog-content">\
    <div class="ngdialog-message">\
      <img src="images/icons/icon-1/ico-notice.svg" />\
      <h3>Notice</h3>\
      <p id="alertDialog_msg"></p>\
    </div>\
    <div class="ngdialog-buttons">\
      <button id="Close" type="button" class="gemtek-btn-primary ng-binding">Close</button>\
    </div>\
  </div>\
</div>';

/** Pattern */
const IPv4_PATTERN =
  "^((?:2[0-2][0-3]|[01]?[0-9][0-9]?)\\.){1}((?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){2}((?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$";
const SUBNET_PATTERN =
  "^(((255\\.){3}(255|254|252|248|240|224|192|128|0+))|((255\\.){2}(255|254|252|248|240|224|192|128|0+)\\.0)|((255.)(255|254|252|248|240|224|192|128|0+)(\\.0+){2})|((255|254|252|248|240|224|192|128)(\\.0+){3}))$";
const MAC_PATTERN =
  "^[\\da-fA-F](?:[^\\Wg-zG-Z13579bBdDfF_]{1})([:])(?:[0-9a-fA-F]{1,2}\\1){4}[0-9a-fA-F]{1,2}$";

const WIFI_MAC_PATTERN =
  "^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{2}[\\-]){5}([0-9A-Fa-f]{2})$";

const IPv6_PREFIX_ADDR_PATTERN =
  "(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\\/(\\d{1,2}|1[0-1]\\d|12[0-8])$";
const IPv6_PATTERN =
  "^\\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))(%.+)?\\s*$";
// these two pattern below use for at set WAN Static IPv6, invalid when 0::0 && Multicast address
const INVALID_IPv6_MULTICAST = /^([0?]|:){1,4}(:([0?]{0,4})*){1,7}$/i;
const INVALID_IPv6_NOIP = /^FF/i;

const WEP64_KEY_PATTERN = "^[0-9a-fA-F]+$";
const WEP128_KEY_PATTERN = "^[0-9a-fA-F]+$";

const URL_PATTERN =
  /^[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&amp;&#39;\*\+,;=.]+$/;

const PORT_PATTERN = /^\d{1,5}$/;
/** Pool WAN interface */
const WAN_INTERFACE_POOL = [
  "ANI0_wan8",
  "ANI0_wan9",
  "ANI0_wan10",
  "ANI0_wan11",
  "ANI0_wan12",
  "ANI0_wan13",
  "ANI0_wan14",
];

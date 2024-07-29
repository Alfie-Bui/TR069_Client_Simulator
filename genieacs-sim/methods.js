"use strict";

const http = require("http");
const https = require("https");
const xmlParser = require("../helper/xml-parser");
const xmlUtils = require("../helper/xml-utils");
const dbService = require("../dbService");
const utils = require("../utils.js");

const INFORM_PARAMS = [
  "Device.DeviceInfo.SpecVersion",
  "InternetGatewayDevice.DeviceInfo.SpecVersion",
  "Device.DeviceInfo.HardwareVersion",
  "InternetGatewayDevice.DeviceInfo.HardwareVersion",
  "Device.DeviceInfo.SoftwareVersion",
  "InternetGatewayDevice.DeviceInfo.SoftwareVersion",
  "Device.DeviceInfo.ProvisioningCode",
  "InternetGatewayDevice.DeviceInfo.ProvisioningCode",
  "Device.ManagementServer.ParameterKey",
  "InternetGatewayDevice.ManagementServer.ParameterKey",
  "Device.ManagementServer.ConnectionRequestURL",
  "InternetGatewayDevice.ManagementServer.ConnectionRequestURL",
  "Device.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ExternalIPAddress",
  "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ExternalIPAddress",
  "Device.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress",
  "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress",
];

function inform(device, event, callback) {
  let manufacturer = "";
  if (device["DeviceID.Manufacturer"]) {
    manufacturer = xmlUtils.node(
      "Manufacturer",
      {},
      xmlParser.encodeEntities(device["DeviceID.Manufacturer"][1])
    );
  } else if (device["Device.DeviceInfo.Manufacturer"]) {
    manufacturer = xmlUtils.node(
      "Manufacturer",
      {},
      xmlParser.encodeEntities(device["Device.DeviceInfo.Manufacturer"][1])
    );
  } else if (device["InternetGatewayDevice.DeviceInfo.Manufacturer"]) {
    manufacturer = xmlUtils.node(
      "Manufacturer",
      {},
      xmlParser.encodeEntities(
        device["InternetGatewayDevice.DeviceInfo.Manufacturer"][1]
      )
    );
  }

  let oui = "";
  if (device["DeviceID.OUI"]) {
    oui = xmlUtils.node(
      "OUI",
      {},
      xmlParser.encodeEntities(device["DeviceID.OUI"][1])
    );
  } else if (device["Device.DeviceInfo.ManufacturerOUI"]) {
    oui = xmlUtils.node(
      "OUI",
      {},
      xmlParser.encodeEntities(device["Device.DeviceInfo.ManufacturerOUI"][1])
    );
  } else if (device["InternetGatewayDevice.DeviceInfo.ManufacturerOUI"]) {
    oui = xmlUtils.node(
      "OUI",
      {},
      xmlParser.encodeEntities(
        device["InternetGatewayDevice.DeviceInfo.ManufacturerOUI"][1]
      )
    );
  }

  let productClass = "";
  if (device["DeviceID.ProductClass"]) {
    productClass = xmlUtils.node(
      "ProductClass",
      {},
      xmlParser.encodeEntities(device["DeviceID.ProductClass"][1])
    );
  } else if (device["Device.DeviceInfo.ProductClass"]) {
    productClass = xmlUtils.node(
      "ProductClass",
      {},
      xmlParser.encodeEntities(device["Device.DeviceInfo.ProductClass"][1])
    );
  } else if (device["InternetGatewayDevice.DeviceInfo.ProductClass"]) {
    productClass = xmlUtils.node(
      "ProductClass",
      {},
      xmlParser.encodeEntities(
        device["InternetGatewayDevice.DeviceInfo.ProductClass"][1]
      )
    );
  }

  let serialNumber = "";
  if (device["DeviceID.SerialNumber"]) {
    serialNumber = xmlUtils.node(
      "SerialNumber",
      {},
      xmlParser.encodeEntities(device["DeviceID.SerialNumber"][1])
    );
  } else if (device["Device.DeviceInfo.SerialNumber"]) {
    serialNumber = xmlUtils.node(
      "SerialNumber",
      {},
      xmlParser.encodeEntities(device["Device.DeviceInfo.SerialNumber"][1])
    );
  } else if (device["InternetGatewayDevice.DeviceInfo.SerialNumber"]) {
    serialNumber = xmlUtils.node(
      "SerialNumber",
      {},
      xmlParser.encodeEntities(
        device["InternetGatewayDevice.DeviceInfo.SerialNumber"][1]
      )
    );
  }

  let deviceId = xmlUtils.node("DeviceId", {}, [
    manufacturer,
    oui,
    productClass,
    serialNumber,
  ]);

  let eventStruct = xmlUtils.node("EventStruct", {}, [
    xmlUtils.node("EventCode", {}, event || "2 PERIODIC"),
    xmlUtils.node("CommandKey"),
  ]);

  let evnt = xmlUtils.node(
    "Event",
    {
      "soap-enc:arrayType": "cwmp:EventStruct[1]",
    },
    eventStruct
  );

  let params = [];
  for (let p of INFORM_PARAMS) {
    let param = device[p];
    if (!param) continue;

    params.push(
      xmlUtils.node("ParameterValueStruct", {}, [
        xmlUtils.node("Name", {}, p),
        xmlUtils.node(
          "Value",
          { "xsi:type": param[2] },
          xmlParser.encodeEntities(param[1])
        ),
      ])
    );
  }

  let parameterList = xmlUtils.node(
    "ParameterList",
    {
      "soap-enc:arrayType": `cwmp:ParameterValueStruct[${INFORM_PARAMS.length}]`,
    },
    params
  );

  let inform = xmlUtils.node("cwmp:Inform", {}, [
    deviceId,
    evnt,
    xmlUtils.node("MaxEnvelopes", {}, "1"),
    xmlUtils.node("CurrentTime", {}, new Date().toISOString()),
    xmlUtils.node("RetryCount", {}, "0"),
    parameterList,
  ]);

  return callback(inform);
}

const pending = [];

function getPending() {
  return pending.shift();
}

function getSortedPaths(device) {
  if (device._sortedPaths) return device._sortedPaths;
  const ignore = new Set([
    "DeviceID",
    "Downloads",
    "Tags",
    "Events",
    "Reboot",
    "FactoryReset",
    "VirtalParameters",
  ]);
  device._sortedPaths = Object.keys(device)
    .filter((p) => p[0] !== "_" && !ignore.has(p.split(".")[0]))
    .sort();
  return device._sortedPaths;
}

async function GetParameterNames(device, request, callback) {
  dbService.getValue({}, function (error, docs) {
    if (error) {
      console.error(
        "[ERROR] Encounter error when try handle GetParameterValues command from server, error: ",
        error
      );
      return callback("Get Parameter Values fail", true);
    }
    device = utils.createDeviceDataToSendACSServer(docs);
    let parameterNames = getSortedPaths(device);

    let parameterPath, nextLevel;
    for (let c of request.children) {
      switch (c.name) {
        case "ParameterPath":
          parameterPath = c.text;
          break;
        case "NextLevel":
          nextLevel = Boolean(JSON.parse(c.text));
          break;
      }
    }

    let parameterList = [];

    if (nextLevel) {
      for (let p of parameterNames) {
        if (
          p.startsWith(parameterPath) &&
          p.length > parameterPath.length + 1
        ) {
          let i = p.indexOf(".", parameterPath.length + 1);
          if (i === -1 || i === p.length - 1) parameterList.push(p);
        }
      }
    } else {
      for (let p of parameterNames) {
        if (p.startsWith(parameterPath)) parameterList.push(p);
      }
    }

    let params = [];
    for (let p of parameterList) {
      params.push(
        xmlUtils.node("ParameterInfoStruct", {}, [
          xmlUtils.node("Name", {}, p),
          xmlUtils.node("Writable", {}, String(device[p][0])),
        ])
      );
    }

    let response = xmlUtils.node(
      "cwmp:GetParameterNamesResponse",
      {},
      xmlUtils.node(
        "ParameterList",
        {
          "soap-enc:arrayType": `cwmp:ParameterInfoStruct[${parameterList.length}]`,
        },
        params
      )
    );

    return callback(response);
  });
}

async function GetParameterValues(device, request, callback) {
  dbService.getValue({}, function (error, docs) {
    if (error) {
      console.error(
        "[ERROR] Encounter error when try handle GetParameterValues command from server, error: ",
        error
      );
      return callback("Get Parameter Values fail", true);
    }
    device = utils.createDeviceDataToSendACSServer(docs);

    let parameterNames = request.children[0].children;

    let params = [];
    for (let p of parameterNames) {
      let name = p.text;
      let value = device[name][1];
      let type = device[name][2];
      let valueStruct = xmlUtils.node("ParameterValueStruct", {}, [
        xmlUtils.node("Name", {}, name),
        xmlUtils.node(
          "Value",
          { "xsi:type": type },
          xmlParser.encodeEntities(value)
        ),
      ]);
      params.push(valueStruct);
    }

    let response = xmlUtils.node(
      "cwmp:GetParameterValuesResponse",
      {},
      xmlUtils.node(
        "ParameterList",
        {
          "soap-enc:arrayType":
            "cwmp:ParameterValueStruct[" + parameterNames.length + "]",
        },
        params
      )
    );

    return callback(response);
  });
}

async function SetParameterValues(device, request, callback) {
  try {
    let parameterValues = request.children[0].children;

    for (let p of parameterValues) {
      let name, value;
      for (let c of p.children) {
        switch (c.localName) {
          case "Name":
            name = c.text;
            break;
          case "Value":
            value = c;
            break;
        }
      }

      console.log(`Parameter: ${name}, value: ${value.text}`);
      await dbService.modValue({ [name]: [null, null, value.text, null] }); // because modValue do not change other arretibutes except the value of parameter
      await dbService.reloadDatabase();

      device[name][1] = xmlParser.decodeEntities(value.text);
      device[name][2] = xmlParser
        .parseAttrs(value.attrs)
        .find((a) => a.localName === "type").value;
    }

    let response = xmlUtils.node(
      "cwmp:SetParameterValuesResponse",
      {},
      xmlUtils.node("Status", {}, "0")
    );
    return callback(response);
  } catch (error) {
    console.error(
      "[ERROR] Encounter error when try handle SetParamterValues command from server, error: ",
      error
    );
    return callback("Set Parameter Values fail", true);
  }
}

async function AddObject(device, request, callback) {
  try {
    console.log("\n===== AddObject =====");
    let objectName = request.children[0].text;
    let instanceNumber = 1;
    let newObjToDB = {};
    console.log(`objectName: ${objectName}, instanceNumber: ${instanceNumber}`);

    while (device[`${objectName}${instanceNumber}.`]) instanceNumber += 1;

    device[`${objectName}${instanceNumber}.`] = [true];

    const defaultValues = {
      "xsd:boolean": "false",
      "xsd:int": "0",
      "xsd:unsignedInt": "0",
      "xsd:dateTime": "0001-01-01T00:00:00Z",
    };

    for (let p of getSortedPaths(device)) {
      if (p.startsWith(objectName) && p.length > objectName.length) {
        let n = `${objectName}${instanceNumber}${p.slice(
          p.indexOf(".", objectName.length)
        )}`;
        if (!device[n])
          device[n] = ["true", defaultValues[device[p][2]] || "", device[p][2]];
        newObjToDB[n] = JSON.parse(JSON.stringify(device[n]));
      }
    }

    // sync up to DB
    let newParamList = Object.keys(newObjToDB);
    if (newParamList.length != 0) {
      delete newObjToDB[newParamList[0]];
      newParamList[0] = newParamList[0].slice(0, -1); // delete the "." character at end of object parameter
      newObjToDB[newParamList[0]] = ["true", "true", "", ""];
      for (let i = 1; i < newParamList.length; i++) {
        newObjToDB[newParamList[i]].unshift("false");
      }
    } else {
      newObjToDB[`${objectName}${instanceNumber}`] = ["true", "true", "", ""];
    }
    await dbService.addValue(newObjToDB);
    if (device[`${objectName.slice(0, -1)}NumberOfEntries`] !== undefined) {
      //remove the . character
      device[`${objectName.slice(0, -1)}NumberOfEntries`][1] =
        parseInt(device[`${objectName.slice(0, -1)}NumberOfEntries`][1]) + 1;
      await dbService.modValue({
        [`${objectName.slice(0, -1)}NumberOfEntries`]: [
          "false",
          "false",
          device[`${objectName.slice(0, -1)}NumberOfEntries`][1],
          "xsd:unsignedInt",
        ],
      });
    }
    await dbService.reloadDatabase();

    let response = xmlUtils.node("cwmp:AddObjectResponse", {}, [
      xmlUtils.node("InstanceNumber", {}, String(instanceNumber)),
      xmlUtils.node("Status", {}, "0"),
    ]);
    delete device._sortedPaths;
    return callback(response);
  } catch (error) {
    console.error(
      "[ERROR] Encounter error when try handle AddObject command from server, error: ",
      error
    );
    return callback("Add Object fail", true);
  }
}

async function DeleteObject(device, request, callback) {
  try {
    console.log("\n===== DeleteObject =====");
    let objectName = request.children[0].text;
    console.log(`objectName: ${objectName}`);

    for (let p in device) {
      if (p.startsWith(objectName)) delete device[p];
    }

    // delete at DB
    let delPattern = objectName.slice(0, -1);
    await dbService.delValue([delPattern]);
    if (
      device[`${delPattern.replace(/\.\d+/, "")}NumberOfEntries`] !== undefined
    ) {
      let updateNumberEntries = `${delPattern.replace(
        /\.\d+/,
        ""
      )}NumberOfEntries`;
      //remove the . character, update numberof entry
      device[`${updateNumberEntries}`][1] =
        parseInt(device[`${updateNumberEntries}`][1]) - 1;
      await dbService.modValue({
        [`${updateNumberEntries}`]: [
          "false",
          "false",
          device[`${updateNumberEntries}`][1],
          "xsd:unsignedInt",
        ],
      });
    }
    await dbService.reloadDatabase();

    let response = xmlUtils.node(
      "cwmp:DeleteObjectResponse",
      {},
      xmlUtils.node("Status", {}, "0")
    );
    delete device._sortedPaths;
    return callback(response);
  } catch (error) {
    console.error(
      "[ERROR] Encounter error when try handle DeleteObject command from server, error: ",
      error
    );
    return callback("Delete Object fail", true);
  }
}

function Download(device, request, callback) {
  let commandKey, url;
  for (let c of request.children) {
    switch (c.name) {
      case "CommandKey":
        commandKey = xmlParser.decodeEntities(c.text);
        break;
      case "URL":
        url = xmlParser.decodeEntities(c.text);
        break;
    }
  }

  let faultCode = "9010";
  let faultString = "Download timeout";

  if (url.startsWith("http://")) {
    http
      .get(url, (res) => {
        res.on("end", () => {
          if (res.statusCode === 200) {
            faultCode = "0";
            faultString = "";
          } else {
            faultCode = "9016";
            faultString = `Unexpected response ${res.statusCode}`;
          }
        });
        res.resume();
      })
      .on("error", (err) => {
        faultString = err.message;
      });
  } else if (url.startsWith("https://")) {
    https
      .get(url, (res) => {
        res.on("end", () => {
          if (res.statusCode === 200) {
            faultCode = "0";
            faultString = "";
          } else {
            faultCode = "9016";
            faultString = `Unexpected response ${res.statusCode}`;
          }
        });
        res.resume();
      })
      .on("error", (err) => {
        faultString = err.message;
      });
  }

  const startTime = new Date();
  pending.push(function (callback) {
    let fault = xmlUtils.node("FaultStruct", {}, [
      xmlUtils.node("FaultCode", {}, faultCode),
      xmlUtils.node("FaultString", {}, xmlParser.encodeEntities(faultString)),
    ]);
    let request = xmlUtils.node("cwmp:TransferComplete", {}, [
      xmlUtils.node("CommandKey", {}, commandKey),
      xmlUtils.node("StartTime", {}, startTime.toISOString()),
      xmlUtils.node("CompleteTime", {}, new Date().toISOString()),
      fault,
    ]);

    callback(request, function (xml, callback) {
      callback();
    });
  });

  let response = xmlUtils.node("cwmp:DownloadResponse", {}, [
    xmlUtils.node("Status", {}, "1"),
    xmlUtils.node("StartTime", {}, "0001-01-01T00:00:00Z"),
    xmlUtils.node("CompleteTime", {}, "0001-01-01T00:00:00Z"),
  ]);

  return callback(response);
}

exports.inform = inform;
exports.getPending = getPending;
exports.GetParameterNames = GetParameterNames;
exports.GetParameterValues = GetParameterValues;
exports.SetParameterValues = SetParameterValues;
exports.AddObject = AddObject;
exports.DeleteObject = DeleteObject;
exports.Download = Download;

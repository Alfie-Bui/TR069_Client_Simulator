"use strict";

const net = require("net");
const xmlParser = require("../helper/xml-parser");
const xmlUtils = require("../helper/xml-utils");
const methods = require("./methods");
const dbService = require("../dbService");

// Custom
const utils = require("../utils");
const { count } = require("console");

const NAMESPACES = {
  "soap-enc": "http://schemas.xmlsoap.org/soap/encoding/",
  "soap-env": "http://schemas.xmlsoap.org/soap/envelope/",
  xsd: "http://www.w3.org/2001/XMLSchema",
  xsi: "http://www.w3.org/2001/XMLSchema-instance",
  cwmp: "urn:dslforum-org:cwmp-1-0",
};

let nextInformTimeout = null;
let pendingInform = false;
let http = null;
let requestOptions = null;
let device = null;
let httpAgent = null;
let basicAuth;
let request = null;
let httpServer = null;

function resetGlobal() {
  nextInformTimeout = null;
  pendingInform = false;
  http = null;
  requestOptions = null;
  device = null;
  httpAgent = null;
  basicAuth;
  request = null;
  httpServer = null;
}
resetGlobal();

function createSoapDocument(id, body) {
  let headerNode = xmlUtils.node(
    "soap-env:Header",
    {},
    xmlUtils.node(
      "cwmp:ID",
      { "soap-env:mustUnderstand": 1 },
      xmlParser.encodeEntities(id)
    )
  );

  let bodyNode = xmlUtils.node("soap-env:Body", {}, body);
  let namespaces = {};
  for (let prefix in NAMESPACES)
    namespaces[`xmlns:${prefix}`] = NAMESPACES[prefix];

  let env = xmlUtils.node("soap-env:Envelope", namespaces, [
    headerNode,
    bodyNode,
  ]);

  return `<?xml version="1.0" encoding="UTF-8"?>\n${env}`;
}

function sendRequest(xml, callback) {
  try {
    let headers = {};
    let body = xml || "";

    headers["Content-Length"] = body.length;
    headers["Content-Type"] = 'text/xml; charset="utf-8"';
    headers["Authorization"] = basicAuth;

    if (device._cookie) headers["Cookie"] = device._cookie;

    let options = {
      method: "POST",
      headers: headers,
      agent: httpAgent,
    };

    // console.log("\nAlfie_Bui === Send req with options:");
    // console.log(options);
    // console.log("---\n");

    Object.assign(options, requestOptions);

    request = http.request(options, function (response) {
      let chunks = [];
      let bytes = 0;

      response.on("data", function (chunk) {
        chunks.push(chunk);
        return (bytes += chunk.length);
      });

      return response.on("end", function () {
        // console.log("Response from server___", response);
        let offset = 0;
        body = Buffer.allocUnsafe(bytes);

        chunks.forEach(function (chunk) {
          chunk.copy(body, offset, 0, chunk.length);
          return (offset += chunk.length);
        });

        if (Math.floor(response.statusCode / 100) !== 2) {
          throw new Error(
            `Unexpected response Code ${response.statusCode}: ${body}`
          );
        }

        if (+response.headers["Content-Length"] > 0 || body.length > 0)
          xml = xmlParser.parseXml(body.toString());
        else xml = null;

        if (response.headers["set-cookie"])
          device._cookie = response.headers["set-cookie"];

        return callback(xml);
      });
    });

    request.on("error", function (err) {
      resetGlobal(); // clear current session
      console.error("Request error:", err);
      callback("Error");
    });

    request.setTimeout(30000, function (err) {
      resetGlobal();
      console.log("\nxxxxxxxxxx Close Socket xxxxxxxxxx\n\n");
      // throw new Error("Socket timed out");
    });
    return request.end(body);
  } catch (err) {
    console.error("Catch error at sendReq: ", err);
    callback("Error: ", err);
  }
}

function startSession(event) {
  return new Promise((resolve, reject) => {
    nextInformTimeout = null;
    pendingInform = false;
    const requestId = Math.random().toString(36).slice(-8);

    console.log("Send inform to ACS Server, event, ", event);
    sendInform(requestId, event)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.log("startSession error: ", error);
        reject();
      });
  });
}

function createFaultResponse(code, message) {
  let fault = xmlUtils.node(
    "detail",
    {},
    xmlUtils.node("cwmp:Fault", {}, [
      xmlUtils.node("FaultCode", {}, code),
      xmlUtils.node("FaultString", {}, xmlParser.encodeEntities(message)),
    ])
  );

  let soapFault = xmlUtils.node("soap-env:Fault", {}, [
    xmlUtils.node("faultcode", {}, "Client"),
    xmlUtils.node("faultstring", {}, "CWMP fault"),
    fault,
  ]);

  return soapFault;
}

function cpeRequest() {
  const pending = methods.getPending();
  if (!pending) {
    sendRequest(null, function (xml) {
      handleMethod(xml);
    });
    return;
  }

  const requestId = Math.random().toString(36).slice(-8);

  pending(function (body, callback) {
    let xml = createSoapDocument(requestId, body);
    sendRequest(xml, function (xml) {
      callback(xml, cpeRequest);
    });
  });
}

function handleMethod(xml) {
  if (!xml) {
    httpAgent.destroy();
    let informInterval = 10;
    if (device["Device.ManagementServer.PeriodicInformInterval"])
      informInterval = parseInt(
        device["Device.ManagementServer.PeriodicInformInterval"][1]
      );
    else if (
      device["InternetGatewayDevice.ManagementServer.PeriodicInformInterval"]
    )
      informInterval = parseInt(
        device[
          "InternetGatewayDevice.ManagementServer.PeriodicInformInterval"
        ][1]
      );

    nextInformTimeout = setTimeout(
      function () {
        startSession()
          .then(() => {
            console.log("nextInform success !!");
          })
          .catch(() => {
            console.log("nextInform fail !!");
          });
      },
      pendingInform ? 0 : 1000 * informInterval
    );

    return;
  }

  let headerElement, bodyElement;
  let envelope = xml.children[0];
  for (const c of envelope.children) {
    switch (c.localName) {
      case "Header":
        headerElement = c;
        break;
      case "Body":
        bodyElement = c;
        break;
    }
  }

  let requestId;
  for (let c of headerElement.children) {
    if (c.localName === "ID") {
      requestId = xmlParser.decodeEntities(c.text);
      break;
    }
  }

  let requestElement;
  for (let c of bodyElement.children) {
    if (c.name.startsWith("cwmp:")) {
      requestElement = c;
      break;
    }
  }

  console.log(
    `\n===== Got a server request at ${utils.getHumanReadableTime()} =====`,
    requestElement.localName
  );
  let method = methods[requestElement.localName];

  if (!method) {
    let body = createFaultResponse(9000, "Method not supported");
    let xml = createSoapDocument(requestId, body);
    sendRequest(xml, function (xml) {
      handleMethod(xml);
    });
    return;
  }

  method(device, requestElement, function (body, errFlag) {
    let xml;
    if (errFlag === true) {
      xml = createFaultResponse(9000, body);
      xml = createSoapDocument(requestId, xml);
    } else {
      xml = createSoapDocument(requestId, body);
    }
    sendRequest(xml, function (xml) {
      handleMethod(xml);
    });
  });
}

function listenForConnectionRequests(serialNumber, acsUrlOptions) {
  return new Promise((resolve, reject) => {
    let ip = null;
    let port = null;
    // Start a dummy socket to get the used local ip
    let socket = net
      .createConnection({
        port: acsUrlOptions.port,
        host: acsUrlOptions.hostname,
        family: 4,
      })
      .on("error", (err) => {
        reject(`[ERROR] on error net.createConnection() fail, ${err}`);
      })
      .on("connect", () => {
        ip = socket.address().address;
        port = socket.address().port + 1;
        socket.end();
      })
      .on("close", () => {
        if ((ip !== null) & (port !== null)) {
          let connectionRequestUrl;
          if (acsUrlOptions.protocol == "http:")
            connectionRequestUrl = `http://${ip}:${port}/`; // For HTTP
          else if (acsUrlOptions.protocol == "https:")
            connectionRequestUrl = `https://${ip}:${port}/`; // For HTTPS

          httpServer = http.createServer((_req, res) => {
            console.log(`Simulator ${serialNumber} got connection request`);
            // console.log("Incoming request from ACS server: ", _req);
            res.end();
            // A session is ongoing when nextInformTimeout === null
            if (nextInformTimeout === null) pendingInform = true;
            else {
              clearTimeout(nextInformTimeout);
              nextInformTimeout = setTimeout(function () {
                startSession("6 CONNECTION REQUEST")
                  .then(() => {
                    console.log("nextInform success !!");
                  })
                  .catch(() => {
                    console.log("nextInform fail !!");
                  });
              }, 0);
            }
          });

          httpServer.listen(port, ip, (err) => {
            if (err) {
              reject(`[ERROR] httpServer.listen fail, ${err}`);
            }
            console.log(
              `Simulator ${serialNumber} listening for connection requests on ${connectionRequestUrl}`
            );
            resolve(connectionRequestUrl);
          });
        } else {
          reject(`[ERROR] Cannot esstablish connection`);
        }
      });
  });
}

let count_connect = 0;
function start(dataModel, serialNumber, acsUrl, response_instance) {
  console.log("\n=== genieacs-sim.simulator ===");
  if (httpServer !== null) {
    console.log("Already connect --> do nothing");
    utils.sendResponseToFE(
      response_instance,
      200,
      "Connection to ACS Server exists"
    );
    return;
  }

  device = dataModel;
  count_connect += 1;
  fs.writeFile(`${count_connect}.json`, `${JSON.stringify(device)}`, (error) => {
    if (error) console.log(error);
  });

  device["Device.DeviceInfo.SerialNumber"][1] = serialNumber;

  let username = "";
  let password = "";
  username = device["Device.ManagementServer.Username"][1];
  password = device["Device.ManagementServer.Password"][1];

  basicAuth =
    "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  requestOptions = require("url").parse(acsUrl);
  http = require(requestOptions.protocol.slice(0, -1));
  httpAgent = new http.Agent({
    keepAlive: true,
    maxSockets: 1,
    rejectUnauthorized: false, // Bypass SSL certificate validation
  });

  listenForConnectionRequests(serialNumber, requestOptions)
    .then(async (connectionRequestUrl) => {
      device["Device.ManagementServer.ConnectionRequestURL"][1] =
        connectionRequestUrl;

      // for now do not wait until modify db done because if no encounter error, the next reload this DB process should be done
      await dbService.modValue({
        "Device.DeviceInfo.SerialNumber": ["false", "false", serialNumber, "xsd:string"],
        "Device.ManagementServer.ConnectionRequestURL": ["false", "false", connectionRequestUrl, "xsd:string"],
      });
      startSession()
        .then(() => {
          utils.sendResponseToFE(
            response_instance,
            200,
            `${connectionRequestUrl}`
          );
        })
        .catch(() => {
          utils.sendResponseToFE(
            response_instance,
            400,
            "Connect to ACS server fail !"
          );
        });
    })
    .catch((err) => {
      console.error("Catch an error at listenForConnectionRequests: ", err);
      utils.sendResponseToFE(response_instance, 500, err);
    });
}

function end(response_instance) {
  if (httpServer !== null) {
    httpServer.close(() => {
      console.log("Close connection");
      resetGlobal();
    });
  }
  utils.sendResponseToFE(
    response_instance,
    200,
    "Close connection to ACS Server Success"
  );
}

function sendInform(requestId, event) {
  return new Promise((resolve, reject) => {
    console.log("\n`=== genieacs-sim.simulator.sendInform() ===");
    if (httpServer == null) {
      console.error("Send Inform status: Can not send Inform to ACS Server");
      reject("Send Inform status: Can not send Inform to ACS Server");
    }

    methods.inform(device, event, function (body) {
      let xml = createSoapDocument(requestId, body);
      sendRequest(xml, function (xml) {
        if (xml === "Error") {
          reject("Send Inform status: Can not send Inform to ACS Server");
        } else {
          cpeRequest();
          resolve("Send Inform status: SUCCESS");
        }
      });
    });
  });
}

exports.start = start;
exports.end = end;
exports.sendInform = sendInform;

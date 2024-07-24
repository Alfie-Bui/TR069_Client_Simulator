"use strict";

/**
 * @TODO: Require npm packages & utils function
 */
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

// Custom module
const utils = require("./utils.js");
const dbService = require("./dbService");
const csv_parser = require("./helper/csv-parser.js");
const xml_parser = require("./helper/xml-parser.js");
const xml_utils = require("./helper/xml-utils.js");

// genieacs
const genieacsClient = require("./genieacs-sim/simulator.js");
const { info } = require("console");

/**
 * @TODO: Define const variables
 */
const PORT = 8888;
const COMMAND = {
  CONNECT_ACS: "CONNECT_ACS", // send data at Apply action    (FE -> BE & response back)
  SEND_INFORM: "SEND_INFORM", // send inform actively         (FE -> BE, POST)
  USER_CONFIG_DATA: {
    ADD: "USER_CONFIG_DATA_ADD",
    MODIFY: "USER_CONFIG_DATA_MODIFY",
    DELETE: "USER_CONFIG_DATA_DELETE",
    COMPLEX: "USER_CONFIG_DATA_COMPLEX",
  }, // get data  from               (FE -> BE & response back)
};
const SERIAL_NUMBER_PATH = "./database/SerialNumber.txt";
const UNIQUE_SERIAL_NUMBER = utils.genSerialNumber(0, 999999);

/**
 * ==================================================
 *                    Init server
 * ==================================================
 */
const app = express();

// serve FrontEnd folder
app.use(express.static(path.join(__dirname, "frontend")));
app.use(bodyParser.json());
app.use(cors());

// listen req on [PORT]
app.listen(PORT, () => {
  console.log(`\n\n===== Server start ${utils.getHumanReadableTime()} =====`);
  console.log(`===== On ${PORT} =====`);
});

// init DB
dbService.createDBinstance();
dbService.initDB();

// init unique Serial Number
try {
  utils.setSerialNumber(UNIQUE_SERIAL_NUMBER, SERIAL_NUMBER_PATH);
} catch (err) {
  console.error("Serial Number creation fail ", err);
  return;
}

/**
 * ===================================================
 *                   Handle request
 * ===================================================
 */
/**
 * POST request handler
 */
app.post("/be_set", async (request, response) => {
  try {
    // log request time
    console.log(`\n== Request at ${utils.getHumanReadableTime()}`);
    console.log("Receive data from WebUI ", request.body);

    if (
      request.body.subOption === undefined ||
      request.body.subOption === null
    ) {
      utils.sendResponseToFE(
        response,
        400,
        `request.body.subOption is required`
      );
      return;
    }

    var inform = utils.mappingDataModel(
      request.body.command,
      request.body.page,
      request.body.data,
      request.body.subOption
    );

    // do the command
    switch (request.body.command) {
      case COMMAND.CONNECT_ACS:
        // update change to DB at first
        await dbService.modValue(inform);
        dbService.getValue({}, function (err, docs) {
          try {
            if (err) throw `[ERROR] db.find fail, ${err}`;
            // start connection
            if (request.body.data.EnaCWMP === true) {
              // get acs URL directly from Client request instead of read from DB
              const acsurl = request.body.data.ACSURL;
              const dataModel = utils.createDeviceDataToSendACSServer(docs);
              fs.writeFileSync("dataModel.json", JSON.stringify(dataModel));
              const serialNumber = utils.getSerialNumber(SERIAL_NUMBER_PATH);
              genieacsClient.start(dataModel, serialNumber, acsurl, response);
            } else genieacsClient.end(response);
          } catch (err) {
            // catch error inside callback
            utils.sendResponseToFE(response, 500, err);
          }
        });
        break;
      case COMMAND.SEND_INFORM:
        await dbService.modValue(inform);
        const requestId = Math.random().toString(36).slice(-8);
        console.log("\n\n === Send Inform actively ===");
        console.log(
          `Timestamp at send inform: ${utils.getHumanReadableTime()}`
        );
        genieacsClient
          .sendInform(requestId)
          .then(() => {
            utils.sendResponseToFE(response, 200, "OK");
          })
          .catch((errText) => {
            utils.sendResponseToFE(response, 500, errText);
          });
        break;
      case COMMAND.USER_CONFIG_DATA.ADD:
        if (inform.UPDATE){
          await dbService.modValue(inform.UPDATE);
          delete inform.UPDATE;
        }
        await dbService.addValue(inform);
        // reload to remove the abundant document (created by DB mechanism)
        await dbService.reloadDatabase();
        utils.sendResponseToFE(response, 200, "OK");

        break;
      case COMMAND.USER_CONFIG_DATA.DELETE:
        if (!Array.isArray(request.body.data)) {
          utils.sendResponseToFE(
            response,
            400,
            `The request.body.data MUST be an array`
          );
          return;
        }
        await dbService.delValue(inform.DELETE);
        if (inform.UPDATE){
          await dbService.modValue(inform.UPDATE);
        }
        await dbService.reIndex(inform.DELETE, request.body.data.length + 1);
        // reload to remove the abundant document (created by DB mechanism)
        await dbService.reloadDatabase();
        utils.sendResponseToFE(response, 200, "OK");
        break;
      case COMMAND.USER_CONFIG_DATA.MODIFY:
        await dbService.modValue(inform);
        // reload to remove the abundant document (created by DB mechanism)
        await dbService.reloadDatabase();
        utils.sendResponseToFE(response, 200, "OK");
        break;
      case COMMAND.USER_CONFIG_DATA.COMPLEX:
        await dbService.complexValueHandler(inform, request.body.subOption);
        // reload to remove the abundant document (created by DB mechanism)
        await dbService.reloadDatabase();
        utils.sendResponseToFE(response, 200, "OK");
        break;
      default:
        // if command id not available --> 400: Bad request from client
        utils.sendResponseToFE(
          response,
          400,
          `Command ${request.body.command} is not supported`
        );
    }
  } catch (error) {
    // if encouter any error --> response HTPP Code 500: Internal Server Error
    utils.sendResponseToFE(response, 500, error);
  }
});

/**
 * GET request handler
 * @TODO
 */
app.get("/be_get", async (request, response) => {
  try {
    console.log(`\n== Request at ${utils.getHumanReadableTime()}`);
    console.log("Receive data from WebUI ", request.body);

    response
      .status(200)
      .send({ content: "Server handle GET request successfully" });
  } catch (error) {
    // if encouter any error --> response HTPP Code 500: Internal Server Error
    console.error(`[ERROR]`, error);
    response.status(500).send({ content: error.toString() });
  }
});

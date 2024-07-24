"use strict";

/**
 * Import
 */
const fs = require("fs");

// Custom
const advanced = require("./helper/mapping/advanced");
const basic = require("./helper/mapping/basic");
const security = require("./helper/mapping/security");
const status = require("./helper/mapping/status");
const utilities = require("./helper/mapping/utilities");
const voip = require("./helper/mapping/voip");
const wifi = require("./helper/mapping/wifi");
const { resolve } = require("path");

/**
 * ===========================================================
 *                    FUNCTION
 * ===========================================================
 */
/**
 * @brief Time stamp human readable
 */
function getHumanReadableTime() {
  try {
    // Get the current timestamp
    var currentDate = new Date();

    // Extract individual time components
    var hour = currentDate.getHours();
    var minute = currentDate.getMinutes();
    var second = currentDate.getSeconds();

    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1; // January is 0, so we add 1
    var year = currentDate.getFullYear();

    // human-readable time return
    return `${day}/${month}/${year}___${hour}:${minute}:${second}`;
  } catch (err) {
    throw `[ERROR] utils.getHumanReadableTime() fail, ${err}`;
  }
}

/**
 * ==========================================================================
 *                            Data model
 * ==========================================================================
 */
/**
 * @brief Mapping Local Storage format to data model format
 * @param {*} page    : which page
 * @param {*} lsData  : local Storage data
 */
function mappingDataModel(command, page, lsData, subOption) {
  try {
    console.log("\n=== utils.mappingDataModel() ===");
    // console.log(page);
    // console.log(lsData);

    if (typeof lsData !== "object")
      throw `[ERROR] utils.mappingDataModel() fail`;
    const retrieveCategory = page.split("-");
    switch (retrieveCategory[0]) {
      case "advanced":
        return advanced.mapping(command, page, lsData, subOption);
      case "basic":
        return basic.mapping(command, page, lsData, subOption);
      case "security":
        return security.mapping(command, page, lsData, subOption);
      case "status":
        return status.mapping(command, page, lsData, subOption);
      case "utilities":
        return utilities.mapping(command, page, lsData, subOption);
      case "voip":
        return voip.mapping(command, page, lsData, subOption);
      case "wifi":
        return wifi.mapping(command, page, lsData, subOption);
      default:
        throw `[Error] Category ${retrieveCategory[0]} is not available`;
    }
  } catch (err) {
    throw `[ERROR] utils.mappingDataModel() fail, ${err}`;
  }
}

/**
 * @brief Create legal Device Data to connect ACS Server
 * @param {*} dataAtArrayOfObj: Array of Object in DB
 * @returns
 */
function createDeviceDataToSendACSServer(dataAtArrayOfObj) {
  try {
    console.log("\n=== utils.createDeviceDataToSendACSServer() ===");
    // console.log(dataAtArrayOfObj);

    let device = {};
    for (const row of dataAtArrayOfObj) {
      const isObject = row["Object"] === "true";
      let id = row["Parameter"];
      if (isObject) id += ".";

      device[id] = [row["Writable"] === "true"];
      if (!isObject) {
        device[id].push(row["Value"] || "");
        if (row["Value type"] != null) device[id].push(row["Value type"]);
      }
    }
    return device;
  } catch (err) {
    throw `[Error] utils.createDeviceDataToSendACSServer() fail, ${err}`;
  }
}

/**
 * ==============================================================================
 *                              Serial Number
 * ==============================================================================
 */
/**
 * @brief Generate unique serial number ID to connect ACS server: sim<randon_number>
 * @param {*} minID
 * @param {*} maxID
 * @returns
 */
function genSerialNumber(minID, maxID) {
  try {
    console.log("\n=== utils.getSerialNumber ===");
    // console.log(minID);
    // console.log(maxID);

    return (
      "sim" +
      (Math.floor(Math.random() * (maxID - minID + 1)) + minID).toString()
    );
  } catch (err) {
    throw `[ERROR] utils.genSerialNumber fail, ${err}`;
  }
}

/**
 * @brief Set serial number to a file
 * @param {*} unique_serial_number
 * @param {*} file_path
 */
function setSerialNumber(unique_serial_number, file_path) {
  if (isFileExist(file_path) === false) {
    fs.writeFileSync(file_path, unique_serial_number);
  }
}

/**
 * Get Serial number from file
 * @param {*} file_path
 * @returns
 */
function getSerialNumber(file_path) {
  if (isFileExist(file_path) === true)
    return fs.readFileSync(file_path).toString();
  else {
    console.error(
      "Serial Number has now been created yet, create new one at getSerialNumber()"
    );
    setSerialNumber("sim" + genSerialNumber(0, 999999), file_path);
    return fs.readFileSync(file_path).toString();
  }
}

/**
 * ================================================================================
 *                                Response to FE
 * ================================================================================
 */
/**
 * @brief Create ressponse to Frontend
 * @param {*} response_instance : instance of response
 * @param {*} status_code       : status code, reference https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * @param {*} content           : content that content can capture at ressponse's body
 */
function sendResponseToFE(response_instance, status_code, content) {
  // catch error inside callback
  try {
    console.log(`\n=== utils.sendResponseToFE() ===\n`, content);
    console.log(`\n>>>>>${getHumanReadableTime()} Response: `, content);
    response_instance.status(status_code).send({ content: content.toString() });
  } catch (err) {
    throw `[Error] utils.sendResponseToFE fail, ${err}`;
  }
}

/**
 * ==================================================================================
 *                                File manipulate
 * ==================================================================================
 */
/**
 * @brief Check if the file is already exist
 * @param {*} file_path
 * @returns true: if exist
 *          false: if not exist
 */
function isFileExist(file_path) {
  return fs.existsSync(file_path);
}

/**
 * @brief Check if a file is empty or not
 * @param {*} filePath
 * @returns
 */
function isFileEmpty(filePath) {
  try {
    console.log("\n=== utils.isFileEmpty() ===");
    // console.log(filePath);

    // Get the file stats
    const stats = fs.statSync(filePath);

    // Check if the file size is 0
    return stats.size === 0;
  } catch (err) {
    // Handle file access errors or file not found errors
    throw `[Error] utils.isFileEmpty() fail, ${err}`;
  }
}

/**
 * @brief Create file if it not yet exist, else do nothing
 * @param {*} file_path
 * @returns
 */
function createFile(file_path) {
  return new Promise((resolve, reject) => {
    if (isFileExist(file_path) === false) {
      fs.open(file_path, "w", (err) => {
        if (err) reject(err);
        resolve();
      });
    } else {
      console.log("File already exist --> pass");
      resolve();
    }
  });
}

module.exports = {
  getHumanReadableTime,
  mappingDataModel,
  isFileEmpty,
  createDeviceDataToSendACSServer,
  sendResponseToFE,
  genSerialNumber,
  isFileExist,
  setSerialNumber,
  getSerialNumber,
  createFile,
};

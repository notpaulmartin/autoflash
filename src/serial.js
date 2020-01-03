/*
 * File:          serial.js
 * Project:       autoflash
 * File Created:  Sunday, 29th December 2019 12:45:09 pm
 * Author(s):     Paul Martin
 *
 * Last Modified: Sunday, 29th December 2019 1:14:19 pm
 * Modified By:   Paul Martin (paul@blibspace.com)
 */

const SerialPort = require('serialport');

/**
 * Gets all active ports
 * @return {string[]} List of ports with connected devices
 */

async function devices() {
  const ports = await SerialPort.list();
  const portnames = ports.map(port => port.comName);
  return portnames;
}

module.exports = {
  devices
};

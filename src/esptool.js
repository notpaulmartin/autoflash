/*
 * File:          esptool.js
 * Project:       autoflash
 * File Created:  Sunday, 29th December 2019 12:31:49 pm
 * Author(s):     Paul Martin
 *
 * Last Modified: Saturday, 21st March 2020 1:10:21 pm
 * Modified By:   Paul Martin
 *
 * Description:   Controls esptool.py using JS
 */

const path = require('path');
const process = require('process');
const { spawn } = require('child_process');

const cwd = process.cwd();
const esptoolPath = path.join(__dirname, '../esptool/esptool.py');
const readBaud = 115200;
// const write_baud = 460800;
const writeBaud = 921600;

/**
 * A JS API that connects to esptool.py
 *
 * @param {string[]} params - A list of parameters (e.g. flags) passed to esptool.py
 * @param {boolean} [verbose=false] - Should the esptool.py be run verbosely
 * @return {Promise} - Resolves when esptool.py has completed
 */
const esptool = (params, verbose = false) =>
  new Promise((resolve, reject) => {
    const proc = spawn(`${esptoolPath}`, params);
    proc.on('exit', resolve);
    proc.on('error', reject);

    if (verbose) {
      proc.stdout.on('data', data => {
        console.log(data.toString('UTF-8'));
      });
      proc.on('message', data => {
        console.log(data.toString('UTF-8'));
      });
    }
  });

function download(port, chipSize, filename = 'backup.afl', verbose = false) {
  // chip_size in MB
  const readUntilAddress = chipSize * 1024 * 1024; // number of bytes

  const fpath = path.join(cwd, filename);
  console.log(`** downloading to ${fpath}\n`);

  return esptool(
    [
      `--port=${port}`,
      `--baud=${readBaud}`,
      'read_flash',
      '0',
      readUntilAddress,
      fpath
    ],
    verbose
  );
}

function upload(port, filename, verbose = false) {
  const fpath = path.join(cwd, filename);
  return esptool(
    [`--port=${port}`, `--baud=${writeBaud}`, 'write_flash', '0', fpath],
    verbose
  );
}

function erase(port, verbose = false) {
  return esptool(
    [`--port=${port}`, `--baud=${writeBaud}`, 'erase_flash'],
    verbose
  );
}

module.exports = {
  download,
  upload,
  erase
};

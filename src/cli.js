/*
 * File:          cli.js
 * Project:       autoflash
 * File Created:  Sunday, 29th December 2019 5:59:36 pm
 * Author(s):     Paul Martin
 *
 * Last Modified: Saturday, 21st March 2020 1:16:33 pm
 * Modified By:   Paul Martin
 *
 * Description:   Interprets commands from CLI and executes the corresponding functions
 */

const os = require('os');
const esptool = require('./esptool');
const serial = require('./serial');
const errorHandler = require('./errorHandler');

/**
 * Handles the input from the CLI
 *
 * @param {Object} argv - Array of arguments passed from CLI
 * @throws unsupported command
 */
async function cli({ _: cmds, ...args }) {
  const cmdString = cmds.join(' ');
  const verbose = isFlagSet(args, 'v', 'verbose');

  if (isFlagSet(args, 'h', 'help')) {
    commands.help();
    return;
  }
  if (isFlagSet(args, 'V', 'version')) {
    const version = require('../package.json').version;
    console.log(version);
    return;
  }

  //* Only first matching regex
  /*
  const cmdRegex = firstMatchingRegex(cmdString, Object.keys(commands));
  const cmdFunction = commands[cmdRegex];

  if (!cmdRegex) {
    throw 'unsupported command';
  }

  // upload test.afl  ->  capturedParameters = ['test.afl']
  const [, ...capturedParameters] = cmdString.match(cmdRegex);

  cmdFunction(capturedParameters, args, verbose).catch(errorHandler);
  */

  //* All matching regexs sequentially
  // TODO: write cleaner without await in a for loop
  const cmdRegexs = allMatchingRegexs(cmdString, Object.keys(commands));

  if (!cmdRegexs[0]) {
    throw 'unsupported command';
  }

  for (const cmdRegex of cmdRegexs) {
    const cmdFunction = commands[cmdRegex];

    // upload test.afl  ->  capturedParameters = ['test.afl']
    const [, ...capturedCommandParameters] = cmdString.match(cmdRegex);

    await cmdFunction(capturedCommandParameters, args, verbose).catch(
      errorHandler
    );
  }

  //* All matching regexs in parallel
  /*
  cmdRegexs.map(cmdRegex => {
    const cmdFunction = commands[cmdRegex];

    // upload test.afl  ->  capturedParameters = ['test.afl']
    const [, ...capturedCommandParameters] = cmdString.match(cmdRegex);

    return cmdFunction(capturedCommandParameters, args, verbose).catch(
      errorHandler
    );
  });
  */
}

// {string} regex : async function (commandParams[], flags{}, verbose) -> executed when regex found
/** The available CLI commands and their corresponding functions */
const commands = {
  async erase(_, { port: portFlag }, verbose = false) {
    // if no port specified, then automatically select one
    const port = portFlag || (await getPort());
    if (port === undefined) throw 'no port found';

    console.log(`** erasing on port ${port}...`);

    await esptool
      .erase(port, verbose)
      .then(exitCode => console.log(`** finished with exit-code ${exitCode}`))
      .catch(errorHandler);
  },

  'upload ([\\w.-/]+)': async function(
    [filename],
    { port: portFlag },
    verbose = false
  ) {
    // if no port specified, then automatically select one
    const port = portFlag || (await getPort());
    if (port === undefined) throw 'no port found';

    console.log(`** uploading ${filename} on port ${port}...`);
    await esptool
      .upload(port, filename, verbose)
      .then(exitCode => console.log(`** finished with exit-code ${exitCode}`))
      .catch(errorHandler);
  },

  'download\\b *([\\w.-/]*)': async function(
    [filename],
    { port: portFlag, chipSize = 4 },
    verbose = false
  ) {
    // if no port specified, then automatically select one
    const port = portFlag || (await getPort());
    if (port === undefined) throw 'no port found';

    filename = filename || 'backup.afl';

    console.log(`** downloading from port ${port} ...`);

    await esptool
      .download(port, chipSize, filename, verbose)
      .then(exitCode => console.log(`** finished with exit-code ${exitCode}`))
      .catch(errorHandler);
    // console.log('finished');
  },

  async devices() {
    (await serial.devices()).forEach(port => console.log(port));
  },

  async device() {
    console.log(await getPort());
  },

  async help() {
    console.log(`Autoflash. A CLI to easily create and upload backups to and from ESP8266.

Usage:
  autoflash <command> <flags>

Commands:
  erase [--port=<auto>]
  upload file.afl [--port=<auto>]
  download [backup.afl] [--port=<auto>]

  device   Shows all connected serial devices
  devices  Shows the automatically selected device
  help     Shows this screen

Options:
  -h --help         Show this screen
  -p --port <path>  Specify the port on which to perform the action
                      If not manually specified, one will automatically be selected.
                      Default port can be viewed with 'autoflash device'
  -v --verbose      Execute verbosely, printing everything the program does
  -V --version      Displays the version number
      `);
  }
};

/**
 * Is a flag set and if so, what is its value?
 *
 * @param {any[]} args - List of arguments to search through
 * @param {string} shortName
 * @param {string} longName
 * @return {any} The value corresponding to the key given
 */
function isFlagSet(args, shortName, longName) {
  return args[longName] || args[shortName];
}

function firstMatchingRegex(str, regexs) {
  for (const regex of regexs) {
    if (RegExp(regex).test(str)) return regex;
  }

  return null;
}

function allMatchingRegexs(str, regexs) {
  return regexs.filter(regex => RegExp(regex).test(str));
}

async function getPort() {
  // depending on the os, devices are registered at COM, /dev/ttyUSB or /dev/cu.
  let portPrefix;
  switch (os.platform()) {
    case 'darwin':
      portPrefix = '/dev/tty.wchusbserial';
      break;
    case 'linux':
      portPrefix = '/dev/ttyUSB';
      break;
    case 'win32':
      portPrefix = 'COM'; //* Not sure whether this is correct
      break;
    default:
      throw 'OS not yet supported';
  }

  // get the first device that could be the ESP (depending on the OS)
  const allDevices = await serial.devices();
  const devices = allDevices.filter(device => device.startsWith(portPrefix));
  return devices[0];
}

module.exports = cli;

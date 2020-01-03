/*
 * File:          errorHandler.js
 * Project:       autoflash
 * File Created:  Tuesday, 31st December 2019 1:17:18 pm
 * Author(s):     Paul Martin
 *
 * Last Modified: Friday, 3rd January 2020 12:13:22 pm
 * Modified By:   Paul Martin (paul@blibspace.com)
 */

function errorHandler(error) {
  switch (error) {
    case 'unsupported command':
      console.error(
        "Error: Command unknown. Please check 'autoflash --help' for instructions on how to use this tool."
      );
      break;
    case 'no port found':
      console.error(
        "Error: Couldn't find a port to select. Please specify it manually using the --port flag"
      );
      break;
    default:
      console.error(`Error: ${error}`);
  }

  console.log('');
}

module.exports = errorHandler;

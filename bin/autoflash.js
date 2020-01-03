#!/usr/bin/env node

/*
 * File:          autoflash.js
 * Project:       autoflash
 * File Created:  Sunday, 29th December 2019 7:02:22 pm
 * Author(s):     Paul Martin
 *
 * Last Modified: Friday, 3rd January 2020 11:55:01 am
 * Modified By:   Paul Martin (paul@blibspace.com)
 *
 * Description:   Entry point for CLI
 */

const argv = require('minimist')(process.argv.slice(2));
const cli = require('../src/cli');
const errorHandler = require('../src/errorHandler');

cli(argv).catch(errorHandler);

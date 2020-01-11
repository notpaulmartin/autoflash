# Autoflash

## A CLI to handle images for the ESP8266

**_Flash an ESP8266 in no time (nodemcu &amp; arduino)_**

[![npm](https://img.shields.io/npm/v/autoflash)](https://www.npmjs.com/package/autoflash)

In building build-yours.com, a company developing and selling products based on ESP8266s, a large problem we encountered was \
_How do you flash a large number of chips with little effort in a short amount time?_

To solve this, I created autoflash, of which I am now publishing the third generation.

You can wipe a chip clean, create backups and upload them again. \
**Uploading to a 4MB chip takes a mere 15s.** \
Autoflash automatically selects the port depending on the OS.

## Installation

Autoflash uses [npm](https://www.npmjs.com/get-npm) as a means of distribution.

```
$ npm i -g autoflash
```

## Usage

Autoflash works with binary files. The only reason we use the file extension `.afl` is so that we know that they are ESP8266 images, but it can also be omitted.

Adding the flag `-v` or `--verbose` tells autoflash to display everything it does in detail.

Available commands: \
[`download`](#downloading) \
[`upload`](#uploading) \
[`erase`](#wiping) \
[`device` / `devices`](#port-selection)

### Downloading

```
$ autoflash download [backup.afl] [--port=<auto>]
```

- If no filename is specified, the file is downloaded to the current working directory with the name "backup.afl".

- If no port is specified, autoflash decides which port to use

### Uploading

```
$ autoflash upload file.afl [--port=<auto>]
```

- If no port is specified, autoflash decides which port to use

### Wiping

```
$ autoflash erase [--port=<auto>]
```

- If no port is specified, autoflash decides which port to use

### Port selection

For the above commands, a port can be specified using the optional `--port` flag. If no port is specified, autoflash detects an active port and uses it.

The port automatically selected port can be viewed with

```
$ autoflash device
```

To get a list of available ports, use

```
$ autoflash devices
```

## Todo

If you want to contribute but don't know where to start, these are a few things that would be cool to have:

- Complain when specified port doesn't exist
- Complain on error with esptool.py
- JS API so that it can be integrated as a dependency in other programs
- Progress bar
  - Download
  - Upload
  - Erase

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[GNU General Public License v2.0](https://choosealicense.com/licenses/gpl-2.0/)

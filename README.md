## Occasions

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/hacs/integration)

Setup entities for occasions like birthdays, aniversarys and holidays. Included is also a lovelace card to show the countdown to these events.

![occasions mov](https://raw.githubusercontent.com/andymcloid/occasions-hass-integration/refs/heads/main/www/logo.png)

For installation instructions, see [this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

# Installation

## HACS

The easiest way to add this to your Homeassistant installation is using [HACS]. 

It's recommended to restart Homeassistent directly after the installation without any change to the Configuration. 
Homeassistent will install the dependencies during the next reboot. After that you can add and check the configuration without error messages. 
This is nothing special to this Integration but the same for all custom components.


# Setup

## Configuration options

Key | Type | Required | Default | Description
-- | -- | -- | -- | --
`name` | `string` | `true` | `None` | Name of the occation and sensor
`date` | `date` | `true` | `None` | Date of the occation
`icon` | `string` | `false` | `mdi:calendar` | MDI Icon string, check https://materialdesignicons.com/
`person` | `string` | `false` | `None` | Connect to a Person entity

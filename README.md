## Occasions

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/hacs/integration)

Setup entities for occasions like birthdays, aniversarys and holidays. Included is also a lovelace card to show the countdown to these events.

![occasions mov](https://raw.githubusercontent.com/andymcloid/occasions-hass-integration/refs/heads/main/screenshot.png)

For installation instructions, see [this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

# Installation

## HACS

The easiest way to add this to your Homeassistant installation is using [HACS]. 

It's recommended to restart Homeassistent directly after the installation without any change to the Configuration. 
Homeassistent will install the dependencies during the next reboot. After that you can add and check the configuration without error messages. 
This is nothing special to this Integration but the same for all custom components.

## Configuration

To use this card, you can add it via the Lovelace UI or manually in YAML:

```yaml
type: 'custom:occasions-card'
title: Occasions
occasions:
  - name: "John's Birthday"
    date: "2024-05-20"
    icon: "mdi:cake"
  - name: "Anniversary"
    date: "2024-06-15"
    icon: "mdi:heart"
  - name: "Christmas Day"
    date: "1900-12-25"
    icon: "mdi:pine-tree"
    count: false
```
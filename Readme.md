# homebridge-marantz-volume
Marantz Receiver plugin for homebridge: https://github.com/nfarina/homebridge

This plugin allows you to control your Marantz receiver volume with Siri, with commands like "set the stereo volume brightness to 25%".  Your receiver will appear as a light bulb in HomeKit, this is so the brightness characteristic of a light bulb, which is voice controllable with Siri, can be leveraged as a way to set the receiver volume.

This plugin controls VOLUME ONLY.  For powering on your Marantz/Denon, see https://github.com/stfnhmplr/homebridge-denon-marantz-avr
This plugin may also work with Denon receivers.

Controlling the volume with Siri has quirks.

This does not work
"set the stereo volume to 25%"

This does
"set the stereo volume BRIGHTNESS to 25%"

This does not work
"set the living room to 25%"

This does
"set the living room LIGHTS to 25%"

# Installation

1. Install homebridge: npm install -g homebridge
2. Install this plugin globally: npm install -g homebridge-marantz-volume
3. Update your homebridge config file.  Example below:

# Configuration

Configuration sample:

 ```
"platforms": [
        {
    		"accessory":      "marantz-volume",
    		"name":           "Stereo Volume",
    		"host": "192.168.1.15",
    		"maxVolume": 50
    	}  
    ]

```
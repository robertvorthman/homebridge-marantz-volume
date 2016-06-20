# homebridge-marantz-volume
Marantz Receiver plugin for homebridge: https://github.com/nfarina/homebridge

This plugin allows you to control your Marantz receiver volume with Siri, with commands like "set the stereo volume to 25%".  Your receiver will appear as a light bulb in HomeKit, this is so the brightness characteristic of a light bulb can be leveraged as a way to set the receiver volume by using Siri.  Unlike other light bulb HomeKit accessories, this plugin ignores power state commands (on/off), this is to avoid having your receiver turn off if you tell Siri to "turn off all the lights".

This plugin controls VOLUME ONLY.  For powering on your Marantz/Denon, see https://github.com/stfnhmplr/homebridge-denon-marantz-avr by stfnhmplr

This plugin may also work with Denon receivers.  Contact me if you have verified this plugin working with a Denon receiver so I can update this readme.

# Siri

Try these Siri commands

*Set the stereo volume to 25%

*Set the living room to 25%

*Increase/Decrease the stereo volume by 5%


# Installation

1. Install homebridge: npm install -g homebridge
2. Install this plugin globally: npm install -g homebridge-marantz-volume
3. Update your homebridge config file.  Example below:

# Configuration

Configuration sample:

 ```
"accessories": [
    {
		"accessory":      "marantz-volume",
		"name":           "Stereo Volume",
		"host": "192.168.1.15",
		"maxVolume": 50
	},
	...
]

```

# Special Thanks
This plugin was built upon code from the following homebridge plugins

https://www.npmjs.com/package/homebridge-fakebulb by schemish

https://www.npmjs.com/package/homebridge-denon by stfnhmplr
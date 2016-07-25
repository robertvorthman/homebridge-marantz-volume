# homebridge-marantz-volume
Marantz Receiver plugin for homebridge: https://github.com/nfarina/homebridge

This plugin allows you to control your Denon or Marantz receiver volume with Siri, with commands like "set the stereo volume to 25%".  Your receiver will appear as a light bulb in HomeKit, this is so the brightness characteristic of a light bulb can be leveraged as a way to set the receiver volume by using Siri.  Unlike other light bulb HomeKit accessories, this plugin ignores power state commands (on/off), this is to avoid having your receiver turn off if you tell Siri to "turn off all the lights".

This plugin controls VOLUME ONLY.  For powering on your Marantz/Denon, see https://github.com/stfnhmplr/homebridge-denon-marantz-avr by stfnhmplr

## Siri

Try these Siri commands

* Set the stereo volume to 25%
* Set the living room to 25%
* Increase/Decrease the stereo volume by 5%

If those Siri commands do not work, try saying "stereo volume brightness", for example "set the stereo volume brightness to 25%"


![Adjust Stereo Volume Using Siri](https://cloud.githubusercontent.com/assets/4665046/16897532/158d983c-4b82-11e6-984c-11d74e00f46e.gif)

## watchOS 3 Home App
Use the Digital Crown to adjust volume with Apple's Home app

![Adjust Stereo Volume Using Apple Watch Crown](https://cloud.githubusercontent.com/assets/4665046/16897807/3909c1ba-4b8b-11e6-81d6-f38dbd2aa46c.gif)

## iOS 10 Control Center
iOS 10 adds HomeKit shortcuts to the iOS Control Center, so you can adjust the volume without even unlocking your phone.

![Adjust Stereo Volume Using Control Center](https://cloud.githubusercontent.com/assets/4665046/16897533/1590c1c4-4b82-11e6-8779-322ad15c31ff.gif)

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
# NO LONGER MAINTAINED
I've moved on to Home Assistant and it's built in Homekit functionality.
See this link for how to recreate the functionality of this Homebridge plugin with Home Assistant.
https://www.home-assistant.io/components/light.template/#theater-volume-control

# homebridge-marantz-volume
Marantz Receiver plugin for homebridge: https://github.com/nfarina/homebridge

This plugin allows you to control your Denon or Marantz receiver volume with Siri, with commands like "set the stereo volume to 25%".  Your receiver will appear as a light bulb in HomeKit, this is so the brightness characteristic of a light bulb can be leveraged as a way to set the receiver volume by using Siri.

Unlike other light bulb HomeKit accessories, this plugin ignores power state commands (on/off) by default, this is to avoid having your receiver turn off if you tell Siri to "turn off all the lights".  If you want to control the power state of the receiver rather than ignoring it, set the `"controlPower":true` property in the configuration.

This plugin also allows you to register the "main zone" and "zone 2" of your receiver as independent accessories within HomeKit, if your receiver is multi-zone.

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

Add as an accessory by editing the homebridge config.json file.

## Simple Example

```
"accessories": [
  {
    "accessory":      "marantz-volume",
    "name":           "Stereo Volume",
    "host":           "192.168.1.15"
  }
]
```
###

Newer Denon receivers may need to add port 8080 to the host name, example: 192.168.1.15:8080

## Multiple Zones Example

If your receiver supports a 2nd zone, add
the plugin a second time with `"zone":2` in the accessory properties, the same host, and a different name.

Configuration sample:

```
"accessories": [
  {
    "accessory":      "marantz-volume",
    "name":           "Stereo Volume",
    "host":           "192.168.1.15",
    "maxVolume":      50
  },
  {
    "accessory":      "marantz-volume",
    "name":           "Outside Volume",
    "host":           "192.168.1.15",
    "maxVolume":      80,
    "zone":           2,
    "controlPower":   true
  },
  ...
]

```
In the above example, the receiver has two zones, the volume control works for both zones (named "Stereo Volume" and "Outside Volume"),
and the power control works is ignored for the main zone and is enabled for the second zone.

## Additional Configuration Details

For newer model Denon's, you might have to add port 8080 to the host option, example:
```
"accessories": [
  {
    "accessory":      "marantz-volume",
    "name":           "Stereo Volume",
    "host":           "192.168.1.15:8080"
  }
]
```

The option `maxVolume` defaults to 70 unless otherwise specified as a values between 0 and 100.

Setting `"mapMaxVolumeTo100":true` will remap the volume percentages that appear in the Home app so that the configured maxVolume will appear as 100% in the Home app.  For example, if the maxVolume is 70%, then setting the stereo volume brightness to 50% would set the receiver's volume to 35%.  Adjusting the stereo volume knob to 70 will appear as 100% brightness in the Home app.  This option could confuse some users to it defaults to off `false`, but it does give the user finer volume control especially when sliding the brightness slider up and down in the Home app.

The `"controlMute":true` option will change the on/off switch behavior to control the receiver's mute status. If `"controlPower":true` is set, this option will be ignored.

# Special Thanks
This plugin was built upon code from the following homebridge plugins

https://www.npmjs.com/package/homebridge-fakebulb by schemish

https://www.npmjs.com/package/homebridge-denon by stfnhmplr

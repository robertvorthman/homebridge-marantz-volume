var request = require('request');
var parseString = require('xml2js').parseString;

var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-marantz-volume", "marantz-volume", ReceiverVolume);
}

function ReceiverVolume(log, config) {
    this.log = log;

    this.name = config['name'] || "Receiver Volume";
    this.maxVolume = config['maxVolume'] || 70;
    this.host = config['host'];
    this.zone = (config['zone'] || 1) | 0; // default to 1, and make sure its an integer
    this.controlPower = !!config['controlPower']; // default to false, and make sure its a bool
    this.useFan = !!config['useFan']; // default to false, and make sure its a bool
    this.controlMute = !!config['controlMute'] && this.controlPower === false;
    this.mapMaxVolumeTo100 = !!config['mapMaxVolumeTo100'];
    
    //cap maxVolume.  Denon/Marantz percentage maxes at 98 in receiver settings
    if(this.maxVolume > 98)
        this.maxVolume = 98;
    
    if (!this.host) {
        this.log.warn('Config is missing host/IP of receiver');
        callback(new Error('No host/IP defined.'));
        return;
    }

    if (this.zone < 1 && this.zone > 2) {
        this.log.warn('Zone number is not recognized (must be 1 or 2); assuming zone 1');
        this.zone = 1;
    }

    this.zoneName = this.zone === 1 ? "MainZone" : "Zone2";

    if (!this.controlPower) {
        this.fakePowerState = 1; //default to on so that brightness will update in HomeKit apps
    }
}

ReceiverVolume.prototype.getStatus = function(callback) {
    var statusUrl = `http://${this.host}/goform/form${this.zoneName}_${this.zoneName}XmlStatusLite.xml`;
    request.get(statusUrl, function (error, response, body) {
        var xml = '';
        if (!error && response.statusCode == 200) {
            parseString(xml + body, function (err, result) {
                callback(result.item);
            }.bind(this));
        }else{
            callback(null);
        }
    }.bind(this));
}

ReceiverVolume.prototype.setControl = function (control, command, callback) {
    var controlUrl = `http://${this.host}/goform/formiPhoneApp${control}.xml?${this.zone}+${command}`;
    request.get(controlUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(null);
        } else {
            callback(error);
        }
    }.bind(this));
}

ReceiverVolume.prototype.getPowerOn = function(callback) {
    if (this.controlPower) {
        this.getStatus(function(status) {
            var powerState = status ? (status.Power[0].value[0] === "ON" ? 1 : 0) : 0;
            this.log("Receiver %s Volume power state is %s", this.zoneName, powerState);
            callback(null, powerState);
        }.bind(this));
    } else if (this.controlMute) {
        this.getStatus(function(status) {
            var powerState = status ? (status.Mute[0].value[0] === "on" ? 0 : 1) : 0;
            this.log("Receiver %s Volume state is %s", this.zoneName, powerState);
            callback(null, powerState);
        }.bind(this));
    } else {
        this.log("Receiver %s Volume power state is %s", this.zoneName, this.fakePowerState);
        callback(null, this.fakePowerState);
    }
}

ReceiverVolume.prototype.setPowerOn = function(powerOn, callback) {
    if (this.controlPower) {
        var command = powerOn ? 'PowerOn' : 'PowerStandby';
        this.log("Set receiver %s volume power state to %s", this.zoneName, command);
        this.setControl('Power', command, callback);
    } else if (this.controlMute) {
        var command = powerOn ? 'MuteOff' : 'MuteOn';
        this.log("Set receiver %s volume state to %s", this.zoneName, command);
        this.setControl('Mute', command, callback);
    } else {
        this.fakePowerState = powerOn ? 1 : 0;
        //this.fakePowerState = 1;
        this.log("Set receiver %s volume power state to %s", this.zoneName, this.fakePowerState);
        callback(null);
    }
}

ReceiverVolume.prototype.setBrightness = function(newLevel, callback) {

    if(this.mapMaxVolumeTo100){
        var volumeMultiplier = this.maxVolume/100;
        var newVolume = volumeMultiplier * newLevel;
    }else{
        //cap to max volume set in homebridge config.json
        var newVolume = Math.min(newLevel, this.maxVolume);
    }
    
    //cap newVolume.  //Denon/Marantz percentage maxes at 98 in receiver settings
    if(newVolume > 98){
        newVolume = 98;
    }

    //convert volume percentage to relative volume
    var relativeVolume = (2 * (newVolume - 80)).toFixed(0) / 2.0;

    //cap between -80 and 0
    relativeVolume = Math.max(-80.0, Math.min(0.0, relativeVolume));
    
    this.setControl('Volume', relativeVolume, callback);
}

ReceiverVolume.prototype.getBrightness = function(callback) {
    this.getStatus(function(status) {
        
        if(status){
            var volume = parseInt(status.MasterVolume[0].value[0]) + 80;
            this.log("Get receiver volume %s ", volume);
            
            if(this.mapMaxVolumeTo100){
                volume = volume * (100/this.maxVolume);
            }
            
            
            callback(null, volume);
        }else{
            this.log("Unable to get receiver status");
            callback(null);
        }
        
    }.bind(this));
}

ReceiverVolume.prototype.getServices = function() {
    if (this.useFan) {
        var lightbulbService = new Service.Fan(this.name);
    }
    else {
        var lightbulbService = new Service.Lightbulb(this.name);
    }
    lightbulbService
        .getCharacteristic(Characteristic.On)
        .on('get', this.getPowerOn.bind(this))
        .on('set', this.setPowerOn.bind(this));
    if (this.useFan) {
        lightbulbService
            .addCharacteristic(new Characteristic.RotationSpeed())
            .on('get', this.getBrightness.bind(this))
            .on('set', this.setBrightness.bind(this));
    }
    else {
        lightbulbService
            .addCharacteristic(new Characteristic.Brightness())
            .on('get', this.getBrightness.bind(this))
            .on('set', this.setBrightness.bind(this));
    }
    return [lightbulbService];
}

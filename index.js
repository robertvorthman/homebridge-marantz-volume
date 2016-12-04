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
        this.fakePowerState = 0;
    }
}

ReceiverVolume.prototype.getStatus = function(callback) {
    var statusUrl = `http://${this.host}/goform/form${this.zoneName}_${this.zoneName}XmlStatus.xml`;
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
            var powerState = status.Power[0].value[0] === "ON" ? 1 : 0;
            this.log("Receiver %s Volume power state is %s", this.zoneName, powerState);
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
    } else {
        this.fakePowerState = powerOn ? 1 : 0;
        this.log("Set receiver %s volume power state to %s", this.zoneName, this.fakePowerState);
        callback(null);
    }
}

ReceiverVolume.prototype.setBrightness = function(level, callback) {

    var maxVolume = this.maxVolume * 80.0 / 100.0;
    var newVolume = maxVolume * level / 100.0;

    //convert volume percentage to relative volume
    var relativeVolume = (2 * (newVolume - 80)).toFixed(0) / 2.0;

    //cap between -80 and 0
    relativeVolume = Math.max(-80.0, Math.min(0.0, relativeVolume));

    this.setControl('Volume', relativeVolume, callback);
}

ReceiverVolume.prototype.getBrightness = function(callback) {
    this.getStatus(function(status) {
        var volume = parseInt(status.MasterVolume[0].value[0]) + 80;
        callback(null, volume);
    }.bind(this));
}

ReceiverVolume.prototype.getServices = function() {
    var lightbulbService = new Service.Lightbulb(this.name);

    lightbulbService
        .getCharacteristic(Characteristic.On)
        .on('get', this.getPowerOn.bind(this))
        .on('set', this.setPowerOn.bind(this));

    lightbulbService
        .addCharacteristic(new Characteristic.Brightness())
        .on('get', this.getBrightness.bind(this))
        .on('set', this.setBrightness.bind(this));

    return [lightbulbService];
}

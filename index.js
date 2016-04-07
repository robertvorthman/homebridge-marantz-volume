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
    
    this.statusUrl = "/goform/formMainZone_MainZoneXml.xml";
    this.controlUrl = "/goform/formiPhoneAppVolume.xml";
    
    this.powerState = 0;

    if (!this.host) {
        this.log.warn('Config is missing host/IP of receiver');
        callback(new Error('No host/IP defined.'));
        return;
    }

}

ReceiverVolume.prototype.getPowerOn = function(callback) {
    this.log("Receiver Volume power state is %s", this.powerState);
    callback(null, this.powerState);
}

ReceiverVolume.prototype.setPowerOn = function(powerOn, callback) {
    
    this.powerState = powerOn ? 1 : 0;
    this.log("Set receiver volume power state to %s", this.powerState);
    callback(null);
}

ReceiverVolume.prototype.setBrightness = function(level, callback){
    
    var newVolume = level;
    
    if(level > this.maxVolume){
        //enforce maximum volume
        newVolume = this.maxVolume;
        this.log('Volume %s capped to max volume %s', level, this.maxVolume);
    }
    
    //convert volume percentage to relative volume
    var relativeVolume = (newVolume - 80).toFixed(1);
    
    request.get('http://' + this.host + this.controlUrl + '?1+' + relativeVolume, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(null);
        } else {
            callback(error)
        }
    });
    
}

ReceiverVolume.prototype.getBrightness = function(callback) {
    
    request.get('http://' + this.host + this.statusUrl, function (error, response, body) {
        var xml = '';
        if (!error && response.statusCode == 200) {
            parseString(xml + body, function (err, result) {
                var volume = parseInt(result.item.MasterVolume[0].value[0]) + 80;
                callback(null, volume);
            });
        }
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
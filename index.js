var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-marantz-volume", "marantz-volume", ReceiverVolume);
}

function ReceiverVolume(log, config) {
    this.log = log;
    this.name = config.name || "Receiver Volume";
    this.bulbName = this.name;
    this.log("Initialize receiver volume service");
}

ReceiverVolume.prototype.getPowerOn = function(callback) {
    var powerOn = this.binaryState > 0;
    this.log("Receiver Volume power state is %s", this.binaryState);
    callback(null, powerOn);
}

ReceiverVolume.prototype.setPowerOn = function(powerOn, callback) {
    this.binaryState = powerOn ? 1 : 0;
    this.log("Set receiver volume power state to %s", this.binaryState);
    callback(null);
}

ReceiverVolume.prototype.setBrightness = function(level, callback){
    
    this.log('Set brightness to %s', level);
    callback();
}

ReceiverVolume.prototype.getBrightness = function(callback) {
    
    var level = .5;
    
    this.log('Get brightness, is %s', level);
    
    callback(null, level);
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
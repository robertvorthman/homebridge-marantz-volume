var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-marantz-volume", "receiver-volume", ReceiverVolume);
}

function ReceiverVolume(log, config) {
  this.log = log;
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

ReceiverVolume.prototype.getServices = function() {
    var lightbulbService = new Service.Lightbulb(this.name);
    
    lightbulbService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerOn.bind(this))
      .on('set', this.setPowerOn.bind(this));
    
    return [lightbulbService];
}
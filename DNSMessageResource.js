const DNSDomainName = require('./DNSDomainName.js');

const DNSMessageResource = function(name, type, rclass, ttl, rdata) {
	this.name = name || new DNSDomainName();
	this.type = type || 1;
	this.rclass = rclass || 1;
	this.ttl = ttl || 300;
	this.rdlength = rdata ? rdata.length : 0;
	this.rdata = rdata || new Buffer(0);
};

// This function ignores this.rdlength and uses this.rdata.length instead
DNSMessageResource.prototype.encode = function() {
	var name = this.name.encode();
	
	var buffer = new Buffer(name.length + this.rdata.length + 10);
	
	name.copy(buffer, 0);
	buffer.writeUInt16BE(this.type, name.length);
	buffer.writeUInt16BE(this.rclass, name.length + 2);
	buffer.writeUInt32BE(this.ttl, name.length + 4);
	buffer.writeUInt16BE(this.rdata.length, name.length + 8);
	this.rdata.copy(buffer, name.length + 10);
	
	return buffer;
};

DNSMessageResource.prototype.toString = function() {
	return '<DNSMessageResource>';
};

module.exports = DNSMessageResource;

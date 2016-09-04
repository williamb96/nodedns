const dgram = require('dgram');

const DNSMessage = require('./DNSMessage.js');
const DNSMessageHeader = require('./DNSMessageHeader.js');
const DNSMessageQuestion = require('./DNSMessageQuestion.js');
const DNSMessageResource = require('./DNSMessageResource.js');
const DNSDomainName = require('./DNSDomainName.js');

const DNSServer = function(callback, port) {
	if (typeof callback !== 'function') {
		throw new Error('Callback is not a function');
	}
	
	this.callback = callback;
	this.port = port || 53;
	this.socket = dgram.createSocket('udp4');
	
	var server = this; // Need access to `this` in the callback below.
	
	this.socket.on('message', function(buffer, rinfo) {
		server.onMessage(buffer, rinfo, server);
	});
};

DNSServer.prototype.onMessage = function(buffer, rinfo, server) {
	var req = DNSMessage.parse(buffer);
	
	var res = new DNSMessage(server, rinfo);
	res.header = new DNSMessageHeader();
	res.header.id = req.header.id;
	res.header.qr = 1;
	
	process.nextTick(server.callback, req, res);
};

DNSServer.prototype.listen = function(port) {
	if (port) {
		this.port = port;
	}
	
	this.socket.bind(this.port);
};

module.exports = {
	DNSServer: DNSServer,
	DNSMessageHeader: DNSMessageHeader,
	DNSMessageQuestion: DNSMessageQuestion,
	DNSMessageResource: DNSMessageResource,
	DNSDomainName: DNSDomainName
};

const DNSMessageHeader = require('./DNSMessageHeader.js');
const DNSMessageQuestion = require('./DNSMessageQuestion.js');
const DNSMessageAnswer = require('./DNSMessageResource.js');

const DNSMessage = function(server, rinfo) {
	this._server = server;
	this._rinfo = rinfo;
	
	this.header = null;
	this.questions = [];
	this.answers = [];
	this.authorities = [];
	this.additionals = [];
};

DNSMessage.prototype.encode = function() {
	var buffers = [];
	
	this.header.qdcount = 0; //this.questions.length;
	this.header.ancount = this.answers.length;
	this.header.nscount = this.authorities.length;
	this.header.arcount = this.additionals.length;
	
	buffers.push(this.header.encode());
	
	// TODO: Encode questions (even though these shouldn't be present in responses)
	
	for (var i=0; i<this.answers.length; i++) {
		buffers.push(this.answers[i].encode());
	}
	
	for (var i=0; i<this.authorities.length; i++) {
		buffers.push(this.authorities[i].encode());
	}
	
	for (var i=0; i<this.additionals.length; i++) {
		buffers.push(this.additionals[i].encode());
	}
	
	return Buffer.concat(buffers);
};

DNSMessage.prototype.send = function() {
	if (!this._server || !this._rinfo) {
		throw new Error('Can not send this message as a response');
	}
	
	var message = this.encode();
	this._server.socket.send(message, 0, message.length, this._rinfo.port, this._rinfo.address);
};

DNSMessage.parse = function(buffer, server) {
	buffer.pos = 0; // Store already read bytes in buffer so parse functions know where to start.
	
	var message = new DNSMessage(server);	
	message.header = DNSMessageHeader.parse(buffer);
	message.questions = DNSMessageQuestion.parse(buffer, message.header.qdcount);
	
	// TODO: Parse answers, authorities, and additionals.
	// These shouldn't be included in question queries, but it would be nice if it was at least possible to parse them.
	
	return message;
};

DNSMessage.prototype.toString = function() {
	return '<DNSMessage>';
};

module.exports = DNSMessage;

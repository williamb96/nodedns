const DNSDomainName = require('./DNSDomainName.js');

const DNSMessageQuestion = function() {
	this.qname = new DNSDomainName();
	this.qtype = 0;
	this.qclass = 0;
};

DNSMessageQuestion.prototype.encode = function() {
	var name = this.qname.encode();

	var buffer = new Buffer(name.length + 4);

	name.copy(buffer, 0);
	buffer.writeInt16BE(this.qtype, name.length);
	buffer.writeInt16BE(this.qclass, name.length + 2);

	return buffer;
};

DNSMessageQuestion.parse = function(buffer, count) {
	var questions = [];
	
	for (var i=0; i<count; i++) {
		var question = new DNSMessageQuestion();
		
		question.qname = DNSDomainName.parse(buffer);
		question.qtype = buffer.readInt16BE(buffer.pos);
		question.qclass = buffer.readInt16BE(buffer.pos + 2);
		
		buffer.pos += 4;
		
		questions.push(question);
	}
	
	return questions;
};

DNSMessageQuestion.prototype.toString = function() {
	return '<DNSMessageQuestion>';
};

module.exports = DNSMessageQuestion;

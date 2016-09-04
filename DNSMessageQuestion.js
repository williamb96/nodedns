const DNSDomainName = require('./DNSDomainName.js');

const DNSMessageQuestion = function() {
	this.qname = new DNSDomainName();
	this.qtype = 0;
	this.qclass = 0;
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

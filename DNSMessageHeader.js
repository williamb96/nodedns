const DNSMessageHeader = function() {
	this.id = 0;
	this.qr = 1;
	this.opcode = 0;
	this.aa = 1;
	this.tc = 0;
	this.rd = 0;
	this.ra = 0;
	this.z = 0;
	this.rcode = 0;
	this.qdcount = 0;
	this.ancount = 0;
	this.nscout = 0;
	this.arcount = 0;
};

DNSMessageHeader.prototype.encode = function() {
	var buffer = new Buffer(12);
	
	buffer.writeInt16BE(this.id, 0);
	
	var qr = this.qr << 7;
	var opcode = this.opcode << 3;
	var aa = this.aa << 2;
	var tc = this.tc << 1;
	var rd = this.rd;
	buffer[2] = qr | opcode | aa | tc | rd;
	
	var ra = this.ra << 7;
	var z = this.z << 6;
	var rcode = this.rcode;
	buffer[3] = ra | z | rcode;
	
	buffer.writeInt16BE(this.qdcount, 4);
	buffer.writeInt16BE(this.ancount, 6);
	buffer.writeInt16BE(this.nscount, 8);
	buffer.writeInt16BE(this.arcount, 10);
	
	return buffer;
};

DNSMessageHeader.parse = function(buffer) {
	if (buffer.length < 12) {
		throw new Error('Buffer length must be exactly 12');
	}
	
	var header = new DNSMessageHeader();
	
	header.id = buffer.readInt16BE(0);
	header.qr = (buffer[2] & 128) >> 7;
	header.opcode = (buffer[2] & 120) >> 6;
	header.aa = (buffer[2] & 4) >> 2;
	header.tc = (buffer[2] & 2) >> 1;
	header.rd = buffer[2] & 1;
	header.ra = (buffer[3] & 128) >> 7;
	header.z = (buffer[3] & 112) >> 6;
	header.rcode = buffer[3] & 15;
	header.qdcount = buffer.readInt16BE(4);
	header.ancount = buffer.readInt16BE(6);
	header.nscount = buffer.readInt16BE(8);
	header.arcount = buffer.readInt16BE(10);
	
	buffer.pos += 12;
	
	return header;
};

DNSMessageHeader.prototype.toString = function() {
	return '<DNSMessageHeader ' + this.id + '>';
};

module.exports = DNSMessageHeader;

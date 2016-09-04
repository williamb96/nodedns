/*
	In the DNS system domains are encoded in the follwing way:
	3 w w w 7 e x a m p l e 3 c o m 0
	
	Each label is prefixed with it's length and
	the domain is terminated by the final 0-length label.
*/

const DNSDomainName = function(domain) {
	this.labels = [];
};

DNSDomainName.prototype.encode = function() {
	var array = [];
	
	for (var i=0; i<this.labels.length; i++) {
		var label = new Buffer(this.labels[i]);
		array.push(label.length);
		
		for (var j=0; j<label.length; j++) {
			array.push(label[j]);
		}
	}
	
	array.push(0);
	
	return new Buffer(array);
};

DNSDomainName.parse = function(buffer) {
	var domainName = new DNSDomainName();
	
	for (var i = buffer.pos; buffer[i] != 0; i += buffer[i] + 1) {
		if (i >= 1024) {
			throw new Error('Too long domain name');
		}
		
		domainName.labels.push(buffer.slice(i + 1, i + buffer[i] + 1).toString());
		buffer.pos += buffer[i] + 1;
	}
	
	buffer.pos++;
	
	return domainName;
};

DNSDomainName.prototype.toString = function() {
	return '<DNSDomainName ' + this.labels.join('.') + '>';
};

DNSDomainName.fromLabels = function(labels) {
	var domainName = new DNSDomainName();
	domainName.labels = labels;
	
	return domainName;
};

DNSDomainName.fromString = function(string) {
	var domainName = new DNSDomainName();
	domainName.labels = string.split('.');
	
	return domainName;
};

module.exports = DNSDomainName;

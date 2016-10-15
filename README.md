# nodedns
This is a server implementation of the DNS protocol.

## Useful information
* [freesoft.org's documentation of the DNS protcol](http://www.freesoft.org/CIE/RFC/1035/38.htm)
* [justanapplication.wordpress.com's documentation on, among other things, how to encode an SRV record](https://justanapplication.wordpress.com/category/dns/dns-resource-records/dns-srv-record/)

## Usage
```javascript
const nodedns = require('nodedns');

const server = new nodedns.DNSServer(function(req, res) {
	var record = new nodedns.DNSMessageResource();
	
	// Name: www.example.com
	record.name = nodedns.DNSDomainName.fromLabels(['www', 'example', 'com']);
	
	// Record type: A
	record.type = 1;
	
	// Record class: IN
	record.rclass = 1;
	
	// TTL: 1 hour
	record.ttl = 3600;
	
	// Record data: 127.0.0.1
	record.rdata = new Buffer([127, 0, 0, 1]);

	// Add record to 'answers' section of the response message
	res.answers.push(record);
	
	// Send response
	res.send();
});

server.listen(53);
```

## Messages
Both requests and responses come in the form of DNSMessage instances.
DNSMessage contains the following fields:

* header: DNSMessageHeader
* questions: DNSMessageQuestion
* answers: DNSMessageResource[]
* authorities: DNSMessageResource[]
* additionals: DNSMessageResource[]

## Question structure
Requests typically contain 1 question in the `questions` array of the DNSMessage.
This question contains the following fields:

* qname: DNSDomainName
* qtype: Number
* qclass: Number

## Domain names
Domain names are represented by DNSDomainName.
Instances of the class contain an array of labels.

To quickly convert a DNSDomainName to a readable domain one can use `domain.labels.join('.')`

There are two ways of creating a DNSDomainName:
```javascript
// From an array of labels
var domain = nodedns.DNSDomainName.fromLabels(['www', 'example', 'com']);

// From a string representation
var domain = nodedns.DNSDomainName.fromString('www.example.com');
```

## Resources
Resources or records are represented by DNSMessageResource objects.
A DNSMessageResource contains the following fields:

* name: DNSDomainName
* type: Number
* rclass: Number
* ttl: Number
* rdlength: Number (This is ignored when encoding messages)
* rdata: Buffer

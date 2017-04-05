let fs = require('fs'),
	Curl = require('node-libcurl').Curl,
	curls = [],
	url = 'http://www.filmreroll.com/?p=',
	end = 160,
	search = 'Play in new',
	output = 'hammer-all-the-urls.md';

for (let i = 0; i <= end; i++) {
	curls.push({
		id: i,
		url: url + i,
		curler: new Curl,
		fucked: true // by default
	});
}

curls.map(curl => {
	console.log('creating ' + curl.id);
	curl.curler.setOpt('URL', curl.url);
	curl.curler.setOpt('FOLLOWLOCATION', true);
    curl.curler.setOpt(Curl.option.CONNECTTIMEOUT, 100);
    curl.curler.setOpt(Curl.option.TIMEOUT, 100);
	curl.curler.on('end', function(statusCode, body, headers) {
		//console.log('finished ' + curl.id);

		if (body.includes(search)) {
			let pos = body.indexOf(search);
			let snippet = body.substring(pos, pos + 300);
			//console.log(snippet);
			//console.log('');
			let matches = snippet.match(/href="(.*?)"/);
			let url = matches[1] + '\n';
			console.log(url);

			fs.appendFile(output, url, function (err) {
				if (err) throw err;
			});

			console.log('');
			curl.fucked = false;
		}
		this.close();
	});

	curl.curler.on('error', function(error) {
		console.log(curl.id + ': ' + error);
		//this.close();
		curl.fucked = true;
		curl.curler.perform();
	});
	curl.curler.perform();
});

setInterval(function() {
	let fucked = [];
	curls.map(curl => {
		if (curl.fucked) {
			fucked.push(curl.id);
		}
	});
	console.log('fucked items: ' + fucked.length);
}, 1000);

/*
for (let i = 0; i < 125; i++) {
	console.log('creating curl ' + i);
	let url = "http://www.filmreroll.com/?p=" + i;
	curls[i] = new Curl();

	curls[i].setOpt('URL', url);
	curls[i].setOpt('FOLLOWLOCATION', true);
    curls[i].setOpt( Curl.option.CONNECTTIMEOUT, 15 );
    curls[i].setOpt( Curl.option.TIMEOUT, 20 );
	curls[i].on('end', function(statusCode, body, headers) {
		console.log('finished ' +i);

		//console.info(body);
		let search = 'Play in new';
		if (body.includes(search)) {
			let pos = body.indexOf(search);
			let snippet = body.substring(pos, pos + 300);
			//console.log(snippet);
			//console.log('');
			let matches = snippet.match(/href="(.*?)"/);
			let url = matches[1] + '\n';
			console.log(url);

			fs.appendFile('curlz.md', url, function (err) {
				if (err) throw err;
			});

			console.log('');

			if (i == 34) {
				console.log(body);
			}
		} else {
			//console.log('No');
		}

		this.close();
	});

	curls[i].on('error', function() {
		console.log('error.. ' + i);
		curls[i].close.bind(curls[i])
			if (i == 34) {
				console.log(body);
			}

	});
	curls[i].perform();
}
*/

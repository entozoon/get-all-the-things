let fs = require('fs'),
	fileList ='../../get-all-these-things.json';

fs.stat(fileList, function(err, stat) {
	if (err != null) {
		console.log('You must have the file: ' + fileList);
		console.log('Relative to the directory node_modules/get-all-the-things)');
		return;
	}

	let things = JSON.parse(fs.readFileSync(fileList, 'utf8'));

	things.forEach(item => {
		// If desired, append the source filetype to the target filename
		if (item.retainFiletype == true) {
			let fileSplit = item.source.split('.');
			item.target += '.' + fileSplit[fileSplit.length - 1];
		}
		console.log(item);
	});
});

let fs = require('fs'),
	wget = require('wget-improved'),
	mkdirp = require('mkdirp'),
	downloaders = [],
	//root = '../../', // no need - running `node node_modules/..` is relative
	fileList = 'get-all-the-things.json';

fs.stat(fileList, function(err, stat) {
	if (err != null) {
		console.log('You must have the file: ' + fileList);
		console.log('(relative to this directory)');
		return;
	}

	let things = JSON.parse(fs.readFileSync(fileList, 'utf8'));

	things.forEach(item => {
		// If desired, append the source filetype to the target filename
		if (item.retainFiletype === true) {
			let fileSplit = item.source.split('.');
			item.target += '.' + fileSplit[fileSplit.length - 1];
		}

		// Remove any invalid characters, such as > which really fewks things up
		// < > : " ' | ? *
		item.target = item.target.replace(/<|>|:|"|'|\||\?|\*/g,'');

		console.log('\n' + item.source);
		console.log('-->\n' + item.target + '\n');

		item.targetDir = require('path').dirname(item.target);
		if (fs.existsSync(item.targetDir)) {
			downloaders.push(Downloader(item.source, item.target));
		} else {
			console.log("Target folder doesn't exist (creating it)");
			mkdirp(item.targetDir, function (err) {
				if (err) {
					console.log("Couldn't create target path:");
					console.error(err);
				}
				else {
					downloaders.push(Downloader(item.source, item.target));
				}
			});
		}

		return;
	});

	// Start all downloads
	downloaders.map(downloader => {
		downloader.downloadFile();
	});

	// Check our progress while any downloads are still going
	let progressCheck = setInterval(function() {
		var allDone = true;
		downloaders.map(downloader => {
			if (downloader.getProgress() != 100) {
				allDone = false;
				console.log(downloader.getProgress() + '% of ' + downloader.getFileSize() + ' for ' + downloader.getTarget());
			}
		});
		if (allDone) {
			clearInterval(progressCheck);
			console.log('Done!\n');
		} else {
			console.log('');
		}
	}, 100);
});

Downloader = (source, target) => {
	let download,
		fileSize = 0,
		progress = 0;
	return {
		downloadFile: () => {
			download = wget.download(source, target);
			download.on('error', function(err) {
				console.log(err);
			});
			download.on('start', function(_fileSize) {
				fileSize = _fileSize;
				//console.log('Starting download of: ' + Math.round(fileSize / 2014 * 10) / 10 + 'kb');
			});
			download.on('end', function(output) {
				//console.log(output);
			});
			download.on('progress', function(_progress) {
				progress = Math.round(_progress * 100);
			});
		},
		getProgress: () => {
			return progress;
		},
		getTarget: () => {
			return target;
		},
		getFileSize: () => {
			return Math.round(fileSize / 2014 * 10) / 10 + 'kb';
		}
	};
};

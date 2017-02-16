# Get All The Things!

Download listed files from a json array to given targets.

## Why?

Well you might just want to download a big ol' list of files, or possibly something more adventurous?

For example, my site [MichaelCook.tech](http://michaelcook.tech) parses markdown files to create its articles and some of those articles incorporate github project readmes. So, in order to keep those localised readmes nice and fresh, I can run this script to bring down the up-to-date files and slot them into the necessary directories.

## Install

	yarn add get-all-the-things

## Run

	node node_modules/get-all-the-things/get-all-the-things.js

## Configuration

You'll need a `get-all-the-things.json` file in your project's root directory with structure similar to:

	[
		{
			"source": "http://example.com/image-1.png",
			"target": "downloads/image-name",
			"retainFiletype": true
		},
		{
			"source": "http://example.com/file-1.txt",
			"target": "downloads/file-name.doc"
		}
	]

### These are the available parameters for each item

Option | Type | Default | Description
------ | ---- | ------- | -----------
source | string | null | Filepath from which to download
target | string | null | Local destination filepath
retainFiletype | bool | false | If the target filepath should be appended with the original file type

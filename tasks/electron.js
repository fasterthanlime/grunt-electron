'use strict';
const electronPackager = require('electron-packager');
const rebuild = require('electron-rebuild');

module.exports = grunt => {
	grunt.registerMultiTask('electron', 'Package Electron apps', function () {
		const done = this.async();

		const options = Object.assign({}, this.options(), {
			afterCopy: [
				(buildPath, electronVersion, platform, arch, callback) => {
					grunt.log('Rebuilding native dependencies');
					rebuild(buildPath, electronVersion, arch, [], true)
						.then(() => done())
						.catch((e) => {
							grunt.warn('Building modules didn\'t work!');
							grunt.fatal(e);
						});
				}
			]
		});

		electronPackager(options, err => {
			if (err) {
				grunt.warn(err);
				done();
				return;
			}

			done();
		});
	});
};

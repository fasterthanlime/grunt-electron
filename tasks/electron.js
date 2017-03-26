'use strict';
const electronPackager = require('electron-packager');
const rebuild = require('electron-rebuild').default;

module.exports = grunt => {
	grunt.registerMultiTask('electron', 'Package Electron apps', function () {
		const done = this.async();

		const options = Object.assign({}, this.options(), {
			afterCopy: [
				(buildPath, electronVersion, platform, arch, callback) => {
					grunt.log.writeln('Rebuilding native dependencies');
					rebuild(buildPath, electronVersion, arch, [], true)
						.then(() => callback())
						.catch((e) => {
							grunt.warn('Building modules didn\'t work!');
							grunt.fatal(e);
                            callback();
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

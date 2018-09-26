const browserSync = require('browser-sync');

browserSync({
	server: './',
	files: [
		'./mesh/*.html'
	]
});


const browserSync = require('browser-sync');

browserSync({
	server: './',
	files: [
		'./mesh-canvas/*.html'
	]
});


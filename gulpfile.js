const gulp = require( 'gulp' );
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const rename = require('gulp-rename');

const browserSync = require('browser-sync').create();

function onError( error ) {
	console.log( error.toString() );
	this.emit( 'end' );
}

gulp.task( 'script', function() {
	return browserify({
		entries: './index.js',
		debug: true,
		transform: [["babelify", { "presets": ["@babel/preset-env"] }]]
	})
		.bundle()
		.on( 'error', onError )
		.pipe( plumber(onError) )
		.pipe( source('tarteaucitron.js') )
		.pipe( gulp.dest('./dist/') )
		.pipe( buffer() )
		.pipe( uglify() )
		.pipe( rename({ extname: '.min.js' }) )
		.pipe( gulp.dest('./dist/') );
})

gulp.task( 'dev', function() {
	browserSync.init({
		server: {
			baseDir: './demo',			// Where the server serve from
		},
		serveStatic: ['./dist'],	// directories from which static files should be served
		watchOptions: {
			ignoreInitial: true
		},
		files: './dist/*'
	});

	gulp.watch( './src/**/*.js', ['script'] );
})

gulp.task( 'default', ['script'] );

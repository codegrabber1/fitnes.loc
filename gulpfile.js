'use strict';
 const gulp				= require('gulp');
 const sass				= require('gulp-sass');
 const wiredep			= require('wiredep').stream;
 const notify			= require('gulp-notify');
 const imgmin			= require('gulp-imagemin');
 const imageminPngquant = require('imagemin-pngquant');
 const autoprefixer 	= require('gulp-autoprefixer');
 const multipipe		= require('multipipe');
 const cached    		= require('gulp-cached');
 const concat    		= require('gulp-concat');
 const bs				= require('browser-sync').create();

 // bower
gulp.task('bower', function(){
	return gulp.src('frontend/*.html')
	.pipe(wiredep({
		directory : "frontend/assets/"
	}))
	.pipe(gulp.dest('frontend/'));
});

//server
gulp.task('server', function(){
	bs.init({
		server: 'frontend'
	});
	bs.watch('frontend/**/*.*').on('change', bs.reload);
});

// sass
gulp.task('sass', function(){
	return multipipe(
		gulp.src('frontend/sass/style.sass'),
		autoprefixer({
			  browsers: ['last 2 versions'],
			  cascade: false
			}),
		sass(),
		gulp.dest('frontend/')
	).on('error', notify.onError());
});

//html
gulp.task('html', function(){
	return gulp.src('frontend/**/*.html')
});

//js
gulp.task('js', function(){
	return multipipe(
		gulp.src([
		 'frontend/assets/easing.js',
		 'frontend/assets/jquery.vide.min.js',
		 'frontend/assets/move-top.js',
		 'frontend/assets/wow.min.js',
		 'frontend/assets/parallax/parallax.min.js',
         'frontend/assets/jq.mmnu/js/jquery.mmenu.all.min.js',
		 'frontend/assets/superfish/dist/js/superfish.js'
		]),
		cached('js'),
		concat('all.js'),
		gulp.dest('frontend/js')
	);
});
// images
gulp.task('img', function(){
	return multipipe(
		gulp.src('frontend/images/*.{png,jpg,gif,svg}'),
		imagemin({
			progressive: true,
			svgPlugins: [{removeViewBox: false}],
			use: [imageminPngquant()]
		}),
		gulp.dest('frontend/images')
		);
	});
//watch
gulp.task('watch', function(){
	var watcher = gulp.watch('frontend/sass/**/*.sass', ['sass']);
	  watcher.on('change', function(event){
		if(event.type === 'delete') {
		  delete cached.caches['sass'][event.path];
		  remember.forget('sass', event.path);
		}
	  });
	gulp.watch('frontend/**/*.html', ['html']);
	gulp.watch('frontend/js/**/*.js', ['js']);
});

//default
gulp.task('default', ['bower', 'watch', 'server']);
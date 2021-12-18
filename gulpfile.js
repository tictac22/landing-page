const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const concat = require('concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const uncss = require('gulp-uncss');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass');
const gcmq = require('gulp-group-css-media-queries');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webphtml = require('gulp-webp-html');
const webpCss = require('gulp-webp-css');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');
const fs = require('fs');
const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);
function clear(){
	return del('build/*');
}
/*let cssFiles = [	
	'./src/css/style.css'.pipe(gulp.dest('./build/css'))
	.on('error',console.error.bind(console))	
];*/
function styles() {
	return gulp.src('./src/css/style.scss')		
		.pipe(gulpif( isDev,sourcemaps.init()))
		.pipe(sass())
		.pipe(webpCss())
		.on('error', sass.logError)

		.pipe(gcmq())

		.pipe(autoprefixer({
				overrideBrowserlist:['>0.3%'],
	            cascade: false
	        }))
		
		.pipe(gulpif(isDev,sourcemaps.write()))
		.pipe(gulp.dest('./build/css'))

		.pipe(gulpif(isProd ,cleanCSS({
			level:1
		})))		
		.pipe(rename({
			extname:'.min.css'
		}))
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream());
}
function img() {
	return gulp.src('./src/img/**/*')
	.pipe(webp({
		quality:75

	}))
	.pipe(gulp.dest('./build/img'))
	.pipe(gulp.src('./src/img/**/*'))
	.pipe(imagemin({
		progressive:true,
		svgoPlugins:[{removeViewBox:false}],
		interlaced:true,
		optimizationLevel:3
	}))
	.pipe(gulp.dest('./build/img'))
	.pipe(browserSync.stream());
}
function html() {
	return gulp.src('./src/*.html')
	.pipe(fileinclude())
	.pipe(webphtml())
	.pipe(gulp.dest('./build/'))
	.pipe(browserSync.stream());
}

const checkWeight = (fontname) => {
  let weight = 400;
  switch (true) {
    case /Thin/.test(fontname):
      weight = 100;
      break;
    case /ExtraLight/.test(fontname):
      weight = 200;
      break;
    case /Light/.test(fontname):
      weight = 300;
      break;
    case /Regular/.test(fontname):
      weight = 400;
      break;
    case /Medium/.test(fontname):
      weight = 500;
      break;
    case /SemiBold/.test(fontname):
      weight = 600;
      break;
    case /Semi/.test(fontname):
      weight = 600;
      break;
    case /Bold/.test(fontname):
      weight = 700;
      break;
    case /ExtraBold/.test(fontname):
      weight = 800;
      break;
    case /Heavy/.test(fontname):
      weight = 700;
      break;
    case /Black/.test(fontname):
      weight = 900;
      break;
    default:
      weight = 400;
  }
  return weight;
}
const fontsScss = `src/css/fonts.scss`;
const fontsFiles = `build/fonts/`;

const fontsStyle = async () => {
  return (() => {
    const file_content = fs.readFileSync(fontsScss);
   
    if (file_content != "") {
      fs.writeFileSync(fontsScss, "");
    }
    fs.readdir(fontsFiles, (_, fonts) => {
      if (fonts) {
        return fonts.forEach((item) => {
        	let woff2 = 'woff2';
        	if (/woff2/.test(item)) {
	          const fontname = item.split(".")[0];
	          const font = fontname.split("-")[0];
	          const weight = checkWeight(fontname);
	          const style = fontname.includes("Italic");
	          fs.appendFileSync(fontsScss,  `@include font("${font}", "${fontname}", ${weight},${style? " italic" : " normal"});\r\n`);
	      	}

        });
      }
    });
  })();
};
function fonts(){
	 gulp.src('./src/fonts/*.ttf')
	.pipe(ttf2woff())
	.pipe(gulp.dest('./build/fonts'));
	 return gulp.src('./src/fonts/*.ttf')
	.pipe(ttf2woff2())
	.pipe(gulp.dest('./build/fonts'));
}
gulp.task('otf2ttf',function() {
	return  gulp.src('./src/fonts/*.otf')
	.pipe(fonter({
		formats:['ttf']
	}))
	.pipe(gulp.dest('./src/fonts'));

})
function js() {
	return gulp.src('./src/js/main.js')
	.pipe(fileinclude())
	.pipe(gulp.dest('./build/js'))
	.pipe(uglify())
	.pipe(rename({
			extname:'.min.js'
		}))
	.pipe(gulp.dest('./build/js'))
	.pipe(browserSync.stream());
}
function watch() {
	 if(isSync){
		browserSync.init({
	        server: {
	            baseDir: "./build/",
			},
			open: false
	    });
	}
	gulp.watch('./src/css/**/*.scss', styles);
	gulp.watch('./src/html/*.html', html);
	gulp.watch('./src/**/*.html', html);
	gulp.watch('./src/js/**/*', js);
	gulp.watch('./src/img/**/*', img);
	gulp.watch('./src/fonts/**/*', fonts);			
}
let build = gulp.series(clear,gulp.parallel(styles,js,img,fonts,html),fontsStyle);
gulp.task('build',build);
gulp.task('watch',gulp.series(build,watch));
gulp.task('fontsStyle',fontsStyle);
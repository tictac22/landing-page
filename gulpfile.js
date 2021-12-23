/// gulp
import gulp from  'gulp';
import del from  'del';
import browserSync from  'browser-sync';
import sourcemaps from  'gulp-sourcemaps';
import gulpif from  'gulp-if';
import fs from  'fs';
const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);
console.log(process.argv)
/// html
import fileinclude from 'gulp-file-include';
import webphtml from 'gulp-webp-html';

///css
import sass from  'gulp-sass';
import autoprefixer from  'gulp-autoprefixer';
import concat from  'concat';
import cleanCSS from  'gulp-clean-css';
import uncss from  'gulp-uncss';
import gcmq from  'gulp-group-css-media-queries';
import rename from  "gulp-rename";
import webpCss from  'gulp-webp-css';

/// js
//const uglify = require('gulp-uglify-es').default;
import webpack from 'webpack-stream';

/// img
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';

///css
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';
import fonter from 'gulp-fonter';

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
const clear = () => {
	return del('build/*');
}

const html = () => {
	return gulp.src('./src/*.html')
	.pipe(fileinclude())
	.pipe(webphtml())
	.pipe(gulp.dest('./build/'))
	.pipe(browserSync.stream());
}
const styles = () => {
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
const mode = `${isDev ? "development" : "production"}` 
const js = () => {
	return gulp.src('./src/js/main.js')
	.pipe(webpack({
		mode: mode,
		output: {
			filename:"main.min.js",
		},
		module: {
				 
		}
	}))
	.pipe(gulp.dest('./build/js'))
	.pipe(browserSync.stream());
}
/*
rules: [
				{ test: /\.css$/, use: 'css-loader' }
			],
*/ 
const img = () => {
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
const fonts = () =>{
	 gulp.src('./src/fonts/*.ttf')
	.pipe(ttf2woff())
	.pipe(gulp.dest('./build/fonts'));
	 return gulp.src('./src/fonts/*.ttf')
	.pipe(ttf2woff2())
	.pipe(gulp.dest('./build/fonts'));
}
export const otf2ttf = () =>  {
	return  gulp.src('./src/fonts/*.otf')
	.pipe(fonter({
		formats:['ttf']
	}))
	.pipe(gulp.dest('./src/fonts'));
}
const watch = () => {
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
const build = gulp.series(clear,gulp.parallel(styles,img,fonts,js,html),fontsStyle);
gulp.task('build',build);
gulp.task('watch',gulp.series(build,watch));
gulp.task('fontsStyle',fontsStyle);
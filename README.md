# gulp-markdown-it-adapter

An adapter for Gulp to render Markdown files with Markdown-It.

It's not a wrapper, it's an adapter!  
Why? I want to have full access to Markdown-It instance instead of place options to the wrapper.

This plugin is the same as [gulp-markdown-it](https://github.com/mcecot/gulp-markdown-it),
but takes Markdown-It instance outside and written on pure JavaScript ES5.

## Usage

Install as a development dependency:

```shell
npm install --save-dev gulp-markdown-it-adapter
```

Use in `Gulpfile.js`:

```javascript
var gulp = require( 'gulp' );
var MarkdownIt = require( 'markdown-it' );
var gulpMarkdownIt = require( 'gulp-markdown-it-adapter' );
var highlightJs = require( 'highlight.js' );
var concat = require( 'gulp-concat' );
var mdToc = require( 'markdown-it-toc-and-anchor' ).default;
var wrap = require( 'gulp-wrap' );

gulp.task(
	'default',
	function ()
	{
		var sourcePath = './docs/*.md';
		var outputPath = './';
		var outputFileName = 'docs';
		var stylesPath = './styles';
		
		var optionsMd = {
			html: false,
			xhtmlOut: true,
			typographer: false,
			linkify: false,
			breaks: false,
			highlight: highlight
		};
		var optionsToc = {
			toc: true,
			tocFirstLevel: 2,
			tocLastLevel: 3,
			anchorLink: false,
			tocClassName: 'table-of-contents'
		};
		
		var md = new MarkdownIt( 'default', optionsMd );
		md.use( mdToc, optionsToc );
		
		return gulp.src( sourcePath )
			.pipe( concat( outputFileName + '.md' ) )
			.pipe( gulpMarkdownIt( md ) )
			.pipe( wrap( {src: stylesPath + '/template.html'} ) )
			.pipe( gulp.dest( outputPath ) );
	}
);

function highlight( str, lang )
{
	if ( lang && highlightJs.getLanguage( lang ) )
	{
		try
		{
			return highlightJs.highlight( lang, str ).value;
		}
		catch ( exception )
		{
			console.error( exception );
		}
	}
	
	try
	{
		return highlightJs.highlightAuto( str ).value;
	}
	catch ( exception )
	{
		console.error( exception );
	}
	
	return '';
}

```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License) © []()

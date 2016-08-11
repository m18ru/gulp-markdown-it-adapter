'use strict';

var gulpUtil = require( 'gulp-util' );
var through = require( 'through2' );

/**
 * Adapter for connect Markdown-it with Gulp stream
 * 
 * @param {MarkdownIt} md Markdown-it instance
 * @return {NodeJS.ReadWriteStream}
 */
function gulpMarkdownItAdapter( md )
{
	return through.obj(
		/**
		 * @param {File} File
		 * @param {string} encoding
		 * @param {() => void} callback
		 */
		function ( file, encoding, callback )
		{
			if (
				file.isNull()
				|| ( file.content === null )
			)
			{
				callback( null, file );
				return;
			}
			
			if ( file.isStream() )
			{
				callback(
					new gulpUtil.PluginError(
						'gulp-markdown-it-adapter',
						'Stream content is not supported.'
					)
				);
				return;
			}
			
			try
			{
				file.contents = new Buffer(
					md.render(
						file.contents.toString()
					)
				);
				file.path = gulpUtil.replaceExtension(
					file.path,
					'.html'
				);
				this.push( file );
			}
			catch ( exception )
			{
				callback(
					new gulpUtil.PluginError(
						'gulp-markdown-it-adapter',
						exception,
						{
							fileName: file.path,
							showstack: true
						}
					)
				);
			}
			
			callback();
		}
	);
}

module.exports = gulpMarkdownItAdapter;

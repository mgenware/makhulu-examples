/**
 * Prerequisites:
 * Please install the required packages first:
 * `yarn add makhulu terser`
 */
import * as mk from 'makhulu';
import { minify } from 'terser';

(async () => {
  // Select all .js files as initial data list.
  const srcDir = './files/';
  const files = await mk.fs.src(srcDir, '**/*.js');
  /**
   * Now the data list is something like:
   * [
   *   {
   *      SrcDir: './files/',
   *      FilePath: 'a.js',
   *    },
   *    {
   *      SrcDir: './files/',
   *      FilePath: 'sub/b/js',
   *    },
   *    ...
   * ]
   */

  // Print out data list file paths using `printsRelativeFile`.
  await files.forEach('Source files', mk.fs.printsRelativeFile);

  // Read file contents, now each data entry contains file contents.
  await files.map('Read files', mk.fs.readToString);
  /**
   * Now the data list is like (note that "Read file" only adds attributes to the data list, all previous attributes are preserved):
   * [
   *   {
   *      SrcDir: './files/',
   *      FilePath: 'a.js',
   *      Content: 'blabla',
   *    },
   *    {
   *      SrcDir: './files/',
   *      FilePath: 'sub/b/js',
   *      Content: 'blabla',
   *    },
   *    ...
   * ]
   */

  // You can change the content to whatever you want, e.g. uglify the content.
  await files.map('Uglify', async (data) => {
    const content = data[mk.fs.FileContent] as string;
    const uglifyRes = await minify(content);
    data[mk.fs.FileContent] = uglifyRes.code;
    return data;
  });
  /**
   * Now the data list is like:
   * [
   *   {
   *      SrcDir: './files/',
   *      FilePath: 'a.js',
   *      Content: 'Uglified content ...',
   *    },
   *    {
   *      SrcDir: './files/',
   *      FilePath: 'sub/b/js',
   *      Content: 'Uglified content ...',
   *    },
   *    ...
   * ]
   */

  // Now let's merge these files into one file.
  // We need to create a new data list.
  await files.reset('Merge files', async (dataList) => {
    // The name of the merged file.
    const destPath = 'bundle.js';
    // Merge contents of all files into a single string.
    let contents = '';
    dataList.forEach((d) => {
      contents += d[mk.fs.FileContent] as string;
    });
    // Create a new `DataObject`.
    const bundleFileObject = {
      [mk.fs.SrcDir]: srcDir,
      [mk.fs.RelativeFile]: destPath,
      [mk.fs.FileContent]: contents,
    };
    return [bundleFileObject];
  });
  /**
   * Now the data list is like:
   * [
   *   {
   *      SrcDir: './files/',
   *      FilePath: 'bundle.js',
   *      Content: 'Merged content',
   *    },
   * ]
   */

  // Call `writeToDirectory` to save the data list to disk, in this case, the `dist/bundle.js` we just created.
  await files.map('Write files', mk.fs.writeToDirectory(`./dist/`));
  await files.forEach('Dest files', mk.fs.printsDestFile);
  /**
   * Now the data list is like:
   * [
   *   {
   *      SrcDir: './dist/',
   *      FilePath: 'bundle.js',
   *      Content: 'Merged content',
   *      DestFilePath: './dist/bundle.js',
   *    },
   * ]
   */
})();

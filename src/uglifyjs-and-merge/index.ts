/**
 * Assuming you have installed the following packages:
 * makhulu, uglify-js, @types/uglify-js
 */
import * as mk from 'makhulu';
import { minify } from 'uglify-js';
import * as nodepath from 'path';

(async () => {
  const srcDir = './test_files/';
  // Select all js files as the initial data list
  const files = await mk.fs.src(srcDir, '**/*.js');
  /**
   * Now the data list is like:
   * [
   *   {
   *      SrcDir: './test_files/',
   *      FilePath: 'a.js',
   *    },
   *    {
   *      SrcDir: './test_files/',
   *      FilePath: 'sub/b/js',
   *    },
   *    ...
   * ]
   */

  // Prints src file paths using printsRelativeFile
  await files.forEach('Source files', mk.fs.printsRelativeFile);

  // Read file paths to string contents, now data list contains file content data
  await files.map('Read files', mk.fs.readToString);
  /**
   * Now the data list is like (note that this only adds attributes to the target data map, all previous attributes are preserved):
   * [
   *   {
   *      SrcDir: './test_files/',
   *      FilePath: 'a.js',
   *      Content: 'blabla',
   *    },
   *    {
   *      SrcDir: './test_files/',
   *      FilePath: 'sub/b/js',
   *      Content: 'blabla',
   *    },
   *    ...
   * ]
   */

  // You can modify the content to whatever you want, e.g. uglify the content
  await files.map('Uglify', async data => {
    const content = data[mk.fs.FileContent] as string;
    const uglifyRes = minify(content);
    if (uglifyRes.error) {
      throw uglifyRes.error;
    }
    data[mk.fs.FileContent] = uglifyRes.code;
    return data;
  });
  /**
   * Now the data list is like:
   * [
   *   {
   *      SrcDir: './test_files/',
   *      FilePath: 'a.js',
   *      Content: 'Uglified content ...',
   *    },
   *    {
   *      SrcDir: './test_files/',
   *      FilePath: 'sub/b/js',
   *      Content: 'Uglified content ...',
   *    },
   *    ...
   * ]
   */

  // Another example of modify the content, we merge all the content of previous files into one, and manually creates the DataObject
  await files.reset('Merge into one file', async dataList => {
    // set merged file as "bundle.js"
    const destPath = 'bundle.js';
    // merge contents of all files into a single string
    let contents = '';
    dataList.forEach(d => {
      contents += d[mk.fs.FileContent] as string;
    });
    // create a new DataObject
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
   *      SrcDir: './test_files/',
   *      FilePath: 'merged.js',
   *      Content: 'Merged content',
   *    },
   * ]
   */

  // Call writeToDirectory to save all files to a directory, in this case, only one file called `merged.js` which we created
  await files.map(
    'Write files',
    mk.fs.writeToDirectory(`./dist_files/${nodepath.basename(__dirname)}`),
  );
  await files.forEach('Dest files', mk.fs.printsDestFile);
  /**
   * Now the data list is like:
   * [
   *   {
   *      SrcDir: './test_files/',
   *      FilePath: 'merged.js',
   *      Content: 'Merged content',
   *      DestFilePath: './dist_files/uglifyjs-and-merge/merged.js',
   *    },
   * ]
   */
})();

import * as mk from '../../../makhulu';
import { minify } from 'uglify-js';

(async () => {
  const files = await mk.fs.src('./test_files/', '**/*.js');
  await files.map('Read files', mk.fs.fileToContentString);
  await files.map('Uglify', async data => {
    const content = data.get(mk.fs.FileContent) as string;
    const uglifyRes = minify(content);
    if (uglifyRes.error) {
      throw uglifyRes.error;
    }
    return data.set(mk.fs.FileContent, uglifyRes.code);
  });
  await files.map('Write files', mk.fs.saveToDirectory('./dist_files/uglify-js-files'));
})();

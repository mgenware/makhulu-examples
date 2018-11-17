import { minify } from 'html-minifier';
import * as mk from 'makhulu';
import * as nodepath from 'path';

(async () => {
  const srcDir = './test_files/';

  const files = await mk.fs.src(srcDir, '**/*.html');
  await files.map('Read files', mk.fs.readToString);
  await files.map('Minify files', async d => {
    const content = d.get(mk.fs.FileContent) as string;
    const res = minify(content, { collapseWhitespace: true });
    return d.set(mk.fs.FileContent, res);
  });
  await files.map('Saving to files', mk.fs.writeToDirectory(`./dist_files/${nodepath.basename(__dirname)}`));
})();

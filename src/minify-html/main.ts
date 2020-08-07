import { minify } from 'html-minifier';
import * as mk from 'makhulu';
import * as nodepath from 'path';

(async () => {
  const srcDir = './files/';

  const files = await mk.fs.src(srcDir, '**/*.html');
  await files.map('Read files', mk.fs.readToString);
  await files.map('Minify files', async (d) => {
    const content = d[mk.fs.FileContent] as string;
    const res = minify(content, { collapseWhitespace: true });
    d[mk.fs.FileContent] = res;
    return d;
  });
  await files.map(
    'Saving to files',
    mk.fs.writeToDirectory(`./dist/${nodepath.basename(__dirname)}`),
  );
})();

import * as mk from 'makhulu';
import * as got from 'got';
import * as nodepath from 'path';
const URL = 'url';

(async () => {
  const urls = ['www.google.com', 'www.microsoft.com', 'www.apple.com'];

  const list = new mk.DataList(
    urls.map(u => ({
      [URL]: u,
    })),
  );
  await list.map('Downloading', async d => {
    const url = d[URL] as string;
    const resp = await got(url);
    d[mk.fs.RelativeFile] = `${url}.html`;
    d[mk.fs.FileContent] = resp.body;
    return d;
  });
  await list.map(
    'Saving to files',
    mk.fs.writeToDirectory(`./dist_files/${nodepath.basename(__dirname)}`),
  );
})();

import * as mk from 'makhulu';
import got from 'got';
import * as nodepath from 'path';

const URL = 'url';
const Name = 'name';

(async () => {
  const urls = ['github.com', 'www.microsoft.com', 'www.apple.com'];

  const list = new mk.DataList(
    urls.map((u) => ({
      [Name]: u,
      [URL]: `https://${u}`,
    })),
  );
  await list.map('Downloading', async (d) => {
    const url = d[URL] as string;
    const resp = await got(url);
    d[mk.fs.RelativeFile] = `${d[Name]}.html`;
    d[mk.fs.FileContent] = resp.body;
    return d;
  });
  await list.map(
    'Saving to files',
    mk.fs.writeToDirectory(`./dist/${nodepath.basename(__dirname)}`),
  );
})();

/**
 * Assuming you have installed the following packages:
 * makhulu, ky
 */
import * as mk from 'makhulu';
import * as got from 'got';
const URL = 'url';

(async () => {
  const urls = [
    'www.google.com',
    'www.microsoft.com',
    'www.apple.com',
  ];

  const list = new mk.DataList(urls.map(u => mk.DataObject.fromEntries([
    [URL, u],
  ])));
  await list.map('Downloading', async d => {
    const url = d.get(URL) as string;
    const resp = await got(url);
    return d.set(mk.fs.RelativeFile, `${url}.html`)
      .set(mk.fs.FileContent, resp.body);
  });
  await list.map('Saving to files', mk.fs.saveToDirectory('./dist_files/download-urls-to-files'));
})();

/**
 * Assuming you have installed the following packages:
 * makhulu, ky
 */
import * as mk from 'makhulu';
import * as ky from 'ky';

const URL = 'url';
const CONTENT = 'content';

(async () => {
  const urls = [
    'www.google.com',
    'www.microsoft.com',
    'www.apple.com',
  ];

  const list = new mk.DataList(urls.map(u => mk.DataObject.fromEntries([
    [URL, u],
  ])));
  await list.map('download', async d => {
    const content = await ky.default.get(d.get(URL) as string).text();
    return d.set(CONTENT, content);
  });
})();

#!/usr/bin/env node
/*
 * Read the carpool calendar outside the browser.
 *
 *   node decrypt.js <key> [file-or-url]
 *
 * The key is the "k" value from a setup link. With no file given it reads the
 * live calendar. Prints the plain JSON to stdout.
 */
const crypto = require('crypto');
const fs = require('fs');

const key = process.argv[2];
const src = process.argv[3] ||
  'https://raw.githubusercontent.com/elijahmanlockedin112/carpool/main/schedule.json';

if (!key) {
  console.error('usage: node decrypt.js <key> [file-or-url]');
  process.exit(1);
}

(async () => {
  const text = /^https?:/.test(src)
    ? await (await fetch(src, {cache: 'no-store'})).text()
    : fs.readFileSync(src, 'utf8');

  const o = JSON.parse(text);
  if (!(o.v === 1 && o.ct)) { console.log(text); return; }   // not encrypted

  // WebCrypto appends the 16-byte GCM tag to the ciphertext.
  const raw = Buffer.from(o.ct, 'base64');
  const d = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key.replace(/-/g, '+').replace(/_/g, '/'), 'base64'),
    Buffer.from(o.iv, 'base64')
  );
  d.setAuthTag(raw.subarray(raw.length - 16));
  console.log(Buffer.concat([d.update(raw.subarray(0, raw.length - 16)), d.final()]).toString());
})().catch(e => {
  console.error('could not decrypt — wrong key, or the file is not this calendar');
  console.error(e.message);
  process.exit(1);
});

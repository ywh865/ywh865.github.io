# Vendored assets

This repository keeps a small number of browser assets in the Phantom theme so the static site can build without obsolete Hexo integration packages.

## jQuery 3.7.1

- Source package: `jquery@3.7.1`
- Upstream: <https://jquery.com/>
- Destination: `themes/phantom/source/js/jquery.min.js`
- Update command: `npm run sync:vendor`
- Verification command: `npm run check:vendor`

The committed file MUST byte-match `node_modules/jquery/dist/jquery.min.js`; manual edits are prohibited.

## Live2D Widget and Shizuku model

- Widget upstream: <https://github.com/xiazeyu/live2d-widget.js>
- Widget build stamp: `2019-04-06`
- Model package origin: `live2d-widget-model-shizuku@1.0.5`
- Destination: `themes/phantom/source/live2dw/`

Key SHA-256 values at the time of vendoring:

| File | SHA-256 |
| --- | --- |
| `lib/L2Dwidget.min.js` | `A8838E32C668E7DF9707658387FA9B358FD6616328DD2764FA83A323F997F2B5` |
| `lib/L2Dwidget.0.min.js` | `0201A0D80D3FAFDBEA982FB9AB6BCBDDC39BA9E522450C71B0C6AFF916085C24` |
| `assets/shizuku.model.json` | `9FFDB0BCA66F30A5D848C0BCFE243B40C6F351986013CC0C5BE42B510BE0A669` |

These assets were vendored to remove the unmaintained `hexo-helper-live2d` dependency chain. Any replacement MUST preserve local loading, mobile-disable behavior, and the configured model path, and MUST receive a fresh vulnerability and license review.

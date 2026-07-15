'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'node_modules', 'jquery', 'dist', 'jquery.min.js');
const destination = path.join(root, 'themes', 'phantom', 'source', 'js', 'jquery.min.js');
const mode = process.argv[2];

if (mode !== '--check' && mode !== '--write') {
    console.error('Usage: node scripts/vendor-jquery.js --check|--write');
    process.exit(2);
}

if (!fs.existsSync(source)) {
    console.error('jQuery is not installed. Run npm ci before checking vendored assets.');
    process.exit(1);
}

const expected = fs.readFileSync(source);
const actual = fs.existsSync(destination) ? fs.readFileSync(destination) : null;
const isCurrent = actual !== null && Buffer.compare(expected, actual) === 0;

if (mode === '--check') {
    if (!isCurrent) {
        console.error('Vendored jQuery does not match node_modules. Run npm run sync:vendor.');
        process.exit(1);
    }

    console.log('Vendored jQuery is synchronized.');
    process.exit(0);
}

if (!isCurrent) {
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.copyFileSync(source, destination);
    console.log('Updated themes/phantom/source/js/jquery.min.js.');
} else {
    console.log('Vendored jQuery is already synchronized.');
}

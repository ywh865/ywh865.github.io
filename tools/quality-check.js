'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const layoutRoot = path.join(root, 'themes', 'phantom', 'layout');
const customScripts = [
    'themes/phantom/source/js/main.js',
    'themes/phantom/source/js/search.js',
    'themes/phantom/source/js/like.js',
    'themes/phantom/source/js/util.js'
];
const failures = [];

function walk(directory, extension) {
    return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
        const filePath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            return walk(filePath, extension);
        }
        return entry.isFile() && filePath.endsWith(extension) ? [filePath] : [];
    });
}

function relative(filePath) {
    return path.relative(root, filePath).replaceAll('\\', '/');
}

function fail(filePath, line, message) {
    failures.push(`${relative(filePath)}:${line}: ${message}`);
}

function lineNumber(content, index) {
    return content.slice(0, index).split('\n').length;
}

for (const filePath of walk(layoutRoot, '.ejs')) {
    const content = fs.readFileSync(filePath, 'utf8');

    for (const match of content.matchAll(/<%-([\s\S]*?)%>/g)) {
        const expression = match[1].trim();
        const allowed = /^(partial\(|js\(|css\(|JSON\.stringify\(|body$|item\.content$)/.test(expression);
        if (!allowed) {
            fail(filePath, lineNumber(content, match.index), `unapproved raw EJS output: ${expression}`);
        }
    }

    const rules = [
        [/(?:src|href)\s*=\s*["']\/(?:css|fonts|images|js|live2dw|sass)\//g,
            'hard-coded root asset URL; use url_for() or a Hexo helper'],
        [/config\.root\s*\+/g, 'manual config.root concatenation; use url_for()'],
        [/target=["']_blank["'](?![^>]*rel=["'][^"']*noopener)/g,
            'target="_blank" requires rel="noopener noreferrer"']
    ];

    for (const [pattern, message] of rules) {
        for (const match of content.matchAll(pattern)) {
            fail(filePath, lineNumber(content, match.index), message);
        }
    }
}

for (const relativePath of customScripts) {
    const filePath = path.join(root, relativePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const rules = [
        [/window\.onclick\s*=/g, 'do not overwrite global event handlers'],
        [/document\.write\s*\(/g, 'document.write() is prohibited'],
        [/(^|[^\w])eval\s*\(/gm, 'eval() is prohibited'],
        [/new\s+Function\s*\(/g, 'new Function() is prohibited']
    ];

    for (const [pattern, message] of rules) {
        for (const match of content.matchAll(pattern)) {
            fail(filePath, lineNumber(content, match.index), message);
        }
    }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const [name, version] of Object.entries(packageJson.dependencies || {})) {
    if (/^[~^*]|\s|\|\||^(?:git|https?|file):/.test(version)) {
        failures.push(`package.json: dependency ${name} must use an exact registry version, found ${version}`);
    }
}

if (failures.length > 0) {
    console.error('Quality checks failed:\n' + failures.map((failure) => `- ${failure}`).join('\n'));
    process.exit(1);
}

console.log('Quality checks passed.');

const en = require('nanoid-good/locale/en');
const fr = require('nanoid-good/locale/fr');

const customAlphabet = require('nanoid-good').customAlphabet(en, fr);
// Based on documentation here https://github.com/ai/nanoid
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const generator = customAlphabet(alphabet, 32);
exports.generator = generator;

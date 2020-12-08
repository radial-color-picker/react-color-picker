const fs = require('fs/promises');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const input = './src/ColorPicker/style.css';

async function writeCSS(file, inputPath, outputPath, minify) {
    const plugins = [autoprefixer];

    if (minify) {
        plugins.push(cssnano);
    }

    const result = await postcss(plugins).process(file, {
        from: inputPath,
        to: outputPath,
        map: minify ? { inline: false } : false,
    });

    await fs.writeFile(outputPath, result.css);

    if (result.map) {
        await fs.writeFile(result.opts.to + '.map', result.map.toString());
    }
}

(async () => {
    try {
        const file = await fs.readFile(input);

        writeCSS(file, input, './dist/react-color-picker.css');
        writeCSS(file, input, './dist/react-color-picker.min.css', true);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
})();

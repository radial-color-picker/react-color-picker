import autoprefixer from 'autoprefixer';
import babel from 'rollup-plugin-babel';
import butternut from 'rollup-plugin-butternut';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

export default [
    {
        input: 'src/index.js',
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' }
        ],
        external: ['react'],
        plugins: [
            postcss({ extract: false }),
            babel({ exclude: ['node_modules/**'] }),
            resolve(),
            commonjs(),
        ]
    },
    {
        input: 'src/index.js',
        output: {
            file: pkg.browser,
            format: 'umd',
            name: 'ReactColorPicker',
            globals: { react: 'React' },
        },
        external: ['react'],
        plugins: [
            postcss({ extract: true, plugins: [autoprefixer], minimize: true }),
            babel({ exclude: ['node_modules/**'] }),
            resolve(),
            commonjs(),
            butternut(),
        ]
    },
];

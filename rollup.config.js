import autoprefixer from 'autoprefixer';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';

const input = 'src/ColorPicker/index.js';
const name = 'react-color-picker';

export default [
    {
        input,
        output: [
            { file: `dist/${name}.cjs.js`, format: 'cjs', exports: 'default' },
            { file: `dist/${name}.esm.js`, format: 'esm' }
        ],
        external: ['react'],
        plugins: [
            resolve(),
            postcss({
                extract: false,
                inject: false,
            }),
            babel(),
        ]
    },
    {
        input,
        output: {
            file: `dist/${name}.umd.js`,
            format: 'umd',
            name: 'ReactColorPicker',
            globals: { react: 'React' }
        },
        external: ['react'],
        plugins: [
            resolve(),
            postcss({
                extract: `${name}.css`,
                inject: false,
                minimize: false,
                sourceMap: false,
                plugins: [autoprefixer],
            }),
            babel(),
        ]
    },
    {
        input,
        output: {
            file: `dist/${name}.umd.min.js`,
            format: 'umd',
            name: 'ReactColorPicker',
            globals: { react: 'React' },
            sourcemap: true,
        },
        external: ['react'],
        plugins: [
            resolve(),
            postcss({
                extract: `${name}.min.css`,
                inject: false,
                minimize: true,
                sourceMap: true,
                plugins: [autoprefixer],
            }),
            babel(),
            terser(),
        ],
    },
];

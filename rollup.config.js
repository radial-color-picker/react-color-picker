import autoprefixer from 'autoprefixer';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';

const input = 'src/ColorPicker/index.js';
const file = 'dist/react-color-picker';

export default [
    {
        input,
        output: [
            { file: `${file}.cjs.js`, format: 'cjs' },
            { file: `${file}.esm.js`, format: 'esm' }
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
            file: `${file}.umd.js`,
            format: 'umd',
            name: 'ReactColorPicker',
            globals: { react: 'React' }
        },
        external: ['react'],
        plugins: [
            resolve(),
            postcss({
                // rollup-plugin-postcss is using deprecated rollup APIs
                // @link https://github.com/egoist/rollup-plugin-postcss/issues/258
                extract: `${file}.css`,
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
            file: `${file}.umd.min.js`,
            format: 'umd',
            name: 'ReactColorPicker',
            globals: { react: 'React' },
            sourcemap: true,
        },
        external: ['react'],
        plugins: [
            resolve(),
            postcss({
                // rollup-plugin-postcss is using deprecated rollup APIs
                // @link https://github.com/egoist/rollup-plugin-postcss/issues/258
                extract: `${file}.min.css`,
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

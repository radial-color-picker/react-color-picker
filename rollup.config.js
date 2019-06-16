import autoprefixer from 'autoprefixer';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';

const file = 'dist/react-color-picker';

export default [
    {
        input: 'src/index.js',
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
        input: 'src/index.js',
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
        input: 'src/index.js',
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

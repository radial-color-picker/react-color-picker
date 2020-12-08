import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const input = 'src/ColorPicker/index.js';
const name = 'react-color-picker';

const getBabelConfig = runtime => {
    return {
        babelHelpers: 'bundled',
        presets: [
            [
                '@babel/preset-env',
                {
                    loose: true,
                    modules: false,
                },
            ],
            ['@babel/preset-react', { runtime }],
        ],
    };
};

export default [
    {
        input,
        output: [
            { file: `dist/${name}.cjs.js`, format: 'cjs', exports: 'default' },
            { file: `dist/${name}.esm.js`, format: 'esm' },
        ],
        external: ['react', 'react/jsx-runtime'],
        plugins: [babel(getBabelConfig('automatic')), resolve()],
    },
    {
        input,
        output: {
            file: `dist/${name}.umd.js`,
            format: 'umd',
            name: 'ReactColorPicker',
            globals: { react: 'React' },
        },
        external: ['react'],
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('development'),
            }),
            babel(getBabelConfig('classic')),
            resolve(),
        ],
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
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            babel(getBabelConfig('classic')),
            resolve(),
            terser(),
        ],
    },
];

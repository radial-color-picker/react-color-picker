import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const name = 'react-color-picker';

export default defineConfig({
    plugins: [react()],
    build: {
        copyPublicDir: false,
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'src/ColorPicker.jsx'),
            name: 'ColorPicker',
            fileName: 'react-color-picker'
        },
        rollupOptions: {
            external: ['react', 'react/jsx-runtime'],
            output: {
                globals: {
                    // @todo react/jsx-runtime doesn't have a UMD build and there's no global to provide here
                    // There probably won't be an UMD at all so react-color-picker might become ESM only build
                    react: 'React',
                },
            },
        },
    },
});

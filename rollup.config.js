import copy from "rollup-plugin-copy"
import livereload from "rollup-plugin-livereload"
import rust from "@wasm-tool/rollup-plugin-rust"
import serve from "rollup-plugin-serve"
import styles from "rollup-plugin-styles"

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
    input: [
        'src/index.js',
    ],
    output: {
        file: 'dist/bundle.js',
        sourcemap: true,
    },
    plugins: [
        copy({
            targets: [
                { 'src': 'src/index.html', dest: 'dist/' },
            ],
        }),
        rust(),
        styles(),
        serve('dist'),
        livereload(),
    ],
    watch: {
        include: ['src/**', "wasm/src/**"],
    },
}

import {defineConfig} from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
    define: {
        global: 'window',
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
        strictPort: true
    },
    plugins: [
        vue(),
        AutoImport({
            imports: ['vue'],
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    prefix: 'Icon',
                }),
            ],
            dts: 'src/auto-imports.d.ts',
        }),
        Components({
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
            ],
            dts: 'src/components.d.ts',
        }),
        Icons({
            autoInstall: true,
        }),
    ],
        resolve
:
{
    alias: {
        '@'
    :
        path.resolve(__dirname, 'src'),
    }
,
}
,
})
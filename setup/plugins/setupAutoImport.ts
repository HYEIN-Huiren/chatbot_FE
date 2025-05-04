import AutoImport from 'unplugin-auto-import/vite';

export default function setupAutoImport(): any {
  return AutoImport({
    include: [/\.[tj]sx?$/, /\.md$/],
    imports: ['react', 'react-router-dom', 'react-i18next'],
    dts: 'setup/plugins/auto-import-dependencies.d.ts',
    dirs: ['src/store/**.ts', 'src/common/utils/**']
  });
}

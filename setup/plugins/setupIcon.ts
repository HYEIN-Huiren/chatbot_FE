import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from 'unplugin-icons/vite';
import IconResolver from 'unplugin-icons/resolver';

const AUTOLOAD_DIR = 'public/icons/autocharge';
const AUTOLOAD_DATA_SVG_DIR = 'public/icons/autocharge/data';
export default function setupIcon():any {
  return Icons({
    autoInstall: true,
    compiler: 'jsx',
    iconSource: 'auto',
    customCollections: {
      local: FileSystemIconLoader(AUTOLOAD_DIR, (svg) => svg),
      data: FileSystemIconLoader(AUTOLOAD_DATA_SVG_DIR, (svg) => svg.replace(/^<svg /, '<svg fill="currentColor" '))
    },
    iconCustomizer: (collection, icon, props) => {},
    transform(s, c, i) {
      return s;
    }
  });
}

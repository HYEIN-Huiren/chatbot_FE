import react from '@vitejs/plugin-react';
import { PluginOption } from 'vite';
import Inspect from 'vite-plugin-inspect';
import setupAutoImport from './plugins/setupAutoImport.ts';

export default function setupVitePlugins(): (PluginOption | PluginOption[])[] {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    react({ include: /\.(mdx|js|jsx|ts|tsx)$/ })
  ];

  vitePlugins.push(setupAutoImport());
  vitePlugins.push(Inspect());

  return vitePlugins;
}

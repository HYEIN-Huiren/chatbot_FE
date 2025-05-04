import { resolve } from 'path';
import type { ConfigEnv, UserConfig } from 'vite';
import { loadEnv } from 'vite';
// @ts-ignore
import pkg from './package.json';
// @ts-ignore
import setupVitePlugins from './setup/index.ts';
// @ts-ignore
import { wrapperEnv } from './setup/utils.ts';

const { dependencies, devDependencies, name, version } = pkg;

const ENV_PREFIX = 'VITE_STD_FE';
const ENV_DIR = 'env';
const FALLBACK_PORT = 8888;

const APP_INFO = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: new Date(),
  lastBuildTimeMs: Date.now(),
  envPrefix: ENV_PREFIX
};

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

function loadEnvByMode(mode: string) {
  return loadEnv(mode, process.cwd().concat(`\\${ENV_DIR}`), [ENV_PREFIX]);
}

function getCurrentEnvContext(rawName: string): string {
  return `${ENV_PREFIX}${rawName}`;
}

function loadSAEnv() {
  return process.env[getCurrentEnvContext('_ENV_ENABLED')] === 'true'
    ? process.env
    : loadEnvByMode('production');
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build';
  const root = process.cwd();
  const env = isBuild ? loadSAEnv() : loadEnvByMode(mode);
  const viteEnv = wrapperEnv(env, APP_INFO);

  return {
    base: viteEnv[getCurrentEnvContext('_PUBLIC_PATH')],
    root,
    envDir: root.concat(`\\${ENV_DIR}`),
    envPrefix: ENV_PREFIX,
    resolve: {
      alias: [
        {
          find: /~\//,
          replacement: `${pathResolve('setup')}/`
        },
        {
          find: /@\//,
          replacement: `${pathResolve('src')}/`
        },
        {
          find: /#\//,
          replacement: `${pathResolve('typing')}/`
        },
        {
          find: /\$\//,
          replacement: `${pathResolve('public')}/`
        }
      ]
    },

    server: {
      host: true,
      open: false,
      port: viteEnv[`${ENV_PREFIX}_PORT`] ? Number(viteEnv[`${ENV_PREFIX}_PORT`]) : FALLBACK_PORT,
      proxy: undefined
    },

    build: {
      rollupOptions: {
        external: [/^\/images*:.*/, /^\/mock-data*:.*/, /^\/themes*:.*/],
        plugins: []
      },
      cssCodeSplit: true,
      emptyOutDir: true,
      manifest: true,
      chunkSizeWarningLimit: 626
    },

    esbuild: {
      pure: viteEnv[`${ENV_PREFIX}_DOUCI`] ? [] : ['console.log', 'debugger']
    },

    plugins: setupVitePlugins()
  };
};

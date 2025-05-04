export function wrapperEnv(envConf: Recordable, appInfo: APP_INFO): ViteEnv {
  const ret: any = {};

  Object.keys(envConf).forEach((key, index) => {
    let realName = envConf[key].replace(/\\n/g, '\n');

    if (key === `${appInfo.envPrefix}_PORT`) {
      realName = Number(realName);
    }
    if (key === `${appInfo.envPrefix}_PROXY` && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'));
      } catch (error) {
        realName = '';
      }
    }
    ret[key] = realName;
  });

  return ret;
}

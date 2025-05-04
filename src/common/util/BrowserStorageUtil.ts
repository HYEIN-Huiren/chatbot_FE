/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.08.14
 * @description: BrowserStorageUtil
 ***************************************************************************
 * */

class BrowserStorageUtil {
  setItem(key: string, value: any) {
    if (value) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getItem(key: string) {
    const value = window.localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }

  clearItems() {
    window.localStorage.clear();
  }
}

export default new BrowserStorageUtil();

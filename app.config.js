/**
 * Extends app.json with build-time values that must not be hard-coded:
 *
 * EXPO_PUBLIC_WEB_BASE — the sub-path the web app is served from. Empty for a root
 * domain; "/pjs-diamond-world" for a GitHub Pages *project* site. The Pages workflow
 * sets it automatically from the repository name. No secrets live here.
 */
const appJson = require('./app.json');

const rawBase = process.env.EXPO_PUBLIC_WEB_BASE ?? '';
const baseUrl = rawBase.replace(/\/+$/, '');

module.exports = ({ config }) => {
  const base = { ...appJson.expo, ...config };
  return {
    ...base,
    experiments: {
      ...base.experiments,
      ...(baseUrl ? { baseUrl } : {}),
    },
  };
};

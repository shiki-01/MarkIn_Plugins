const fs = require('fs');
const path = require('path');

const pluginsDir = path.join(__dirname, '..', 'plugins');
const outputFilePath = path.join(__dirname, '..', 'plugins.json');

const plugins = [];

fs.readdirSync(pluginsDir).forEach(plugin => {
  const pluginPath = path.join(pluginsDir, plugin);
  if (fs.lstatSync(pluginPath).isDirectory()) {
    const versions = fs.readdirSync(pluginPath).filter(version => {
      return fs.lstatSync(path.join(pluginPath, version)).isDirectory();
    }).sort((a, b) => {
      return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
    });

    if (versions.length > 0) {
      const latestVersion = versions[0];
      const latestVersionPath = path.join(pluginPath, latestVersion, 'plugin.json');
      if (fs.existsSync(latestVersionPath)) {
        try {
          const pluginData = JSON.parse(fs.readFileSync(latestVersionPath, 'utf8'));
          plugins.push({ name: plugin, ...pluginData });
        } catch (error) {
          console.error(`Error parsing JSON for plugin ${plugin} version ${latestVersion}:`, error);
        }
      }
    }
  }
});

fs.writeFileSync(outputFilePath, JSON.stringify(plugins, null, 2), 'utf8');
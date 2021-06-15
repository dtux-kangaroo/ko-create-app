module.exports = {
  resolvePlugin: function (plugins) {
    return plugins.filter(Boolean).map(plugin => {
      if (Array.isArray(plugin)) {
        const [pluginName, ...args] = plugin;
        return [require.resolve(pluginName), ...args];
      }
      return require.resolve(plugin);
    });
  },
};

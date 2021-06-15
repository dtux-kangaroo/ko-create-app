const conf = {
  reduceConfig(config) { 
       if(!_.isArray(config)) {
          return config;
        }
        let output = {};
        for (let i = 0, len = config.length; i < len; i++) {
          output[config[i]._name] = this.reduceConfig(config[i]._value);
        }
        return output;
  } ,
  getValueFromConfig(config, path) {
      function _get(path) {
        let nextValue = { _value: config };
        path.split('.').every((key, i) => {
          if (_.isNumber(key)) {
            return (nextValue = nextValue._value[key]);
          }
          return (nextValue = nextValue._value.find((item) => item._name === key));
        });
        return nextValue || {};
      }
      if (arguments.length < 2) {
        return _get;
      }
      return _get(path);
    }
}
export default conf

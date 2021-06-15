const path = require('path');
const { resolvePlugin } = require('./util');
const absoluteRuntime = path.dirname(
  require.resolve('@babel/runtime/package.json')
);

//TODO: update with new babel config assumptions: https://babeljs.io/docs/en/assumptions
module.exports = function (plugins = [], targets) {
  const basePlugins = [
    // Stage 0
    '@babel/plugin-proposal-function-bind',
    // Stage 1
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-logical-assignment-operators',
    '@babel/plugin-transform-regenerator',
    [
      '@babel/plugin-proposal-optional-chaining',
      {
        loose: false,
      },
    ],
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        useBuiltIns: true,
      },
    ],
    // Disabled as it's handled automatically by preset-env, and `selectiveLoose` isn't
    // yet merged into babel: https://github.com/babel/babel/pull/9486
    // Related: https://github.com/facebook/create-react-app/pull/8215
    // [
    //   '@babel/plugin-transform-destructuring',
    //   {
    //     loose: false,
    //     selectiveLoose: [
    //       'useState',
    //       'useEffect',
    //       'useContext',
    //       'useReducer',
    //       'useCallback',
    //       'useMemo',
    //       'useRef',
    //       'useImperativeHandle',
    //       'useLayoutEffect',
    //       'useDebugValue',
    //     ],
    //   },
    // ],
    [
      '@babel/plugin-proposal-pipeline-operator',
      {
        proposal: 'minimal',
      },
    ],
    [
      '@babel/plugin-proposal-nullish-coalescing-operator',
      {
        loose: true,
      },
    ],
    '@babel/plugin-proposal-do-expressions',
    // Stage 2
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    // Stage 3
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    [
      '@babel/plugin-proposal-private-methods',
      {
        loose: true,
      },
    ],
    // Polyfills the runtime needed for async/await, generators, and friends
    // https://babeljs.io/docs/en/babel-plugin-transform-runtime
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false,
        // By default, babel assumes babel/runtime version 7.0.0-beta.0,
        // explicitly resolving to match the provided helper functions.
        // https://github.com/babel/babel/issues/10261
        version: require('@babel/runtime/package.json').version,
        //Using absolute paths is not desirable if files are compiled for use at a later time,
        //but in contexts where a file is compiled and then immediately consumed, they can be quite helpful.
        absoluteRuntime: absoluteRuntime,
      },
    ],
    '@babel/plugin-proposal-json-strings',
    [
      'babel-plugin-import',
      { libraryName: 'antd', libraryDirectory: 'lib' },
      'ant',
    ],
    [
      'babel-plugin-import',
      { libraryName: 'ant-mobile', libraryDirectory: 'lib' },
      'ant-mobile',
    ],
    [
      'babel-plugin-import',
      { libraryName: 'ant-design-vue', libraryDirectory: 'lib' },
      'ant-design-vue',
    ],
  ];
  return {
    babelrc: false,
    presets: resolvePlugin([
      [
        '@babel/preset-env',
        {
          /**
           * @tutorial https://github.com/browserslist/browserslist
           */
          targets: targets ? targets : 'defaults',
          useBuiltIns: 'entry',
          corejs: 3,
          // Exclude transforms that make all code slower
          exclude: ['transform-typeof-symbol'],
        },
      ],
      ['@babel/preset-react'],
      ['@babel/preset-typescript'],
    ]),
    plugins: resolvePlugin(basePlugins.concat(plugins)),
  };
};

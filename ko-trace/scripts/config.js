const path=require('path');
const bable =require('rollup-plugin-babel');
const uglify=require('rollup-plugin-uglify').uglify;
const version = process.env.VERSION || require('../package.json').version;
const banner =
  '/*!\n' +
  ' * ko-trace.js v' + version + '\n' +
  ' * (c) 2018-' + new Date().getFullYear() + ' dtstack\n' +
  ' * Released under the MIT License.\n' +
  ' */';
const builds={
  "dev-common":{
    dest:path.resolve(__dirname,'../test/common-html/ko-trace.js'),
    format:'umd',
    banner
  },
  "dev-react":{
    dest:path.resolve(__dirname,'../test/react-webpack/ko-trace.js'),
    format:'umd',
    banner
  },
  "production":{
    dest:path.resolve(__dirname,'../lib/ko-trace.js'),
    format:'umd',
    banner    
  },
  "production:min":{
    dest:path.resolve(__dirname,'../lib/ko-trace.min.js'),
    format:'umd',
    plugins:[
      uglify()
    ],
    banner    
  }
}
function getConfig(name){
  const opts = builds[name];
  const config={
    input:path.resolve(__dirname,'../src/index.js'),
    output:{
      name:'Kotrace',
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
    },
    plugins:[
      bable({
        exclude: 'node_modules/**',
        runtimeHelpers: true 
      })
    ].concat(opts.plugins||[])
  }
  return config;
}

if(process.env.TARGET){
  module.exports=getConfig(process.env.TARGET);
}else{
  module.exports.getAllBuilds=()=>Object.keys(builds).map(getConfig);
}
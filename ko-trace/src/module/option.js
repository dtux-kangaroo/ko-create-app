const DEFALUT_OPTIONS={
  session_expiration:30*60*1000,
  status:1,
  debug:false
}

export default {
  get:(name)=>{
    if(name) return DEFALUT_OPTIONS[name];
    return  DEFALUT_OPTIONS;
  },
  set:(options)=>{
    Object.assign(DEFALUT_OPTIONS,options);
    return DEFALUT_OPTIONS;
  }
}

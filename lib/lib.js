async function lib(paths){
  if(typeof paths==='string'){
    if(lib.cache[paths]===undefined){}
    const ret=Function(await((await(fetch(lib.dir+paths))).text()))()
    lib.cache=ret
    return ret
  }
  return Promise.all(paths.map(lib))
}
lib.dir='https://tankhellfire.glitch.me/lib/'
lib.cache={}
if(typeof window === "undefined"){module.exports = exports =lib}
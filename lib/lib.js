async function lib(paths){
  if(typeof paths==='string'){
    return paths
  }
  return Promise.all(paths.map(lib))
}
if(typeof window === "undefined"){module.exports = exports =lib}
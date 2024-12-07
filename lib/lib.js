( async(n, f) => {

  if (typeof window === "undefined") {
    let a= (await f((libNameLocations)=>{
      if (typeof libNameLocations === "string") {
        // return require(libNameLocations)
      } else {
        // return libNameLocations.map((path) => require(path))
      }
    }))
    module.exports = exports =a
  } else {
    this[n] = f((libNameLocations)=>{
      const loadScript = (path) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = path // Assume .js extension
          script.onload = () => resolve(window[path.split("/").pop()]);
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      if (typeof libNameLocations === "string") {
        loadScript(libNameLocations);
      } else {
        return Promise.all(libNameLocations.map(loadScript));
      }
    });
  }
}
)('lib', async(lib) => {
  console.log('loaded','lib')
  return lib
});
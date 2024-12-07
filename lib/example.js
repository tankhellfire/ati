((n, f) => {
  if (typeof window === "undefined") {
    module.exports = exports = f((libNameLocations)=>{
      if (typeof libNameLocations === "string") {
        return require(libNameLocations)
      } else {
        return libNameLocations.map((path) => require(path))
      }
    });
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
)('example', (lib) => {
  console.log('loaded example')
  let a=2
  function m(inp){
    return inp*2
  }


  return {a,m}
});

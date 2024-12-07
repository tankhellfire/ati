((n, f) => {
  if (typeof window === "undefined") {
    module.exports = exports = f();
  } else {
    this[n] = f();
  }
})("lib", () => {
  let self = (libNameLocations) => {
    if (typeof window === "undefined") {
      
      if (typeof libNameLocations === "string") {
        return require(libNameLocations)
      } else {
        return libNameLocations.map((path) => require(path))
      }
      
      
    } else {
      // Browser environment: Dynamically load scripts
      const loadScript = (path) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = `${path}.js`; // Assume .js extension
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
    }
  };
  return self;
});

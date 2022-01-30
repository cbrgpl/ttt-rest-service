module.exports = {
  getFunctionCaller: ( callback ) => () => callback(),
  getFunctionResult: ( callback ) => callback()
};

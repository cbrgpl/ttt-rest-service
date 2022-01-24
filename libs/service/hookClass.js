const { isFunction } = require( './../helper/isFunction' );
const defaultHook = ( val ) => val;

module.exports.HookClass = class {
  constructor( availableHooks ) {
    this.hooks = new Map();

    for( const hook in availableHooks ) {
      this.hooks.set( hook, defaultHook );
    }
  }

  validateHook( hookCallback ) {
    if( isFunction( hookCallback ) ) {
      return true;
    } else {
      throw TypeError( 'Hook callback must be an function' );
    }
  }

  setHook( hookName, hookCallback ) {
    this.validateHook( hookCallback );

    if( !this.hooks.has( hookName ) ) {
      throw Error( `Unknown hook name ${ hookName }` );
    }

    this.hooks.set( hookName, hookCallback );
  }

  callHook( hookName, args ) {
    const hook = this.hooks.get( hookName );

    return hook( args );
  }
};

const { isFunction } = require( '../helper/isFunction' );
const defaultHook = ( val ) => val;

module.exports.Hookable = class {
  static getConstructorMapableArray( listOfHooks ) {
    const mapableArray = [];

    for( const hook of listOfHooks ) {
      mapableArray.push( [ hook, defaultHook ] );
    }

    return mapableArray;
  }

  constructor( mapableArray ) {
    this.hooks = new Map( mapableArray );
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

  callHook( hookName, ...args ) {
    const hook = this.hooks.get( hookName );

    return hook( ...args );
  }
};

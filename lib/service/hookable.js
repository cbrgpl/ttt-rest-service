import { isFunction } from '../helper/isFunction.js';

export class Hookable {
  constructor( hookArray ) {
    this.hooks = new Map( hookArray );
  }

  callHook( name, ...args ) {
    const hook = this.hooks.get( name );

    return hook( ...args );
  }

  setHook( name, callback ) {
    this.validateHookCallback( callback );

    if( !this.hooks.has( name ) ) {
      throw Error( `Unknown hook name ${ name }` );
    }

    this.hooks.set( name, callback );
  }

  validateHookCallback( callback ) {
    if( isFunction( callback ) ) {
      return true;
    } else {
      throw TypeError( 'Hook callback must be a function' );
    }
  }
};

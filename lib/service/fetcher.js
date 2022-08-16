import { Hookable } from './hookable';
import { defaultHook } from '../helper/defaultHook';

const mapableHookList =  [
  [ 'beforeFetch', defaultHook ]
];

export class Fetcher extends Hookable {
  constructor( requestMap ) {
    super( mapableHookList );

    this.requestMap = requestMap;
    this.setHook( 'beforeFetch', () => false );
  }

  onBeforeFetch( callback ) {
    this.setHook( 'beforeFetch', callback );
  }

  request( { name, requestPayload = {}, id } ) {
    if( !this.requestMap.has( name ) ) {
      throw Error( `Request parameters for handler with name ${ name } are not exists` );
    }

    const requestParams = this.requestMap.get( name );
    const recievedRequestParams = requestParams.getRequestParams( requestPayload, id );

    const fetchCanceled = this.callHook( 'beforeFetch', recievedRequestParams );
    if( fetchCanceled ) {
      return;
    }

    return fetch( recievedRequestParams.url, recievedRequestParams.fetchParams );
  }
};

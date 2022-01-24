const { ApiModule } = require( './apiModule' );
const { HookClass } = require( './hookClass' );

const availableHooks = {
  beforeFetch: 'beforeFetch'
};

module.exports.Fetcher = class extends HookClass {
  constructor( apiModuleSchema = [] ) {
    super( availableHooks );

    this.apiModule = new ApiModule( apiModuleSchema );
    this.setHook( availableHooks.beforeFetch, () => false );
  }

  onBeforeFetch( callback ) {
    this.setHook( availableHooks.beforeFetch, callback );
  }

  request( { handlerName, data = {}, id } ) {
    const requestParams = this.apiModule.getRequestParams( handlerName, data, id );

    // allows cancel a fetch
    if( this.callHook( availableHooks.beforeFetch, requestParams ) ) {
      return;
    }

    return fetch( requestParams.url, requestParams.fetchParams );
  }
};

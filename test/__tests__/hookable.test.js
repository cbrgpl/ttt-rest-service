import { Hookable } from '../../lib/service/hookable.js';
import { getFunctionResult, getFunctionCaller } from '../__utils__';

const defaultHook = ( val ) => val;
const testMapableArray = [
  [ 'testHook1', defaultHook ],
  [ 'testHook2', defaultHook ],
];

function createTestHookable( testMapableArray ) {
  return new Hookable( testMapableArray );
}

test( 'Hookable - constructor()', () =>{
  expect( () => {
    createTestHookable( testMapableArray );
    return true;
  } ).toBeTruthy();
} );



test( 'Hookable - setHook( existingHook, validFunction )', () => {
  const testHook = () => null;

  expect( getFunctionResult( () => {
    const testHookable = createTestHookable( testMapableArray );

    testHookable.setHook( 'testHook1', testHook );
    return testHookable.hooks.get( 'testHook1' );
  } ) ).toBe( testHook );
} );


test( 'Hookable - setHook(notExistingHook, validFunction)', () => {
  expect( getFunctionCaller( () => {
    const testHookable = createTestHookable( testMapableArray );

    testHookable.setHook( 'testHook3', () => true );
  } ) ).toThrow( 'Unknown hook name testHook3' );
} );


test( 'Hookable - валидация коллбека для хука', () => {
  expect( () => {
    const testHookable = createTestHookable( testMapableArray );
    const exampleFunction = () => true;
    return testHookable.validateHook( exampleFunction );
  } ).toBeTruthy();
} );

test( 'Hookable - вадация коллбека не являющегося функцией для хука ', () => {
  expect( getFunctionCaller( () => {
    const testHookable = createTestHookable( testMapableArray );
    const exampleNotFunction = true;

    testHookable.validateHookCallback( exampleNotFunction );
  } ) ).toThrow( 'Hook callback must be a function' );
} );

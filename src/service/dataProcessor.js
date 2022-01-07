const CONST = require('./../helpers/consts.js')
const isObject = require('./../helpers/isObject.js')

const PROCESS_VARIANTS = {
    SEND: 'SEND_TYPE',
    GET: 'GET_TYPE'
}

function getArgValidationObj (argName, value, callback) {
    return {
        value: value,
        validationCallback: callback,
        validateCallbackValues: value,
        error: `${argName} is not valid with value ${value}`
    }
}

function generateValidationObj(args) {
    const argsValidationObj = {}

    for(const argName in args) {
        switch(argName) {
            case 'dataType':
                argsValidationObj.dataType = getArgValidationObj('dataType', {value: args.dataType, enumObj: CONST.RESPONSE_TYPE}, enumIncludesValue)
                continue

            case 'variant':
                argsValidationObj.variant = getArgValidationObj('variant', { value: args.variant, enumObj: PROCESS_VARIANTS }, enumIncludesValue)
                continue

            case 'callback':
                argsValidationObj.callback = getArgValidationObj('callback', { callback: args.callback }, validateCallback)
                continue

            default:
                continue
        }
    }

    return argsValidationObj
}

const validateArg = (args, conditionCallback, error) => {
    if(!conditionCallback(args)) {
        console.warn(error);
        return false
    }

    return true
}

const validateCallback = ({callback}) => typeof callback === 'function'
const enumIncludesValue = ({enumObj, value}) => Object.keys(enumObj).some(( enumKey ) => enumObj[enumKey] === value)

function validateArgs(argsObject) {
    let argsValid = {}

    for(const argKey in argsObject) {
        argsValid[argKey] = true
        const argParams = argsObject[argKey]

        if(!validateArg(argParams.validateCallbackValues, argParams.validationCallback, argParams.error)) {
            argsValid[argKey] = false
        }

    }

    return Object.keys(argsValid).every( (argKey) => argsValid[argKey] )
}

module.exports = class DataProcessor {
    constructor() {
        this._processorFunctions = {}

        for(const  typeKey in CONST.RESPONSE_TYPE) {
            const dataType = CONST.RESPONSE_TYPE[typeKey]
            this._processorFunctions[dataType] = {}

            for(const variantKey in PROCESS_VARIANTS) {
                const variant = PROCESS_VARIANTS[variantKey]
                this._processorFunctions[dataType][variant] = []
            }
        }
    }

    static PROCESS_VARIANTS = PROCESS_VARIANTS

    setProcessor({ dataType = CONST.RESPONSE_TYPE.JSON, variant, callback }) {
        const validateObject = generateValidationObj({ dataType, variant, callback })
        const argsValidation = validateArgs( validateObject )

        if( argsValidation) {
            this._processorFunctions[dataType][variant].push(callback)
        }

    }

    processData( {data, dataType = CONST.RESPONSE_TYPE.JSON, variant} ) {
        const validateObject = generateValidationObj({ dataType, variant })
        const argsValidation = validateArgs( validateObject )

        if( !argsValidation) {
            return
        }

        if(!data) {
            console.warn('"data" value is not valid')
            console.warn(data)
            return
        }

        let buffer = data

        for(const processor of this._processorFunctions[dataType][PROCESS_VARIANTS.SEND]) {
            buffer = processor(buffer)
            buffer = isObject(buffer) ? buffer : data // if function does not return object
        }

        return buffer
    }
}

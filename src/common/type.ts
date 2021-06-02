import { TYPE } from './enum';

const _toString = Object.prototype.toString;

export const isPureObject = (val: unknown) => _toString.call(val) === TYPE.PureObject;
export const isBoolean = (val: unknown) => _toString.call(val) === TYPE.Boolean;
export const isFunction = (val: unknown) => _toString.call(val) === TYPE.Function;
export const isArray = (val: unknown) => _toString.call(val) === TYPE.Array;

export const isNumber = (val: unknown) => _toString.call(val) === TYPE.Number;
export const isValidNumber = (val: unknown) => isNumber(val) && !Number.isNaN(val as number);
export const isMinus = (val: unknown) => isValidNumber(val) && (val as number) < 0;
export const isZero = (val: unknown) => isValidNumber(val) && (val as number) === 0;
export const isPositive = (val: unknown) => isValidNumber(val) && (val as number) > 0;

export const isTrue = (bool: unknown) => bool === true;
export const isFalse = (bool: unknown) => bool === false;

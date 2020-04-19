import "reflect-metadata";
import { AliasInjection } from './container';
import { CLASS_INJECTS, IS_INJECTABLE, CONTAINER_KEYS } from './constants';

export function injectable(constructorFunction: Function) {  
  Reflect.defineMetadata(IS_INJECTABLE, true, constructorFunction);
  Reflect.defineMetadata(CONTAINER_KEYS, [], constructorFunction);

  if (!Reflect.getOwnMetadata(CLASS_INJECTS, constructorFunction)) {
    Reflect.defineMetadata(CLASS_INJECTS, [], constructorFunction);
  }
}

export function dep(alias?: string) {
  return function(
    target: Function,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    if (propertyKey) {
      throw new Error('Should be used only in constructor args');
    }

    const aliasInjection = { name: alias, alias: true } as AliasInjection;
    const inject = alias ? aliasInjection : Reflect.getMetadata('design:paramtypes', target)[parameterIndex];

    if (!Object.is(aliasInjection, inject) && inject && Reflect.has(inject, 'isExtensible')) {
      throw new Error(`You can't inject interfaces without an ALIAS`);
    }

    let injects = Reflect.getOwnMetadata(CLASS_INJECTS, target) || [];

    injects[parameterIndex] = inject;

    Reflect.defineMetadata(CLASS_INJECTS, injects, target);
  }
}
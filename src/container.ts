import { CLASS_INJECTS, IS_INJECTABLE, CONTAINER_KEYS } from './constants';

export interface Injectable {
  injectable: boolean;
  containerKeys: string[];
  injects: Array<Injection | AliasInjection>;
}

export interface Injection extends Function {
  name: string;
}

export interface AliasInjection extends Injection {
  alias: boolean;
}

export class Container {
  private injectables: Array<Injection | AliasInjection> = [];
  private instances: { [name: string]: Object } = {};
  private aliases: { [name: string]: Array<Injection | AliasInjection> } = {};

  private containerKey: string;

  constructor() {
    this.containerKey = `${Math.random()}`;
  }

  use(className: Injection, alias?: string) {
    if (!Reflect.getOwnMetadata(IS_INJECTABLE, className)) {
      throw new Error(`Class ${className.name} is not injectable`);
    }

    const classContainerKeys = Reflect.getOwnMetadata(CONTAINER_KEYS, className);

    if (classContainerKeys.find((k: string) => k === this.containerKey)) {
      throw new Error(`Class ${className.name} was already attributed to this container`);
    }

    if (alias === className.name) {
      throw new Error(`Class name must be different from ALIAS`);
    }

    classContainerKeys.push(this.containerKey);

    Reflect.defineMetadata(CONTAINER_KEYS, classContainerKeys, className);

    if (alias) {
      this.aliases[alias] = this.aliases[alias] ?  
        [...this.aliases[alias], className] : [className];
    }

    this.injectables = [...this.injectables, className];
  }

  get<T>(name: Function | string): T {
    let classRef: Injection = null;
    const isAlias: boolean = typeof(name) === 'string';

    if (name instanceof Function) {
      const classContainerKeys = Reflect.getOwnMetadata(CONTAINER_KEYS, name);

      classRef = classContainerKeys?.find((c: string) => c === this.containerKey) && name;
    } else if (isAlias) {
      classRef = this.getInjectionFromAlias(name);
    }
    
    if (!classRef) {
      throw new Error(`[DEPENDENCY ERROR] CLASS OR ALIAS "${name}" was not registered in container`);
    }

    this.instantiate(classRef as (new (...args: any[]) => Injection), isAlias ? name as string : null);

    const subject = this.instances[classRef.name] as T;

    if (!subject) {
      console.warn(`Avoid circular dependencies: (${classRef.name})`);
    }

    return subject;
  }

  private instantiate(Instance: new (...args: any[]) => Injection, alias?: string) {
    if (this.getInstance(Instance.name)) {
      return;
    }

    const injects = Reflect.getMetadata(CLASS_INJECTS, Instance);

    const dependencies = injects
      .map((i: AliasInjection) => {
        if (!i) {
          throw new Error(`[DEPENDENCY FAILED] You should check for circular dependencies or non existing classes => ${Instance.name}`)
        }

        if (i.name === Instance.name || (i.alias && alias === i.name)) {
          return null;
        }

        return this.get<Object>(i.alias ? i.name : i);
      })
      .filter((d: any) => d);

    const instance = new Instance(...dependencies);

    this.addInstance(instance, Instance.name);
  }

  private addInstance(instance: Object, name: string) {
    this.instances[name] = instance;
  }

  private getInstance(name: string): Object {
    return this.instances[name];
  }

  private getInjectionFromAlias(alias: string): Injection {
    const aliasForClass = this.aliases[alias];

    if (!aliasForClass) {
      return null;
    }

    return aliasForClass[aliasForClass.length - 1];
  }
}
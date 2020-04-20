
import 'mocha';
import { expect } from 'chai';
import { Test, SomeOtherClass } from './mocks/mocks';
import { IS_INJECTABLE, CLASS_INJECTS, CONTAINER_KEYS } from '../src/constants';
import { dep, injectable } from '../src/dependency-decorator';

describe('Decorator tests', () => {
  it('should decorate class with injectable', () => {
    expect(Reflect.getOwnMetadata(IS_INJECTABLE, SomeOtherClass)).to.be.true;
  });

  it('should define class injects to empty', () => {
    expect(Reflect.getOwnMetadata(CLASS_INJECTS, SomeOtherClass)).to.be.empty;
  });

  it('should have empty container keys', () => {
    @injectable
    class NewClass {
      constructor() {
      }
    }
    expect(Reflect.getOwnMetadata(CONTAINER_KEYS, NewClass)).to.be.empty;
  });

  it('should have one injection as dependency', () => {
    expect(Reflect.getOwnMetadata(CLASS_INJECTS, Test)).to.be.lengthOf(1);
  });

  it('should throw error trying to inject in a function that is not a constructor', () => {
    try {
      class WrongInjectionClass {
        constructor() {
        }

        method(@dep() wrong: any) {}
      }
    } catch(e) {
      expect(e.message).to.contain('STRUCTURAL ERROR');
    }
  });

  it('should throw error trying to inject in a interface without an alias', () => {
    try {
      interface Generic {}

      class InterfaceWithoutAlias {
        constructor(@dep() a: Generic) {
        }
      }
    } catch(e) {
      expect(e.message).to.contain('INJECTION ERROR');
    }
  });
})
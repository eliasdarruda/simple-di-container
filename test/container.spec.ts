
import 'mocha';
import { expect } from 'chai';
import { Container } from '../src/container';
import { Test, SomeOtherClass, TestWithoutAlias, SomeOtherClassMock, RecursiveTwo, NotInjectable } from './mocks/mocks';
import { RecursiveOne } from './mocks/recursive';

describe('Container tests', () => {
  it('should inject dependencies without alias', () => {
    const container = new Container();
    container.use(TestWithoutAlias);
    container.use(SomeOtherClass);

    const expected = SomeOtherClass.instanceKey;

    const subject = container.get<TestWithoutAlias>(TestWithoutAlias);
    const result = subject.test();

    expect(result).to.equals(expected);
  });

  it('should inject dependencies with alias and overriding mock', () => {
    const container = new Container();
    container.use(Test);
    container.use(SomeOtherClass, 'UNIQUE_ALIAS');
    container.use(SomeOtherClassMock, 'UNIQUE_ALIAS');

    const expected = SomeOtherClassMock.instanceKey;

    const subject = container.get<Test>(Test);
    const result = subject.test();

    expect(result).to.equals(expected);
  });

  it('should get class two times returning same instance', () => {
    const container = new Container();
    container.use(Test);
    container.use(SomeOtherClassMock, 'UNIQUE_ALIAS');

    const expected = SomeOtherClassMock.instanceKey;

    container.get<Test>(Test);
    const subject = container.get<Test>(Test);
    const result = subject.test();

    expect(result).to.equals(expected);
  });

  it('should get class not instantiated in container', () => {
    const container = new Container();

    const expected = 'DEPENDENCY ERROR';

    try {
      container.get<Test>(Test);
    } catch (e) {
      expect(e.message).to.contain(expected);
    }
  });

  it('should get class dependency with wrong parameter', () => {
    const container = new Container();

    const expected = 'DEPENDENCY ERROR';

    try {
      container.get<any>(new Object() as Function);
    } catch (e) {
      expect(e.message).to.contain(expected);
    }
  });

  it('should throw not injected error', () => {
    const container = new Container();
    container.use(Test);

    const expected = 'DEPENDENCY ERROR';

    try {
      container.get<Test>(Test);
    } catch (e) {
      expect(e.message).to.contain(expected);
    }
  });

  it('should throw recursive dependency error', () => {
    const container = new Container();
    container.use(RecursiveTwo);
    container.use(RecursiveOne);

    const expected = 'DEPENDENCY FAILED';

    try {
      container.get<RecursiveTwo>(RecursiveTwo);
    } catch (e) {
      expect(e.message).to.contain(expected);
    }
  });

  it('should throw not injectable class error', () => {
    const container = new Container();

    const expected = 'not injectable';

    try {
      container.use(NotInjectable);
    } catch (e) {
      expect(e.message).to.contain(expected);
    }
  });

  it('should throw already injected class', () => {
    const container = new Container();

    const expected = 'already attributed';

    try {
      container.use(Test);
      container.use(Test);
    } catch (e) {
      expect(e.message).to.contain(expected);
    }
  });

  it('should throw same class as alias', () => {
    const container = new Container();

    const expected = 'different from ALIAS';

    try {
      container.use(Test, 'Test');
    } catch (e) {
      expect(e.message).to.contain(expected);
    }
  });
})
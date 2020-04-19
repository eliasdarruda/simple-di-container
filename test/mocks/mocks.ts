import { injectable, dep } from '../../src/dependency-decorator';
import { RecursiveOne } from './recursive';

@injectable
export abstract class GenericClass implements Generic {
  protected uniqueInstanceKey: string;

  constructor() {
    this.uniqueInstanceKey = 'GENERIC HERE ' + Math.random();
  }

  test() {
    return this.uniqueInstanceKey;
  }
}


@injectable
export class SomeOtherClass extends GenericClass {
  static instanceKey = 'SOMEOTHERCLASS';

  protected uniqueInstanceKey: string;

  constructor() {
    super();
    this.uniqueInstanceKey = SomeOtherClass.instanceKey;
  }
}

@injectable
export class SomeOtherClassMock extends GenericClass {
  static instanceKey = 'SOMEOTHERCLASS-MOCK';

  protected uniqueInstanceKey: string;

  constructor() {
    super();
    this.uniqueInstanceKey = SomeOtherClassMock.instanceKey;
  }
}

interface Generic {
  test(): any;
}

@injectable
export class Test {
  static testValue = 'testValue';

  constructor(@dep('UNIQUE_ALIAS') private agoraTem: Generic) {}

  getValue(): string {
    return Test.testValue;
  }

  test(): string {
    return this.agoraTem.test();
  }
}

@injectable
export class TestWithoutAlias {
  static testValue = 'testValue';

  constructor(@dep() private agoraTem: SomeOtherClass) {}

  getValue(): string {
    return Test.testValue;
  }

  test(): string {
    return this.agoraTem?.test();
  }
}

@injectable
export class RecursiveTwo {
  constructor(@dep() private depe: RecursiveOne) {}

  printf() {
    return 'two';
  }

  print() {
    return this.depe.printf();
  }
}

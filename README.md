# Super simple DI framework and IoC with containers

Soon on npm package

## Usage example

```TYPESCRIPT
    import { Container, injectable, dep } from 'simple-di-container';

    const container = new Container();
    container.use(TestClass);
    container.use(SomeOtherClass);

    const subject = container.get<TestClass>(TestClass);
    subject.some.printf(); // 'SOME OTHER CLASS INSTANCE'

    // Classes

    @injectable
    class SomeOtherClass {
      constructor() {}

      printf(): string {
        return 'SOME OTHER CLASS INSTANCE';
      }
    }

    @injectable
    class TestClass {
      constructor(@dep() public some: SomeOtherClass) {}
    }
```

## Usage example with an alias interface for dependency inversion.

```TYPESCRIPT
    import { Container, injectable, dep } from 'simple-di-container';

    const container = new Container();
    container.use(TestClass);
    container.use(Foo, 'FOO_BAR');
    container.use(Bar, 'FOO_BAR');

    // "FOO_BAR" is an alias for whatever injection you will use
    // Your dependencies will inherit last added "FOO_BAR" reference, in this case "Bar"

    const subject = container.get<TestClass>(TestClass);
    subject.some.printf(); // 'BAR CLASS INTERFACE'

    // Classes

    interface AliasInterface {
      printf(): string;
    }

    @injectable
    class Foo implements AliasInterface {
      constructor() {}

      printf(): string {
        return 'FOO CLASS INSTANCE';
      }
    }

    @injectable
    class Bar implements AliasInterface {
      constructor() {}

      printf(): string {
        return 'BAR CLASS INSTANCE';
      }
    }

    @injectable
    class TestClass {
      constructor(@dep('FOO_BAR') public some: AliasInterface) {}
    }
```

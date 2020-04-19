import { RecursiveTwo } from './mocks';
import { injectable, dep } from '../../src/dependency-decorator';

@injectable
export class RecursiveOne {
  constructor(@dep() private depe: RecursiveTwo) {}

  printf() {
    return 'one';
  }

  print() {
    return this.depe.printf();
  }
}

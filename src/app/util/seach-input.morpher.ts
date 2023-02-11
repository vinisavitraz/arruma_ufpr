import { InvalidArgumentException } from "../exception/invalid-argument.exception";

export class SearchInputMorpher {

  public static morphString(argument: any): string | undefined {
    if (!argument) {
      return undefined;
    }

    if (typeof argument !== 'string') {
      return undefined;
    }

    if (argument === '') {
      return undefined;
    }

    if (argument === 'undefined') {
      return undefined;
    }

    return argument;
  }

  public static morphNumber(argument: any): number | undefined {
    if (!argument) {
      return undefined;
    }

    const number: number = Number(argument);

    if (isNaN(number)) {
      return undefined;
    }

    if (number <= 0) {
      return undefined;
    }

    return number;
  }

  public static morphID(argument: any): number | undefined {
    if (!argument) {
      return undefined;
    }

    const number: number = Number(argument);

    if (isNaN(number)) {
      return undefined;
    }

    if (number === 0) {
      return undefined;
    }

    return number;
  }

  public static morphDateString(argument: any): Date | undefined {
    if (!argument) {
      return undefined;
    }

    if (typeof argument !== 'string') {
      return undefined;
    }

    if (argument === '') {
      return undefined;
    }
    
    if (isNaN(Date.parse(argument)) == true) {
      return undefined;
    }

    return new Date(argument);
  }

  public static morphBoolean(argument: any): boolean {
    if (!argument) {
      return false;
    }

    if (typeof argument !== "boolean") {
      return false;
  }

    return argument;
  }

}
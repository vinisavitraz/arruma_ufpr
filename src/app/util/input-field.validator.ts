import { HttpStatus } from "@nestjs/common";
import { HttpOperationErrorCodes } from "../exception/http-operation-error-codes";
import { HttpOperationException } from "../exception/http-operation.exception";

export class InputFieldValidator {
  
  public static validateEmail(email: string): void {
    if (this.isEmpty(email)) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid email', 
        HttpOperationErrorCodes.INVALID_USER_EMAIL,
      );
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid email', 
        HttpOperationErrorCodes.INVALID_USER_EMAIL,
      );
    }
  }

  public static validateDocument(document: string): void {
    if (this.isEmpty(document)) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid document', 
        HttpOperationErrorCodes.INVALID_USER_DOCUMENT,
      );
    }

    document = document.replace(/[^\d]+/g, '');

    if (document.length !== 11 || !!document.match(/(\d)\1{10}/)) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid document', 
        HttpOperationErrorCodes.INVALID_USER_DOCUMENT,
      );
    } 
    
    const numbers: number[] = document.split('').map(el => +el);

    const rest = (count: number) => (numbers.slice(0, count-12)
        .reduce( (soma, el, index) => (soma + el * (count-index)), 0 )*10) % 11 % 10;
    
    if (!(rest(10) === numbers[9] && rest(11) === numbers[10])) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid document', 
        HttpOperationErrorCodes.INVALID_USER_DOCUMENT,
      );
    }
  }

  public static validatePhoneNumber(phone: string): void {
    if (this.isEmpty(phone)) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid phone', 
        HttpOperationErrorCodes.INVALID_USER_PHONE,
      );
    }
    
    phone = phone.replace(/\D/g, '');

    if (!(phone.length >= 10 && phone.length <= 11)) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid phone', 
        HttpOperationErrorCodes.INVALID_USER_PHONE,
      );
    }

    if (phone.length == 11 && parseInt(phone.substring(2, 3)) != 9) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid phone', 
        HttpOperationErrorCodes.INVALID_USER_PHONE,
      );
    } 

    var DDDs = [11, 12, 13, 14, 15, 16, 17, 18, 19,
        21, 22, 24, 27, 28, 31, 32, 33, 34,
        35, 37, 38, 41, 42, 43, 44, 45, 46,
        47, 48, 49, 51, 53, 54, 55, 61, 62,
        64, 63, 65, 66, 67, 68, 69, 71, 73,
        74, 75, 77, 79, 81, 82, 83, 84, 85,
        86, 87, 88, 89, 91, 92, 93, 94, 95,
        96, 97, 98, 99];

    if (DDDs.indexOf(parseInt(phone.substring(0, 2))) == -1) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid phone', 
        HttpOperationErrorCodes.INVALID_USER_PHONE,
      );
    }

    if (phone.length == 10 && [2, 3, 4, 5, 7].indexOf(parseInt(phone.substring(2, 3))) == -1) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid phone', 
        HttpOperationErrorCodes.INVALID_USER_PHONE,
      );
    }
  }

  public static validateName(name: string): void {
    if (this.isEmpty(name)) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid name', 
        HttpOperationErrorCodes.INVALID_USER_NAME,
      );
    }

    if (!(/[a-zA-Z\u00C0-\u00FF ]+/i.test(name))) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid name', 
        HttpOperationErrorCodes.INVALID_USER_NAME,
      );
    }
  }

  private static isEmpty(value: string): boolean {
    return value === '';
  }

}
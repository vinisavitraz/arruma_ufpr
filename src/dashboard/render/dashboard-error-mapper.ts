import { ValidationError } from "@nestjs/common";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";

export class DashboardErrorMapper {

  static readonly errorMap: Map<string, string> = new Map([
    ['LOC_002', 'Nome do local inválido'],
    ['LOC_003', 'Descrição do local inválida'],
    ['ITM_001', 'Nome do item inválido'],
    ['ITM_002', 'Descrição do item inválida'],
    ['ITM_003', 'Local inválido'],
    ['ITM_004', 'Local inválido'],
    ['USR_002', 'Nome do usuário inválido'],
    ['USR_003', 'Email do usuário inválido'],
    ['USR_004', 'Tipo do usuário inválido'],
    ['INC_001', 'Nome do tipo de incidente inválido'],
    ['INC_002', 'Descrição do tipo de incidente inválida'],
    ['INC_005', 'Título inválido'],
    ['INC_006', 'Descrição inválida'],
    ['USR_006', 'Senha inválida'],
    ['AUTH_006', 'Token não encontrado'],
  ]);

  public static mapValidationErrors(validationErrors: any[]): object {
    const errors: string[] = [];
    let errorCodes: string[] = [];

    for (let i = 0; i < validationErrors.length; i++) {
      const validationError: ValidationError = validationErrors[i];
      const errorCode: string[] = Object.keys(validationError.constraints).map(
        function(k){return validationError.constraints[k]}
      );

      if (errorCode.length === 0) {
        const keys = Object.keys(HttpOperationErrorCodes).filter((x) => HttpOperationErrorCodes[x] == errorCode);
        
        if (keys.length > 0) {
          errorCodes = errorCodes.concat(keys[0]);
        }
      }
      errorCodes = errorCodes.concat(errorCode);
    }
    
    for (let i = 0; i < errorCodes.length; i++) {
      const errorCode: string = errorCodes[i];
      const error: string | null = this.errorMap.get(errorCode);

      if (error && !errors.includes(error)) {
        errors.push(error);
      }
    }

    return {
      showError: errors.length > 0,
      errors: errors,
    };
  }

}
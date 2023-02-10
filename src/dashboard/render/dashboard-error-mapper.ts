import { ValidationError } from "@nestjs/common";

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
  ]);

  public static map(validationErrors: any[]): object {
    const errors: string[] = [];
    let errorCodes: string[] = [];

    for (let i = 0; i < validationErrors.length; i++) {
      const validationError: ValidationError = validationErrors[i];
      const errorCode: string[] = Object.keys(validationError.constraints).map(
        function(k){return validationError.constraints[k]}
      );
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
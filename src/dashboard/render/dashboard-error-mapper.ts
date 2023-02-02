import { ValidationError } from "@nestjs/common";

export class DashboardErrorMapper {

  static readonly errorMap: Map<string, string> = new Map([
    ['LOC_002', 'Nome inválido'],
    ['LOC_003', 'Descrição inválida'],
    ['ITM_001', 'Nome inválido'],
    ['ITM_002', 'Descrição inválida'],
    ['ITM_004', 'Local inválido'],
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
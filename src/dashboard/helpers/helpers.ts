import { RoleEnum } from "src/app/enum/role.enum";
import { IncidentStatusEnum } from "src/app/enum/status.enum";
import { DateFormatter } from "src/app/util/date.formatter";
import { IncidentInteractionEntity } from "src/incident/entity/incident-interaction.entity";

export function formatObjectDateTime(date: Date | undefined) { 
  if (!date) {
    return '';
  }
  
  return DateFormatter.formatDateToStringWithTime(date);
}

export function formatDate(date: string | null) { 
    if (!date) {
      return '';
    }
    
    return DateFormatter.formatStringDate(date);
}

export function formatDateTime(datetime: string | null) { 
    if (!datetime) {
      return '';
    }
    
    return DateFormatter.formatStringDateTime(datetime);
}

export function select(selected, options) { 
    return options.fn(this).replace(
      new RegExp(' value=\"' + selected + '\"'),
      '$& selected="selected"');
}

export function formatMilliseconds(milliseconds: number) { 
    const seconds: number = milliseconds / 1000;
    
    return seconds.toFixed(3);
}

export function labelStatusIncident(status: string) { 
  switch (status) {
    case IncidentStatusEnum.OPEN:
      return 'warning';
    case IncidentStatusEnum.PENDING:
      return 'success';
    case IncidentStatusEnum.CLOSED:
      return 'primary';
    default:
      return 'dark';
  }
}

export function textStatusIncident(status: string) { 
  switch (status) {
    case IncidentStatusEnum.OPEN:
      return 'Aberto';
    case IncidentStatusEnum.PENDING:
      return 'Em atendimento';
    case IncidentStatusEnum.CLOSED:
      return 'Finalizado';
    default:
      return 'Desconhecido';
  }
}

export function setInteractionSide(interaction: IncidentInteractionEntity, role: string) {
  const admin: boolean = role === 'admin';

  if (admin && interaction.origin === RoleEnum.ADMIN) {
    return 'left';
  }

  if (admin && interaction.origin === RoleEnum.USER) {
    return 'right';
  }

  if (!admin && interaction.origin !== RoleEnum.ADMIN) {
    return 'left';
  }

  if (!admin && interaction.origin === RoleEnum.ADMIN) {
    return 'right';
  }
  
  return 'left';
}

export function isAdmin(role: number) { 
  return role === RoleEnum.ADMIN;
}

export function formatInteractionDate(interactionDate: Date) { 
  return DateFormatter.formatIncidentDateToString(interactionDate);
}

export function formatIncidentDate(incidentDate: Date) { 
  return DateFormatter.formatIncidentDateToString(incidentDate);
}

export function setActiveTab(tabName: string, status: string) { 
  if (status && tabName === status) {
    return 'active';
  }

  if (!status && tabName === '') {
    return 'active';
  }

  return '';
}
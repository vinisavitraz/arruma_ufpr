import { RoleEnum } from "src/app/enum/role.enum";
import { IncidentStatusEnum } from "src/app/enum/status.enum";
import { DateFormatter } from "src/app/util/date.formatter";
import { QueryStringBuilder } from "src/app/util/query-string.builder";
import { IncidentInteractionEntity } from "src/incident/entity/incident-interaction.entity";
import { IncidentsPageContent } from "../content/incidents-page.content";

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

export function formatInteraction(interaction: IncidentInteractionEntity) {
  const color: string = interaction.origin === RoleEnum.ADMIN ? '323232' : '4c90f7';
  const user: string = interaction.origin === RoleEnum.ADMIN ? 'Admin: ' + interaction.userName : 'Usuário: ' + interaction.userName;
  const date: string = DateFormatter.formatIncidentDateToString(interaction.sentDate);
  const content: string = interaction.description;

  return '<div class="d-flex text-muted pt-3"> <i class="bx bxs-user nav_icon" style="color:#' + color + 
    '"></i> <p class="pb-3 mb-0 small lh-sm border-bottom mx-2"> <strong class="d-block text-gray-dark mx-2">' + user +
    ' - ' + date + '</strong>' + content + '</p> </div>';
}

export function isAdmin(role: number) { 
  return role === RoleEnum.ADMIN;
}

export function formatRole(role: number) { 
  return role === RoleEnum.ADMIN ? 'Administrador' : 'Usuário';
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

export function buildIncidentsRegistersPerPageUrl(
  maxPerPage: string, 
  uri: string, 
  content: IncidentsPageContent,
) { 
  return QueryStringBuilder.build(content, Number(maxPerPage), uri, 0);
}


export function formatInteractionColor(origin: number) {
  return origin === 0 ? 'text-secondary' : 'text-primary';
}
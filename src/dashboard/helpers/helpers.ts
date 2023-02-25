import { RoleEnum } from "src/app/enum/role.enum";
import { IncidentPriorityLevelEnum, IncidentStatusEnum } from "src/app/enum/status.enum";
import { DateFormatter } from "src/app/util/date.formatter";
import { QueryStringBuilder } from "src/app/util/query-string.builder";
import { IncidentsPageContent } from "../content/incidents-page.content";
import { PageInfo } from "../pagination/page-info";

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

export function labelStatusPriority(priority: number) { 
  switch (priority) {
    case IncidentPriorityLevelEnum.LOW:
      return 'success';
    case IncidentPriorityLevelEnum.MEDIUM:
      return 'warning';
    case IncidentPriorityLevelEnum.HIGH:
      return 'red';
    default:
      return 'dark';
  }
}

export function textStatusPriority(priority: number) { 
  switch (priority) {
    case IncidentPriorityLevelEnum.LOW:
      return 'Prioridade baixa';
    case IncidentPriorityLevelEnum.MEDIUM:
      return 'Prioridade média';
    case IncidentPriorityLevelEnum.HIGH:
      return 'Prioridade alta';
    default:
      return 'Desconhecido';
  }
}

export function isAdmin(role: number) { 
  return role === RoleEnum.ADMIN;
}

export function formatRole(role: number) { 
  if (role === RoleEnum.SYSTEM) {
    return 'Sistema';
  }
  if (role === RoleEnum.ADMIN) {
    return 'Administrador';
  }
  
  return 'Usuário';
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
  if (origin === RoleEnum.SYSTEM) {
    return 'text-success';
  }
  if (origin === RoleEnum.ADMIN) {
    return 'text-secondary';
  }
  
  return 'text-primary';
}

export function isPaginationButtonEnabled(page: PageInfo | null) {
  return page !== null ? '' : 'disabled';
}

export function showPendingUserReview(userId: number, userIncidentId: number, endDate: Date | null, rating: number) {
  if (rating > 0) {
    return false;
  }

  if (userId !== userIncidentId) {
    return false;
  }

  if (endDate === null) {
    return false;
  }
  
  const today: Date = new Date();
  const timeDifference: number = Math.abs(endDate.getTime() - today.getTime());
  const daysDifference: number = timeDifference / (1000 * 60 * 60 * 24);

  if (daysDifference > 3) {
    return false;
  }
  
  return true;
}

export function setRatingClass(rating: number, star: string) {
  const starNumber: number = Number(star);

  if (starNumber <= rating) {
    return 'bx bxs-star';
  }

  return 'bx bx-star';
}

export function alignInteraction(userId: number, userRole: number, interactionUserId: number | null, interactionOrigin: number) {
  if (interactionOrigin === RoleEnum.SYSTEM) {
    return 'justify-content-center';
  }

  if (userId === interactionUserId) {
    return 'justify-content-end';  
  }

  if (userRole === RoleEnum.ADMIN && interactionOrigin === RoleEnum.ADMIN) {
    return 'justify-content-end';  
  }
  
  return 'justify-content-start';
}

export function setInteractionColor(userId: number, userRole: number, interactionUserId: number, interactionOrigin: number) {
  if (interactionOrigin === RoleEnum.SYSTEM) {
    return ' bg-primary-light-color';
  }

  if (userId === interactionUserId) {
    return 'bg-secondary-light-color';  
  }

  if (userRole === RoleEnum.ADMIN && interactionOrigin === RoleEnum.ADMIN) {
    return 'bg-secondary-light-color';  
  }
  
  return 'bg-secondary-color';
}

export function showIncidentImage(fileMetadataId: number | null) {
  return fileMetadataId !== null;
}
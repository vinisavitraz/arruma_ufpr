import { IncidentStatusEnum } from "src/app/enum/status.enum";
import { DateFormatter } from "src/app/util/date.formatter";

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
      return 'success';
    default:
      return 'dark';
  }
}

export function textStatusIncident(status: string) { 
  switch (status) {
    case IncidentStatusEnum.OPEN:
      return 'Aberto';
    default:
      return 'Desconhecido';
  }
}
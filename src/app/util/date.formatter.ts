export class DateFormatter {
    
  public static formatDateToStringWithTime(dateInput: Date): string {
    const dateInputDay = dateInput.getDate();
    const dateInputMonth = dateInput.getMonth() + 1;
    const dateInputYear = dateInput.getFullYear();
    const dateInputHours = dateInput.getHours();
    const dateInputMinutes = dateInput.getMinutes();
    const dateInputSeconds = dateInput.getSeconds();
    
    const year = dateInputYear;
    const month = dateInputMonth <= 9 ? '0' + dateInputMonth : dateInputMonth;
    const day = dateInputDay <= 9 ? '0' + dateInputDay : dateInputDay;
    const hours = dateInputHours <= 9 ? '0' + dateInputHours : dateInputHours;
    const minutes = dateInputMinutes <= 9 ? '0' + dateInputMinutes : dateInputMinutes;
    const seconds = dateInputSeconds <= 9 ? '0' + dateInputSeconds : dateInputSeconds;

    const date = year + '-' + month + '-' + day;
    const time = hours + ':' + minutes + ':' + seconds;

    return date + ' ' + time;
  }
  
}
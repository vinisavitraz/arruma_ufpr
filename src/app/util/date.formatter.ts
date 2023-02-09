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

  public static formatStringDate(stringDate: string): string {
    const dateInput = new Date(stringDate);
    const dateInputDay = dateInput.getDate();
    const dateInputMonth = dateInput.getMonth() + 1;
    const dateInputYear = dateInput.getFullYear();
    
    const year = dateInputYear;
    const month = dateInputMonth <= 9 ? '0' + dateInputMonth : dateInputMonth;
    const day = dateInputDay <= 9 ? '0' + dateInputDay : dateInputDay;
    
    return day + '/' + month + '/' + year;
  }

  public static formatStringDateTime(stringDate: string): string {
      const dateInput = new Date(stringDate);
      const dateInputDay = dateInput.getDate();
      const dateInputMonth = dateInput.getMonth() + 1;
      const dateInputHours = dateInput.getHours();
      const dateInputMinutes = dateInput.getMinutes();
      const dateInputSeconds = dateInput.getSeconds();

      const month = dateInputMonth <= 9 ? '0' + dateInputMonth : dateInputMonth;
      const day = dateInputDay <= 9 ? '0' + dateInputDay : dateInputDay;
      const hours = dateInputHours <= 9 ? '0' + dateInputHours : dateInputHours;
      const minutes = dateInputMinutes <= 9 ? '0' + dateInputMinutes : dateInputMinutes;
      const seconds = dateInputSeconds <= 9 ? '0' + dateInputSeconds : dateInputSeconds;
      
      const date = day + '/' + month;
      const time = hours + ':' + minutes + ':' + seconds;

      return date + ' ' + time;
  }

  public static formatDateToStringDashboardWithTime(dateInput: Date): string {
    const dateInputDay = dateInput.getDate();
    const dateInputMonth = dateInput.getMonth() + 1;
    const dateInputYear = dateInput.getFullYear();
    const dateInputHours = dateInput.getHours();
    const dateInputMinutes = dateInput.getMinutes();
    
    const year = dateInputYear;
    const month = dateInputMonth <= 9 ? '0' + dateInputMonth : dateInputMonth;
    const day = dateInputDay <= 9 ? '0' + dateInputDay : dateInputDay;
    const hours = dateInputHours <= 9 ? '0' + dateInputHours : dateInputHours;
    const minutes = dateInputMinutes <= 9 ? '0' + dateInputMinutes : dateInputMinutes;

    const date = day + '/' + month + '/' + year;
    const time = hours + ':' + minutes;

    return time + ' ' + date;
  }

  public static formatIncidentDateToString(dateInput: Date): string {
    const today: Date = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear();
    const dateInputDay = dateInput.getDate();
    const dateInputMonth = dateInput.getMonth() + 1;
    const dateInputYear = dateInput.getFullYear();

    if (todayDay === dateInputDay && todayMonth === dateInputMonth && todayYear === dateInputYear) {
      const hoursAgo: number = this.calculateDifferenceInHours(today, dateInput);

      if (hoursAgo < 1) {
        const minutesAgo: number = this.calculateDifferenceInMinutes(today, dateInput);

        return minutesAgo + 'm atrás';
      }
      
      return hoursAgo + 'h atrás';
    }
    
    const day = dateInputDay <= 9 ? '0' + dateInputDay : dateInputDay;
    return this.getMonthAbbreviation(dateInputMonth.toString()) + ' ' + day;
  }

  private static calculateDifferenceInHours(dateA: Date, dateB: Date): number {
    let difference = (dateA.getTime() - dateB.getTime()) / 1000;
    difference /= (60 * 60);

    return Math.abs(Math.round(difference));
  }

  private static calculateDifferenceInMinutes(dateA: Date, dateB: Date): number {
    let difference = dateA.getTime() - dateB.getTime();
    difference /= 60000;

    return Math.abs(Math.round(difference));
  }

  private static getMonthAbbreviation(monthNumber: string): string {
    switch(monthNumber) {
      case '1':
        return 'Jan';
      case '2':
        return 'Fev';
      case '3':
        return 'Mar';
      case '4':
        return 'Abr';
      case '5':
        return 'Mai';
      case '6':
        return 'Jun';
      case '7':
        return 'Jul';
      case '8':
        return 'Ago';
      case '9':
        return 'Set';
      case '10':
        return 'Out';
      case '11':
        return 'Nov';
      case '12':
        return 'Dez';
      default:
        return '';
    }
  }
  
}
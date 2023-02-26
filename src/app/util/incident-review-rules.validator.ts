export class IncidentReviewRulesValidator {

  public static validate(userId: number, userIncidentId: number, endDate: Date | null, rating: number): boolean {
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

}
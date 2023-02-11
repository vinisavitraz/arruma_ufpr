export class QueryStringBuilder {
    
  public static buildForIncidents(content: any, maxPerPage: number, uri: string, skip: number | null = null): string {
    const queryStringObject: string[] = [];

    for (let property in content) {
      if (content.hasOwnProperty(property)) {
        if (property === 'maxPerPage') {
          content[property] = maxPerPage;
        }
        if (property === 'skip' && skip !== null) {
          content[property] = skip;
        }

        const queryItem: string = encodeURIComponent(property) + '=' + encodeURIComponent(content[property]);
        if (!queryStringObject.includes(queryItem)) {
          queryStringObject.push(queryItem);
        }
        
      }
    }
    const queryString: string = queryStringObject.join('&');
    const url: string = uri + '?' + queryString;

    return url;
  }
  
}
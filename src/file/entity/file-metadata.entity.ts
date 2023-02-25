export class FileMetadataEntity {

    id: number;   
    filename: string;
    path: string;
    mimetype: string;

    constructor(id: number, filename: string, path: string, mimetype: string) {
        this.id = id;
        this.filename = filename;
        this.path = path;
        this.mimetype = mimetype;
    }

}
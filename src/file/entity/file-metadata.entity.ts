import { file_metadata } from "@prisma/client";

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

  public static fromRepository(fileMetadata: file_metadata): FileMetadataEntity {
    return new FileMetadataEntity(
      fileMetadata.id,
      fileMetadata.filename,
      fileMetadata.path,
      fileMetadata.mimetype,
    );
  }

}
import { StreamableFile } from "@nestjs/common";
import { FileMetadataEntity } from "./file-metadata.entity";

export class FileStreamEntity {

  stream: StreamableFile;
  fileMetadata: FileMetadataEntity;
  

  constructor(stream: StreamableFile, fileMetadata: FileMetadataEntity) {
    this.stream = stream;
    this.fileMetadata = fileMetadata;
  }

  public static fromRepository(stream: StreamableFile, fileMetadata: FileMetadataEntity): FileStreamEntity {
    return new FileStreamEntity(
      stream,
      fileMetadata,
    );
  }

}
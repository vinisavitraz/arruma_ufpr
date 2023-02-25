import { file_metadata } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { FileMetadataEntity } from "./entity/file-metadata.entity";

export class FileRepository {

    private connection: DatabaseService;
  
    constructor(databaseService: DatabaseService) {
        this.connection = databaseService;
    }

    public async saveFileMetadata(fileMetadata: FileMetadataEntity): Promise<FileMetadataEntity> {
      const fileMetadataDb: file_metadata = await this.connection.file_metadata.create({
        data: {
          filename: fileMetadata.filename,
          path: fileMetadata.path,
          mimetype: fileMetadata.mimetype,
        },
      });
      
      fileMetadata.id = fileMetadataDb.id;

      return fileMetadata;
    }

    public async updateFileMetadata(fileMetadata: FileMetadataEntity): Promise<FileMetadataEntity> {
      await this.connection.file_metadata.update({
        where: {
          id: fileMetadata.id,
        },
        data: {
          filename: fileMetadata.filename || undefined,
          path: fileMetadata.path || undefined,
          mimetype: fileMetadata.mimetype || undefined,
        },
      });

      return fileMetadata;
    }

    public async deleteFileMetadata(fileMetadataId: number): Promise<void> {
      await this.connection.file_metadata.delete({ where: {id: fileMetadataId}});
    }

    public async getFileByID(fileMetadataId: number): Promise<file_metadata | null> {
      return await this.connection.file_metadata.findUnique({where: {id: fileMetadataId}});
    }

}
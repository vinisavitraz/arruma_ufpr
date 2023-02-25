import { HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
import { file_metadata } from '@prisma/client';
import { unlink } from 'node:fs/promises';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { DatabaseService } from 'src/database/database.service';
import { FileMetadataEntity } from './entity/file-metadata.entity';
import { FileRepository } from './file.repository';
import * as fs from 'fs';
import { FileStreamEntity } from './entity/file-stream.entity';
import { join } from 'node:path';
import { createReadStream, ReadStream } from 'node:fs';

@Injectable()
export class FileService {

  private repository: FileRepository;

  constructor(databaseService: DatabaseService) {
    this.repository = new FileRepository(databaseService);
  }

  public validateImageType(fileExtension: string): boolean {
    return fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'jpg'; 
  }

  public async getFileReadStreamOrCry(fileMetadataId: number): Promise<FileStreamEntity> {
    const fileMetadata: FileMetadataEntity = await this.findFileMetadataByIDOrCry(fileMetadataId);
    
    if (!this.fileExists(fileMetadata.path)) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'File not found on path: ' + fileMetadata.path,
        HttpOperationErrorCodes.FILE_NOT_FOUND_ON_PATH
      );
    }

    const readStream: ReadStream = createReadStream(join(process.cwd(), fileMetadata.path));
    const fileStream: StreamableFile = new StreamableFile(readStream);

    return FileStreamEntity.fromRepository(fileStream, fileMetadata);
  }

  public async getFileMetadataByID(fileMetadataId: number): Promise<FileMetadataEntity | null> {
    const fileMetadata: file_metadata | null = await this.repository.getFileByID(fileMetadataId);
    
    if (!fileMetadata) {
      return null;
    }

    return FileMetadataEntity.fromRepository(fileMetadata);
  }

  public async findFileMetadataByIDOrCry(fileMetadataId: number): Promise<FileMetadataEntity> {
    const fileMetadata: file_metadata | null = await this.repository.getFileByID(fileMetadataId);
    
    if (!fileMetadata) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'File metadata with ID' + fileMetadataId + ' not found on database.', 
        HttpOperationErrorCodes.FILE_METADATA_NOT_FOUND,
      );
    }

    return FileMetadataEntity.fromRepository(fileMetadata);
  }

  public async saveNewFileMetadataFromDashboard(image: Express.Multer.File): Promise<FileMetadataEntity> {
    const fileMetadata: FileMetadataEntity = new FileMetadataEntity(0, image.filename, image.path, image.mimetype);

    return await this.repository.saveFileMetadata(fileMetadata);
  }

  public async saveNewFileMetadata(fileName: string, filePath: string, fileType: string): Promise<FileMetadataEntity> {
    const fileMetadata: FileMetadataEntity = new FileMetadataEntity(0, fileName, filePath, 'image/' + fileType);

    return await this.repository.saveFileMetadata(fileMetadata);
  }

  public async updateFileMetadataImage(fileMetadataId: number, image: Express.Multer.File): Promise<FileMetadataEntity> {
    const fileMetadataDb: FileMetadataEntity = await this.findFileMetadataByIDOrCry(fileMetadataId);

    await this.deleteFile(fileMetadataDb);

    const newFileMetadata = new FileMetadataEntity(
      fileMetadataId, 
      image.filename, 
      image.path, 
      image.mimetype
    );

    return await this.repository.updateFileMetadata(newFileMetadata);
  }

  public async deleteFileMetadataByID(fileMetadataId: number): Promise<void> {
    const fileMetadataDb: file_metadata = await this.findFileMetadataByIDOrCry(fileMetadataId);

    await this.deleteFile(fileMetadataDb);
    await this.repository.deleteFileMetadata(fileMetadataDb.id);
  }

  private async deleteFile(fileMetadata: FileMetadataEntity): Promise<void> {
      
    try {
      if (fs.existsSync(fileMetadata.path)) {
        await unlink(fileMetadata.path);
        console.log('successfully deleted file: ' + fileMetadata.path);    
      }
    } catch (error) {
      console.error('there was an error deleting file: ' + fileMetadata.path, error.message);
    }
  }

  public async fileMetadataExists(fileMetadataId: number): Promise<boolean> {
    const fileMetadata: file_metadata = await this.findFileMetadataByIDOrCry(fileMetadataId);
    
    return this.fileExists(fileMetadata.path);
  }

  public fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

}

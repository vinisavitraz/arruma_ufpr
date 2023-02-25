import { Controller, Get, Param, ParseIntPipe, StreamableFile, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileStreamEntity } from './entity/file-stream.entity';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':id')
  public async getFileByMetadataId(@Param('id', ParseIntPipe) id: number, @Res({ passthrough: true }) response: Response): Promise<StreamableFile> {
    const file: FileStreamEntity = await this.fileService.getFileReadStreamOrCry(id);

    response.set({
      'Content-Disposition': `inline; filename="${file.fileMetadata.filename}"`,
      'Content-Type': file.fileMetadata.mimetype
    });

    return file.stream;
  }
}

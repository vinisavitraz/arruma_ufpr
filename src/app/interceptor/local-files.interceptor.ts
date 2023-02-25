import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
 
interface LocalFilesInterceptorOptions {
  fieldName: string;
  path?: string;
}
 
function LocalFilesInterceptor (options: LocalFilesInterceptorOptions): Type<NestInterceptor> {
  
  const IMAGES_BASE_FOLDER = './files/images/';

  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    
    constructor() {
      const destination = `${IMAGES_BASE_FOLDER}${options.path}`;
        
      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination
        })
      };
 
      this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions));
    }
 
    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}
 
export default LocalFilesInterceptor;
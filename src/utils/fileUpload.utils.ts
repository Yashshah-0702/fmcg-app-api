import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { failure } from './response.utils';
import { httpStatusCodes } from '@/constants/httpStatusCodes.constants';
import { MAIN_UPLOAD_DIR, IMAGE_PATH } from '@/config';
import { globalConstants } from '@/constants/globalConstants.constants';

const uploadImg = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsPath = path.join(MAIN_UPLOAD_DIR, IMAGE_PATH);
    if (!fs.existsSync(path.join(__dirname, `/../..${uploadsPath}`))) {
      fs.mkdirSync(path.join(__dirname, `/../..${uploadsPath}`), { recursive: true });
    }

    cb(null, path.join(__dirname, `/../..${uploadsPath}`));
  },
  filename: (req, file, cb) => {
    const uploadsPath = path.join(MAIN_UPLOAD_DIR, IMAGE_PATH);
    const fileLocation = path.join(__dirname, `/../..${uploadsPath}`);
    req.media_details = {
      name: `${Date.now()}_${file.originalname.replace(/ /g, '_')}`,
      mime_type: file.mimetype,
      extensions: file.mimetype.split('/')[1],
      original_name: file.originalname,
      file_location: fileLocation,
      file_path: uploadsPath.replace('/public', ''),
    };
    cb(null, `${Date.now()}_${file.originalname.replace(/ /g, '_')}`);
  },
});

// const fileFilter: multer.Options['fileFilter'] = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//   if (globalConstants.allowedMultipleFiles.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file format, allowed formats are jpg, png, jpeg.'), false);
//   }
// };

const uploadImgStorage = multer({ storage: uploadImg }).single('upload_file');

export const uploadImgMiddleware = (req: Request, res: Response, next: NextFunction) => {
  uploadImgStorage(req, res, (err: any) => {
    if (err instanceof Error && err.message === 'Invalid file format, allowed formats are jpg, png, jpeg.') {
      return failure(res, httpStatusCodes.BAD_REQUEST, 'INVALID_FILE_FORMAT',{});
    } else if (err) {
      return failure(res, httpStatusCodes.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR',{});
    } else {
      return next();
    }
  });
};

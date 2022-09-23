import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');
@Injectable()
export class AppService {
  async upload(file, body) {
    const fileName = body.fileName;
    const fileSize = body.size;
    const fileSuffix = body.fileSuffix;
    const fileBuffer = file?.buffer;
    let fileUrl = '/files/';
    const imageFormats = ['jpg', 'png', 'gif', 'psd', 'tif', 'bmp'];
    const videoFormats = ['avi', 'wmv', 'mpeg', 'mp4', 'mov', 'flv'];
    console.log(__dirname, './public', `${fileName}`);
    if (imageFormats.includes(fileSuffix.toLocaleLowerCase())) {
      fileUrl = '/images/';
    }
    if (videoFormats.includes(fileSuffix.toLocaleLowerCase())) {
      fileUrl = '/videos/';
    }
    const writeImage = createWriteStream(
      path.join(
        __dirname,
        '../../public' + fileUrl,
        moment().format('YYYYMMDDhhmmss') + '.' + fileSuffix,
      ),
    );
    writeImage.write(fileBuffer);
    return {
      fileUrl:
        'http://localhost:9080/storage' +
        fileUrl +
        moment().format('YYYYMMDDhhmmss') +
        '.' +
        fileSuffix,
      fileName,
      fileSize: fileSize + 'M',
      fileType: fileSuffix,
    };
  }
}

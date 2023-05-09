// import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { async } from 'rxjs';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { DrawEntity } from './entities/draw.entity';

@Injectable()
export class DrawService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {} // private readonly drawRepository: Repository<DrawEntity>, // @InjectRepository(DrawEntity)
  async predictImage(prompt, image) {
    const params: any = {
      prompt: prompt,
      image: image,
      structure: 'scribble',
    };
    const res = await axios({
      method: 'post',
      url: 'https://scribblediffusion.com/api/predictions',
      data: params,
    });
    return res.data;
  }
  async getPictureById(id) {
    const res = await axios({
      method: 'get',
      url: 'https://scribblediffusion.com/api/predictions/' + id,
    });
    return res.data;
  }
}

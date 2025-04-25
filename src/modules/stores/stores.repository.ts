import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entities/Store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoresRepository {
  constructor(
    @InjectRepository(Store) private storesRepository: Repository<Store>,
  ) {}
}

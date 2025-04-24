import { Injectable } from '@nestjs/common';
import { AdminsRepository } from './admins.repository';

@Injectable()
export class AdminsService {
  constructor(private readonly adminsRepository: AdminsRepository) {}
}

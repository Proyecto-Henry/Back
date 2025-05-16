import { Injectable, OnModuleInit } from '@nestjs/common';
import { SuperAdminService } from 'src/modules/superAdmins/supers.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SuperAdminSeeder implements OnModuleInit {
  constructor(private readonly superAdminService: SuperAdminService) {}

  async onModuleInit() {
    try {
      const pathFile = path.join(
        __dirname,
        '../../..',
        'src',
        'seeds',
        'supers',
        'supers.json',
      );
      const data = fs.readFileSync(pathFile, 'utf8');
      const superAdmins = JSON.parse(data);

      for (const admin of superAdmins) {
        const exist = await this.superAdminService.findByEmail(admin.email);
        if (!exist) {
          await this.superAdminService.register(admin);
          console.log('✅ Super admin creado');
        } else {
          console.log('ℹ️ Super admin ya agregado');
        }
      }
      console.log('🦸‍♂️ Precarga de super admin finalizada');
    } catch (error) {
      console.log('❌ Ocurrio un problema con la precarga de super admin');
    }
  }
}

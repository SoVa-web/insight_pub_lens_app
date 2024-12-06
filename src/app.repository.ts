import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';

import { DatabaseService } from './database/database.service';

@Injectable()
export class AppRepository {
  protected logger = new Logger(AppRepository.name);
  constructor(readonly databaseService: DatabaseService) {}
}

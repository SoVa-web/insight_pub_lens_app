  import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
  import { DatabaseError, Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
  
  import { CONNECTION_POOL } from './database.module-definition';
  
  @Injectable()
  export class DatabaseService {
    private readonly logger = new Logger(DatabaseService.name);
    constructor(@Inject(CONNECTION_POOL) public readonly pool: Pool) {}

    async query<T extends QueryResultRow>(sql: string, args: unknown[], client?: PoolClient): Promise<QueryResult<T>> {
        try {
          this.logger.debug({ sql }, 'DB sql request');
    
          return await (client ?? this.pool).query<T>(sql, args);
        } catch (err: unknown) {
          this.logger.error({ err }, 'sql queryFromBuilder');
          throw err;
        }
      }
  
  }
  
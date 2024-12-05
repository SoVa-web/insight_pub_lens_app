import { Global, Module, Logger } from '@nestjs/common';
import { Pool, DatabaseError } from 'pg';
import {
  ConfigurableDatabaseModule,
  CONNECTION_POOL,
  DATABASE_OPTIONS,
  DatabaseOptions,
} from './database.module-definition';
import { DatabaseService } from './database.service';

const logger = new Logger(DatabaseService.name);
console.log({CONNECTION_POOL})
console.log({DATABASE_OPTIONS})

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: CONNECTION_POOL,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions) => {
        logger.log(`Initializing connection pool with options: ${JSON.stringify(databaseOptions)}`);
        const pool = new Pool(databaseOptions);

        pool.on('error', (err: Error) => {
          const dbError = err as DatabaseError;
          if (dbError.code === '57P01') {
            return;
          }
          logger.error(`Unexpected error on idle PG client: ${dbError.message}`, dbError.stack);
        });

        return pool;
      },
    },
  ],
  exports: [DatabaseService, CONNECTION_POOL],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
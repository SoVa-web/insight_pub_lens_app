/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
import { TABLE_PUBLICATIONS } from '../src/database/tables';
export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
        ALTER TABLE "${TABLE_PUBLICATIONS}" ADD CONSTRAINT unique_id UNIQUE (id);
        `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
}

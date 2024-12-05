/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';
import { TABLE_PUBLICATIONS } from '../src/database/tables';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createExtension('pg_trgm', { ifNotExists: true });
    pgm.createExtension('btree_gin', { ifNotExists: true });
    pgm.createExtension('cube', { ifNotExists: true });

    const columnDefinitions: ColumnDefinitions = {
        id: {
          type: PgType.BIGINT,
          primaryKey: true,
          sequenceGenerated: { precedence: 'ALWAYS' },
        },
        source: {type: PgType.TEXT, notNull: true},
        id_from_source: {type: PgType.TEXT},
        title: {type: PgType.TEXT},
        doi: {type: PgType.TEXT},
        abstract: {type: PgType.TEXT},
        keywords: { type: 'text[]', notNull: true},
        authors: { type: PgType.TEXT},
        journal_ref: {type: PgType.TEXT},
        year: {type: PgType.INTEGER},
        updatedAt: {
          type: PgType.TIMESTAMP_WITH_TIME_ZONE,
          default: pgm.func('current_timestamp'),
          notNull: true,
        },
        createdAt: {
          type: PgType.TIMESTAMP_WITH_TIME_ZONE,
          default: pgm.func('current_timestamp'),
          notNull: true,
        },
      };
      pgm.createTable(TABLE_PUBLICATIONS, columnDefinitions);

      pgm.sql(`
        ALTER TABLE "${TABLE_PUBLICATIONS}" ADD COLUMN search_vector tsvector;

        UPDATE "${TABLE_PUBLICATIONS}"
        SET search_vector = 
            to_tsvector('english', coalesce(title, '') || ' ' || coalesce(abstract, '') || ' ' || array_to_string(keywords, ' '));

        `)
      pgm.sql(`
        CREATE FUNCTION update_search_vector() RETURNS trigger AS $$
        BEGIN
            NEW.search_vector := to_tsvector('english', coalesce(NEW.title, '') || ' ' || coalesce(NEW.abstract, '') || ' ' || array_to_string(NEW.keywords, ' '));
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER trigger_update_search_vector
        BEFORE INSERT OR UPDATE ON "${TABLE_PUBLICATIONS}"
        FOR EACH ROW EXECUTE FUNCTION update_search_vector();
        `)

      pgm.sql(`
        CREATE INDEX idx_publications_search ON "${TABLE_PUBLICATIONS}" USING gin(search_vector);
        `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable(TABLE_PUBLICATIONS)
}

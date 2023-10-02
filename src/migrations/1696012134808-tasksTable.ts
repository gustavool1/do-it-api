import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TasksTable1696012134808 implements MigrationInterface {
  private TABLE_NAME = 'tasks';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'varchar' },
          { name: 'completed', type: 'boolean' },
          { name: 'user_id', type: 'varchar' },
        ],
        foreignKeys: [
          {
            name: 'fk_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}

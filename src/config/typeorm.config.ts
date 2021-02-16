import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');
console.log(dbConfig.get('database'));
console.log(config.get('server').port);
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  dropSchema: dbConfig.dropSchema,
  keepConnectionAlive: dbConfig.keepConnectionAlive,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};

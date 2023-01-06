import { createConnection } from 'typeorm';

export default (async () => await createConnection())();

/*import { Connection, createConnection, getConnectionOptions } from 'typeorm';


export default async (host = "database"): Promise<Connection> => {
  const defaultOption = await getConnectionOptions();

  //console.log(process.env.NODE_ENV);

  return createConnection(
    Object.assign(defaultOption, {
      host: process.env.NODE_ENV === "test" ? "localhost" : host,
      database: process.env.NODE_ENV === "test" ? "fin_api" : defaultOption.database,
    })
  );
};*/


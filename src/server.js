import dotenv from 'dotenv';
dotenv.config();
import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import Inert from '@hapi/inert';
import path from 'path';

//Users
import { UsersService } from './services/postgre/UsersService';
import { UsersValidator } from './validators/users';
import { authentications } from './api/authentications';

//Auth
import { AuthenticationsService } from './services/postgre/AuthenticationsService';
import { AuthenticationsValidator } from './validators/authentications';
import { users } from './api/users';


const init = async() => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([Jwt, Inert]);

  server.auth.strategy('bukutamu_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    },
    {
      plugin: authentications,
      options: {
        service: authenticationsService,
        validator: AuthenticationsValidator
      }
    }
  ]);

    server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.statusCode);
      }

      if (!response.isServer) {return h.continue;}

      console.error(response);
      return h
        .response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        })
        .code(500);
    }

    return h.continue;
  });

  await server.start();
  console.log(`\n✅ Server berjalan pada ${server.info.uri}`);
}

init();
import { InvariantError } from '../../exceptions/InvariantError';
import { UserPayloadSchema } from './schema';
 
export const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
 
    if (validationResult.error) {
      console.log("Kesalahan pada validate user payload");
      throw new InvariantError(validationResult.error.message);
    }
  },
};
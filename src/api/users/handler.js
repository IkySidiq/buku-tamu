import autoBind from "auto-bind";

export class UsersHandler{
  constructor(service, validator) {
    this._service = service;
    this._validator = validator

    autoBind(this)
  }

  async postUserHandler(request) {
    try {
      const { name, position, username, password} = request.payload;
      this._validator.validateUserPayload({ name, position, username, password });

      const { userId, logId } = await this._service.addUserService({ name, position, username, password })
    
      return h.response({
        status: "success",
        data: {
          userId, 
          logId
        }
      }).code(201)
    } catch(error) {
      throw error
    }
  }

  async getUsersHandler(request) {
    try {
      const { position, role } = request.auth;

      const data = await this._service.getAllUsers({ position, role });

      return {
        status: "success",
        data
      }
    } catch(error) {
      throw error;
    }
  }

  async editUserHandler(request) {
    try {
      const {name, position, username, password} = request.payload;
      const { id } = request.params;
      await this._validator.validateUserPayload({ name, position, username, password });

      const { id: adminId } = request.auth;
      await this._service.verifyAdmin({ adminId });

      const { userId, logId } = await this._service.editUser({adminId, name, position, username, password, id});

      return {
        status: "success",
        data: {
          userId,
          logId
        }
      }
    } catch(error) {
      throw error;
    }
  }

  async deleteUserHandler(request) {
    try {
      const { id } = request.params;
      const { role } = request.auth;
      await this._service.verifyAdmin({ role });

      const { userId, logId} = await this._service.deleteUser({ id });

      return {
        status: "success",
        data: {
          userId,
          logId
        }
      }
    } catch(error) {
      throw error;
    }
  }
}
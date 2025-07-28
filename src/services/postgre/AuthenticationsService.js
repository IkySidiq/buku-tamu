import pg from "pg";
import { nanoid } from "nanoid";
import { InvariantError } from "../../exceptions/InvariantError.js";

const { Pool } = pg;

export class AuthenticationsService{
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken({ token }) {
    const id = `auth-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO authentications (id, refreshToken) VALUES ($1, $2) RETURNING id`,
      value: [id, token]
    }

    const result = await this._pool.query(query);
    if (!result.rows[0]?.id) {
      throw new InvariantError('Gagal menyimpan refresh token');
    }

    return result.rows[0].id;
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}
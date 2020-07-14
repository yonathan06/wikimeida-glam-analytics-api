import { NowRequestHandler } from 'fastify-now';
import { authenticateAndGetUser } from '@lib/queries/glamsUsers';
import { Unauthorized } from 'http-errors';
import S from 'fluent-schema';

interface RequestParams {
  Params: { glamId: string };
  Body: { username: string; password: string };
}

export const POST: NowRequestHandler<RequestParams> = async function (req) {
  const { glamId } = req.params;
  const { username, password } = req.body;
  const response = await this.pg.pool.query(authenticateAndGetUser(glamId, username, password));
  if (response.rowCount === 0) {
    throw new Unauthorized();
  }
  const token = await this.signToken({ glam_id: glamId, username });
  return { token };
};

POST.opts = {
  schema: {
    body: S.object()
      .prop('username', S.string().required())
      .prop('password', S.string().required()),
    response: {
      200: S.object().prop('token', S.string().required()),
    },
  },
};

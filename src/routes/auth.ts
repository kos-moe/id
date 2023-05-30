import db from '../db';
import { sendEmail } from '../email';
import { randomInt } from 'crypto';
import { makeSession } from '../session';
import { hash, verify } from '@node-rs/argon2';
import { HTTPException } from 'hono/http-exception';
import { ulid } from 'ulid';
import { AccountAuthenticator } from '../model';
import { createRouter, parseBody } from '../router';

const app = createRouter();

app.post('/login', parseBody, async(ctx) => {
  const { email } = ctx.get('body');
  const identifier = await db.accountIdentifier.findUnique({
    where: {
      type_identifier: {
        type: 'email',
        identifier: email,
      }
    },
    include: {
      account: true
    }
  });
  if(identifier) {
    // if((identifier.account.authenticator as AccountAuthenticator).password)
    return ctx.json({type: 'login_password'});
  }
  else {
    const tokens = await db.verifyToken.findUnique({
      where: {
        identifier: email
      }
    });
    if(tokens) {
      throw new HTTPException(429);
    }
    else {
      const authCode = randomInt(1000000).toString().padStart(6, '0');
      await sendEmail('no-reply@kos.moe', email, `kos.moe 회원가입 인증 이메일 [${authCode}]`, `인증 코드는 ${authCode} 입니다.\r\n인증 코드를 입력하시거나 이 링크를 클릭해주세요: https://id.kos.moe/register?email=${email}&authCode=${authCode}`);
      await db.verifyToken.create({
        data: {
          identifier: email, 
          token: authCode,
          data: {resendCount: 0},
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        }
      });
      return ctx.json({type: 'register'});
    }
  }
});

app.post('/login/password', parseBody, async(ctx) => {
  const { email, password } = ctx.get('body'); 
  const identifier = await db.accountIdentifier.findUnique({
    where: {
      type_identifier: {
        type: 'email',
        identifier: email,
      }
    },
    include: {
      account: true
    }
  });
  if(!identifier) throw new HTTPException(401, {message: 'invalid_credentials'});
  const passwordHash = (identifier.account.authenticator as AccountAuthenticator).password;
  if(!passwordHash || !await verify(passwordHash, password)) throw new HTTPException(401, {message: 'invalid_credentials'});
  return ctx.json({session: await makeSession(identifier.account.id)});
});

app.post('/register', parseBody, async(ctx) => {
  const { email, authCode, name, password } = ctx.get('body');
  if(!name || name.length > 20) throw new HTTPException(400, {message: 'name_invalid'});
  if(!password || password.length < 8) throw new HTTPException(400, {message: 'password_invalid'});
  const accountId = await db.$transaction(async (db) => {
    if(await db.accountIdentifier.findUnique({
      where: {
        type_identifier: {
          type: 'email',
          identifier: email
        }
      }
    })) throw new HTTPException(409, {message: 'email_exists'});
    const token = await db.verifyToken.findUnique({
      where: {
        identifier: email
      }
    });
    if(!token || token.token !== authCode || token.expiresAt < new Date()) throw new HTTPException(400, {message: 'code_invalid'});
    const accountId = ulid();
    await Promise.all([
      db.account.create({
        data: {
          id: accountId,
          name,
          authenticator: {
            password: await hash(password)
          },
          accountIdentifiers: {
            create: {
              type: 'email',
              identifier: email
            }
          }
        }
      }),
      db.verifyToken.delete({
        where: {
          identifier: email
        }
      })
    ]);
    return accountId;
  });
  return ctx.json({session: await makeSession(accountId)});
});



export default app;
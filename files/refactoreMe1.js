const pool = require('./db');

// Table users
pool.query(`
  CREATE TABLE IF NOT EXISTS public.users (
    "id" serial4 PRIMARY KEY,
    "digits" varchar(155) NULL,
    "fotoUrl" varchar(255) NULL,
    "workType" varchar(100) NULL,
    "positionTitle" varchar(100) NULL,
    "lat" float8 NULL,
    "lon" float8 NULL,
    "company" varchar(155) NULL,
    "isLogin" bool NULL,
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now(),
    "dovote" bool DEFAULT false,
    "dosurvey" bool DEFAULT false,
    "dofeedback" bool DEFAULT false,
    "fullname" varchar(255) NULL,
    "cuurentLeave" int4 NULL,
    CONSTRAINT users_digits_key UNIQUE (digits)
  )
`)
  .then(() => {
    console.log('Tabel users telah dibuat');
  })
  .catch((error) => {
    console.error('Gagal membuat tabel users:', error);
  });

// Table surveys
pool.query(`
  CREATE TABLE IF NOT EXISTS public.surveys (
    "id" serial4 PRIMARY KEY,
    "values" _int4 NULL,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    "userId" int4 NULL,
    CONSTRAINT surveys_userId_fkey FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE
  )
`)
  .then(() => {
    console.log('Tabel surveys telah dibuat');
  })
  .catch((error) => {
    console.error('Gagal membuat tabel surveys:', error);
  });


pool.end();
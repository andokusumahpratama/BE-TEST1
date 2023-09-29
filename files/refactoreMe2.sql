-- DROP TABLE public.surveys;
-- DROP TABLE public.users;

-- Definition for public.users table
CREATE TABLE public.users (
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
);

-- Insert data into public.users table
INSERT INTO public.users (id, digits, "fotoUrl", "workType", "positionTitle", lat, lon, company, "isLogin", "createdAt", "updatedAt", dovote, dosurvey, dofeedback, fullname, "cuurentLeave") VALUES
    (1, 'DFA', '', 'WFO', NULL, 0.0, 0.0, 'NTX', true, '2021-12-15 15:06:33+07', '2022-12-22 21:05:32.377+07', true, true, false, 'M. Daffa Quraisy', 0),
    (2, 'HTA', '', 'WFH', NULL, 0.0, 0.0, 'NTX', true, '2021-12-15 15:06:33+07', '2022-12-22 15:04:01.302+07', true, true, false, 'R. Hernanta Subagya', 0),
    (3, 'HFW', '', 'WFO', NULL, 0.0, 0.0, 'NTX', true, '2021-12-15 15:06:33.226343+07', '2022-12-22 15:03:46.848+07', true, false, false, 'Hafidz Wibowo', 0);

-- Definition for public.surveys table
CREATE TABLE public.surveys (
    "id" serial4 PRIMARY KEY,
    "values" _int4 NULL,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    "userId" int4 NULL,
    CONSTRAINT surveys_userId_fkey FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert data into public.surveys table
INSERT INTO public.surveys ("values", "createdAt", "updatedAt", "userId") VALUES
    ('{100,100,90,90,100}', '2022-12-22 08:56:50.696+07', '2022-12-22 08:56:50.696+07', 1),
    ('{90,100,100,80,90}', '2022-12-22 09:08:50.908+07', '2022-12-22 09:08:50.908+07', 2),
    ('{80,80,80,80,80}', '2022-12-22 21:05:32.317+07', '2022-12-22 21:05:32.317+07', 3);

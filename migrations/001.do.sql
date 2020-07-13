CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS glams (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS galms_users (
  id UUID PRIMARY KEY NOT NULL DEFAULT GEN_RANDOM_UUID(),
  glam_id TEXT REFERENCES glams(id),
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS glams_items (
  file_path TEXT NOT NULL,
  glam_id TEXT REFERENCES glams(id),
  title TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  page_url TEXT NOT NULL,
  upload_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(glam_id, file_path)
);

CREATE INDEX IF NOT EXISTS glams_items_glam_id ON glams_items(glam_id);
CREATE INDEX IF NOT EXISTS glams_users_username ON galms_users(username);
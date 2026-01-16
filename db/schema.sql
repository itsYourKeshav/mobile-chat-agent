CREATE TABLE IF NOT EXISTS phones (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  price INTEGER NOT NULL,
  camera_mp INTEGER NOT NULL,
  has_ois BOOLEAN NOT NULL DEFAULT FALSE,
  battery_mah INTEGER NOT NULL,
  charging_watts INTEGER NOT NULL,
  size_category TEXT CHECK (size_category IN ('compact', 'medium', 'large')) NOT NULL,
  os TEXT NOT NULL,
  rating DECIMAL(2, 1) NOT NULL
);

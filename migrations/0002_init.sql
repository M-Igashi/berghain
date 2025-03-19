-- Migration number: 0002 	 2025-03-19T12:49:14.306Z
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  content_url TEXT,
  image_url TEXT
);

CREATE TABLE performances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL,
  stage TEXT NOT NULL,  -- 'Berghain' または 'Panorama Bar'
  artist_name TEXT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

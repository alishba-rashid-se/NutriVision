/*
# Create user-scoped tables for profiles, history, and settings

1. New Tables
- `user_profiles`: Stores user profile information (name, age, height, weight, goal)
  - `id` (uuid, primary key, references auth.users)
  - `name` (text, not null)
  - `age` (integer)
  - `height` (integer, in cm)
  - `weight` (integer, in kg)
  - `goal` (text: 'lose', 'gain', 'maintain')
  - `created_at`, `updated_at` (timestamps)
  
- `food_history`: Stores food analysis history per user
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, DEFAULT auth.uid())
  - `name` (text, not null)
  - `timestamp` (timestamptz)
  - `confidence` (real)
  - `calories`, `protein`, `carbs`, `fat`, `fiber`, `sugar` (real)
  - `serving_size` (text)
  - `health_score` (integer)
  - `is_healthy` (boolean)
  - `insights`, `suggestions` (text arrays)
  - `image_url` (text)
  
- `user_settings`: Stores user preferences
  - `id` (uuid, primary key, references auth.users)
  - `dark_mode` (boolean, default false)
  - `push_notifications` (boolean, default true)
  - `language` (text, default 'English')
  - `privacy` (boolean, default true)
  - `water_intake` (integer, default 0)
  - `created_at`, `updated_at` (timestamps)

- `daily_totals`: Stores daily nutrition totals for quick lookup
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, DEFAULT auth.uid())
  - `date` (date)
  - `calories`, `protein`, `carbs`, `fat` (real)
  - `water_intake` (integer)

2. Security
- Enable RLS on all tables
- All tables use owner-scoped CRUD: each user can only access their own data
- user_id columns have DEFAULT auth.uid() for automatic owner assignment

3. Indexes
- Index on food_history.user_id for faster queries
- Index on food_history.timestamp for chronological sorting
- Index on daily_totals(user_id, date) for quick lookups
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  age integer,
  height integer,
  weight integer,
  goal text NOT NULL DEFAULT 'maintain' CHECK (goal IN ('lose', 'gain', 'maintain')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS food_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  confidence real,
  calories real NOT NULL,
  protein real NOT NULL,
  carbs real NOT NULL,
  fat real NOT NULL,
  fiber real,
  sugar real,
  serving_size text,
  health_score integer,
  is_healthy boolean NOT NULL DEFAULT true,
  insights text[] DEFAULT '{}',
  suggestions text[] DEFAULT '{}',
  image_url text
);

ALTER TABLE food_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_history" ON food_history;
CREATE POLICY "select_own_history" ON food_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_history" ON food_history;
CREATE POLICY "insert_own_history" ON food_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_history" ON food_history;
CREATE POLICY "delete_own_history" ON food_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_food_history_user_id ON food_history(user_id);
CREATE INDEX IF NOT EXISTS idx_food_history_timestamp ON food_history(timestamp DESC);

CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  dark_mode boolean NOT NULL DEFAULT false,
  push_notifications boolean NOT NULL DEFAULT true,
  language text NOT NULL DEFAULT 'English',
  privacy boolean NOT NULL DEFAULT true,
  water_intake integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_settings" ON user_settings;
CREATE POLICY "select_own_settings" ON user_settings FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_settings" ON user_settings;
CREATE POLICY "insert_own_settings" ON user_settings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_settings" ON user_settings;
CREATE POLICY "update_own_settings" ON user_settings FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS daily_totals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  calories real NOT NULL DEFAULT 0,
  protein real NOT NULL DEFAULT 0,
  carbs real NOT NULL DEFAULT 0,
  fat real NOT NULL DEFAULT 0,
  water_intake integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

ALTER TABLE daily_totals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_daily_totals" ON daily_totals;
CREATE POLICY "select_own_daily_totals" ON daily_totals FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_daily_totals" ON daily_totals;
CREATE POLICY "insert_own_daily_totals" ON daily_totals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_daily_totals" ON daily_totals;
CREATE POLICY "update_own_daily_totals" ON daily_totals FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_totals_user_date ON daily_totals(user_id, date DESC);
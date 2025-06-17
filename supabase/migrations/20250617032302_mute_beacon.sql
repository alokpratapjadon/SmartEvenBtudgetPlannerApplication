/*
  # Add profile image support

  1. Changes
    - Add `profile_image_url` column to `users` table
    - Allow users to store profile image URLs

  2. Security
    - No changes to existing RLS policies
    - Users can still only update their own profile data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'profile_image_url'
  ) THEN
    ALTER TABLE users ADD COLUMN profile_image_url text;
  END IF;
END $$;
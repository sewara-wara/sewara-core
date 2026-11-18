-- Users of the app: seekers (pencari) and owners (pemilik).

CREATE TABLE IF NOT EXISTS users (
  id             INT NOT NULL AUTO_INCREMENT,
  name           VARCHAR(100) NOT NULL,
  email          VARCHAR(100) NOT NULL,
  image_profile  TEXT NULL,                                  -- Cloudinary URL
  password       VARCHAR(255) NOT NULL,                      -- bcrypt hash
  role           ENUM('seeker', 'owner') NOT NULL DEFAULT 'seeker',
  token          VARCHAR(255) NULL,                          -- last issued JWT
  fcm            TEXT NULL,                                  -- push notification token (not used by the API yet)
  is_verified    TINYINT(1) NOT NULL DEFAULT 0,              -- 1 = email verified via OTP
  status         INT NOT NULL DEFAULT 1,                     -- 1 = active, 0 = deleted (soft delete)
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- OTP codes for email verification.
-- user_id must keep the same type as users.id for the foreign key.

CREATE TABLE IF NOT EXISTS user_otps (
  id              INT NOT NULL AUTO_INCREMENT,
  user_id         INT NOT NULL,
  otp             CHAR(6) NOT NULL,
  otp_expired_at  DATETIME NOT NULL,
  is_used         TINYINT(1) NOT NULL DEFAULT 0,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_otps_user_otp (user_id, otp),
  CONSTRAINT fk_user_otps_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Admin System Database Schema
-- Tables for admin users, sign-in logs, contact messages, and backups

-- Admin Users Table (separate from regular users)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' COMMENT 'admin, super_admin, moderator',
  phone VARCHAR(20),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_status (status)
);

-- Admin Sign-In Logs
CREATE TABLE IF NOT EXISTS admin_signin_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_type VARCHAR(50),
  browser VARCHAR(50),
  login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logout_timestamp TIMESTAMP NULL,
  session_status ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_admin_id (admin_id),
  INDEX idx_timestamp (login_timestamp),
  INDEX idx_email (email)
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  country_code VARCHAR(5),
  whatsapp VARCHAR(20),
  subject VARCHAR(255),
  message LONGTEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  assigned_to INT,
  reply_message LONGTEXT,
  replied_at TIMESTAMP NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at),
  INDEX idx_priority (priority)
);

-- Admin Activity Log (for backup audit trail)
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INT,
  details JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_admin_id (admin_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_action (action)
);

-- Data Backups Table
CREATE TABLE IF NOT EXISTS data_backups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  backup_name VARCHAR(255) UNIQUE NOT NULL,
  backup_type ENUM('manual', 'automatic', 'signout') DEFAULT 'manual',
  triggered_by INT,
  total_records INT,
  backup_size_bytes BIGINT,
  file_path VARCHAR(255),
  backup_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  restored_at TIMESTAMP NULL,
  restored_by INT,
  status ENUM('completed', 'failed', 'in_progress') DEFAULT 'in_progress',
  error_message TEXT,
  metadata JSON,
  FOREIGN KEY (triggered_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  FOREIGN KEY (restored_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_backup_type (backup_type),
  INDEX idx_timestamp (backup_timestamp),
  INDEX idx_status (status)
);

-- Signup Users (for admin to manage)
CREATE TABLE IF NOT EXISTS signup_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  country_code VARCHAR(5),
  country VARCHAR(100),
  state VARCHAR(100),
  gender VARCHAR(20),
  age INT,
  profession VARCHAR(100),
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  source ENUM('signup', 'signin', 'manual', 'csv_upload') DEFAULT 'signup',
  notes TEXT,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_registration_date (registration_date)
);

-- Create indexes for better query performance
CREATE INDEX idx_contact_messages_created ON contact_messages(submitted_at DESC);
CREATE INDEX idx_admin_signin_logs_created ON admin_signin_logs(login_timestamp DESC);
CREATE INDEX idx_admin_users_created ON admin_users(created_at DESC);

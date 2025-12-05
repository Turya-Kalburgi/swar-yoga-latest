import { query } from './mysqlAdmin.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUPS_DIR = path.join(__dirname, '..', 'admin_backups');

// Ensure backups directory exists
async function ensureBackupDir() {
  try {
    await fs.mkdir(BACKUPS_DIR, { recursive: true });
  } catch (error) {
    console.error('❌ Failed to create backups directory:', error);
  }
}

ensureBackupDir();

/**
 * Create a backup when admin signs out
 * Backs up: contact messages, signin logs, signup users
 */
export async function createSignoutBackup(adminId, email) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `admin_signout_${adminId}_${timestamp}.json`;
    const backupPath = path.join(BACKUPS_DIR, backupName);

    console.log(`📦 Creating signout backup for admin: ${email}`);

    // Fetch all data to backup
    const [contactMessages, signinLogs, signupUsers, adminUsers] = await Promise.all([
      query('SELECT * FROM contact_messages ORDER BY submitted_at DESC'),
      query('SELECT * FROM admin_signin_logs ORDER BY login_timestamp DESC'),
      query('SELECT * FROM signup_users ORDER BY registration_date DESC'),
      query('SELECT id, email, name, role, status FROM admin_users')
    ]);

    const backupData = {
      backupType: 'signout',
      createdAt: new Date().toISOString(),
      createdBy: email,
      adminId,
      summary: {
        totalContactMessages: contactMessages.length,
        totalSigninLogs: signinLogs.length,
        totalSignupUsers: signupUsers.length,
        totalAdmins: adminUsers.length
      },
      data: {
        contactMessages,
        signinLogs,
        signupUsers,
        adminUsers
      }
    };

    // Write backup to file
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');

    // Record backup in database
    await query(
      `INSERT INTO data_backups 
       (backup_name, backup_type, triggered_by, total_records, file_path, status, backup_timestamp, metadata)
       VALUES (?, 'signout', ?, ?, ?, 'completed', NOW(), ?)`,
      [
        backupName,
        adminId,
        contactMessages.length + signinLogs.length + signupUsers.length,
        backupPath,
        JSON.stringify(backupData.summary)
      ]
    );

    console.log(`✅ Signout backup created: ${backupName}`);
    console.log(`   📊 Contact Messages: ${contactMessages.length}`);
    console.log(`   📊 Signin Logs: ${signinLogs.length}`);
    console.log(`   📊 Signup Users: ${signupUsers.length}`);

    return {
      success: true,
      backupName,
      backupPath,
      summary: backupData.summary
    };
  } catch (error) {
    console.error('❌ Error creating signout backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create manual backup
 */
export async function createManualBackup(adminId, email) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `admin_manual_${adminId}_${timestamp}.json`;
    const backupPath = path.join(BACKUPS_DIR, backupName);

    console.log(`📦 Creating manual backup by admin: ${email}`);

    // Fetch all data
    const [contactMessages, signinLogs, signupUsers, adminUsers] = await Promise.all([
      query('SELECT * FROM contact_messages ORDER BY submitted_at DESC'),
      query('SELECT * FROM admin_signin_logs ORDER BY login_timestamp DESC'),
      query('SELECT * FROM signup_users ORDER BY registration_date DESC'),
      query('SELECT id, email, name, role, status FROM admin_users')
    ]);

    const backupData = {
      backupType: 'manual',
      createdAt: new Date().toISOString(),
      createdBy: email,
      adminId,
      summary: {
        totalContactMessages: contactMessages.length,
        totalSigninLogs: signinLogs.length,
        totalSignupUsers: signupUsers.length,
        totalAdmins: adminUsers.length
      },
      data: {
        contactMessages,
        signinLogs,
        signupUsers,
        adminUsers
      }
    };

    // Write backup to file
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');

    // Record in database
    await query(
      `INSERT INTO data_backups 
       (backup_name, backup_type, triggered_by, total_records, file_path, status, backup_timestamp, metadata)
       VALUES (?, 'manual', ?, ?, ?, 'completed', NOW(), ?)`,
      [
        backupName,
        adminId,
        contactMessages.length + signinLogs.length + signupUsers.length,
        backupPath,
        JSON.stringify(backupData.summary)
      ]
    );

    console.log(`✅ Manual backup created: ${backupName}`);

    return {
      success: true,
      backupName,
      backupPath,
      summary: backupData.summary
    };
  } catch (error) {
    console.error('❌ Error creating manual backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * List all backups
 */
export async function listBackups() {
  try {
    const backups = await query(
      'SELECT * FROM data_backups ORDER BY backup_timestamp DESC LIMIT 100',
      []
    );

    return backups;
  } catch (error) {
    console.error('❌ Error listing backups:', error);
    throw error;
  }
}

/**
 * Get backup statistics
 */
export async function getBackupStats() {
  try {
    const stats = await query(
      `SELECT 
        COUNT(*) as total_backups,
        SUM(CASE WHEN backup_type = 'signout' THEN 1 ELSE 0 END) as signout_backups,
        SUM(CASE WHEN backup_type = 'manual' THEN 1 ELSE 0 END) as manual_backups,
        MAX(backup_timestamp) as latest_backup
      FROM data_backups WHERE status = 'completed'`,
      []
    );

    return stats[0] || {};
  } catch (error) {
    console.error('❌ Error getting backup stats:', error);
    throw error;
  }
}

/**
 * Restore from backup
 */
export async function restoreFromBackup(backupName, adminId) {
  try {
    console.log(`🔄 Restoring from backup: ${backupName}`);

    const backupPath = path.join(BACKUPS_DIR, backupName);

    // Check if file exists
    await fs.access(backupPath);

    // Read backup file
    const backupContent = await fs.readFile(backupPath, 'utf-8');
    const backupData = JSON.parse(backupContent);

    // Update backup record as restored
    await query(
      `UPDATE data_backups 
       SET restored_at = NOW(), restored_by = ?, status = 'completed'
       WHERE backup_name = ?`,
      [adminId, backupName]
    );

    console.log(`✅ Backup restored: ${backupName}`);

    return {
      success: true,
      message: 'Backup restored successfully',
      data: backupData
    };
  } catch (error) {
    console.error('❌ Error restoring backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Download backup file
 */
export async function getBackupFile(backupName) {
  try {
    const backupPath = path.join(BACKUPS_DIR, backupName);
    await fs.access(backupPath);
    return await fs.readFile(backupPath);
  } catch (error) {
    console.error('❌ Error reading backup file:', error);
    throw error;
  }
}

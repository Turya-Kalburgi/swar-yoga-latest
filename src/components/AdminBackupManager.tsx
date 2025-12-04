import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Backup {
  filename: string;
  date: string;
  dateISO: string;
  sizeKB: string;
  created: string;
  modified: string;
}

interface BackupStats {
  totalBackups: number;
  maxBackups: number;
  totalSizeMB: string;
  backupsDirectory: string;
  backups: Backup[];
}

const AdminBackupManager: React.FC = () => {
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // Fetch backup statistics
  const fetchBackupStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/backup/stats');
      setStats(response.data);
      setMessage(null);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to fetch backup stats'
      });
    } finally {
      setLoading(false);
    }
  };

  // Create daily backup
  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/admin/backup/create');
      
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: `Backup created: ${response.data.filename} (${response.data.sizeKB} KB)`
        });
        fetchBackupStats();
      } else {
        setMessage({
          type: 'success',
          text: response.data.reason
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create backup'
      });
    } finally {
      setLoading(false);
    }
  };

  // Restore from backup
  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;

    try {
      setLoading(true);
      const response = await axios.post('/api/admin/backup/restore', {
        backupFilename: selectedBackup
      });

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: `Restored from ${selectedBackup}. Safety backup: ${response.data.safetyBackup}`
        });
        setShowRestoreConfirm(false);
        setSelectedBackup(null);
        fetchBackupStats();
      } else {
        setMessage({
          type: 'error',
          text: response.data.error
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to restore backup'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load stats on component mount
  useEffect(() => {
    fetchBackupStats();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">💾 Backup Manager</h1>

      {/* Message Alert */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Backups</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalBackups}/{stats.maxBackups}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Storage</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalSizeMB} MB</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-2xl font-bold text-green-600">✅ Active</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <button
          onClick={handleCreateBackup}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : '+ Create Backup Now'}
        </button>

        <button
          onClick={fetchBackupStats}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Restore Confirmation Dialog */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-red-600">⚠️ Confirm Restore</h2>
            <p className="mb-4 text-gray-700">
              Restore from <strong>{selectedBackup}</strong>?
            </p>
            <p className="mb-4 text-sm text-gray-600">
              Current data will be backed up to a safety backup before restoring.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRestoreBackup}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Restoring...' : 'Restore'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backups List */}
      {stats && stats.backups && stats.backups.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Available Backups ({stats.backups.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Date</th>
                  <th className="border p-3 text-left">Size</th>
                  <th className="border p-3 text-left">Modified</th>
                  <th className="border p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.backups.map((backup) => (
                  <tr key={backup.filename} className="hover:bg-gray-50">
                    <td className="border p-3">
                      <div className="font-semibold">{backup.date}</div>
                      <div className="text-sm text-gray-600">{backup.filename}</div>
                    </td>
                    <td className="border p-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                        {backup.sizeKB} KB
                      </span>
                    </td>
                    <td className="border p-3 text-sm text-gray-600">
                      {new Date(backup.modified).toLocaleString()}
                    </td>
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedBackup(backup.filename);
                          setShowRestoreConfirm(true);
                        }}
                        disabled={loading}
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 text-sm"
                      >
                        ↺ Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-yellow-800">
          No backups found. Click "Create Backup Now" to create your first backup.
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
        <h3 className="font-bold mb-2">📋 Backup System Information</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Daily backups are automatically created when the server starts</li>
          <li>Only one backup per day is kept (duplicates are skipped)</li>
          <li>The system automatically keeps the last 10 days of backups</li>
          <li>Older backups are automatically deleted to save storage</li>
          <li>You can manually create additional backups anytime</li>
          <li>A safety backup is created before restoring from a backup</li>
          <li>Restore operation creates a safety backup of current data first</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminBackupManager;

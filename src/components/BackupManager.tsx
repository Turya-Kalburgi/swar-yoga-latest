import React, { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Plus, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { backupAPI } from '../utils/database';

interface Backup {
  id: string;
  timestamp: string;
  size?: number;
  description?: string;
}

const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [creatingBackup, setCreatingBackup] = useState(false);

  // Load backups on mount
  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      setLoading(true);
      const data = await backupAPI.listBackups();
      setBackups(data || []);
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to load backups'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setCreatingBackup(true);
      await backupAPI.createBackup();
      setMessage({
        type: 'success',
        text: 'Backup created successfully!'
      });
      await loadBackups();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to create backup'
      });
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      await backupAPI.downloadBackupFile();
      setMessage({
        type: 'success',
        text: 'Backup downloaded successfully!'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to download backup'
      });
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!window.confirm('Are you sure? This will replace your current data with the backup.')) {
      return;
    }

    try {
      setLoading(true);
      await backupAPI.restoreBackup(backupId);
      setMessage({
        type: 'success',
        text: 'Backup restored successfully! Please refresh the page.'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to restore backup'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!window.confirm('Are you sure you want to delete this backup?')) {
      return;
    }

    try {
      setLoading(true);
      await backupAPI.deleteBackup(backupId);
      setMessage({
        type: 'success',
        text: 'Backup deleted successfully!'
      });
      await loadBackups();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to delete backup'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm('Are you sure? This will replace your current data with the uploaded backup.')) {
      return;
    }

    try {
      setLoading(true);
      await backupAPI.importFromJSON(file);
      setMessage({
        type: 'success',
        text: 'Backup imported successfully! Please refresh the page.'
      });
      await loadBackups();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to import backup'
      });
    } finally {
      setLoading(false);
    }

    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Data Backup & Restore</h1>
        <p className="text-gray-600">Safely backup and restore all your Swar Yoga data</p>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Create Backup Button */}
        <button
          onClick={handleCreateBackup}
          disabled={creatingBackup || loading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {creatingBackup ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          {creatingBackup ? 'Creating...' : 'Create Backup'}
        </button>

        {/* Download Backup Button */}
        <button
          onClick={handleDownloadBackup}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <Download className="w-5 h-5" />
          Download
        </button>

        {/* Upload Backup Button */}
        <label className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer">
          <Upload className="w-5 h-5" />
          Upload File
          <input
            type="file"
            accept=".json"
            onChange={handleUploadBackup}
            disabled={loading}
            className="hidden"
          />
        </label>
      </div>

      {/* Backups List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Saved Backups</h2>

        {loading && !backups.length ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : backups.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No backups yet. Create one to get started!</p>
        ) : (
          <div className="space-y-3">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-800">{backup.description || 'Backup'}</p>
                  <p className="text-sm text-gray-600">{formatDate(backup.timestamp)}</p>
                  {backup.size && <p className="text-xs text-gray-500">Size: {(backup.size / 1024).toFixed(2)} KB</p>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRestoreBackup(backup.id)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleDeleteBackup(backup.id)}
                    disabled={loading}
                    className="p-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 How it works</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>✅ <strong>Create Backup:</strong> Saves all your data (goals, tasks, visions, etc.) to the server</li>
          <li>✅ <strong>Download:</strong> Export your backup as a JSON file for safekeeping</li>
          <li>✅ <strong>Upload:</strong> Restore from a previously downloaded backup file</li>
          <li>✅ <strong>Restore:</strong> Replace current data with a saved backup version</li>
          <li>⚠️ <strong>Warning:</strong> Restoring will overwrite all current data!</li>
        </ul>
      </div>
    </div>
  );
};

export default BackupManager;

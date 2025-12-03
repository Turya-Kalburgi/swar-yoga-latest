import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Download, 
  Filter, 
  Search,
  Mail,
  Phone,
  Reply,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { contactAPI } from '../../utils/contactData';
import { toast } from 'react-toastify';

interface ContactMessage {
  id: number | string;
  name: string;
  email: string;
  whatsapp: string;
  countryCode: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
}

const AdminContactData = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadContactMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, filter, searchTerm]);

  const loadContactMessages = async () => {
    try {
      setLoading(true);
      const data = await contactAPI.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Error loading contact messages:', error);
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(msg => msg.status === filter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by submitted date (most recent first)
    filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    setFilteredMessages(filtered);
  };

  const exportMessages = () => {
    const csvContent = [
      ['Name', 'Email', 'WhatsApp', 'Subject', 'Message', 'Submitted Date', 'Status', 'Priority'].join(','),
      ...filteredMessages.map(msg => [
        msg.name,
        msg.email,
        `${msg.countryCode} ${msg.whatsapp}`,
        msg.subject,
        `"${msg.message.replace(/"/g, '""')}"`, // Escape quotes in CSV
        new Date(msg.submittedAt).toLocaleString(),
        msg.status,
        msg.priority
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact_messages_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Contact messages exported successfully');
  };

  const markAsRead = async (id: number | string) => {
    try {
      await contactAPI.update(id, { status: 'read' });
      setMessages(messages.map(msg => 
        msg.id.toString() === id.toString() ? { ...msg, status: 'read' as const } : msg
      ));
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to update message status');
    }
  };

  const sendEmailReply = async (message: ContactMessage) => {
    try {
      const subject = `Re: ${message.subject}`;
      const body = `Dear ${message.name},\n\nThank you for contacting SwarYoga.\n\n${replyText}\n\nBest regards,\nSwarYoga Team`;
      const mailtoLink = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink);
      
      // Mark as replied
      await contactAPI.update(message.id, { status: 'replied' });
      setMessages(messages.map(msg => 
        msg.id === message.id ? { ...msg, status: 'replied' as const } : msg
      ));
      setSelectedMessage(null);
      setReplyText('');
      toast.success('Email reply sent');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const sendWhatsAppReply = async (message: ContactMessage) => {
    try {
      const whatsappMessage = `Hello ${message.name}, thank you for contacting SwarYoga regarding "${message.subject}". ${replyText}`;
      const whatsappLink = `https://wa.me/${message.countryCode.replace('+', '')}${message.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappLink, '_blank');
      
      // Mark as replied
      await contactAPI.update(message.id, { status: 'replied' });
      setMessages(messages.map(msg => 
        msg.id === message.id ? { ...msg, status: 'replied' as const } : msg
      ));
      setSelectedMessage(null);
      setReplyText('');
      toast.success('WhatsApp reply sent');
    } catch (error) {
      console.error('Error sending WhatsApp reply:', error);
      toast.error('Failed to send WhatsApp reply');
    }
  };

  const deleteMessage = async (id: number | string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await contactAPI.delete(id);
        setMessages(messages.filter(msg => msg.id !== id));
        toast.success('Message deleted successfully');
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const clearAllMessages = async () => {
    if (confirm('Are you sure you want to clear all messages? This action cannot be undone.')) {
      try {
        await contactAPI.clearAll();
        setMessages([]);
        toast.success('All messages have been cleared');
      } catch (error) {
        console.error('Error clearing messages:', error);
        toast.error('Failed to clear messages');
      }
    }
  };

  const getMessageStats = () => {
    const totalMessages = messages.length;
    const unreadMessages = messages.filter(msg => msg.status === 'unread').length;
    const readMessages = messages.filter(msg => msg.status === 'read').length;
    const repliedMessages = messages.filter(msg => msg.status === 'replied').length;
    const highPriorityMessages = messages.filter(msg => msg.priority === 'high').length;

    return { totalMessages, unreadMessages, readMessages, repliedMessages, highPriorityMessages };
  };

  const stats = getMessageStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date in DD/MM/YYYY format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format time in HH:MM format
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contact messages...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Messages</h1>
            <p className="text-gray-600">Manage and respond to customer inquiries</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportMessages}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Debug Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Debug Tools</h3>
          <p className="text-sm text-blue-700 mb-3">
            Use these tools to manage the contact messages for testing purposes:
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={clearAllMessages}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Clear All Messages
            </button>
            <button
              onClick={loadContactMessages}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Messages</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-pink-100">
                <MessageSquare className="h-6 w-6 text-pink-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-pink-600 mb-1">{stats.totalMessages}</div>
            <div className="text-gray-600 text-sm">Total Messages</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-sm text-red-600">{stats.unreadMessages}</span>
            </div>
            <div className="text-2xl font-bold text-red-600 mb-1">{stats.unreadMessages}</div>
            <div className="text-gray-600 text-sm">Unread</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-sm text-yellow-600">{stats.readMessages}</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.readMessages}</div>
            <div className="text-gray-600 text-sm">Read</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600">{stats.repliedMessages}</span>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.repliedMessages}</div>
            <div className="text-gray-600 text-sm">Replied</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-100">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm text-orange-600">{stats.highPriorityMessages}</span>
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-1">{stats.highPriorityMessages}</div>
            <div className="text-gray-600 text-sm">High Priority</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <div className="flex space-x-2">
                {[
                  { id: 'all', label: 'All Messages' },
                  { id: 'unread', label: 'Unread' },
                  { id: 'read', label: 'Read' },
                  { id: 'replied', label: 'Replied' }
                ].map(filterOption => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterOption.id
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Contact Messages</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                          <MessageSquare className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                          <div className="text-xs text-gray-400">{message.countryCode} {message.whatsapp}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{message.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{message.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(message.submittedAt)} {formatTime(message.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {message.status === 'unread' && (
                          <button
                            onClick={() => markAsRead(message.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Mark as Read"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="text-green-600 hover:text-green-900"
                          title="Reply"
                        >
                          <Reply className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        )}

        {/* Reply Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Reply to {selectedMessage.name}</h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                {/* Original Message */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Original Message:</h3>
                  <p className="text-sm text-gray-600 mb-2"><strong>Subject:</strong> {selectedMessage.subject}</p>
                  <p className="text-sm text-gray-700">{selectedMessage.message}</p>
                </div>

                {/* Reply Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                      placeholder="Type your reply here..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => sendEmailReply(selectedMessage)}
                      disabled={!replyText.trim()}
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      <span>Reply via Email</span>
                    </button>
                    <button
                      onClick={() => sendWhatsAppReply(selectedMessage)}
                      disabled={!replyText.trim()}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      <span>Reply via WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContactData;
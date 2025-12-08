import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  Download, 
  Search, 
  Plus, 
  X, 
  Calendar, 
  User, 
  MapPin, 
  Image, 
  FileText, 
  Trash2, 
  Eye, 
  RefreshCw 
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CertificateTemplate from '../../components/CertificateTemplet';

interface Certificate {
  id: string;
  fullName: string;
  address: string;
  workshopName: string;
  certificateType: string;
  issueDate: string;
  photoUrl: string;
  createdAt: string;
}

const CertificateCreator = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    workshopName: '',
    certificateType: 'completion',
    issueDate: new Date().toISOString().split('T')[0],
    photoUrl: ''
  });

  // Load certificates from localStorage on component mount
  useEffect(() => {
    const savedCertificates = localStorage.getItem('swaryoga_certificates');
    if (savedCertificates) {
      try {
        const parsedCertificates = JSON.parse(savedCertificates);
        setCertificates(parsedCertificates);
        setFilteredCertificates(parsedCertificates);
      } catch (error) {
        console.error('Error parsing certificates:', error);
        toast.error('Failed to load certificates');
      }
    }
  }, []);

  // Save certificates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('swaryoga_certificates', JSON.stringify(certificates));
  }, [certificates]);

  // Filter certificates based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCertificates(certificates);
      return;
    }
    
    const filtered = certificates.filter(cert => 
      cert.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.workshopName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredCertificates(filtered);
  }, [searchTerm, certificates]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.workshopName) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newCertificate: Certificate = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };
    
    setCertificates(prev => [newCertificate, ...prev]);
    setFilteredCertificates(prev => [newCertificate, ...prev]);
    setShowAddModal(false);
    toast.success('Certificate created successfully');
    
    // Reset form
    setFormData({
      fullName: '',
      address: '',
      workshopName: '',
      certificateType: 'completion',
      issueDate: new Date().toISOString().split('T')[0],
      photoUrl: ''
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      setCertificates(prev => prev.filter(cert => cert.id !== id));
      setFilteredCertificates(prev => prev.filter(cert => cert.id !== id));
      toast.success('Certificate deleted successfully');
    }
  };

  const handlePreview = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowPreviewModal(true);
  };

  const handleDownload = async () => {
    if (!certificateRef.current || !selectedCertificate) return;
    
    setIsGenerating(true);
    
    try {
      // Create a canvas from the certificate template
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      // Convert to PDF (A4 size)
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${selectedCertificate.fullName.replace(/\s+/g, '_')}_Certificate.pdf`);
      
      toast.success('Certificate downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Certificate Creator</h1>
            <p className="text-gray-600">Create and manage certificates for workshop participants</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            <span>Create Certificate</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search certificates by name or workshop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map(certificate => (
              <div key={certificate.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{certificate.fullName}</h3>
                      <p className="text-sm text-gray-600">{certificate.workshopName}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreview(certificate)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Preview Certificate"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(certificate.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Certificate"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {certificate.certificateType === 'completion' ? 'Certificate of Completion' : 
                         certificate.certificateType === 'participation' ? 'Certificate of Participation' : 
                         'Certificate of Achievement'}
                      </p>
                      <p className="text-xs text-gray-500">Issued on {formatDate(certificate.issueDate)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {certificate.address && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{certificate.address}</span>
                      </div>
                    )}
                    {certificate.photoUrl && (
                      <div className="flex items-center space-x-2">
                        <Image className="h-4 w-4 flex-shrink-0" />
                        <span>Photo included</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>Created on {new Date(certificate.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePreview(certificate)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Certificates Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No certificates match your search criteria.' : 'You haven\'t created any certificates yet.'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Certificate</span>
            </button>
          </div>
        )}

        {/* Add Certificate Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Create New Certificate</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter participant's full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter participant's address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workshop Name *
                  </label>
                  <input
                    type="text"
                    name="workshopName"
                    value={formData.workshopName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter workshop name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate Type
                    </label>
                    <select
                      name="certificateType"
                      value={formData.certificateType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="completion">Certificate of Completion</option>
                      <option value="participation">Certificate of Participation</option>
                      <option value="achievement">Certificate of Achievement</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter URL for participant's photo"
                  />
                  {formData.photoUrl && (
                    <div className="mt-2 w-20 h-24 bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={formData.photoUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2296%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%25%22 height=%22100%25%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2212%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22 font-family=%22Arial%22%3ENo Photo%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Create Certificate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Certificate Preview Modal */}
        {showPreviewModal && selectedCertificate && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Certificate Preview</h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 flex justify-center">
                <div ref={certificateRef} className="transform scale-75 origin-top">
                  <CertificateTemplate
                    fullName={selectedCertificate.fullName}
                    workshopDetails={selectedCertificate.workshopName}
                    date={selectedCertificate.issueDate}
                    photoUrl={selectedCertificate.photoUrl}
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={18} className="mr-2 animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} className="mr-2" />
                      <span>Download Certificate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CertificateCreator;
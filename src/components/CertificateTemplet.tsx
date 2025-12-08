import React from 'react';
import { format } from 'date-fns';

interface CertificateTemplateProps {
  fullName: string;
  workshopDetails: string;
  date: string;
  photoUrl?: string;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  fullName,
  workshopDetails,
  date,
  photoUrl
}) => {
  const formattedDate = format(new Date(date), 'dd MMMM yyyy');
  
  return (
    <div className="w-[842px] h-[595px] bg-white relative overflow-hidden border border-gray-300 shadow-lg">
      {/* Certificate Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>
      <div className="absolute top-2 left-0 w-2 h-[calc(100%-4px)] bg-gradient-to-b from-purple-600 via-indigo-600 to-blue-600"></div>
      <div className="absolute top-2 right-0 w-2 h-[calc(100%-4px)] bg-gradient-to-b from-purple-600 via-indigo-600 to-blue-600"></div>
      
      {/* Mandala Patterns - Subtle Background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='%236366f1' /%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px'
      }}></div>
      
      {/* Om Symbol Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="text-[300px] text-indigo-900 font-serif">ॐ</div>
      </div>
      
      {/* Certificate Content */}
      <div className="absolute inset-0 m-16 flex flex-col items-center justify-between">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-800 mb-1">CERTIFICATE OF COMPLETION</h1>
          <div className="w-64 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 mx-auto mb-2"></div>
          <h2 className="text-xl font-semibold text-purple-700">Swar Yoga</h2>
          <p className="text-sm text-indigo-600">The Ancient Science of Brain Breathing</p>
        </div>
        
        {/* Main Content */}
        <div className="text-center flex-1 flex flex-col items-center justify-center">
          <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
          <h2 className="text-3xl font-bold text-indigo-900 mb-4 border-b-2 border-purple-400 px-8 pb-2">{fullName}</h2>
          
          <p className="text-lg text-gray-700 mb-4">has successfully completed</p>
          <h3 className="text-2xl font-semibold text-purple-800 mb-6">{workshopDetails}</h3>
          
          <div className="flex items-center justify-center mb-4">
            {photoUrl && (
              <div className="w-24 h-32 border-2 border-indigo-300 overflow-hidden mr-8 shadow-md">
                <img 
                  src={photoUrl} 
                  alt={`${fullName}'s photo`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2296%22 height=%22128%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%25%22 height=%22100%25%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22 font-family=%22Arial%22%3EPhoto%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            )}
            <div className="text-center">
              <p className="text-lg text-gray-700">Dated: <span className="font-semibold">{formattedDate}</span></p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="w-full flex justify-between items-end">
          <div className="text-center">
            <div className="w-32 border-t-2 border-indigo-400 pt-1 mb-1"></div>
            <p className="text-sm font-medium text-indigo-800">Organization Seal</p>
          </div>
          
          <div className="text-center">
            <div className="w-32 border-t-2 border-indigo-400 pt-1 mb-1"></div>
            <p className="text-sm font-medium text-indigo-800">Signature</p>
            <p className="text-xs text-indigo-600">Yogacharya Mohan Kalburgi</p>
          </div>
        </div>
        
        {/* Organization Details */}
        <div className="text-center mt-4 text-xs text-indigo-600">
          <p className="font-semibold">Upamnayu International Education Pvt. Ltd.</p>
          <p>Vedant Complex, Maldad Road, Sangamner, Maharashtra - 422605, India</p>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
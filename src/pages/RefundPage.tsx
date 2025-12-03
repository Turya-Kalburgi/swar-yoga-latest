import React from 'react';
import { Link } from 'react-router-dom';
// Header and Footer are provided by App routes; removed local imports to avoid duplicate rendering
import PageHeader from '../components/PageHeader';
import { ArrowRight, RefreshCw, Calendar, DollarSign, FileText, Shield } from 'lucide-react';

const RefundPage = () => {
  return (
    <div className="min-h-screen bg-white">
  {/* Header provided by App layout */}
      
      <PageHeader 
        title="Refund Policy" 
        breadcrumbs={[{ name: 'Refund Policy', path: '/refund' }]}
        image="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="prose max-w-none">
            <div className="flex items-center space-x-2 mb-6">
              <RefreshCw className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800 m-0">Refund Policy</h2>
            </div>
            
            <p className="text-gray-700">
              At Swar Yogaa, we strive to provide high-quality yoga and wellness services. We understand that circumstances may arise that require you to cancel your registration or request a refund. This policy outlines our guidelines for refunds and cancellations.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Workshop and Course Refunds</h3>
            <p className="text-gray-700">
              Our refund policy for workshops and courses is as follows:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Cancellation 14+ days before start date:</strong> Full refund minus a 10% administrative fee</li>
              <li><strong>Cancellation 7-13 days before start date:</strong> 50% refund</li>
              <li><strong>Cancellation less than 7 days before start date:</strong> No refund</li>
              <li><strong>After program has begun:</strong> No refund</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Retreat Refunds</h3>
            <p className="text-gray-700">
              Due to the nature of retreat planning and limited spaces, our retreat refund policy is as follows:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Cancellation 30+ days before retreat:</strong> Full refund minus a 20% deposit</li>
              <li><strong>Cancellation 15-29 days before retreat:</strong> 50% refund</li>
              <li><strong>Cancellation less than 15 days before retreat:</strong> No refund</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Digital Products</h3>
            <p className="text-gray-700">
              Due to the nature of digital products:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>All sales of digital products (e-books, recorded classes, online courses) are final and non-refundable once access has been granted.</li>
              <li>If you experience technical issues accessing the content, please contact our support team for assistance.</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Membership Plans</h3>
            <p className="text-gray-700">
              For resort and other membership plans:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Membership fees are non-refundable once the membership has been activated.</li>
              <li>In exceptional circumstances, we may consider partial refunds or credit toward future services at our discretion.</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Cancellation by Swar Yogaa</h3>
            <p className="text-gray-700">
              If Swar Yogaa cancels a workshop, course, or retreat:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>You will receive a full refund of all fees paid.</li>
              <li>Alternatively, you may choose to transfer your registration to another date or program of equal value.</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. How to Request a Refund</h3>
            <p className="text-gray-700">
              To request a refund:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Email your request to globalswaryoga@gmail.com</li>
              <li>Include your full name, the program you registered for, and the reason for your cancellation</li>
              <li>Refunds will be processed within 7-14 business days and will be issued using the original payment method</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Special Circumstances</h3>
            <p className="text-gray-700">
              We understand that unexpected circumstances such as medical emergencies or family crises may arise. In such cases, please contact us as soon as possible. We will evaluate these situations on a case-by-case basis and may offer alternatives such as:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Credit toward future programs</li>
              <li>Transfer to another participant</li>
              <li>Partial refund</li>
            </ul>
            <p className="text-gray-700">
              Documentation may be required for special circumstance considerations.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Contact Information</h3>
            <p className="text-gray-700">
              If you have any questions about our refund policy, please contact us at:
            </p>
            <p className="text-gray-700">
              Email: globalswaryoga@gmail.com<br />
              Phone: +91 9779006820 (11AM to 5PM)
            </p>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                Last updated: April 25, 2024
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/terms" className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              <FileText className="h-5 w-5" />
              <span>Terms and Conditions</span>
            </Link>
            <Link to="/privacy" className="flex items-center justify-center space-x-2 border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
              <Shield className="h-5 w-5" />
              <span>Privacy Policy</span>
            </Link>
          </div>
        </div>
      </div>
      
  {/* Footer provided by App layout */}
    </div>
  );
};

export default RefundPage;
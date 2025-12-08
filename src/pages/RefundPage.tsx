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
              At Swar Yoga, we strive to provide high-quality yoga, wellness, and spiritual services that exceed your expectations. We understand that circumstances may change, and you might need to cancel your registration or request a refund. This Refund Policy outlines our comprehensive guidelines for refunds, cancellations, credits, and alternative arrangements to ensure fairness for both our clients and our organization.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
              <p className="text-blue-800">
                <strong>Important:</strong> Please read this policy carefully. Our refund terms vary depending on the type of program and timing of cancellation. All refund requests must be submitted in writing via email.
              </p>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Workshop and Short-Term Course Refunds</h3>
            <p className="text-gray-700">
              Our refund policy for workshops and short-term courses (lasting less than 30 days) is based on the timing of your cancellation:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Cancellation 21+ days before start date:</strong> Full refund minus a 10% processing fee</li>
              <li><strong>Cancellation 14-20 days before start date:</strong> 75% refund (25% retained as cancellation fee)</li>
              <li><strong>Cancellation 7-13 days before start date:</strong> 50% refund (50% retained as cancellation fee)</li>
              <li><strong>Cancellation 1-6 days before start date:</strong> 25% refund (75% retained as cancellation fee)</li>
              <li><strong>Cancellation after program has started:</strong> No refund</li>
              <li><strong>No-show (no cancellation notice):</strong> No refund</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Retreat and Extended Program Refunds</h3>
            <p className="text-gray-700">
              Due to the special nature of retreat planning, advance arrangements, and limited availability, our retreat and extended program (30+ days) refund policy is as follows:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Cancellation 45+ days before retreat start date:</strong> Full refund minus 15% non-refundable deposit</li>
              <li><strong>Cancellation 30-44 days before retreat start date:</strong> 60% refund (40% retained)</li>
              <li><strong>Cancellation 15-29 days before retreat start date:</strong> 40% refund (60% retained)</li>
              <li><strong>Cancellation 8-14 days before retreat start date:</strong> 20% refund (80% retained)</li>
              <li><strong>Cancellation less than 8 days before retreat:</strong> No refund (spots are difficult to fill)</li>
              <li><strong>No-show:</strong> No refund</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Online Courses and Digital Products</h3>
            <p className="text-gray-700">
              Due to the nature of digital products and the ability to access content immediately:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Digital products with immediate access:</strong> All sales are final and non-refundable once access has been granted or download link has been sent</li>
              <li><strong>Recorded classes and video content:</strong> Non-refundable 24 hours after purchase</li>
              <li><strong>E-books and digital guides:</strong> Non-refundable once downloaded or access provided</li>
              <li><strong>Subscription services:</strong> Can be cancelled anytime, but no pro-rata refunds for partial months</li>
              <li><strong>Technical issues:</strong> If you experience technical difficulties accessing content, we will provide technical support or grant access to alternative formats at no additional cost</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Membership and Subscription Plans</h3>
            <p className="text-gray-700">
              For resort memberships, subscriptions, and ongoing service plans:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Monthly memberships:</strong> Can be cancelled anytime with 7 days written notice; pro-rata refunds not provided</li>
              <li><strong>Annual memberships:</strong> Can be cancelled within 30 days of purchase for a full refund; after 30 days, refunds are not provided unless membership has not yet been activated</li>
              <li><strong>Lifetime memberships:</strong> Generally non-refundable; exceptions may be considered for medical or extraordinary circumstances at our sole discretion</li>
              <li><strong>Partial membership transfers:</strong> May be available; contact us for details</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Cancellation Initiated by Swar Yoga</h3>
            <p className="text-gray-700">
              If Swar Yoga cancels a workshop, course, retreat, or other program due to insufficient enrollment, instructor unavailability, or circumstances beyond our control:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>You will receive a full refund of all fees paid, or</li>
              <li>You may choose to transfer your registration to another date or program of equal or greater value at no additional cost, or</li>
              <li>You may request a credit toward future services</li>
            </ul>
            <p className="text-gray-700">
              Notification of cancellation will be provided as soon as reasonably possible. If cancellation occurs within 7 days of the program start date, we will provide maximum flexibility including extended refund deadlines.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. How to Request a Refund</h3>
            <p className="text-gray-700">
              To request a refund or cancellation, please follow these steps:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Send an email to globalswaryoga@gmail.com with subject line: "Refund Request - [Your Full Name]"</li>
              <li>Include your full name, email address, phone number, and order/registration details</li>
              <li>Specify the program you registered for and the date of registration</li>
              <li>Provide the reason for your cancellation</li>
              <li>Include any relevant documentation if requesting an exception</li>
              <li>Keep a copy of your cancellation request for your records</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Refund Processing Timeline:</h4>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Refund requests are processed within 5-7 business days</li>
              <li>Refunds are issued to the original payment method used for purchase</li>
              <li>Your bank or credit card issuer may take an additional 5-10 business days to post the refund</li>
              <li>For international transactions, refunds may take 10-15 business days</li>
              <li>We will send you a confirmation email once the refund has been processed</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Special Circumstances and Exceptions</h3>
            <p className="text-gray-700">
              We recognize that life circumstances sometimes change unexpectedly. If you have a special situation, please contact us as soon as possible. We evaluate special circumstances on a case-by-case basis, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Medical emergencies or serious illness (medical documentation may be required)</li>
              <li>Family crises or bereavement</li>
              <li>Unexpected travel requirements or work emergencies</li>
              <li>Financial hardship</li>
              <li>Force majeure events (natural disasters, severe weather, etc.)</li>
            </ul>
            <p className="text-gray-700">
              For special circumstances, we may offer:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Full or partial refund (beyond standard policy)</li>
              <li>Transfer of registration to a future date with extended flexibility</li>
              <li>Credit toward future services (may exceed 100% of paid amount)</li>
              <li>Payment plan arrangements</li>
              <li>Combination of the above options</li>
            </ul>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 my-4">
              <p className="text-yellow-800">
                <strong>Documentation Request:</strong> For special circumstances involving medical or personal emergencies, we may request appropriate documentation (doctor's letter, death certificate, etc.) to process exceptions to our standard refund policy. All documentation remains confidential.
              </p>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Group and Corporate Refunds</h3>
            <p className="text-gray-700">
              Group bookings and corporate programs have specialized cancellation and refund terms that are determined on a case-by-case basis. Please contact us directly at globalswaryoga@gmail.com to discuss terms for group or corporate registrations.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Transfer of Registration</h3>
            <p className="text-gray-700">
              Instead of requesting a refund, you may be able to transfer your registration to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Another date of the same program (subject to availability)</li>
              <li>A different program of equal or greater value</li>
              <li>Another person (subject to eligibility and availability)</li>
            </ul>
            <p className="text-gray-700">
              Transfer requests should be submitted to globalswaryoga@gmail.com. A $25 transfer fee may apply (unless a refund would exceed this amount). Transfers are subject to availability and program eligibility requirements.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. Credits and Vouchers</h3>
            <p className="text-gray-700">
              In some circumstances, we may offer credits or vouchers instead of cash refunds. These credits/vouchers:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Can be applied toward any future Swar Yoga programs or services</li>
              <li>Are typically valid for 12 months from issuance</li>
              <li>May be transferred to family members or friends (subject to our approval)</li>
              <li>Must be used in full; partial use may not be possible</li>
              <li>Are non-refundable and have no cash value</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11. Disputes and Appeal Process</h3>
            <p className="text-gray-700">
              If you disagree with a refund decision or have concerns about your cancellation:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Send an appeal email to globalswaryoga@gmail.com within 15 days of the decision</li>
              <li>Include detailed reasons and any supporting documentation</li>
              <li>Include "REFUND APPEAL" in the subject line</li>
              <li>We will review your appeal and respond within 7 business days</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">12. Contact Information</h3>
            <p className="text-gray-700">
              If you have any questions about our refund policy or need to request a refund, cancellation, or special consideration, please contact us at:
            </p>
            <p className="text-gray-700">
              <strong>Swar Yoga</strong><br />
              Email: globalswaryoga@gmail.com<br />
              Phone: +91 9779006820 (11AM to 5PM IST, Monday-Friday)<br />
              Website: www.swaryoga.online
            </p>
            
            <p className="text-gray-700 mt-4">
              We aim to respond to all refund and cancellation requests within 24-48 hours during business days.
            </p>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Last updated:</strong> December 5, 2025
              </p>
              <p className="text-xs text-green-700 mt-2">
                This Refund Policy is effective immediately and applies to all registrations and purchases made through Swar Yoga. Refund terms for specific programs are determined at the time of registration. We reserve the right to update this policy at any time with notice.
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
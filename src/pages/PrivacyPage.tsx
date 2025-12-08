import React from 'react';
import { Link } from 'react-router-dom';
// Header and Footer are provided by App routes; removed local imports to avoid duplicate rendering
import PageHeader from '../components/PageHeader';
import { ArrowRight, Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white">
  {/* Header provided by App layout */}
      
      <PageHeader 
        title="Privacy Policy" 
        breadcrumbs={[{ name: 'Privacy Policy', path: '/privacy' }]}
        image="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="prose max-w-none">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800 m-0">Privacy Policy</h2>
            </div>
            
            <p className="text-gray-700">
              At Swar Yoga, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, access our mobile applications, or use our services. Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our services.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Information We Collect</h3>
            <p className="text-gray-700">
              We collect personal information in various ways, including when you voluntarily provide it to us, when it is automatically collected through your use of our services, and through third-party sources.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">1.1 Information You Provide Directly:</h4>
            <p className="text-gray-700">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Create or register an account with us</li>
              <li>Sign up for our newsletter or email updates</li>
              <li>Register for workshops, retreats, or other programs</li>
              <li>Make a purchase or payment for our services</li>
              <li>Contact us with questions, inquiries, or feedback</li>
              <li>Participate in surveys, contests, or promotions</li>
              <li>Fill out forms on our website or applications</li>
              <li>Subscribe to memberships or subscription services</li>
            </ul>
            <p className="text-gray-700">
              This information may include your name, email address, phone number, mailing address, payment information (credit card or other payment details), date of birth, gender, fitness level, health information, and demographic information. We only request information that is necessary for providing our services.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">1.2 Automatically Collected Information:</h4>
            <p className="text-gray-700">
              When you access our website or applications, we automatically collect certain information about your device and usage, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Device information (hardware model, operating system, unique device identifiers)</li>
              <li>Browser information (type, version, language preferences)</li>
              <li>IP address and geolocation data</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referring and exit pages</li>
              <li>Clicks and interactions with our services</li>
              <li>Search queries and activity logs</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. How We Use Your Information</h3>
            <p className="text-gray-700">
              We use the information we collect for legitimate business purposes and to provide, maintain, and improve our services. Specifically, we use your information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Provide and deliver our services, including workshops, retreats, and programs</li>
              <li>Process transactions and send transactional information</li>
              <li>Create and maintain your account and user profile</li>
              <li>Send administrative communications and service announcements</li>
              <li>Respond to your inquiries, comments, and requests for support</li>
              <li>Send promotional emails, newsletters, and marketing materials (with your consent)</li>
              <li>Analyze usage patterns to improve our website and services</li>
              <li>Personalize your experience and provide targeted recommendations</li>
              <li>Prevent fraudulent transactions and protect against abuse</li>
              <li>Comply with legal obligations and enforce our terms and policies</li>
              <li>Conduct research, analytics, and statistical analysis</li>
              <li>Generate aggregate, anonymized data for business purposes</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. How We Share Your Information</h3>
            <p className="text-gray-700">
              We do not sell, rent, or lease your personal information to third parties. However, we may share your information in the following circumstances:
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">3.1 Service Providers:</h4>
            <p className="text-gray-700">
              We share information with third-party service providers who perform services on our behalf, including payment processors, email service providers, hosting providers, analytics companies, and customer service platforms. These providers are contractually obligated to use your information only for the purposes we specify and to maintain the confidentiality and security of your information.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">3.2 Business Partners:</h4>
            <p className="text-gray-700">
              We may share limited information with business partners for joint programs, co-branded offerings, or strategic partnerships. Any such sharing will be done in accordance with your preferences and applicable law.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">3.3 Legal Requirements:</h4>
            <p className="text-gray-700">
              We may disclose your information when required by law or when we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others, or to comply with legal process, such as a court order or subpoena.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">3.4 Business Transfers:</h4>
            <p className="text-gray-700">
              In the event of a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will provide notice if such a change occurs.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Cookies and Tracking Technologies</h3>
            <p className="text-gray-700">
              We use cookies, web beacons, pixels, and similar tracking technologies to collect information about your browsing activities and to remember your preferences. This helps us enhance your user experience, analyze site performance, and deliver targeted content.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">4.1 Types of Cookies:</h4>
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly (login, security)</li>
              <li><strong>Performance Cookies:</strong> Collect information about how you use our site (page visits, time spent)</li>
              <li><strong>Functionality Cookies:</strong> Remember your preferences and enhance your experience</li>
              <li><strong>Marketing Cookies:</strong> Track your activities to show relevant advertisements</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">4.2 Cookie Management:</h4>
            <p className="text-gray-700">
              You can control cookie settings through your browser preferences. You can choose to accept or reject cookies, but please note that some features of our website may not function properly if you reject cookies. For more information about managing cookies, visit www.allaboutcookies.org.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Data Security</h3>
            <p className="text-gray-700">
              We implement appropriate technical, physical, and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. Our security measures include:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure authentication protocols</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Data backup and recovery procedures</li>
              <li>Employee training on data protection and privacy</li>
            </ul>
            <p className="text-gray-700">
              However, no method of transmission over the Internet or electronic storage is completely secure. While we strive to protect your information, we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Your Rights and Choices</h3>
            <p className="text-gray-700">
              Depending on your location and applicable privacy laws (including GDPR and CCPA), you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Right of Access:</strong> You have the right to request and receive a copy of the personal information we hold about you</li>
              <li><strong>Right to Rectification:</strong> You have the right to request corrections to inaccurate or incomplete information</li>
              <li><strong>Right to Erasure:</strong> You have the right to request deletion of your personal information (subject to legal obligations)</li>
              <li><strong>Right to Restrict Processing:</strong> You have the right to request restrictions on how we use your information</li>
              <li><strong>Right to Data Portability:</strong> You have the right to receive your information in a portable format</li>
              <li><strong>Right to Object:</strong> You have the right to object to certain processing of your information</li>
              <li><strong>Right to Withdraw Consent:</strong> You have the right to withdraw consent to marketing communications at any time</li>
              <li><strong>Right to Lodge a Complaint:</strong> You have the right to lodge a complaint with your local data protection authority</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">6.1 Marketing Communications:</h4>
            <p className="text-gray-700">
              You can opt out of promotional emails and marketing communications by clicking the "unsubscribe" link at the bottom of any email we send you, or by contacting us directly. Please note that even if you opt out of marketing communications, we will continue to send transactional and administrative messages.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Third-Party Links and Services</h3>
            <p className="text-gray-700">
              Our website may contain links to third-party websites, applications, and services that are not operated by us. This Privacy Policy does not apply to third-party services, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of third-party services before providing them with your personal information.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Children's Privacy</h3>
            <p className="text-gray-700">
              Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without verifiable parental consent, we will take steps to delete such information and terminate the child's account.
            </p>
            <p className="text-gray-700">
              If you are under 18 years old, you may have additional privacy rights under applicable laws. We encourage parents and guardians to monitor their children's online activities.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Data Retention</h3>
            <p className="text-gray-700">
              We retain your personal information for as long as necessary to provide our services, fulfill the purposes outlined in this Privacy Policy, and comply with legal obligations. Retention periods vary depending on the context of processing and applicable legal requirements. When information is no longer needed, we securely delete or anonymize it.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. International Data Transfers</h3>
            <p className="text-gray-700">
              If you access our services from outside India, please be aware that your information may be transferred to, processed, and stored in India or other countries. These countries may have data protection laws that differ from your country of residence. By using our services, you consent to the transfer of your information to countries other than your country of residence, which may provide a different level of data protection.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11. California Privacy Rights (CCPA)</h3>
            <p className="text-gray-700">
              If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA), including:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>The right to know what personal information is collected, used, and shared</li>
              <li>The right to delete personal information collected from you</li>
              <li>The right to opt-out of the sale of your personal information</li>
              <li>The right to non-discrimination for exercising your CCPA rights</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, please contact us at globalswaryoga@gmail.com with "CCPA Request" in the subject line.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">12. European Union Privacy Rights (GDPR)</h3>
            <p className="text-gray-700">
              If you are located in the European Union, you are protected by the General Data Protection Regulation (GDPR). We process your information only when we have a lawful basis to do so, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Your explicit consent</li>
              <li>Performance of a contract with you</li>
              <li>Compliance with legal obligations</li>
              <li>Protection of vital interests</li>
              <li>Performance of tasks in the public interest</li>
              <li>Our legitimate interests</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">13. Changes to This Privacy Policy</h3>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the updated Privacy Policy on our website and updating the "Last updated" date. Your continued use of our services following the posting of changes constitutes your acceptance of the updated Privacy Policy. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">14. Contact Us</h3>
            <p className="text-gray-700">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="text-gray-700">
              <strong>Swar Yoga</strong><br />
              Email: globalswaryoga@gmail.com<br />
              Phone: +91 9779006820 (11AM to 5PM IST)<br />
              Website: www.swaryoga.online
            </p>
            
            <p className="text-gray-700 mt-4">
              We will respond to your inquiry within 30 business days. If you are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority.
            </p>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Last updated:</strong> December 5, 2025
              </p>
              <p className="text-xs text-green-700 mt-2">
                This Privacy Policy is effective immediately and applies to all users of our website and services. We reserve the right to update this policy at any time.
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/terms" className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              <FileText className="h-5 w-5" />
              <span>Terms and Conditions</span>
            </Link>
            <Link to="/refund" className="flex items-center justify-center space-x-2 border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
              <ArrowRight className="h-5 w-5" />
              <span>Refund Policy</span>
            </Link>
          </div>
        </div>
      </div>
      
  {/* Footer provided by App layout */}
    </div>
  );
};

export default PrivacyPage;
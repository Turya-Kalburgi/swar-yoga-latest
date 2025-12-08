import React from 'react';
import { Link } from 'react-router-dom';
// Header and Footer are provided by App routes; removed local imports to avoid duplicate rendering
import PageHeader from '../components/PageHeader';
import { ArrowRight, CheckCircle, FileText, Shield } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-white">
  {/* Header provided by App layout */}
      
      <PageHeader 
        title="Terms and Conditions" 
        breadcrumbs={[{ name: 'Terms and Conditions', path: '/terms' }]}
        image="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="prose max-w-none">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800 m-0">Terms and Conditions</h2>
            </div>
            
            <p className="text-gray-700">
              Welcome to Swar Yoga. These Terms and Conditions ("Terms") govern your access to and use of our website, mobile applications, services, products, and all related content. By accessing or using Swar Yoga in any way, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our services.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
              <p className="text-blue-800">
                <strong>Important:</strong> These Terms are a legally binding agreement between you and Swar Yoga. Please read them carefully before using our services. By continuing to use our services, you indicate your acceptance of these Terms.
              </p>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Acceptance of Terms and Conditions</h3>
            <p className="text-gray-700">
              By accessing or using the Swar Yoga website, mobile applications, attending our workshops, registering for programs, purchasing products, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you are under 18 years of age, you must have parental or guardian consent to use our services. We reserve the right to modify these Terms at any time, and your continued use of our services constitutes acceptance of such modifications.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Description of Services</h3>
            <p className="text-gray-700">
              Swar Yoga provides a comprehensive range of yoga, meditation, and wellness services including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Live and recorded yoga classes and training sessions</li>
              <li>In-person workshops and seminars</li>
              <li>Yoga retreats and wellness programs</li>
              <li>Online courses and digital content</li>
              <li>Meditation and mindfulness training</li>
              <li>Spiritual guidance and consultation</li>
              <li>Health and wellness coaching</li>
              <li>Membership and subscription programs</li>
              <li>E-books, audiobooks, and digital products</li>
              <li>Merchandise and physical products</li>
            </ul>
            <p className="text-gray-700">
              Our services are provided "as is" and "as available" without warranties of any kind. While we strive to provide quality services, we make no guarantee of results.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. User Accounts and Registration</h3>
            <p className="text-gray-700">
              When creating an account with us, you are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Providing accurate, complete, and current information during registration</li>
              <li>Maintaining the confidentiality of your username and password</li>
              <li>Accepting responsibility for all activities under your account</li>
              <li>Promptly updating your information if it changes</li>
              <li>Notifying us immediately of any unauthorized access to your account</li>
            </ul>
            <p className="text-gray-700">
              We reserve the right to suspend or terminate accounts that provide false, incomplete, or misleading information. You may not use another person's account without permission. You are solely responsible for maintaining the security of your account credentials.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Payment Terms and Pricing</h3>
            <p className="text-gray-700">
              Payment for our services is required at the time specified during registration or checkout unless alternative payment arrangements have been agreed upon in writing. By providing payment information, you authorize us to charge your payment method. You agree that:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>All fees and charges are accurate</li>
              <li>You are authorized to use the payment method provided</li>
              <li>You are responsible for monitoring your account for unauthorized charges</li>
              <li>All prices are subject to change with notice</li>
              <li>We may offer promotional pricing that is subject to specific terms</li>
            </ul>
            <p className="text-gray-700">
              For details on our current pricing, please visit our website or contact us. Refund policies are detailed in our separate Refund Policy document.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Workshop and Program Registration Policies</h3>
            <p className="text-gray-700">
              Registration for all workshops, courses, and programs is on a first-come, first-served basis and subject to availability. By registering, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Comply with all program rules and requirements</li>
              <li>Attend on time and participate fully</li>
              <li>Follow the instructions of instructors and staff</li>
              <li>Respect the privacy and dignity of other participants</li>
              <li>Provide appropriate notice if you need to cancel</li>
            </ul>
            <p className="text-gray-700">
              We reserve the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Modify or reschedule programs due to insufficient enrollment</li>
              <li>Cancel programs due to instructor illness or emergencies</li>
              <li>Remove participants who violate program policies or disrupt the learning environment</li>
              <li>Postpone or cancel due to circumstances beyond our control (force majeure)</li>
              <li>Set minimum and maximum enrollment caps</li>
            </ul>
            <p className="text-gray-700">
              In the event of Swar Yoga-initiated cancellations, participants will be offered refunds or alternative dates as outlined in our Refund Policy.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Intellectual Property Rights</h3>
            <p className="text-gray-700">
              All content on the Swar Yoga website, applications, and services—including text, graphics, logos, images, audio clips, video recordings, software, and other materials—is the property of Swar Yoga, its instructors, or our content providers and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">6.1 Limited License:</h4>
            <p className="text-gray-700">
              We grant you a limited, non-exclusive, non-transferable license to access and use our content for personal, non-commercial purposes only. You may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Reproduce, distribute, or publicly display our content</li>
              <li>Modify, adapt, or create derivative works</li>
              <li>Download or store content for redistribution</li>
              <li>Use content for commercial purposes without permission</li>
              <li>Remove or alter copyright notices or proprietary markings</li>
              <li>Share login credentials or access with unauthorized persons</li>
              <li>Record classes or sessions without express written permission</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">6.2 Unauthorized Use:</h4>
            <p className="text-gray-700">
              Any unauthorized use of our content is a violation of these Terms and applicable copyright laws. We actively monitor for copyright infringement and may pursue legal action, including seeking damages and injunctive relief.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. User Conduct and Prohibited Activities</h3>
            <p className="text-gray-700">
              You agree not to use our services for any unlawful purpose or in any manner that could damage, disable, or impair our services or systems. Prohibited activities include:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Harassing, threatening, or defaming other users</li>
              <li>Distributing spam, malware, or harmful content</li>
              <li>Attempting to gain unauthorized access to accounts or systems</li>
              <li>Interfering with or disrupting services or network operations</li>
              <li>Collecting or using personal information about others without consent</li>
              <li>Engaging in illegal activities or activities that violate others' rights</li>
              <li>Impersonating another person or entity</li>
              <li>Violating any applicable laws or regulations</li>
              <li>Recording classes without permission</li>
              <li>Sharing login credentials or account access</li>
              <li>Reselling or redistributing access to our services</li>
              <li>Reverse engineering or attempting to derive our source code</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Health, Safety, and Medical Disclaimer</h3>
            <p className="text-gray-700">
              <strong>IMPORTANT DISCLAIMER:</strong> Swar Yoga services are intended for general wellness and educational purposes only. Our services are NOT a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">8.1 Medical Consultation:</h4>
            <p className="text-gray-700">
              You should always consult with a qualified healthcare professional before:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Beginning any exercise program or yoga practice</li>
              <li>Making significant changes to your diet or wellness routine</li>
              <li>Taking herbal supplements or other products</li>
              <li>Participating if you have existing medical conditions</li>
              <li>During pregnancy or postpartum recovery</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">8.2 Assumption of Risk:</h4>
            <p className="text-gray-700">
              Yoga and physical exercise involve inherent risks of injury. By participating in our programs, you voluntarily assume these risks and acknowledge that you are physically able to participate. You are responsible for knowing your body's limitations and modifying exercises as needed.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">8.3 Not Medical Treatment:</h4>
            <p className="text-gray-700">
              Yoga is not a substitute for medical treatment. While yoga may offer health benefits, Swar Yoga does not diagnose, treat, cure, or prevent any disease or medical condition. If you experience pain, dizziness, or other medical symptoms during practice, stop immediately and seek professional medical attention.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Limitation of Liability and Disclaimers</h3>
            <p className="text-gray-700">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SWAR YOGA AND ITS OFFICERS, EMPLOYEES, INSTRUCTORS, AND AGENTS SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Any direct, indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Injury or illness resulting from yoga practice or program participation</li>
              <li>Results or outcomes of using our services</li>
              <li>Unauthorized access to or use of our services</li>
              <li>Any disruption or interruption of service</li>
              <li>Loss or theft of personal property during programs</li>
              <li>Actions of other users or third parties</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">9.1 "AS IS" and "AS AVAILABLE":</h4>
            <p className="text-gray-700">
              Our services and content are provided "as is" and "as available" without any warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, or accuracy. We do not warrant that our services will be uninterrupted, error-free, or secure.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">9.2 Waiver:</h4>
            <p className="text-gray-700">
              By using our services, you acknowledge and agree that you voluntarily assume all risks associated with your participation.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. Indemnification</h3>
            <p className="text-gray-700">
              You agree to indemnify, defend, and hold harmless Swar Yoga, its officers, employees, instructors, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from or related to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Your use of our services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any applicable laws or rights of others</li>
              <li>Your actions or conduct related to our services</li>
              <li>Content you provide or post</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11. Privacy and Data Protection</h3>
            <p className="text-gray-700">
              Your privacy is important to us. Our collection and use of personal information is governed by our separate Privacy Policy, which is incorporated into these Terms by reference. By using our services, you consent to our collection and use of personal information as described in our Privacy Policy.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">12. Third-Party Links and Services</h3>
            <p className="text-gray-700">
              Our website and services may contain links to third-party websites, apps, and services. We are not responsible for the content, practices, or policies of third-party services. Your use of third-party services is governed by their terms and privacy policies. We encourage you to review the terms and policies of any third-party service before using it.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">13. Modifications to Terms and Services</h3>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time without prior notice. Modifications become effective immediately upon posting to our website. Your continued use of our services after modifications indicates your acceptance of the updated Terms. If you do not agree with modifications, you must stop using our services.
            </p>
            <p className="text-gray-700">
              We also reserve the right to modify, suspend, or discontinue our services at any time, with or without notice.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">14. Dispute Resolution and Governing Law</h3>
            <p className="text-gray-700">
              These Terms and all related matters shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. You agree to the exclusive jurisdiction of the courts located in India for any disputes arising from these Terms or your use of our services.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">14.1 Dispute Resolution Process:</h4>
            <p className="text-gray-700">
              In the event of any dispute, complaint, or claim, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>First attempt to resolve the matter through direct communication with us</li>
              <li>Submit a written complaint to globalswaryoga@gmail.com with detailed information</li>
              <li>Allow 30 days for us to respond and attempt resolution</li>
              <li>Only proceed to legal action if resolution cannot be achieved</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">15. Severability</h3>
            <p className="text-gray-700">
              If any provision of these Terms is found to be invalid, illegal, or unenforceable, such provision shall be modified to the minimum extent necessary to make it valid, or if not possible, severed. The remaining provisions shall continue in full force and effect.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">16. Entire Agreement</h3>
            <p className="text-gray-700">
              These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and Swar Yoga regarding your use of our services and supersede all prior understandings and agreements. There are no other terms, conditions, or representations except as stated herein.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">17. Waiver</h3>
            <p className="text-gray-700">
              Our failure to enforce any provision of these Terms does not constitute a waiver of that provision or any other provision. No waiver is effective unless in writing and signed by an authorized representative of Swar Yoga.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">18. Assignment</h3>
            <p className="text-gray-700">
              You may not assign, transfer, or sublicense these Terms or your rights and obligations hereunder to any third party without our express written consent. We may assign these Terms at any time without notice. Any attempted assignment by you without our consent is void.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">19. Testimonials and Success Stories</h3>
            <p className="text-gray-700">
              Any testimonials, success stories, or case studies on our website represent individual experiences and results may vary. We do not guarantee any particular results. Testimonials are not typical and may not be representative of all users' experiences. Results depend on individual effort, commitment, and numerous other factors.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">20. Contact Information and Support</h3>
            <p className="text-gray-700">
              If you have any questions about these Terms and Conditions or need support, please contact us:
            </p>
            <p className="text-gray-700">
              <strong>Swar Yoga</strong><br />
              Email: globalswaryoga@gmail.com<br />
              Phone: +91 9779006820 (11AM to 5PM IST, Monday-Friday)<br />
              Website: www.swaryoga.online
            </p>
            
            <p className="text-gray-700 mt-4">
              We aim to respond to all inquiries within 24-48 business hours.
            </p>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Last updated:</strong> December 5, 2025
              </p>
              <p className="text-xs text-green-700 mt-2">
                These Terms and Conditions are effective immediately and apply to all use of Swar Yoga's website, applications, and services. We reserve the right to update these Terms at any time with or without notice. Continued use of our services constitutes your acceptance of any updates.
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/privacy" className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              <Shield className="h-5 w-5" />
              <span>Privacy Policy</span>
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

export default TermsPage;
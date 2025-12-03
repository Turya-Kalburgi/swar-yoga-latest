import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { Award, Heart, Users, CheckCircle2 } from 'lucide-react';
// Header and Footer are provided by App routes; removed local imports to avoid duplicate rendering

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <Heart size={30} className="text-red-600" />,
      title: 'Compassion',
      description: 'We approach every student with kindness and understanding, creating a supportive environment for growth.'
    },
    {
      icon: <Award size={30} className="text-amber-600" />,
      title: 'Authenticity',
      description: 'We honor the ancient traditions of yoga while making them accessible and relevant for modern practitioners.'
    },
    {
      icon: <Users size={30} className="text-blue-600" />,
      title: 'Community',
      description: 'We foster a sense of belonging where everyone can share their journey and support each other.'
    }
  ];

  const achievements = [
    { number: '25+', label: 'Years of Experience' },
    { number: '8,000+', label: 'Students Trained' },
    { number: '20+', label: 'Certified Teachers' },
    { number: '15+', label: 'Countries Reached' }
  ];

  return (
    <>
  {/* Header provided by App layout */}
      <PageHeader 
        title="About Us" 
        breadcrumbs={[{ name: 'About', path: '/about' }]}
        image="https://i.postimg.cc/bY3PLkq7/temp-Imageq9q9-SN.avif"
      />
      
      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission & Vision</h2>
              <p className="text-gray-600 mb-6">
                At Swar Yoga, we are dedicated to preserving and sharing the transformative 
                practice of yoga through sound and breath. Our mission is to empower individuals 
                to discover their inner harmony and achieve holistic well-being through authentic yoga practices.
              </p>
              <p className="text-gray-600 mb-6">
                We envision a world where the ancient wisdom of Swar Yoga is accessible to all, 
                creating a global community of practitioners who experience deeper awareness, 
                improved health, and spiritual growth.
              </p>
              <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
                <p className="italic text-gray-700">
                  "Swar Yoga is not just a practice, but a way of life that harmonizes 
                  our inner vibrations with the universal rhythm."
                </p>
                <p className="mt-2 font-medium">- Mohan Kalburgi, Founder</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-lg overflow-hidden shadow-xl"
            >
              <img 
                src="https://i.postimg.cc/NFfcBfkC/temp-Imageu-NC5-GN.avif"
                alt="Yoga meditation" 
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://i.postimg.cc/3RfL08Hc/temp-Image-N5-TSEG.avif"
                alt="Yogacharya Mohan Kalburgi"
                className="rounded-lg shadow-xl w-full h-[600px] object-cover"
              />
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Meet Our Founder</h2>
              <h3 className="text-xl text-[#5DA25D] font-medium mb-4">Yogacharya Mohan Kalburgi</h3>
              <p className="text-gray-600 mb-6">
                With over 25 years of dedicated practice and teaching experience, Yogacharya Mohan Kalburgi 
                has transformed thousands of lives through the ancient wisdom of Swar Yoga. His journey 
                began in the sacred valleys of the Himalayas, where he learned from master practitioners.
              </p>
              <p className="text-gray-600 mb-6">
                As a renowned expert in Swar Yoga, he has conducted workshops across India and internationally, 
                bringing the transformative power of yoga to practitioners worldwide. His unique approach 
                combines traditional teachings with modern understanding, making yoga accessible to everyone.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle2 className="text-[#5DA25D] mt-1 mr-3" size={20} />
                  <p className="text-gray-600">Certified Yoga Master with international recognition</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="text-[#5DA25D] mt-1 mr-3" size={20} />
                  <p className="text-gray-600">Author of multiple books on yoga and wellness</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="text-[#5DA25D] mt-1 mr-3" size={20} />
                  <p className="text-gray-600">Featured speaker at global yoga conferences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-[#2A5654] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Over two decades of dedication to spreading the wisdom of yoga
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-2">{achievement.number}</div>
                <div className="text-gray-300">{achievement.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Swar Yoga
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="inline-block p-3 bg-red-100 rounded-full mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Join Us Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Join Our Community</h2>
          <p className="max-w-2xl mx-auto mb-8 text-green-100">
            Experience the transformative power of Swar Yoga and connect with like-minded 
            individuals on the path to wellness and inner harmony.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center px-6 py-3 bg-white text-green-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Get in Touch
          </Link>
        </div>
      </section>
  {/* Footer provided by App layout */}
    </>
  );
};

export default AboutPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock, Globe } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { blogAPI, type BlogPost } from '../utils/blogData';

const Blog: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const posts = await blogAPI.getAll();
      setBlogPosts(posts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Health', 'Education', 'Lifestyle', 'Spiritual'];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(
      language === 'en' ? 'en-US' : 
      language === 'hi' ? 'hi-IN' : 'mr-IN', 
      options
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Health':
        return 'bg-green-100 text-green-800';
      case 'Education':
        return 'bg-blue-100 text-blue-800';
      case 'Lifestyle':
        return 'bg-orange-100 text-orange-800';
      case 'Spiritual':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLanguageText = (lang: 'en' | 'hi' | 'mr') => {
    switch (lang) {
      case 'en': return 'English';
      case 'hi': return 'हिंदी';
      case 'mr': return 'मराठी';
      default: return 'English';
    }
  };

  const translations = {
    pageTitle: {
      en: 'Yoga & Wellness Blog',
      hi: 'योग और स्वास्थ्य ब्लॉग',
      mr: 'योग आणि आरोग्य ब्लॉग'
    },
    breadcrumb: {
      en: 'Blog',
      hi: 'ब्लॉग',
      mr: 'ब्लॉग'
    },
    featuredPost: {
      en: 'Featured Post',
      hi: 'विशेष लेख',
      mr: 'विशेष लेख'
    },
    readFullArticle: {
      en: 'Read Full Article',
      hi: 'पूरा लेख पढ़ें',
      mr: 'संपूर्ण लेख वाचा'
    },
    welcomeTitle: {
      en: 'Welcome to Our Wellness Blog',
      hi: 'हमारे स्वास्थ्य ब्लॉग में आपका स्वागत है',
      mr: 'आमच्या आरोग्य ब्लॉगमध्ये आपले स्वागत आहे'
    },
    welcomeText: {
      en: 'Dive deep into the ancient wisdom of Swar Yoga and discover practical insights for modern living. Our blog features authentic teachings from Yogacharya Mohan Kalburgi, combining traditional knowledge with contemporary wellness practices to help you achieve optimal health and inner harmony.',
      hi: 'स्वर योग के प्राचीन ज्ञान में गहराई से उतरें और आधुनिक जीवन के लिए व्यावहारिक अंतर्दृष्टि प्राप्त करें। हमारा ब्लॉग योगाचार्य मोहन कालबुर्गी के प्रामाणिक शिक्षाओं को प्रस्तुत करता है, जो आपको इष्टतम स्वास्थ्य और आंतरिक सद्भाव प्राप्त करने में मदद करने के लिए पारंपरिक ज्ञान को समकालीन स्वास्थ्य प्रथाओं के साथ जोड़ता है।',
      mr: 'स्वर योगाच्या प्राचीन ज्ञानात खोलवर जा आणि आधुनिक जीवनासाठी व्यावहारिक अंतर्दृष्टी शोधा. आमचा ब्लॉग योगाचार्य मोहन कालबुर्गी यांच्या प्रामाणिक शिकवणी सादर करतो, जे तुम्हाला उत्तम आरोग्य आणि अंतर्गत सुसंवाद मिळवण्यास मदत करण्यासाठी पारंपारिक ज्ञान आणि समकालीन आरोग्य पद्धतींचे संयोजन करतात.'
    },
    comingSoonTitle: {
      en: 'More Articles Coming Soon',
      hi: 'जल्द ही और अधिक लेख आ रहे हैं',
      mr: 'लवकरच अधिक लेख येत आहेत'
    },
    comingSoonText: {
      en: "We're working on bringing you more insightful articles about yoga, meditation, breathing techniques, and holistic wellness. Stay tuned for regular updates from our experienced practitioners.",
      hi: 'हम आपके लिए योग, ध्यान, श्वास तकनीक और समग्र स्वास्थ्य के बारे में अधिक अंतर्दृष्टिपूर्ण लेख लाने पर काम कर रहे हैं। हमारे अनुभवी अभ्यासकर्ताओं से नियमित अपडेट के लिए बने रहें।',
      mr: 'आम्ही तुमच्यासाठी योग, ध्यान, श्वास तंत्र आणि सर्वांगीण आरोग्याबद्दल अधिक अंतर्दृष्टीपूर्ण लेख आणण्यासाठी कार्यरत आहोत. आमच्या अनुभवी व्यावसायिकांकडून नियमित अपडेट्ससाठी वाट पाहत रहा.'
    },
    exploreWorkshops: {
      en: 'Explore Our Workshops',
      hi: 'हमारे वर्कशॉप्स देखें',
      mr: 'आमचे वर्कशॉप एक्सप्लोर करा'
    },
    subscribeUpdates: {
      en: 'Subscribe for Updates',
      hi: 'अपडेट के लिए सदस्यता लें',
      mr: 'अपडेट्ससाठी सबस्क्राइब करा'
    },
    newsletterTitle: {
      en: 'Stay Updated with Swar Yoga',
      hi: 'स्वर योग के साथ अपडेट रहें',
      mr: 'स्वर योगासह अपडेट रहा'
    },
    newsletterText: {
      en: 'Get the latest yoga tips, wellness insights, and workshop updates delivered directly to your inbox.',
      hi: 'नवीनतम योग टिप्स, स्वास्थ्य अंतर्दृष्टि और वर्कशॉप अपडेट सीधे अपने इनबॉक्स में प्राप्त करें।',
      mr: 'नवीनतम योग टिप्स, आरोग्य अंतर्दृष्टी आणि वर्कशॉप अपडेट्स थेट तुमच्या इनबॉक्समध्ये मिळवा.'
    },
    emailPlaceholder: {
      en: 'Enter your email',
      hi: 'अपना ईमेल दर्ज करें',
      mr: 'तुमचा ईमेल प्रविष्ट करा'
    },
    subscribe: {
      en: 'Subscribe',
      hi: 'सदस्यता लें',
      mr: 'सबस्क्राइब करा'
    }
  };

  return (
    <div className="pt-16">
  {/* Header provided by App layout */}
      <PageHeader 
        title={translations.pageTitle[language]} 
        breadcrumbs={[{ name: translations.breadcrumb[language], path: '/blog' }]}
        image="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg"
      />

      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Language Selector */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            {(['en', 'hi', 'mr'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  language === lang
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getLanguageText(lang)}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full"
            >
              <div className="relative h-48">
                <img
                  src={post.image}
                  alt={post.title[language]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {post.title[language]}
                </h2>
                
                <p className="text-gray-600 mb-4 flex-1">
                  {post.excerpt[language]}
                </p>
                
                <div className="mt-auto">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User size={16} className="mr-1" />
                    <span className="mr-4">{post.author}</span>
                    <Calendar size={16} className="mr-1" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                  >
                    {translations.readFullArticle[language]}
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* About This Blog */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 text-center mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{translations.welcomeTitle[language]}</h3>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {translations.welcomeText[language]}
          </p>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center py-12 bg-white rounded-lg shadow-md"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">{translations.comingSoonTitle[language]}</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {translations.comingSoonText[language]}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/workshops"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              {translations.exploreWorkshops[language]}
            </Link>
            <Link
              to="/contact"
              className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg transition-colors"
            >
              {translations.subscribeUpdates[language]}
            </Link>
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 bg-green-600 rounded-lg p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">{translations.newsletterTitle[language]}</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            {translations.newsletterText[language]}
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder={translations.emailPlaceholder[language]}
              className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
            />
            <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-r-lg transition-colors">
              {translations.subscribe[language]}
            </button>
          </div>
        </motion.div>
      </div>
  {/* Footer provided by App layout */}
    </div>
  );
};

export default Blog;
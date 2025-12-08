// Blog data API with server-first pattern

interface BlogPost {
  id: string;
  title: {
    en: string;
    hi: string;
    mr: string;
  };
  excerpt: {
    en: string;
    hi: string;
    mr: string;
  };
  author: string;
  date: string;
  readTime: {
    en: string;
    hi: string;
    mr: string;
  };
  image: string;
  slug: string;
  category: string;
}

// Default sample blog posts for fallback
const defaultBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: {
      en: 'Mastering Sleep Postures for Better Health with Swar Yoga',
      hi: 'स्वर योग के साथ बेहतर स्वास्थ्य के लिए नींद की मुद्राओं में महारत हासिल करना',
      mr: 'स्वर योगासह उत्तम आरोग्यासाठी झोपेच्या मुद्रांमध्ये प्रावीण्य मिळवणे'
    },
    excerpt: {
      en: 'Discover how Swar Yoga provides insights into optimal sleep positioning for enhanced health and well-being.',
      hi: 'जानें कैसे स्वर योग बेहतर स्वास्थ्य और कल्याण के लिए सर्वोत्तम नींद की स्थिति के बारे में अंतर्दृष्टि प्रदान करता है।',
      mr: 'स्वर योग कसे उत्तम आरोग्य आणि कल्याणासाठी झोपेच्या स्थितीबद्दल अंतर्दृष्टी देतो हे शोधा.'
    },
    author: 'Yogacharya Mohan Kalburgi',
    date: '2024-04-21',
    readTime: {
      en: '8 min read',
      hi: '8 मिनट पढ़ें',
      mr: '8 मिनिट वाचा'
    },
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
    slug: 'sleep-postures-swar-yoga',
    category: 'Health'
  },
  {
    id: '2',
    title: {
      en: 'The Ancient Science of Breath: How Swar Yoga Transforms Your Life',
      hi: 'श्वास का प्राचीन विज्ञान: कैसे स्वर योग आपके जीवन को बदलता है',
      mr: 'श्वासाचे प्राचीन विज्ञान: स्वर योग तुमचे जीवन कसे बदलते'
    },
    excerpt: {
      en: 'Explore the profound principles of Swar Yoga and how ancient yogic breathing techniques can revolutionize your physical and mental health.',
      hi: 'स्वर योग के गहन सिद्धांतों की खोज करें और कैसे प्राचीन योगिक श्वास तकनीकें आपके शारीरिक और मानसिक स्वास्थ्य में क्रांति ला सकती हैं।',
      mr: 'स्वर योगाच्या गहन तत्त्वांचा शोध घ्या आणि कसे प्राचीन योगिक श्वास तंत्र तुमच्या शारीरिक आणि मानसिक आरोग्यात क्रांती आणू शकतात.'
    },
    author: 'Yogacharya Mohan Kalburgi',
    date: '2024-04-15',
    readTime: {
      en: '10 min read',
      hi: '10 मिनट पढ़ें',
      mr: '10 मिनिट वाचा'
    },
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
    slug: 'ancient-science-breath',
    category: 'Wellness'
  }
];

export const blogAPI = {
  async getAll(): Promise<BlogPost[]> {
    try {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://api.swaryoga.online/api');
      const response = await fetch(`${apiUrl}/blog-posts`);
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      const data = await response.json();
      return Array.isArray(data) ? data : data.data || defaultBlogPosts;
    } catch (error) {
      console.warn('Error fetching blog posts from server, using defaults:', error);
      return defaultBlogPosts;
    }
  },

  async create(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    try {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://api.swaryoga.online/api');
      const response = await fetch(`${apiUrl}/blog-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      if (!response.ok) throw new Error('Failed to create blog post');
      return await response.json();
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  async update(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://api.swaryoga.online/api');
      const response = await fetch(`${apiUrl}/blog-posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      if (!response.ok) throw new Error('Failed to update blog post');
      return await response.json();
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://api.swaryoga.online/api');
      const response = await fetch(`${apiUrl}/blog-posts/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete blog post');
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }
};

export type { BlogPost };

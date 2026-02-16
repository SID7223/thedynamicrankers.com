import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // This data object must match the slugs in Blog.tsx
  const postData: Record<string, any> = {
    'ai-powered-crms-revolutionizing-sales': {
      title: 'How AI-Powered CRMs are Revolutionizing Sales in 2025',
      date: 'January 10, 2026',
      category: 'CRM Solutions',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
      content: `AI-powered CRMs have transitioned from futuristic concepts to essential business tools. In 2025, the gap between businesses using AI and those using traditional methods has widened significantly.

      Predictive analytics allow sales teams to prioritize leads based on the likelihood of conversion, while automated lead scoring ensures no high-value opportunity is missed. By analyzing historical data and real-time interactions, AI can suggest the best time to contact a prospect and even recommend specific talking points.

      Key advancements include:
      - Real-time sentiment analysis during sales calls.
      - Automated follow-up sequences that adapt to user responses.
      - Deep integration with social media intent signals.`
    },
    'future-of-seo-user-intent': {
      title: 'The Future of SEO: Beyond Keywords to User Intent',
      date: 'December 28, 2025',
      category: 'SEO Services',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
      content: `The days of ranking purely through keyword frequency are over. Search engines like Google now utilize advanced machine learning to understand the "why" behind a search query.

      User Intent optimization involves categorizing content into Informational, Navigational, Transactional, or Commercial Investigation. If a user searches for "best CRM tools," they are looking for a comparison, not a single product landing page. Matching your content structure to these intent patterns is the secret to ranking in 2026.

      Focus areas for modern SEO:
      - Topical authority and content clustering.
      - Core Web Vitals and mobile-first responsiveness.
      - High-quality, original research and data-driven insights.`
    },
    'web-design-trends-2025': {
      title: '7 High-Converting Web Design Trends for Service Agencies',
      date: 'December 15, 2025',
      category: 'Web Development',
      image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800',
      content: `Web design in 2025 is defined by "Human-Centric Minimalism." It’s not just about how a site looks, but how it feels to interact with. 

      Micro-interactions—small animations that happen when a user scrolls or clicks—provide immediate feedback and keep users engaged. Furthermore, Bento-grid layouts have become the standard for showcasing services in a clean, digestible format.

      Top trends to implement:
      - Dark mode as a default toggle.
      - Ultra-personalized user journeys based on browsing history.
      - Immersive 3D elements that don't compromise page speed.`
    },
    'maximizing-roi-multi-channel': {
      title: 'Maximizing ROI: Why Multi-Channel Marketing is Mandatory',
      date: 'November 30, 2025',
      category: 'Digital Marketing',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      content: `The modern consumer interacts with a brand across multiple touchpoints before making a purchase. Relying solely on Facebook Ads or Google SEO is a high-risk strategy. 

      Multi-channel marketing creates a unified brand presence. By synchronizing your messaging across Email, Social Media, and Search, you increase your conversion rate through repeated, consistent exposure. This strategy ensures that even if one platform changes its algorithm, your business remains stable and visible.

      How to synchronize your channels:
      - Use retargeting pixels to follow visitors across platforms.
      - Maintain a consistent visual identity and tone of voice.
      - Centralize your data to track the customer journey from first click to final sale.`
    }
  };

  const post = postData[slug || ''];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | The Dynamic Rankers</title>
        <meta name="description" content={post.content.substring(0, 160).replace(/
/g, " ")} />
        <meta property="og:title" content={`${post.title} | The Dynamic Rankers`} />
        <meta property="og:description" content={post.content.substring(0, 160).replace(/
/g, " ")} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <main className="pt-32 pb-20">
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
            >
              <Link to="/blog" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium mb-10 group">
                <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>

              <header className="mb-12">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wider">{post.category}</span>
                  <time className="text-gray-500 dark:text-gray-400 font-medium">{post.date}</time>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8">{post.title}</h1>
              </header>

              <div className="relative h-[300px] md:h-[500px] w-full mb-16 rounded-3xl overflow-hidden shadow-2xl">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-line text-lg leading-relaxed">
                {post.content}
              </div>

              <div className="mt-16 p-8 bg-blue-50 dark:bg-gray-800 rounded-3xl text-center border border-blue-100 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to implement these strategies?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Our team specializes in transforming these trends into real growth for your business.</p>
                <Link to="/book-a-call-meeting" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20">
                  Book A Strategy Session
                </Link>
              </div>
            </motion.div>
          </article>
        </main>
      </div>
    </>
  );
};

export default BlogPost;

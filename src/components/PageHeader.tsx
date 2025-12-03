import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface Breadcrumb {
  name: string;
  path: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  image?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs, image }) => {
  return (
    <div className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={image || "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{title}</h1>
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-white/80">
            <Link to="/" className="flex items-center hover:text-white transition-colors">
              <Home size={16} className="mr-2" />
              Home
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <ChevronRight size={16} className="mx-2" />
                <Link 
                  to={crumb.path}
                  className={`hover:text-white transition-colors ${
                    index === breadcrumbs.length - 1 ? 'text-white font-medium' : ''
                  }`}
                >
                  {crumb.name}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
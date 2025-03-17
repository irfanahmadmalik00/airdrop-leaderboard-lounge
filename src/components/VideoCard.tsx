
import { useState } from 'react';
import { Play, Clock } from 'lucide-react';
import { Video } from '@/lib/data';

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <a 
      href={video.videoUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block"
    >
      <div 
        className="glass-card rounded-xl overflow-hidden hover-effect"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="w-full h-48 object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-14 h-14 rounded-full bg-crypto-green/90 flex items-center justify-center">
              <Play className="w-6 h-6 text-crypto-black fill-crypto-black ml-1" />
            </div>
          </div>
          <div className="absolute bottom-3 right-3 bg-crypto-black/80 text-xs py-1 px-2 rounded">
            {video.category}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">{video.description}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatDate(video.dateAdded)}</span>
            </div>
            <div>{formatViews(video.views)} views</div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default VideoCard;

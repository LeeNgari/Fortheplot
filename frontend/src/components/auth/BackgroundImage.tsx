
import React, { useState, useEffect } from 'react';

const backgroundImages = [
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop',
];

const BackgroundImage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [nextImageIndex, setNextImageIndex] = useState(2);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % backgroundImages.length);
        setTransitioning(false);
      }, 2000);
    }, 8000);

    return () => clearInterval(interval);
  }, [nextImageIndex]);

  return (
    <div className="absolute inset-0">
      <div 
        className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${transitioning ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%), url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'opacity 2s ease-in-out',
        }}
      />
      
      <div 
        className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${transitioning ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%), url(${backgroundImages[nextImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'opacity 2s ease-in-out',
        }}
      />
    </div>
  );
};

export default BackgroundImage;

import React, { useRef } from 'react';
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import Offers from '../Components/Offers/Offers';
import NewCollections from '../Components/NewCollections/NewCollections';
import NewsLetter from '../Components/NewsLetter/NewsLetter';

const Home = () => {
  const newCollectionsRef = useRef(null); // Reference to NewCollections section

  // Function to scroll to NewCollections
  const scrollToNewCollections = () => {
    newCollectionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <Hero scrollToNewCollections={scrollToNewCollections} />
      <Popular />
      <Offers />

      {/* Attach ref to NewCollections */}
      <div ref={newCollectionsRef}>
        <NewCollections />
      </div>

      <NewsLetter />
    </div>
  );
};

export default Home;

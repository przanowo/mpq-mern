import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const Meta: React.FC<MetaProps> = ({
  title = 'MiniParfumQueen',
  description = 'Explore the best perfumes at the best prices!',
  keywords = 'parfum, perfume, parfumuri, parfumuri ieftine, parfumuri originale, parfumuri de dama, parfumuri de barbati, parfumuri de lux, parfumuri de firma, parfumuri online, parfumuri reduceri, parfumuri promotii, parfumuri ieftine online, parfumuri originale online, parfumuri de dama online, parfumuri de barbati online, parfumuri de lux online, parfumuri de firma online, parfumuri reduceri online, parfumuri promotii online',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
};

export default Meta;

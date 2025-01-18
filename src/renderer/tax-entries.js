import React from 'react';
import { createRoot } from 'react-dom/client';
import TaxEntriesList from '../components/TaxEntriesList';
import Layout from '../components/Layout';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Layout>
        <TaxEntriesList />
    </Layout>
  );
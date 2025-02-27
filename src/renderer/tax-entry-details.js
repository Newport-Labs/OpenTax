import React from 'react';
import { createRoot } from 'react-dom/client';
import TaxEntryDetails from '../components/TaxDetails';
import Layout from '../components/Layout';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Layout>
        <TaxEntryDetails />
    </Layout>
  );
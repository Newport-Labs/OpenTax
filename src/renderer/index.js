import React from 'react';
import { createRoot } from 'react-dom/client';
import CompanyForm from '../components/CompanyForm';
import Layout from '../components/Layout';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Layout>
        <CompanyForm />
    </Layout>
  );
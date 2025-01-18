import React from 'react';
import { createRoot } from 'react-dom/client';
import Layout from '../components/Layout';
import FinancialForm from '../components/FinancialForm';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Layout>
    <FinancialForm />
  </Layout>
);
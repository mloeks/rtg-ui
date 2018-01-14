import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PermissionDenied = () => (
  <main className="content">
    <Header />
    <section className="page-content">
      <h1>403</h1>
      <h3>(Permission Denied)</h3>
    </section>
    <Footer />
  </main>
);

export default PermissionDenied;

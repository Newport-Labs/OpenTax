import React, { useState, useEffect } from 'react';
import Dexie from 'dexie';
import { jsPDF } from 'jspdf';
import ButtonBack from './ButtonBack';

const db = new Dexie('CompanyManager');
db.version(2).stores({
    companies: '++id, name, address, tax_id',
    financialData: '++id, companyId, title, totalVenit, rulajCont711, totalCheltuieli, contSold741, chImpozit691, ct635Nedeductibil, ct623Nedeductibil, ct658Nedeductibil, ct681Nedeductibil, ct6022Nedeductibil, declaratAnterior, sponsorizare, impozitDeclarat, ctRulaj623, rulaj691'
});

function TaxEntryDetails() {
    const [entry, setEntry] = useState(null);
    const [company, setCompany] = useState(null);

    // Get IDs from URL
    const urlParams = new URLSearchParams(window.location.search);
    const entryId = parseInt(urlParams.get('entryId'));
    const companyId = parseInt(urlParams.get('companyId'));

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const entryData = await db.financialData.get(entryId);
            const companyData = await db.companies.get(companyId);
            setEntry(entryData);
            setCompany(companyData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const generatePDF = async () => {
        if (!entry || !company) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // Company Header
        doc.setFontSize(20);
        doc.text('Registru Evidenta Fiscala', pageWidth / 2, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.text(company.name, pageWidth / 2, 30, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Tax ID: ${company.tax_id}`, 20, 40);
        doc.text(`Address: ${company.address}`, 20, 48);
        doc.text(`Period: ${entry.title}`, 20, 56);

        let yPos = 70;

        // Financial Data Sections
        const addSection = (title, items) => {
            doc.setFontSize(14);
            doc.text(title, 20, yPos);
            yPos += 8;
            
            doc.setFontSize(10);
            items.forEach(([label, value]) => {
                doc.text(`${label}: ${value.toLocaleString('ro-RO')} RON`, 25, yPos);
                yPos += 7;
            });
            yPos += 5;
        };

        // Basic Income and Expenses
        addSection('Venituri și Cheltuieli', [
            ['Total Venit', entry.totalVenit],
            ['Venit Impozabil', entry.venitImpozabil],
            ['Total Cheltuieli', entry.totalCheltuieli],
            ['Profit Contabil', entry.profitContabil]
        ]);

        // Tax Calculations
        addSection('Calcul Impozit', [
            ['Baza Impozabila', entry.bazaImpozabila],
            ['Impozit 16%', entry.impozit16],
            ['Impozit de Achitat', entry.impozitAchitat],
            ['Impozit Final', entry.impozitPlata2]
        ]);

        // Protocol Calculations
        addSection('Protocol', [
            ['Total Rulaj', entry.totalRulaj],
            ['Protocol Deductibil', entry.protocolDed],
            ['Protocol Inregistrat', entry.protocolInreg],
            ['Protocol Nedeductibil', entry.protocolNed]
        ]);

        // Add generation date
        doc.setFontSize(10);
        const dateStr = new Date().toLocaleDateString('ro-RO');
        doc.text(`Generated: ${dateStr}`, 20, 280);
        doc.text('Powered by OpenTax', pageWidth - 20, 280, { align: 'right' });
        doc.text('Find us on GitHub', pageWidth - 20, 285, { align: 'right' });

        // Save PDF
        doc.save(`${company.name}_${entry.title}_tax_report.pdf`);
    };

    if (!entry || !company) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>

                <ButtonBack Label="Inapoi" />
                <button 
                    onClick={generatePDF}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Genereaza PDF
                </button>
            </div>

            <h1>{company.name} - {entry.title}</h1>
            
            <div style={{ marginTop: '20px' }}>
                <h2>Venituri și Cheltuieli</h2>
                <div style={{ marginLeft: '20px' }}>
                    <p>Total Venit: {entry.totalVenit.toLocaleString('ro-RO')} RON</p>
                    <p>Venit Impozabil: {entry.venitImpozabil.toLocaleString('ro-RO')} RON</p>
                    <p>Total Cheltuieli: {entry.totalCheltuieli.toLocaleString('ro-RO')} RON</p>
                    <p>Profit Contabil: {entry.profitContabil.toLocaleString('ro-RO')} RON</p>
                </div>

                <h2>Calcul Impozit</h2>
                <div style={{ marginLeft: '20px' }}>
                    <p>Baza Impozabila: {entry.bazaImpozabila.toLocaleString('ro-RO')} RON</p>
                    <p>Impozit 16%: {entry.impozit16.toLocaleString('ro-RO')} RON</p>
                    <p>Impozit de Achitat: {entry.impozitAchitat.toLocaleString('ro-RO')} RON</p>
                    <p>Impozit Final: {entry.impozitPlata2.toLocaleString('ro-RO')} RON</p>
                </div>

                <h2>Protocol</h2>
                <div style={{ marginLeft: '20px' }}>
                    <p>Total Rulaj: {entry.totalRulaj.toLocaleString('ro-RO')} RON</p>
                    <p>Protocol Deductibil: {entry.protocolDed.toLocaleString('ro-RO')} RON</p>
                    <p>Protocol Inregistrat: {entry.protocolInreg.toLocaleString('ro-RO')} RON</p>
                    <p>Protocol Nedeductibil: {entry.protocolNed.toLocaleString('ro-RO')} RON</p>
                </div>
            </div>
        </div>
    );
}

export default TaxEntryDetails;
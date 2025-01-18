import React, { useState, useEffect } from 'react';
import Dexie from 'dexie';
import ButtonBack from './ButtonBack';

const db = new Dexie('CompanyManager');
db.version(2).stores({
    companies: '++id, name, address, tax_id',
    financialData: '++id, companyId, title, totalVenit, rulajCont711, totalCheltuieli, contSold741, chImpozit691, ct635Nedeductibil, ct623Nedeductibil, ct658Nedeductibil, ct681Nedeductibil, ct6022Nedeductibil, declaratAnterior, sponsorizare, impozitDeclarat, ctRulaj623, rulaj691'
});

function TaxEntriesList() {
    const [entries, setEntries] = useState([]);
    const [companyName, setCompanyName] = useState('');
    
    // Get company ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = parseInt(urlParams.get('companyId'));

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        try {
            const company = await db.companies.get(companyId);
            setCompanyName(company.name);
            
            const entries = await db.financialData
                .where('companyId')
                .equals(companyId)
                .toArray();
            setEntries(entries);
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    };

    const openEntryDetails = (entryId) => {
        window.location.href = `tax-entry-details.html?entryId=${entryId}&companyId=${companyId}`;
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <ButtonBack Label="Inapoi" />
            <h1 className="text-3xl font-bold mb-6">Lista Taxe - <span className='text-blue-800'> {companyName} </span> </h1>
            <button 
                onClick={() => window.location.href = `financial.html?companyId=${companyId}`}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                Adauga Date Financiare
            </button>

            <div className="tax-entries-list">
                {entries.map(entry => (
                    <div 
                        key={entry.id}
                        className="tax-entry-item"
                        onClick={() => openEntryDetails(entry.id)}
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            marginBottom: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        <strong>{entry.title}</strong><br />
                        Venit Total: {entry.totalVenit.toLocaleString('ro-RO')} RON<br />
                        Profit Contabil: {entry.profitContabil.toLocaleString('ro-RO')} RON<br />
                        Impozit Final: {entry.impozitPlata2?.toLocaleString('ro-RO')} RON
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TaxEntriesList;
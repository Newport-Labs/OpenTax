import React, { useState, useEffect } from 'react';
import Dexie from 'dexie';
import FormFields from './FormFields';
import ButtonBack from './ButtonBack';

// Database setup
const db = new Dexie('CompanyManager');
db.version(2).stores({
    companies: '++id, name, address, tax_id',
    financialData: '++id, companyId, title, totalVenit, rulajCont711, totalCheltuieli, contSold741, chImpozit691, ct635Nedeductibil, ct623Nedeductibil, ct658Nedeductibil, ct681Nedeductibil, ct6022Nedeductibil, declaratAnterior, sponsorizare, impozitDeclarat, ctRulaj623, rulaj691'
});

function FinancialForm() {
    const [entries, setEntries] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        totalVenit: 0,
        rulajCont711: 0,
        totalCheltuieli: 0,
        contSold741: 0,
        chImpozit691: 0,
        ct635Nedeductibil: 0,
        ct623Nedeductibil: 0,
        ct658Nedeductibil: 0,
        ct681Nedeductibil: 0,
        ct6022Nedeductibil: 0,
        declaratAnterior: 0,
        sponsorizare: 0,
        impozitDeclarat: 0,
        ctRulaj623: 0,
        rulaj691: 0
    });

    // Get company ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = parseInt(urlParams.get('companyId'));

    useEffect(() => {
        loadFinancialEntries();
    }, []);

    const calculateFields = (data) => {
        const venitImpozabil = Number(data.totalVenit) + Number(data.rulajCont711);
        const profitContabil = Number(data.totalVenit) - Number(data.rulajCont711) - Number(data.totalCheltuieli) - Number(data.contSold741);
        const bazaImpozabila = profitContabil + 
            Number(data.chImpozit691) + 
            Number(data.ct635Nedeductibil) + 
            Number(data.ct623Nedeductibil) + 
            Number(data.ct658Nedeductibil) + 
            Number(data.ct681Nedeductibil) + 
            Number(data.ct6022Nedeductibil);
        const impozit16 = bazaImpozabila * 0.16;
        const impozitAchitat = impozit16 - Number(data.declaratAnterior);
        const impozitPlata1 = impozitAchitat - Number(data.sponsorizare);
        const impozitPlata2 = impozitPlata1 - Number(data.impozitDeclarat);
        
        // Protocol calculations
        const totalRulaj = profitContabil + Number(data.ctRulaj623) + Number(data.rulaj691);
        const protocolDed = totalRulaj * 0.02;
        const protocolInreg = Number(data.ctRulaj623);
        const protocolNed = Math.max(0, protocolInreg - protocolDed);

        const to_return = {
            ...data,
            venitImpozabil,
            profitContabil,
            bazaImpozabila,
            impozit16,
            impozitAchitat,
            impozitPlata1,
            impozitPlata2,
            totalRulaj,
            protocolDed,
            protocolInreg,
            protocolNed
        };

        return to_return;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const calculatedData = calculateFields(formData);
        try {
            await db.financialData.add({
                ...calculatedData,
                companyId
            });
            setShowForm(false);
            setFormData({
                title: '',
                totalVenit: 0,
                // ... reset other fields
            });
            await loadFinancialEntries();
        } catch (error) {
            console.error('Error saving entry:', error);
            alert('Error saving entry');
        }
    };

    const loadFinancialEntries = async () => {
        try {
            const entries = await db.financialData
                .where('companyId')
                .equals(companyId)
                .toArray();
            console.log(entries)
            setEntries(entries);
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    };

return (
    <div className="financial-form">
        <ButtonBack Label="Inapoi" />

        <FormFields calculateFields={calculateFields} handleInputChange={handleInputChange} handleSubmit={handleSubmit} formData={formData} />
    </div>
);
}

export default FinancialForm;
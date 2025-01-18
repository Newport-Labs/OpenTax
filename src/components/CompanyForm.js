import React, { useState, useEffect } from 'react';
import Dexie from 'dexie';

const CompanyForm = () => {
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        tax_id: ''
    });

    // Database setup
    const db = new Dexie('CompanyManager');
    db.version(2).stores({
        companies: '++id, name, address, tax_id',
        financialData: '++id, companyId, title, totalVenit, rulajCont711, totalCheltuieli, contSold741, chImpozit691, ct635Nedeductibil, ct623Nedeductibil, ct658Nedeductibil, ct681Nedeductibil, ct6022Nedeductibil, declaratAnterior, sponsorizare, impozitDeclarat, ctRulaj623, rulaj691'
    });

    useEffect(() => {
        loadCompanies();
    }, []);

    const handleDelete = async (event, companyId) => {
        event.stopPropagation();
        if (window.confirm('Sigur vrei sa stergi aceasta firma?')) {
            try {
                await db.companies.delete(companyId);
                await loadCompanies();
            } catch (error) {
                console.error('Error deleting company:', error);
            }
        }
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
        
        if (!formData.name || !formData.address || !formData.tax_id) {
            alert('Please fill in all fields');
            return;
        }

        try {
            await db.companies.add({
                name: formData.name,
                address: formData.address,
                tax_id: formData.tax_id
            });

            // Clear form
            setFormData({
                name: '',
                address: '',
                tax_id: ''
            });

            // Refresh list
            await loadCompanies();
        } catch (error) {
            alert('Error adding company');
            console.error(error);
        }
    };

    const loadCompanies = async () => {
        try {
            const companiesData = await db.companies.toArray();
            setCompanies(companiesData);
        } catch (error) {
            console.error('Error loading companies:', error);
        }
    };

    function openFinancialData(companyId) {
        window.location.href = `tax-entries.html?companyId=${companyId}`;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Firma</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Companie Noua</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Nume Firma:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium mb-1">
                            Adresa:
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="tax_id" className="block text-sm font-medium mb-1">
                            CUI/CIF:
                        </label>
                        <input
                            type="text"
                            id="tax_id"
                            name="tax_id"
                            value={formData.tax_id}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Adauga
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Lista Firme</h2>
                <div className="space-y-3">
                    {companies.map(company => (
                        <div 
                            key={company.id}
                            onClick={() => openFinancialData(company.id)}
                            className="p-4 border rounded cursor-pointer hover:bg-gray-50"
                        >
                            <div className="flex justify-between items-center">
                                <strong className="block text-lg">{company.name}</strong>
                                <span className="block text-gray-600">Adresa: {company.address}</span>
                                <span className="block text-gray-600">CUI/CIF: {company.tax_id}</span>
                                <button 
                                    onClick={(event) => handleDelete(event, company.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                     Sterge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompanyForm;
import React from 'react';
import ButtonBack from './ButtonBack';

// Input field configurations grouped by sections
const FIELD_CONFIG = {
    basicInfo: {
        title: 'Basic Information',
        fields: {
            title: {
                label: 'Title (e.g., TRIM 1 AN 2024)',
                type: 'text',
                required: true
            }
        }
    },
    baseIncomeExpenses: {
        title: 'VENITURI SI CHELTUIELI DE BAZA',
        fields: {
            totalVenit: {
                label: 'TOTAL VENIT',
                type: 'number',
                required: true,
                step: '0.01'
            },
            rulajCont711: {
                label: 'RULAJ CONT 711',
                type: 'number',
                required: true,
                step: '0.01'
            },
            venitImpozabil: {
                label: 'VENIT IMPOZABIL',
                type: 'number',
                readOnly: true,
                calculated: true
            },
            totalCheltuieli: {
                label: 'TOTAL CHELTUIELI',
                type: 'number',
                required: true,
                step: '0.01'
            },
            contSold741: {
                label: 'CONT SOLD 741',
                type: 'number',
                required: true,
                step: '0.01'
            },
            profitContabil: {
                label: 'PROFIT CONTABIL',
                type: 'number',
                readOnly: true,
                calculated: true
            }
        }
    },
    nonDeductibleExpenses: {
        title: 'CHELTUIELI NEDEDUCTIBILE',
        fields: {
            chImpozit691: {
                label: 'CH IMPOZIT 691',
                type: 'number',
                required: true,
                step: '0.01'
            },
            ct635Nedeductibil: {
                label: 'CT 635 NEDEDUCTIBIL',
                type: 'number',
                required: true,
                step: '0.01'
            },
            ct623Nedeductibil: {
                label: 'CT 623 NEDEDUCTIBIL',
                type: 'number',
                required: true,
                step: '0.01'
            },
            ct658Nedeductibil: {
                label: 'CT 658 NEDEDUCTIBIL',
                type: 'number',
                required: true,
                step: '0.01'
            },
            ct681Nedeductibil: {
                label: 'CT 681 NEDEDUCTIBIL',
                type: 'number',
                required: true,
                step: '0.01'
            },
            ct6022Nedeductibil: {
                label: 'CT 6022 NEDEDUCTIBIL',
                type: 'number',
                required: true,
                step: '0.01'
            }
        }
    },
    taxCalculation: {
        title: 'CALCUL IMPOZIT',
        fields: {
            bazaImpozabila: {
                label: 'BAZA IMPOZABILA',
                type: 'number',
                readOnly: true,
                calculated: true
            },
            impozit16: {
                label: 'IMPOZIT 16%',
                type: 'number',
                readOnly: true,
                calculated: true
            },
            declaratAnterior: {
                label: 'DECLARAT ANTERIOR',
                type: 'number',
                required: true,
                step: '0.01'
            },
            impozitAchitat: {
                label: 'IMPOZIT DE ACHITAT',
                type: 'number',
                readOnly: true,
                calculated: true
            },
            sponsorizare: {
                label: 'SPONSORIZARE',
                type: 'number',
                required: true,
                step: '0.01'
            },
            impozitPlata1: {
                label: 'IMPOZIT DE PLATA',
                type: 'number',
                readOnly: true,
                calculated: true
            },
            impozitDeclarat: {
                label: 'IMPOZIT DECLARAT',
                type: 'number',
                required: true,
                step: '0.01'
            },
            impozitPlata2: {
                label: 'IMPOZIT DE PLATA (final)',
                type: 'number',
                readOnly: true,
                calculated: true
            }
        }
    },
    protocolCalculation: {
        title: 'CALCUL PROTOCOL DEDUCTIBIL',
        fields: {
            ctRulaj623: {
                label: 'CT RULAJ 623',
                type: 'number',
                required: true,
                step: '0.01'
            },
            rulaj691: {
                label: 'RULAJ 691',
                type: 'number',
                required: true,
                step: '0.01'
            },
            totalRulaj: {
                label: 'TOTAL RULAJ',
                type: 'number',
                readOnly: true,
                calculated: true
            },
            protocolDed: {
                label: 'PROTOCOL DED.',
                type: 'number',
                readOnly: true,
                calculated: true
            },
            protocolInreg: {
                label: 'PROTOCOL INREG',
                type: 'number',
                readOnly: true,
                calculated: true
            },
            protocolNed: {
                label: 'PROTOCOL NED.',
                type: 'number',
                readOnly: true,
                calculated: true
            }
        }
    }
};

// Reusable Input Component
const FormInput = ({ field, name, value, onChange, calculatedValue }) => {
    const inputValue = field.calculated ? calculatedValue : value;
    
    return (
        <div className="space-y-2">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {field.label}
            </label>
            <input
                type={field.type}
                id={name}
                name={name}
                value={inputValue}
                onChange={onChange}
                required={field.required}
                readOnly={field.readOnly}
                step={field.step}
                className={`w-full px-4 py-2 border rounded-md shadow-sm 
                    ${field.readOnly 
                        ? 'bg-gray-100 text-gray-600' 
                        : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
            />
        </div>
    );
};

// Form Section Component
const FormSection = ({ title, fields, formData, handleInputChange, calculateFields }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(fields).map(([fieldName, fieldConfig]) => (
                    <FormInput
                        key={fieldName}
                        field={fieldConfig}
                        name={fieldName}
                        value={formData[fieldName]}
                        onChange={handleInputChange}
                        calculatedValue={fieldConfig.calculated
                            ? calculateFields(formData)[fieldName]
                            : formData[fieldName]}
                    />
                ))}
            </div>
        </div>
    );
};

// Main Form Component
const FormFields = ({ calculateFields, handleInputChange, formData, handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-6xl mx-auto p-6">
            {Object.entries(FIELD_CONFIG).map(([sectionKey, section]) => (
                <FormSection
                    key={sectionKey}
                    title={section.title}
                    fields={section.fields}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    calculateFields={calculateFields}
                />
            ))}
            
            <div className="flex justify-end space-x-4">
                <ButtonBack Label="Anuleaza" />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Adauga Informatii
                </button>
            </div>
        </form>
    );
};

export default FormFields;
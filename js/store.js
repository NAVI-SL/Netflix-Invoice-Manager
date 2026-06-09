// Central State Manager using localStorage for Netflix Subscription Invoicer

const SETTINGS_KEY = 'netflix_invoice_settings';
const INVOICES_KEY = 'netflix_invoice_list';

const DEFAULT_SETTINGS = {
    bankFeePercent: 0.00,
    taxPercent: 0.0,
    defaultMembers: 5,
    whatsappGroup: "Netflix Squad",
    defaultNotes: "Please transfer your share by the 5th of the month. Use your name as reference.",
    bankAccountName: "Amila Perera",
    bankAccountNumber: "123456789",
    bankNameBranch: "HNB - Head Office"
};

const SEED_INVOICES = [
    {
        id: "inv_oct23",
        month: "October",
        year: 2023,
        plan: "Premium",
        baseAmountUsd: 14.77,
        exchangeRate: 300.00,
        baseAmountLkr: 4431.53,
        bankFeePercent: 1.5,
        bankFeeLkr: 68.47,
        taxPercent: 0.0,
        taxLkr: 0.0,
        totalLkr: 4500.00,
        membersCount: 5,
        perMemberLkr: 900.00,
        dueDate: "2023-10-15",
        notes: "Please transfer before the due date.",
        status: "Pending",
        payments: [
            { name: "Sarith", status: "Pending" },
            { name: "Sachin", status: "Paid" },
            { name: "Aizen", status: "Pending" },
            { name: "Heshan", status: "Pending" },
            { name: "Navitha", status: "Pending" }
        ]
    },
    {
        id: "inv_nov23",
        month: "November",
        year: 2023,
        plan: "Premium",
        baseAmountUsd: 9.52,
        exchangeRate: 300.00,
        baseAmountLkr: 2857.00,
        bankFeePercent: 1.5,
        bankFeeLkr: 43.00,
        taxPercent: 0.0,
        taxLkr: 0.0,
        totalLkr: 2900.00,
        membersCount: 4,
        perMemberLkr: 725.00,
        dueDate: "2023-11-15",
        notes: "Please pay before due date.",
        status: "Pending",
        payments: [
            { name: "Sarith", status: "Pending" },
            { name: "Sachin", status: "Paid" },
            { name: "Aizen", status: "Pending" },
            { name: "Heshan", status: "Pending" }
        ]
    },
    {
        id: "inv_dec23",
        month: "December",
        year: 2023,
        plan: "Premium",
        baseAmountUsd: 11.50,
        exchangeRate: 300.00,
        baseAmountLkr: 3450.00,
        bankFeePercent: 1.5,
        bankFeeLkr: 50.00,
        taxPercent: 0.0,
        taxLkr: 0.0,
        totalLkr: 3500.00,
        membersCount: 5,
        perMemberLkr: 700.00,
        dueDate: "2023-12-15",
        notes: "Holiday split.",
        status: "Paid",
        payments: [
            { name: "Sarith", status: "Paid" },
            { name: "Sachin", status: "Paid" },
            { name: "Aizen", status: "Paid" },
            { name: "Heshan", status: "Paid" },
            { name: "Navitha", status: "Paid" }
        ]
    }
];

// Initialize store
function initStore() {
    // Force a one-time reset to load the new names
    if (!localStorage.getItem('v2_names_updated')) {
        localStorage.removeItem(SETTINGS_KEY);
        localStorage.removeItem(INVOICES_KEY);
        localStorage.setItem('v2_names_updated', 'true');
    }

    if (!localStorage.getItem(SETTINGS_KEY)) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(INVOICES_KEY)) {
        localStorage.setItem(INVOICES_KEY, JSON.stringify(SEED_INVOICES));
    }
}

// Get/Save Settings
function getSettings() {
    initStore();
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || DEFAULT_SETTINGS;
}

function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Get/Save/Delete Invoices
function getInvoices() {
    initStore();
    return JSON.parse(localStorage.getItem(INVOICES_KEY)) || [];
}

function getInvoice(id) {
    const invoices = getInvoices();
    return invoices.find(inv => inv.id === id) || null;
}

function saveInvoice(invoice) {
    const invoices = getInvoices();
    const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
    
    if (existingIndex > -1) {
        invoices[existingIndex] = invoice;
    } else {
        invoices.unshift(invoice); // Add to the beginning of list
    }
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

function deleteInvoice(id) {
    const invoices = getInvoices();
    const filtered = invoices.filter(inv => inv.id !== id);
    localStorage.setItem(INVOICES_KEY, JSON.stringify(filtered));
}

function updateMemberPayment(invoiceId, memberName, status) {
    const invoices = getInvoices();
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
        const payment = invoice.payments.find(p => p.name === memberName);
        if (payment) {
            payment.status = status;
            
            // Check if all members paid, then update invoice status
            const allPaid = invoice.payments.every(p => p.status === 'Paid');
            invoice.status = allPaid ? 'Paid' : 'Pending';
            
            saveInvoice(invoice);
        }
    }
}

// Export functions to global scope
window.AppStore = {
    getSettings,
    saveSettings,
    getInvoices,
    getInvoice,
    saveInvoice,
    deleteInvoice,
    updateMemberPayment
};

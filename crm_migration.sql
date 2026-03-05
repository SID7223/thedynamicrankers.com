-- CRM Customers Table
CREATE TABLE crm_customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    notes TEXT,
    sales_stage TEXT CHECK(sales_stage IN ('Discovery', 'Trial', 'Presentation', 'Paperwork', 'Checkout', 'Closed')) DEFAULT 'Discovery',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CRM Invoices Table
CREATE TABLE crm_invoices (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('invoice_created', 'sent', 'payment_received')) DEFAULT 'invoice_created',
    invoice_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES crm_customers(id) ON DELETE CASCADE
);

-- CRM Appointments Table
CREATE TABLE crm_appointments (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT CHECK(status IN ('scheduled', 'completed')) DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES crm_customers(id) ON DELETE CASCADE
);

-- Trigger to update updated_at for customers
CREATE TRIGGER update_crm_customers_timestamp AFTER UPDATE ON crm_customers
BEGIN
    UPDATE crm_customers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at for invoices
CREATE TRIGGER update_crm_invoices_timestamp AFTER UPDATE ON crm_invoices
BEGIN
    UPDATE crm_invoices SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at for appointments
CREATE TRIGGER update_crm_appointments_timestamp AFTER UPDATE ON crm_appointments
BEGIN
    UPDATE crm_appointments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

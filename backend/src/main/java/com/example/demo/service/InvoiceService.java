package com.example.demo.service;

import com.example.demo.model.Invoice;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class InvoiceService {

    private final List<Invoice> invoices = new ArrayList<>();

    public InvoiceService() {
        // Adding 10 sample invoices
        invoices.add(new Invoice("1", "Invoice for Office Supplies", 150.75));
        invoices.add(new Invoice("2", "Invoice for IT Equipment", 1200.00));
        invoices.add(new Invoice("3", "Invoice for Marketing Services", 500.50));
        invoices.add(new Invoice("4", "Invoice for Travel Expenses", 300.00));
        invoices.add(new Invoice("5", "Invoice for Consulting Services", 800.00));
        invoices.add(new Invoice("6", "Invoice for Software Subscription", 99.99));
        invoices.add(new Invoice("7", "Invoice for Maintenance Services", 450.00));
        invoices.add(new Invoice("8", "Invoice for Training Programs", 700.00));
        invoices.add(new Invoice("9", "Invoice for Catering Services", 250.00));
        invoices.add(new Invoice("10", "Invoice for Event Management", 1500.00));
    }

    public List<Invoice> getAllInvoices() {
        return invoices;
    }

    public String requestChange(Invoice invoice) {
        // Logic to request change
        return "Change request submitted for invoice: " + invoice.getId();
    }

    public String requestRefund(Invoice invoice) {
        // Logic to request refund
        return "Refund request submitted for invoice: " + invoice.getId();
    }
}

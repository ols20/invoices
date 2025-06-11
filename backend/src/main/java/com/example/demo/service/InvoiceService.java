package com.example.demo.service;

import com.example.demo.model.Invoice;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class InvoiceService {

    private final List<Invoice> invoices = new ArrayList<>();

    public InvoiceService() {
        Random random = new Random();
        String[] statuses = {"Pending", "Paid", "Overdue"};

        // Adding 10 sample invoices with random dates, statuses, and line items
        invoices.add(new Invoice("1", "Invoice for Office Supplies", 150.75, LocalDate.now().minusDays(random.nextInt(30)), statuses[random.nextInt(statuses.length)],
            List.of(
                new Invoice.LineItem("Paper", 50.00),
                new Invoice.LineItem("Pens", 30.75),
                new Invoice.LineItem("Folders", 70.00)
            )));
        invoices.add(new Invoice("2", "Invoice for IT Equipment", 1200.00, LocalDate.now().minusDays(random.nextInt(30)), statuses[random.nextInt(statuses.length)],
            List.of(
                new Invoice.LineItem("Laptop", 900.00),
                new Invoice.LineItem("Monitor", 200.00),
                new Invoice.LineItem("Keyboard", 100.00)
            )));
        invoices.add(new Invoice("3", "Invoice for Marketing Services", 500.50, LocalDate.now().minusDays(random.nextInt(30)), statuses[random.nextInt(statuses.length)],
            List.of(
                new Invoice.LineItem("Social Media Ads", 200.00),
                new Invoice.LineItem("Flyers", 100.50),
                new Invoice.LineItem("Consulting", 200.00)
            )));
        invoices.add(new Invoice("4", "Invoice for Travel Expenses", 300.00, LocalDate.now().minusDays(random.nextInt(30)), statuses[random.nextInt(statuses.length)],
            List.of(
                new Invoice.LineItem("Flight", 200.00),
                new Invoice.LineItem("Hotel", 100.00)
            )));
        invoices.add(new Invoice("5", "Invoice for Consulting Services", 800.00, LocalDate.now().minusDays(random.nextInt(30)), statuses[random.nextInt(statuses.length)],
            List.of(
                new Invoice.LineItem("Strategy Session", 500.00),
                new Invoice.LineItem("Follow-up", 300.00)
            )));
        invoices.add(new Invoice("6", "Invoice for Software Subscription", 99.99, LocalDate.now().minusDays(random.nextInt(30)), statuses[random.nextInt(statuses.length)],
            List.of(
                new Invoice.LineItem("Monthly Subscription", 99.99)
            )));
        invoices.add(new Invoice("7", "Invoice for Maintenance Services", 450.00, LocalDate.now().minusDays(random.nextInt(30)), statuses[random.nextInt(statuses.length)],
            List.of(
                new Invoice.LineItem("System Check", 200.00),
                new Invoice.LineItem("Repairs", 250.00)
            )));
        invoices.add(new Invoice("8", "Invoice for Training Programs", 700.00, LocalDate.now().minusDays(random.nextInt(30)), statuses[random.nextInt(statuses.length)],
            List.of(
                new Invoice.LineItem("Workshop", 400.00),
                new Invoice.LineItem("Materials", 300.00)
            )));
        invoices.add(new Invoice("9", "Invoice for Catering Services", 250.00, LocalDate.now().minusDays(random.nextInt(30)), statuses[random.nextInt(statuses.length)],
            List.of(
                new Invoice.LineItem("Lunch", 150.00),
                new Invoice.LineItem("Drinks", 100.00)
            )));
        invoices.add(new Invoice("10", "Invoice for Event Management", 1500.00, LocalDate.now().minusDays(random.nextInt(30)), statuses[random.nextInt(statuses.length)],
            List.of(
                new Invoice.LineItem("Venue", 800.00),
                new Invoice.LineItem("Staff", 400.00),
                new Invoice.LineItem("Equipment", 300.00)
            )));
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

    public Invoice getInvoiceById(String id) {
        return invoices.stream()
                .filter(invoice -> invoice.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
    }
}

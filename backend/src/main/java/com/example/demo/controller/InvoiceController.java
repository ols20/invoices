package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Invoice;
import com.example.demo.service.InvoiceService;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    @PostMapping("/request-change")
    public String requestChange(@RequestBody Invoice invoice) {
        return invoiceService.requestChange(invoice);
    }

    @PostMapping("/request-refund")
    public String requestRefund(@RequestBody Invoice invoice) {
        return invoiceService.requestRefund(invoice);
    }
}

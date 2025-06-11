package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Invoice;
import com.example.demo.service.InvoiceService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> requestChange(@RequestBody Object request) {
        var response = invoiceService.requestChange(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/request-refund")
    public String requestRefund(@RequestBody Invoice invoice) {
        return invoiceService.requestRefund(invoice);
    }

    @GetMapping("/{id}")
    public Invoice getInvoiceById(@PathVariable String id) {
        return invoiceService.getInvoiceById(id);
    }

    @GetMapping("/change-request/{reference}")
    public ResponseEntity<?> getChangeRequest(@PathVariable String reference) {
        try {
            var cr = invoiceService.getChangeRequestByReference(reference);
            return ResponseEntity.ok(cr);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/refund-request/{reference}")
    public ResponseEntity<?> getRefundRequest(@PathVariable String reference) {
        try {
            var rr = invoiceService.getRefundRequestByReference(reference);
            return ResponseEntity.ok(rr);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

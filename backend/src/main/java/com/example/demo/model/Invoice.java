package com.example.demo.model;

import java.time.LocalDate;
import java.util.List;

public class Invoice {

    private String id;
    private String description;
    private double amount;
    private LocalDate date;
    private String status;
    private List<LineItem> lineItems;

    public Invoice(String id, String description, double amount, LocalDate date, String status) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.status = status;
    }

    public Invoice(String id, String description, double amount, LocalDate date, String status, List<LineItem> lineItems) {
        this(id, description, amount, date, status);
        this.lineItems = lineItems;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<LineItem> getLineItems() {
        return lineItems;
    }

    public void setLineItems(List<LineItem> lineItems) {
        this.lineItems = lineItems;
    }

    public static class LineItem {
        private String description;
        private double cost;

        public LineItem(String description, double cost) {
            this.description = description;
            this.cost = cost;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public double getCost() {
            return cost;
        }

        public void setCost(double cost) {
            this.cost = cost;
        }
    }
}

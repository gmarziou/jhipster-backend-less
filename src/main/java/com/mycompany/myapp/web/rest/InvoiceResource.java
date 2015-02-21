package com.mycompany.myapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.Invoice;
import com.mycompany.myapp.repository.InvoiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Invoice.
 */
@RestController
@RequestMapping("/api")
public class InvoiceResource {

    private final Logger log = LoggerFactory.getLogger(InvoiceResource.class);

    @Inject
    private InvoiceRepository invoiceRepository;

    /**
     * POST  /invoices -> Create a new invoice.
     */
    @RequestMapping(value = "/invoices",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void create(@RequestBody Invoice invoice) {
        log.debug("REST request to save Invoice : {}", invoice);
        invoiceRepository.save(invoice);
    }

    /**
     * GET  /invoices -> get all the invoices.
     */
    @RequestMapping(value = "/invoices",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Invoice> getAll() {
        log.debug("REST request to get all Invoices");
        return invoiceRepository.findAll();
    }

    /**
     * GET  /invoices/:id -> get the "id" invoice.
     */
    @RequestMapping(value = "/invoices/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Invoice> get(@PathVariable Long id) {
        log.debug("REST request to get Invoice : {}", id);
        return Optional.ofNullable(invoiceRepository.findOne(id))
            .map(invoice -> new ResponseEntity<>(
                invoice,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /invoices/:id -> delete the "id" invoice.
     */
    @RequestMapping(value = "/invoices/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void delete(@PathVariable Long id) {
        log.debug("REST request to delete Invoice : {}", id);
        invoiceRepository.delete(id);
    }
}

package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.Application;
import com.mycompany.myapp.domain.Invoice;
import com.mycompany.myapp.repository.InvoiceRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import org.joda.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the InvoiceResource REST controller.
 *
 * @see InvoiceResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class InvoiceResourceTest {


    private static final LocalDate DEFAULT_DATE = new LocalDate(0L);
    private static final LocalDate UPDATED_DATE = new LocalDate();

    private static final Integer DEFAULT_AMOUNT = 0;
    private static final Integer UPDATED_AMOUNT = 1;

    private static final Integer DEFAULT_STATUS = 0;
    private static final Integer UPDATED_STATUS = 1;

    @Inject
    private InvoiceRepository invoiceRepository;

    private MockMvc restInvoiceMockMvc;

    private Invoice invoice;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        InvoiceResource invoiceResource = new InvoiceResource();
        ReflectionTestUtils.setField(invoiceResource, "invoiceRepository", invoiceRepository);
        this.restInvoiceMockMvc = MockMvcBuilders.standaloneSetup(invoiceResource).build();
    }

    @Before
    public void initTest() {
        invoice = new Invoice();
        invoice.setDate(DEFAULT_DATE);
        invoice.setAmount(DEFAULT_AMOUNT);
        invoice.setStatus(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    public void createInvoice() throws Exception {
        // Validate the database is empty
        assertThat(invoiceRepository.findAll()).hasSize(0);

        // Create the Invoice
        restInvoiceMockMvc.perform(post("/api/invoices")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(invoice)))
                .andExpect(status().isOk());

        // Validate the Invoice in the database
        List<Invoice> invoices = invoiceRepository.findAll();
        assertThat(invoices).hasSize(1);
        Invoice testInvoice = invoices.iterator().next();
        assertThat(testInvoice.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testInvoice.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testInvoice.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    public void getAllInvoices() throws Exception {
        // Initialize the database
        invoiceRepository.saveAndFlush(invoice);

        // Get all the invoices
        restInvoiceMockMvc.perform(get("/api/invoices"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[0].id").value(invoice.getId().intValue()))
                .andExpect(jsonPath("$.[0].date").value(DEFAULT_DATE.toString()))
                .andExpect(jsonPath("$.[0].amount").value(DEFAULT_AMOUNT))
                .andExpect(jsonPath("$.[0].status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    public void getInvoice() throws Exception {
        // Initialize the database
        invoiceRepository.saveAndFlush(invoice);

        // Get the invoice
        restInvoiceMockMvc.perform(get("/api/invoices/{id}", invoice.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(invoice.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    public void getNonExistingInvoice() throws Exception {
        // Get the invoice
        restInvoiceMockMvc.perform(get("/api/invoices/{id}", 1L))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateInvoice() throws Exception {
        // Initialize the database
        invoiceRepository.saveAndFlush(invoice);

        // Update the invoice
        invoice.setDate(UPDATED_DATE);
        invoice.setAmount(UPDATED_AMOUNT);
        invoice.setStatus(UPDATED_STATUS);
        restInvoiceMockMvc.perform(post("/api/invoices")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(invoice)))
                .andExpect(status().isOk());

        // Validate the Invoice in the database
        List<Invoice> invoices = invoiceRepository.findAll();
        assertThat(invoices).hasSize(1);
        Invoice testInvoice = invoices.iterator().next();
        assertThat(testInvoice.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testInvoice.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testInvoice.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    public void deleteInvoice() throws Exception {
        // Initialize the database
        invoiceRepository.saveAndFlush(invoice);

        // Get the invoice
        restInvoiceMockMvc.perform(delete("/api/invoices/{id}", invoice.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Invoice> invoices = invoiceRepository.findAll();
        assertThat(invoices).hasSize(0);
    }
}

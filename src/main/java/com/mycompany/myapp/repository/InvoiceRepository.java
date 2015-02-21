package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Invoice entity.
 */
public interface InvoiceRepository extends JpaRepository<Invoice,Long>{

}

package co.edu.sena.web.rest;

import co.edu.sena.domain.Sede;
import co.edu.sena.repository.SedeRepository;
import co.edu.sena.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link co.edu.sena.domain.Sede}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SedeResource {

    private final Logger log = LoggerFactory.getLogger(SedeResource.class);

    private static final String ENTITY_NAME = "sede";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SedeRepository sedeRepository;

    public SedeResource(SedeRepository sedeRepository) {
        this.sedeRepository = sedeRepository;
    }

    /**
     * {@code POST  /sedes} : Create a new sede.
     *
     * @param sede the sede to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sede, or with status {@code 400 (Bad Request)} if the sede has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sedes")
    public ResponseEntity<Sede> createSede(@Valid @RequestBody Sede sede) throws URISyntaxException {
        log.debug("REST request to save Sede : {}", sede);
        if (sede.getId() != null) {
            throw new BadRequestAlertException("A new sede cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Sede result = sedeRepository.save(sede);
        return ResponseEntity
            .created(new URI("/api/sedes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sedes/:id} : Updates an existing sede.
     *
     * @param id the id of the sede to save.
     * @param sede the sede to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sede,
     * or with status {@code 400 (Bad Request)} if the sede is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sede couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sedes/{id}")
    public ResponseEntity<Sede> updateSede(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Sede sede)
        throws URISyntaxException {
        log.debug("REST request to update Sede : {}, {}", id, sede);
        if (sede.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sede.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sedeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Sede result = sedeRepository.save(sede);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sede.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sedes/:id} : Partial updates given fields of an existing sede, field will ignore if it is null
     *
     * @param id the id of the sede to save.
     * @param sede the sede to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sede,
     * or with status {@code 400 (Bad Request)} if the sede is not valid,
     * or with status {@code 404 (Not Found)} if the sede is not found,
     * or with status {@code 500 (Internal Server Error)} if the sede couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sedes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Sede> partialUpdateSede(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Sede sede
    ) throws URISyntaxException {
        log.debug("REST request to partial update Sede partially : {}, {}", id, sede);
        if (sede.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sede.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sedeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Sede> result = sedeRepository
            .findById(sede.getId())
            .map(existingSede -> {
                if (sede.getCorreoSede() != null) {
                    existingSede.setCorreoSede(sede.getCorreoSede());
                }
                if (sede.getDireccioSede() != null) {
                    existingSede.setDireccioSede(sede.getDireccioSede());
                }
                if (sede.getNombreSede() != null) {
                    existingSede.setNombreSede(sede.getNombreSede());
                }
                if (sede.getTelefonoSede() != null) {
                    existingSede.setTelefonoSede(sede.getTelefonoSede());
                }

                return existingSede;
            })
            .map(sedeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sede.getId().toString())
        );
    }

    /**
     * {@code GET  /sedes} : get all the sedes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sedes in body.
     */
    @GetMapping("/sedes")
    public List<Sede> getAllSedes() {
        log.debug("REST request to get all Sedes");
        return sedeRepository.findAll();
    }

    /**
     * {@code GET  /sedes/:id} : get the "id" sede.
     *
     * @param id the id of the sede to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sede, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sedes/{id}")
    public ResponseEntity<Sede> getSede(@PathVariable Long id) {
        log.debug("REST request to get Sede : {}", id);
        Optional<Sede> sede = sedeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sede);
    }

    /**
     * {@code DELETE  /sedes/:id} : delete the "id" sede.
     *
     * @param id the id of the sede to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sedes/{id}")
    public ResponseEntity<Void> deleteSede(@PathVariable Long id) {
        log.debug("REST request to delete Sede : {}", id);
        sedeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

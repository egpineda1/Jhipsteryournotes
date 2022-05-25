package co.edu.sena.web.rest;

import co.edu.sena.domain.Aula;
import co.edu.sena.repository.AulaRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.Aula}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AulaResource {

    private final Logger log = LoggerFactory.getLogger(AulaResource.class);

    private static final String ENTITY_NAME = "aula";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AulaRepository aulaRepository;

    public AulaResource(AulaRepository aulaRepository) {
        this.aulaRepository = aulaRepository;
    }

    /**
     * {@code POST  /aulas} : Create a new aula.
     *
     * @param aula the aula to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new aula, or with status {@code 400 (Bad Request)} if the aula has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/aulas")
    public ResponseEntity<Aula> createAula(@Valid @RequestBody Aula aula) throws URISyntaxException {
        log.debug("REST request to save Aula : {}", aula);
        if (aula.getId() != null) {
            throw new BadRequestAlertException("A new aula cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Aula result = aulaRepository.save(aula);
        return ResponseEntity
            .created(new URI("/api/aulas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /aulas/:id} : Updates an existing aula.
     *
     * @param id the id of the aula to save.
     * @param aula the aula to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated aula,
     * or with status {@code 400 (Bad Request)} if the aula is not valid,
     * or with status {@code 500 (Internal Server Error)} if the aula couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/aulas/{id}")
    public ResponseEntity<Aula> updateAula(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Aula aula)
        throws URISyntaxException {
        log.debug("REST request to update Aula : {}, {}", id, aula);
        if (aula.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, aula.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!aulaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Aula result = aulaRepository.save(aula);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, aula.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /aulas/:id} : Partial updates given fields of an existing aula, field will ignore if it is null
     *
     * @param id the id of the aula to save.
     * @param aula the aula to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated aula,
     * or with status {@code 400 (Bad Request)} if the aula is not valid,
     * or with status {@code 404 (Not Found)} if the aula is not found,
     * or with status {@code 500 (Internal Server Error)} if the aula couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/aulas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Aula> partialUpdateAula(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Aula aula
    ) throws URISyntaxException {
        log.debug("REST request to partial update Aula partially : {}, {}", id, aula);
        if (aula.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, aula.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!aulaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Aula> result = aulaRepository
            .findById(aula.getId())
            .map(existingAula -> {
                if (aula.getCapacidadMaxima() != null) {
                    existingAula.setCapacidadMaxima(aula.getCapacidadMaxima());
                }
                if (aula.getGrado() != null) {
                    existingAula.setGrado(aula.getGrado());
                }
                if (aula.getSalon() != null) {
                    existingAula.setSalon(aula.getSalon());
                }

                return existingAula;
            })
            .map(aulaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, aula.getId().toString())
        );
    }

    /**
     * {@code GET  /aulas} : get all the aulas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of aulas in body.
     */
    @GetMapping("/aulas")
    public List<Aula> getAllAulas() {
        log.debug("REST request to get all Aulas");
        return aulaRepository.findAll();
    }

    /**
     * {@code GET  /aulas/:id} : get the "id" aula.
     *
     * @param id the id of the aula to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the aula, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/aulas/{id}")
    public ResponseEntity<Aula> getAula(@PathVariable Long id) {
        log.debug("REST request to get Aula : {}", id);
        Optional<Aula> aula = aulaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(aula);
    }

    /**
     * {@code DELETE  /aulas/:id} : delete the "id" aula.
     *
     * @param id the id of the aula to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/aulas/{id}")
    public ResponseEntity<Void> deleteAula(@PathVariable Long id) {
        log.debug("REST request to delete Aula : {}", id);
        aulaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

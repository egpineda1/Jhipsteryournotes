package co.edu.sena.web.rest;

import co.edu.sena.domain.Nota;
import co.edu.sena.repository.NotaRepository;
import co.edu.sena.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
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
 * REST controller for managing {@link co.edu.sena.domain.Nota}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NotaResource {

    private final Logger log = LoggerFactory.getLogger(NotaResource.class);

    private static final String ENTITY_NAME = "nota";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NotaRepository notaRepository;

    public NotaResource(NotaRepository notaRepository) {
        this.notaRepository = notaRepository;
    }

    /**
     * {@code POST  /notas} : Create a new nota.
     *
     * @param nota the nota to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new nota, or with status {@code 400 (Bad Request)} if the nota has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/notas")
    public ResponseEntity<Nota> createNota(@Valid @RequestBody Nota nota) throws URISyntaxException {
        log.debug("REST request to save Nota : {}", nota);
        if (nota.getId() != null) {
            throw new BadRequestAlertException("A new nota cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Nota result = notaRepository.save(nota);
        return ResponseEntity
            .created(new URI("/api/notas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /notas/:id} : Updates an existing nota.
     *
     * @param id the id of the nota to save.
     * @param nota the nota to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nota,
     * or with status {@code 400 (Bad Request)} if the nota is not valid,
     * or with status {@code 500 (Internal Server Error)} if the nota couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/notas/{id}")
    public ResponseEntity<Nota> updateNota(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Nota nota)
        throws URISyntaxException {
        log.debug("REST request to update Nota : {}, {}", id, nota);
        if (nota.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nota.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Nota result = notaRepository.save(nota);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, nota.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /notas/:id} : Partial updates given fields of an existing nota, field will ignore if it is null
     *
     * @param id the id of the nota to save.
     * @param nota the nota to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nota,
     * or with status {@code 400 (Bad Request)} if the nota is not valid,
     * or with status {@code 404 (Not Found)} if the nota is not found,
     * or with status {@code 500 (Internal Server Error)} if the nota couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/notas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Nota> partialUpdateNota(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Nota nota
    ) throws URISyntaxException {
        log.debug("REST request to partial update Nota partially : {}, {}", id, nota);
        if (nota.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nota.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Nota> result = notaRepository
            .findById(nota.getId())
            .map(existingNota -> {
                if (nota.getNota() != null) {
                    existingNota.setNota(nota.getNota());
                }
                if (nota.getObservaciones() != null) {
                    existingNota.setObservaciones(nota.getObservaciones());
                }

                return existingNota;
            })
            .map(notaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, nota.getId().toString())
        );
    }

    /**
     * {@code GET  /notas} : get all the notas.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of notas in body.
     */
    @GetMapping("/notas")
    public List<Nota> getAllNotas(@RequestParam(required = false) String filter) {
        if ("asignatura-is-null".equals(filter)) {
            log.debug("REST request to get all Notas where asignatura is null");
            return StreamSupport
                .stream(notaRepository.findAll().spliterator(), false)
                .filter(nota -> nota.getAsignatura() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Notas");
        return notaRepository.findAll();
    }

    /**
     * {@code GET  /notas/:id} : get the "id" nota.
     *
     * @param id the id of the nota to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the nota, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/notas/{id}")
    public ResponseEntity<Nota> getNota(@PathVariable Long id) {
        log.debug("REST request to get Nota : {}", id);
        Optional<Nota> nota = notaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(nota);
    }

    /**
     * {@code DELETE  /notas/:id} : delete the "id" nota.
     *
     * @param id the id of the nota to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/notas/{id}")
    public ResponseEntity<Void> deleteNota(@PathVariable Long id) {
        log.debug("REST request to delete Nota : {}", id);
        notaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

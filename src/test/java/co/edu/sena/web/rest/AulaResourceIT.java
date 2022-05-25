package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Aula;
import co.edu.sena.repository.AulaRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AulaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AulaResourceIT {

    private static final Float DEFAULT_CAPACIDAD_MAXIMA = 1F;
    private static final Float UPDATED_CAPACIDAD_MAXIMA = 2F;

    private static final Float DEFAULT_GRADO = 1F;
    private static final Float UPDATED_GRADO = 2F;

    private static final String DEFAULT_SALON = "AAAAAAAAAA";
    private static final String UPDATED_SALON = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/aulas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AulaRepository aulaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAulaMockMvc;

    private Aula aula;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Aula createEntity(EntityManager em) {
        Aula aula = new Aula().capacidadMaxima(DEFAULT_CAPACIDAD_MAXIMA).grado(DEFAULT_GRADO).salon(DEFAULT_SALON);
        return aula;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Aula createUpdatedEntity(EntityManager em) {
        Aula aula = new Aula().capacidadMaxima(UPDATED_CAPACIDAD_MAXIMA).grado(UPDATED_GRADO).salon(UPDATED_SALON);
        return aula;
    }

    @BeforeEach
    public void initTest() {
        aula = createEntity(em);
    }

    @Test
    @Transactional
    void createAula() throws Exception {
        int databaseSizeBeforeCreate = aulaRepository.findAll().size();
        // Create the Aula
        restAulaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aula)))
            .andExpect(status().isCreated());

        // Validate the Aula in the database
        List<Aula> aulaList = aulaRepository.findAll();
        assertThat(aulaList).hasSize(databaseSizeBeforeCreate + 1);
        Aula testAula = aulaList.get(aulaList.size() - 1);
        assertThat(testAula.getCapacidadMaxima()).isEqualTo(DEFAULT_CAPACIDAD_MAXIMA);
        assertThat(testAula.getGrado()).isEqualTo(DEFAULT_GRADO);
        assertThat(testAula.getSalon()).isEqualTo(DEFAULT_SALON);
    }

    @Test
    @Transactional
    void createAulaWithExistingId() throws Exception {
        // Create the Aula with an existing ID
        aula.setId(1L);

        int databaseSizeBeforeCreate = aulaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAulaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aula)))
            .andExpect(status().isBadRequest());

        // Validate the Aula in the database
        List<Aula> aulaList = aulaRepository.findAll();
        assertThat(aulaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAulas() throws Exception {
        // Initialize the database
        aulaRepository.saveAndFlush(aula);

        // Get all the aulaList
        restAulaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(aula.getId().intValue())))
            .andExpect(jsonPath("$.[*].capacidadMaxima").value(hasItem(DEFAULT_CAPACIDAD_MAXIMA.doubleValue())))
            .andExpect(jsonPath("$.[*].grado").value(hasItem(DEFAULT_GRADO.doubleValue())))
            .andExpect(jsonPath("$.[*].salon").value(hasItem(DEFAULT_SALON)));
    }

    @Test
    @Transactional
    void getAula() throws Exception {
        // Initialize the database
        aulaRepository.saveAndFlush(aula);

        // Get the aula
        restAulaMockMvc
            .perform(get(ENTITY_API_URL_ID, aula.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(aula.getId().intValue()))
            .andExpect(jsonPath("$.capacidadMaxima").value(DEFAULT_CAPACIDAD_MAXIMA.doubleValue()))
            .andExpect(jsonPath("$.grado").value(DEFAULT_GRADO.doubleValue()))
            .andExpect(jsonPath("$.salon").value(DEFAULT_SALON));
    }

    @Test
    @Transactional
    void getNonExistingAula() throws Exception {
        // Get the aula
        restAulaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAula() throws Exception {
        // Initialize the database
        aulaRepository.saveAndFlush(aula);

        int databaseSizeBeforeUpdate = aulaRepository.findAll().size();

        // Update the aula
        Aula updatedAula = aulaRepository.findById(aula.getId()).get();
        // Disconnect from session so that the updates on updatedAula are not directly saved in db
        em.detach(updatedAula);
        updatedAula.capacidadMaxima(UPDATED_CAPACIDAD_MAXIMA).grado(UPDATED_GRADO).salon(UPDATED_SALON);

        restAulaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAula.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAula))
            )
            .andExpect(status().isOk());

        // Validate the Aula in the database
        List<Aula> aulaList = aulaRepository.findAll();
        assertThat(aulaList).hasSize(databaseSizeBeforeUpdate);
        Aula testAula = aulaList.get(aulaList.size() - 1);
        assertThat(testAula.getCapacidadMaxima()).isEqualTo(UPDATED_CAPACIDAD_MAXIMA);
        assertThat(testAula.getGrado()).isEqualTo(UPDATED_GRADO);
        assertThat(testAula.getSalon()).isEqualTo(UPDATED_SALON);
    }

    @Test
    @Transactional
    void putNonExistingAula() throws Exception {
        int databaseSizeBeforeUpdate = aulaRepository.findAll().size();
        aula.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAulaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, aula.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(aula))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aula in the database
        List<Aula> aulaList = aulaRepository.findAll();
        assertThat(aulaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAula() throws Exception {
        int databaseSizeBeforeUpdate = aulaRepository.findAll().size();
        aula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAulaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(aula))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aula in the database
        List<Aula> aulaList = aulaRepository.findAll();
        assertThat(aulaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAula() throws Exception {
        int databaseSizeBeforeUpdate = aulaRepository.findAll().size();
        aula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAulaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aula)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Aula in the database
        List<Aula> aulaList = aulaRepository.findAll();
        assertThat(aulaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAulaWithPatch() throws Exception {
        // Initialize the database
        aulaRepository.saveAndFlush(aula);

        int databaseSizeBeforeUpdate = aulaRepository.findAll().size();

        // Update the aula using partial update
        Aula partialUpdatedAula = new Aula();
        partialUpdatedAula.setId(aula.getId());

        restAulaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAula.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAula))
            )
            .andExpect(status().isOk());

        // Validate the Aula in the database
        List<Aula> aulaList = aulaRepository.findAll();
        assertThat(aulaList).hasSize(databaseSizeBeforeUpdate);
        Aula testAula = aulaList.get(aulaList.size() - 1);
        assertThat(testAula.getCapacidadMaxima()).isEqualTo(DEFAULT_CAPACIDAD_MAXIMA);
        assertThat(testAula.getGrado()).isEqualTo(DEFAULT_GRADO);
        assertThat(testAula.getSalon()).isEqualTo(DEFAULT_SALON);
    }

    @Test
    @Transactional
    void fullUpdateAulaWithPatch() throws Exception {
        // Initialize the database
        aulaRepository.saveAndFlush(aula);

        int databaseSizeBeforeUpdate = aulaRepository.findAll().size();

        // Update the aula using partial update
        Aula partialUpdatedAula = new Aula();
        partialUpdatedAula.setId(aula.getId());

        partialUpdatedAula.capacidadMaxima(UPDATED_CAPACIDAD_MAXIMA).grado(UPDATED_GRADO).salon(UPDATED_SALON);

        restAulaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAula.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAula))
            )
            .andExpect(status().isOk());

        // Validate the Aula in the database
        List<Aula> aulaList = aulaRepository.findAll();
        assertThat(aulaList).hasSize(databaseSizeBeforeUpdate);
        Aula testAula = aulaList.get(aulaList.size() - 1);
        assertThat(testAula.getCapacidadMaxima()).isEqualTo(UPDATED_CAPACIDAD_MAXIMA);
        assertThat(testAula.getGrado()).isEqualTo(UPDATED_GRADO);
        assertThat(testAula.getSalon()).isEqualTo(UPDATED_SALON);
    }

    @Test
    @Transactional
    void patchNonExistingAula() throws Exception {
        int databaseSizeBeforeUpdate = aulaRepository.findAll().size();
        aula.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAulaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, aula.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(aula))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aula in the database
        List<Aula> aulaList = aulaRepository.findAll();
        assertThat(aulaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAula() throws Exception {
        int databaseSizeBeforeUpdate = aulaRepository.findAll().size();
        aula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAulaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(aula))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aula in the database
        List<Aula> aulaList = aulaRepository.findAll();
        assertThat(aulaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAula() throws Exception {
        int databaseSizeBeforeUpdate = aulaRepository.findAll().size();
        aula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAulaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(aula)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Aula in the database
        List<Aula> aulaList = aulaRepository.findAll();
        assertThat(aulaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAula() throws Exception {
        // Initialize the database
        aulaRepository.saveAndFlush(aula);

        int databaseSizeBeforeDelete = aulaRepository.findAll().size();

        // Delete the aula
        restAulaMockMvc
            .perform(delete(ENTITY_API_URL_ID, aula.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Aula> aulaList = aulaRepository.findAll();
        assertThat(aulaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

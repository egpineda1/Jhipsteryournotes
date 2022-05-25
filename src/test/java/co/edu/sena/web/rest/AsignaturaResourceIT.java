package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Asignatura;
import co.edu.sena.repository.AsignaturaRepository;
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
 * Integration tests for the {@link AsignaturaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AsignaturaResourceIT {

    private static final Float DEFAULT_CODE_ASIGNATURA = 1F;
    private static final Float UPDATED_CODE_ASIGNATURA = 2F;

    private static final String DEFAULT_ASIGNATURA = "AAAAAAAAAA";
    private static final String UPDATED_ASIGNATURA = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/asignaturas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAsignaturaMockMvc;

    private Asignatura asignatura;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Asignatura createEntity(EntityManager em) {
        Asignatura asignatura = new Asignatura().codeAsignatura(DEFAULT_CODE_ASIGNATURA).asignatura(DEFAULT_ASIGNATURA);
        return asignatura;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Asignatura createUpdatedEntity(EntityManager em) {
        Asignatura asignatura = new Asignatura().codeAsignatura(UPDATED_CODE_ASIGNATURA).asignatura(UPDATED_ASIGNATURA);
        return asignatura;
    }

    @BeforeEach
    public void initTest() {
        asignatura = createEntity(em);
    }

    @Test
    @Transactional
    void createAsignatura() throws Exception {
        int databaseSizeBeforeCreate = asignaturaRepository.findAll().size();
        // Create the Asignatura
        restAsignaturaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(asignatura)))
            .andExpect(status().isCreated());

        // Validate the Asignatura in the database
        List<Asignatura> asignaturaList = asignaturaRepository.findAll();
        assertThat(asignaturaList).hasSize(databaseSizeBeforeCreate + 1);
        Asignatura testAsignatura = asignaturaList.get(asignaturaList.size() - 1);
        assertThat(testAsignatura.getCodeAsignatura()).isEqualTo(DEFAULT_CODE_ASIGNATURA);
        assertThat(testAsignatura.getAsignatura()).isEqualTo(DEFAULT_ASIGNATURA);
    }

    @Test
    @Transactional
    void createAsignaturaWithExistingId() throws Exception {
        // Create the Asignatura with an existing ID
        asignatura.setId(1L);

        int databaseSizeBeforeCreate = asignaturaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAsignaturaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(asignatura)))
            .andExpect(status().isBadRequest());

        // Validate the Asignatura in the database
        List<Asignatura> asignaturaList = asignaturaRepository.findAll();
        assertThat(asignaturaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAsignaturas() throws Exception {
        // Initialize the database
        asignaturaRepository.saveAndFlush(asignatura);

        // Get all the asignaturaList
        restAsignaturaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(asignatura.getId().intValue())))
            .andExpect(jsonPath("$.[*].codeAsignatura").value(hasItem(DEFAULT_CODE_ASIGNATURA.doubleValue())))
            .andExpect(jsonPath("$.[*].asignatura").value(hasItem(DEFAULT_ASIGNATURA)));
    }

    @Test
    @Transactional
    void getAsignatura() throws Exception {
        // Initialize the database
        asignaturaRepository.saveAndFlush(asignatura);

        // Get the asignatura
        restAsignaturaMockMvc
            .perform(get(ENTITY_API_URL_ID, asignatura.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(asignatura.getId().intValue()))
            .andExpect(jsonPath("$.codeAsignatura").value(DEFAULT_CODE_ASIGNATURA.doubleValue()))
            .andExpect(jsonPath("$.asignatura").value(DEFAULT_ASIGNATURA));
    }

    @Test
    @Transactional
    void getNonExistingAsignatura() throws Exception {
        // Get the asignatura
        restAsignaturaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAsignatura() throws Exception {
        // Initialize the database
        asignaturaRepository.saveAndFlush(asignatura);

        int databaseSizeBeforeUpdate = asignaturaRepository.findAll().size();

        // Update the asignatura
        Asignatura updatedAsignatura = asignaturaRepository.findById(asignatura.getId()).get();
        // Disconnect from session so that the updates on updatedAsignatura are not directly saved in db
        em.detach(updatedAsignatura);
        updatedAsignatura.codeAsignatura(UPDATED_CODE_ASIGNATURA).asignatura(UPDATED_ASIGNATURA);

        restAsignaturaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAsignatura.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAsignatura))
            )
            .andExpect(status().isOk());

        // Validate the Asignatura in the database
        List<Asignatura> asignaturaList = asignaturaRepository.findAll();
        assertThat(asignaturaList).hasSize(databaseSizeBeforeUpdate);
        Asignatura testAsignatura = asignaturaList.get(asignaturaList.size() - 1);
        assertThat(testAsignatura.getCodeAsignatura()).isEqualTo(UPDATED_CODE_ASIGNATURA);
        assertThat(testAsignatura.getAsignatura()).isEqualTo(UPDATED_ASIGNATURA);
    }

    @Test
    @Transactional
    void putNonExistingAsignatura() throws Exception {
        int databaseSizeBeforeUpdate = asignaturaRepository.findAll().size();
        asignatura.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAsignaturaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, asignatura.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(asignatura))
            )
            .andExpect(status().isBadRequest());

        // Validate the Asignatura in the database
        List<Asignatura> asignaturaList = asignaturaRepository.findAll();
        assertThat(asignaturaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAsignatura() throws Exception {
        int databaseSizeBeforeUpdate = asignaturaRepository.findAll().size();
        asignatura.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAsignaturaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(asignatura))
            )
            .andExpect(status().isBadRequest());

        // Validate the Asignatura in the database
        List<Asignatura> asignaturaList = asignaturaRepository.findAll();
        assertThat(asignaturaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAsignatura() throws Exception {
        int databaseSizeBeforeUpdate = asignaturaRepository.findAll().size();
        asignatura.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAsignaturaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(asignatura)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Asignatura in the database
        List<Asignatura> asignaturaList = asignaturaRepository.findAll();
        assertThat(asignaturaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAsignaturaWithPatch() throws Exception {
        // Initialize the database
        asignaturaRepository.saveAndFlush(asignatura);

        int databaseSizeBeforeUpdate = asignaturaRepository.findAll().size();

        // Update the asignatura using partial update
        Asignatura partialUpdatedAsignatura = new Asignatura();
        partialUpdatedAsignatura.setId(asignatura.getId());

        partialUpdatedAsignatura.codeAsignatura(UPDATED_CODE_ASIGNATURA);

        restAsignaturaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAsignatura.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAsignatura))
            )
            .andExpect(status().isOk());

        // Validate the Asignatura in the database
        List<Asignatura> asignaturaList = asignaturaRepository.findAll();
        assertThat(asignaturaList).hasSize(databaseSizeBeforeUpdate);
        Asignatura testAsignatura = asignaturaList.get(asignaturaList.size() - 1);
        assertThat(testAsignatura.getCodeAsignatura()).isEqualTo(UPDATED_CODE_ASIGNATURA);
        assertThat(testAsignatura.getAsignatura()).isEqualTo(DEFAULT_ASIGNATURA);
    }

    @Test
    @Transactional
    void fullUpdateAsignaturaWithPatch() throws Exception {
        // Initialize the database
        asignaturaRepository.saveAndFlush(asignatura);

        int databaseSizeBeforeUpdate = asignaturaRepository.findAll().size();

        // Update the asignatura using partial update
        Asignatura partialUpdatedAsignatura = new Asignatura();
        partialUpdatedAsignatura.setId(asignatura.getId());

        partialUpdatedAsignatura.codeAsignatura(UPDATED_CODE_ASIGNATURA).asignatura(UPDATED_ASIGNATURA);

        restAsignaturaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAsignatura.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAsignatura))
            )
            .andExpect(status().isOk());

        // Validate the Asignatura in the database
        List<Asignatura> asignaturaList = asignaturaRepository.findAll();
        assertThat(asignaturaList).hasSize(databaseSizeBeforeUpdate);
        Asignatura testAsignatura = asignaturaList.get(asignaturaList.size() - 1);
        assertThat(testAsignatura.getCodeAsignatura()).isEqualTo(UPDATED_CODE_ASIGNATURA);
        assertThat(testAsignatura.getAsignatura()).isEqualTo(UPDATED_ASIGNATURA);
    }

    @Test
    @Transactional
    void patchNonExistingAsignatura() throws Exception {
        int databaseSizeBeforeUpdate = asignaturaRepository.findAll().size();
        asignatura.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAsignaturaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, asignatura.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(asignatura))
            )
            .andExpect(status().isBadRequest());

        // Validate the Asignatura in the database
        List<Asignatura> asignaturaList = asignaturaRepository.findAll();
        assertThat(asignaturaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAsignatura() throws Exception {
        int databaseSizeBeforeUpdate = asignaturaRepository.findAll().size();
        asignatura.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAsignaturaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(asignatura))
            )
            .andExpect(status().isBadRequest());

        // Validate the Asignatura in the database
        List<Asignatura> asignaturaList = asignaturaRepository.findAll();
        assertThat(asignaturaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAsignatura() throws Exception {
        int databaseSizeBeforeUpdate = asignaturaRepository.findAll().size();
        asignatura.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAsignaturaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(asignatura))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Asignatura in the database
        List<Asignatura> asignaturaList = asignaturaRepository.findAll();
        assertThat(asignaturaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAsignatura() throws Exception {
        // Initialize the database
        asignaturaRepository.saveAndFlush(asignatura);

        int databaseSizeBeforeDelete = asignaturaRepository.findAll().size();

        // Delete the asignatura
        restAsignaturaMockMvc
            .perform(delete(ENTITY_API_URL_ID, asignatura.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Asignatura> asignaturaList = asignaturaRepository.findAll();
        assertThat(asignaturaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

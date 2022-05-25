package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Sede;
import co.edu.sena.repository.SedeRepository;
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
 * Integration tests for the {@link SedeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SedeResourceIT {

    private static final String DEFAULT_CORREO_SEDE = "AAAAAAAAAA";
    private static final String UPDATED_CORREO_SEDE = "BBBBBBBBBB";

    private static final String DEFAULT_DIRECCIO_SEDE = "AAAAAAAAAA";
    private static final String UPDATED_DIRECCIO_SEDE = "BBBBBBBBBB";

    private static final String DEFAULT_NOMBRE_SEDE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_SEDE = "BBBBBBBBBB";

    private static final String DEFAULT_TELEFONO_SEDE = "AAAAAAAAAA";
    private static final String UPDATED_TELEFONO_SEDE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sedes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SedeRepository sedeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSedeMockMvc;

    private Sede sede;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sede createEntity(EntityManager em) {
        Sede sede = new Sede()
            .correoSede(DEFAULT_CORREO_SEDE)
            .direccioSede(DEFAULT_DIRECCIO_SEDE)
            .nombreSede(DEFAULT_NOMBRE_SEDE)
            .telefonoSede(DEFAULT_TELEFONO_SEDE);
        return sede;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sede createUpdatedEntity(EntityManager em) {
        Sede sede = new Sede()
            .correoSede(UPDATED_CORREO_SEDE)
            .direccioSede(UPDATED_DIRECCIO_SEDE)
            .nombreSede(UPDATED_NOMBRE_SEDE)
            .telefonoSede(UPDATED_TELEFONO_SEDE);
        return sede;
    }

    @BeforeEach
    public void initTest() {
        sede = createEntity(em);
    }

    @Test
    @Transactional
    void createSede() throws Exception {
        int databaseSizeBeforeCreate = sedeRepository.findAll().size();
        // Create the Sede
        restSedeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sede)))
            .andExpect(status().isCreated());

        // Validate the Sede in the database
        List<Sede> sedeList = sedeRepository.findAll();
        assertThat(sedeList).hasSize(databaseSizeBeforeCreate + 1);
        Sede testSede = sedeList.get(sedeList.size() - 1);
        assertThat(testSede.getCorreoSede()).isEqualTo(DEFAULT_CORREO_SEDE);
        assertThat(testSede.getDireccioSede()).isEqualTo(DEFAULT_DIRECCIO_SEDE);
        assertThat(testSede.getNombreSede()).isEqualTo(DEFAULT_NOMBRE_SEDE);
        assertThat(testSede.getTelefonoSede()).isEqualTo(DEFAULT_TELEFONO_SEDE);
    }

    @Test
    @Transactional
    void createSedeWithExistingId() throws Exception {
        // Create the Sede with an existing ID
        sede.setId(1L);

        int databaseSizeBeforeCreate = sedeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSedeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sede)))
            .andExpect(status().isBadRequest());

        // Validate the Sede in the database
        List<Sede> sedeList = sedeRepository.findAll();
        assertThat(sedeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSedes() throws Exception {
        // Initialize the database
        sedeRepository.saveAndFlush(sede);

        // Get all the sedeList
        restSedeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sede.getId().intValue())))
            .andExpect(jsonPath("$.[*].correoSede").value(hasItem(DEFAULT_CORREO_SEDE)))
            .andExpect(jsonPath("$.[*].direccioSede").value(hasItem(DEFAULT_DIRECCIO_SEDE)))
            .andExpect(jsonPath("$.[*].nombreSede").value(hasItem(DEFAULT_NOMBRE_SEDE)))
            .andExpect(jsonPath("$.[*].telefonoSede").value(hasItem(DEFAULT_TELEFONO_SEDE)));
    }

    @Test
    @Transactional
    void getSede() throws Exception {
        // Initialize the database
        sedeRepository.saveAndFlush(sede);

        // Get the sede
        restSedeMockMvc
            .perform(get(ENTITY_API_URL_ID, sede.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sede.getId().intValue()))
            .andExpect(jsonPath("$.correoSede").value(DEFAULT_CORREO_SEDE))
            .andExpect(jsonPath("$.direccioSede").value(DEFAULT_DIRECCIO_SEDE))
            .andExpect(jsonPath("$.nombreSede").value(DEFAULT_NOMBRE_SEDE))
            .andExpect(jsonPath("$.telefonoSede").value(DEFAULT_TELEFONO_SEDE));
    }

    @Test
    @Transactional
    void getNonExistingSede() throws Exception {
        // Get the sede
        restSedeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSede() throws Exception {
        // Initialize the database
        sedeRepository.saveAndFlush(sede);

        int databaseSizeBeforeUpdate = sedeRepository.findAll().size();

        // Update the sede
        Sede updatedSede = sedeRepository.findById(sede.getId()).get();
        // Disconnect from session so that the updates on updatedSede are not directly saved in db
        em.detach(updatedSede);
        updatedSede
            .correoSede(UPDATED_CORREO_SEDE)
            .direccioSede(UPDATED_DIRECCIO_SEDE)
            .nombreSede(UPDATED_NOMBRE_SEDE)
            .telefonoSede(UPDATED_TELEFONO_SEDE);

        restSedeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSede.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSede))
            )
            .andExpect(status().isOk());

        // Validate the Sede in the database
        List<Sede> sedeList = sedeRepository.findAll();
        assertThat(sedeList).hasSize(databaseSizeBeforeUpdate);
        Sede testSede = sedeList.get(sedeList.size() - 1);
        assertThat(testSede.getCorreoSede()).isEqualTo(UPDATED_CORREO_SEDE);
        assertThat(testSede.getDireccioSede()).isEqualTo(UPDATED_DIRECCIO_SEDE);
        assertThat(testSede.getNombreSede()).isEqualTo(UPDATED_NOMBRE_SEDE);
        assertThat(testSede.getTelefonoSede()).isEqualTo(UPDATED_TELEFONO_SEDE);
    }

    @Test
    @Transactional
    void putNonExistingSede() throws Exception {
        int databaseSizeBeforeUpdate = sedeRepository.findAll().size();
        sede.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSedeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sede.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sede))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sede in the database
        List<Sede> sedeList = sedeRepository.findAll();
        assertThat(sedeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSede() throws Exception {
        int databaseSizeBeforeUpdate = sedeRepository.findAll().size();
        sede.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSedeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sede))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sede in the database
        List<Sede> sedeList = sedeRepository.findAll();
        assertThat(sedeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSede() throws Exception {
        int databaseSizeBeforeUpdate = sedeRepository.findAll().size();
        sede.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSedeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sede)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sede in the database
        List<Sede> sedeList = sedeRepository.findAll();
        assertThat(sedeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSedeWithPatch() throws Exception {
        // Initialize the database
        sedeRepository.saveAndFlush(sede);

        int databaseSizeBeforeUpdate = sedeRepository.findAll().size();

        // Update the sede using partial update
        Sede partialUpdatedSede = new Sede();
        partialUpdatedSede.setId(sede.getId());

        partialUpdatedSede.correoSede(UPDATED_CORREO_SEDE).nombreSede(UPDATED_NOMBRE_SEDE).telefonoSede(UPDATED_TELEFONO_SEDE);

        restSedeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSede.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSede))
            )
            .andExpect(status().isOk());

        // Validate the Sede in the database
        List<Sede> sedeList = sedeRepository.findAll();
        assertThat(sedeList).hasSize(databaseSizeBeforeUpdate);
        Sede testSede = sedeList.get(sedeList.size() - 1);
        assertThat(testSede.getCorreoSede()).isEqualTo(UPDATED_CORREO_SEDE);
        assertThat(testSede.getDireccioSede()).isEqualTo(DEFAULT_DIRECCIO_SEDE);
        assertThat(testSede.getNombreSede()).isEqualTo(UPDATED_NOMBRE_SEDE);
        assertThat(testSede.getTelefonoSede()).isEqualTo(UPDATED_TELEFONO_SEDE);
    }

    @Test
    @Transactional
    void fullUpdateSedeWithPatch() throws Exception {
        // Initialize the database
        sedeRepository.saveAndFlush(sede);

        int databaseSizeBeforeUpdate = sedeRepository.findAll().size();

        // Update the sede using partial update
        Sede partialUpdatedSede = new Sede();
        partialUpdatedSede.setId(sede.getId());

        partialUpdatedSede
            .correoSede(UPDATED_CORREO_SEDE)
            .direccioSede(UPDATED_DIRECCIO_SEDE)
            .nombreSede(UPDATED_NOMBRE_SEDE)
            .telefonoSede(UPDATED_TELEFONO_SEDE);

        restSedeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSede.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSede))
            )
            .andExpect(status().isOk());

        // Validate the Sede in the database
        List<Sede> sedeList = sedeRepository.findAll();
        assertThat(sedeList).hasSize(databaseSizeBeforeUpdate);
        Sede testSede = sedeList.get(sedeList.size() - 1);
        assertThat(testSede.getCorreoSede()).isEqualTo(UPDATED_CORREO_SEDE);
        assertThat(testSede.getDireccioSede()).isEqualTo(UPDATED_DIRECCIO_SEDE);
        assertThat(testSede.getNombreSede()).isEqualTo(UPDATED_NOMBRE_SEDE);
        assertThat(testSede.getTelefonoSede()).isEqualTo(UPDATED_TELEFONO_SEDE);
    }

    @Test
    @Transactional
    void patchNonExistingSede() throws Exception {
        int databaseSizeBeforeUpdate = sedeRepository.findAll().size();
        sede.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSedeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sede.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sede))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sede in the database
        List<Sede> sedeList = sedeRepository.findAll();
        assertThat(sedeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSede() throws Exception {
        int databaseSizeBeforeUpdate = sedeRepository.findAll().size();
        sede.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSedeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sede))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sede in the database
        List<Sede> sedeList = sedeRepository.findAll();
        assertThat(sedeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSede() throws Exception {
        int databaseSizeBeforeUpdate = sedeRepository.findAll().size();
        sede.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSedeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sede)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sede in the database
        List<Sede> sedeList = sedeRepository.findAll();
        assertThat(sedeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSede() throws Exception {
        // Initialize the database
        sedeRepository.saveAndFlush(sede);

        int databaseSizeBeforeDelete = sedeRepository.findAll().size();

        // Delete the sede
        restSedeMockMvc
            .perform(delete(ENTITY_API_URL_ID, sede.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Sede> sedeList = sedeRepository.findAll();
        assertThat(sedeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

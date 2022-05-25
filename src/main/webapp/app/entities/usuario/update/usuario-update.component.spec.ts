import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UsuarioService } from '../service/usuario.service';
import { IUsuario, Usuario } from '../usuario.model';
import { IRol } from 'app/entities/rol/rol.model';
import { RolService } from 'app/entities/rol/service/rol.service';
import { IDireccion } from 'app/entities/direccion/direccion.model';
import { DireccionService } from 'app/entities/direccion/service/direccion.service';
import { ISede } from 'app/entities/sede/sede.model';
import { SedeService } from 'app/entities/sede/service/sede.service';

import { UsuarioUpdateComponent } from './usuario-update.component';

describe('Usuario Management Update Component', () => {
  let comp: UsuarioUpdateComponent;
  let fixture: ComponentFixture<UsuarioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let usuarioService: UsuarioService;
  let rolService: RolService;
  let direccionService: DireccionService;
  let sedeService: SedeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UsuarioUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(UsuarioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UsuarioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    usuarioService = TestBed.inject(UsuarioService);
    rolService = TestBed.inject(RolService);
    direccionService = TestBed.inject(DireccionService);
    sedeService = TestBed.inject(SedeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Rol query and add missing value', () => {
      const usuario: IUsuario = { id: 456 };
      const rol: IRol = { id: 48518 };
      usuario.rol = rol;

      const rolCollection: IRol[] = [{ id: 64498 }];
      jest.spyOn(rolService, 'query').mockReturnValue(of(new HttpResponse({ body: rolCollection })));
      const additionalRols = [rol];
      const expectedCollection: IRol[] = [...additionalRols, ...rolCollection];
      jest.spyOn(rolService, 'addRolToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(rolService.query).toHaveBeenCalled();
      expect(rolService.addRolToCollectionIfMissing).toHaveBeenCalledWith(rolCollection, ...additionalRols);
      expect(comp.rolsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Direccion query and add missing value', () => {
      const usuario: IUsuario = { id: 456 };
      const direccion: IDireccion = { id: 98708 };
      usuario.direccion = direccion;

      const direccionCollection: IDireccion[] = [{ id: 96778 }];
      jest.spyOn(direccionService, 'query').mockReturnValue(of(new HttpResponse({ body: direccionCollection })));
      const additionalDireccions = [direccion];
      const expectedCollection: IDireccion[] = [...additionalDireccions, ...direccionCollection];
      jest.spyOn(direccionService, 'addDireccionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(direccionService.query).toHaveBeenCalled();
      expect(direccionService.addDireccionToCollectionIfMissing).toHaveBeenCalledWith(direccionCollection, ...additionalDireccions);
      expect(comp.direccionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Sede query and add missing value', () => {
      const usuario: IUsuario = { id: 456 };
      const sede: ISede = { id: 92650 };
      usuario.sede = sede;

      const sedeCollection: ISede[] = [{ id: 99742 }];
      jest.spyOn(sedeService, 'query').mockReturnValue(of(new HttpResponse({ body: sedeCollection })));
      const additionalSedes = [sede];
      const expectedCollection: ISede[] = [...additionalSedes, ...sedeCollection];
      jest.spyOn(sedeService, 'addSedeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(sedeService.query).toHaveBeenCalled();
      expect(sedeService.addSedeToCollectionIfMissing).toHaveBeenCalledWith(sedeCollection, ...additionalSedes);
      expect(comp.sedesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const usuario: IUsuario = { id: 456 };
      const rol: IRol = { id: 76029 };
      usuario.rol = rol;
      const direccion: IDireccion = { id: 30985 };
      usuario.direccion = direccion;
      const sede: ISede = { id: 9661 };
      usuario.sede = sede;

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(usuario));
      expect(comp.rolsSharedCollection).toContain(rol);
      expect(comp.direccionsSharedCollection).toContain(direccion);
      expect(comp.sedesSharedCollection).toContain(sede);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Usuario>>();
      const usuario = { id: 123 };
      jest.spyOn(usuarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: usuario }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(usuarioService.update).toHaveBeenCalledWith(usuario);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Usuario>>();
      const usuario = new Usuario();
      jest.spyOn(usuarioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: usuario }));
      saveSubject.complete();

      // THEN
      expect(usuarioService.create).toHaveBeenCalledWith(usuario);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Usuario>>();
      const usuario = { id: 123 };
      jest.spyOn(usuarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(usuarioService.update).toHaveBeenCalledWith(usuario);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackRolById', () => {
      it('Should return tracked Rol primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRolById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackDireccionById', () => {
      it('Should return tracked Direccion primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDireccionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSedeById', () => {
      it('Should return tracked Sede primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSedeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});

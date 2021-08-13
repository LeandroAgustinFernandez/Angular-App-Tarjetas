import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})
export class CrearTarjetaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  titulo = "Crear Tarjeta";
  id: string | undefined;

  constructor(private fb: FormBuilder, private _tarjetaService: TarjetaService,private toastr: ToastrService) { 
    this.form = this.fb.group({
      titular: ['',Validators.required],
      numeroTarjeta: ['',[Validators.required,Validators.minLength(16),Validators.maxLength(16)]],
      fechaExpiracion: ['',[Validators.required,Validators.minLength(5),Validators.maxLength(5)]],
      cvv: ['',[Validators.required,Validators.minLength(3),Validators.maxLength(3)]]
    })
  }

  ngOnInit(): void {
    this._tarjetaService.getTarjetaEdit().subscribe(data => {
      this.id = data.id;
      this.titulo = "Editar Tarjeta";
      this.form.patchValue({
        titular: data.titular,
        cvv: data.cvv,
        fechaExpiracion: data.fechaExpiracion,
        numeroTarjeta: data.numeroTarjeta
      })
    })
  }

  guardarTarjeta(){
    // console.log(this.form);
    this.loading = true
    if (this.id == undefined) {
      this.crearTarjeta();
    }else{
      this.modificarTarjeta(this.id);
    }
   
  }

  crearTarjeta(){
    const TARJETA: TarjetaCredito = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }
    // console.log(TARJETA);
    this._tarjetaService.guardarTarjeta(TARJETA).then(()=>{
      this.loading = false;
      console.log('registro registrado');
      this.toastr.success('La tarjeta fue registrada con exito','Tarjeta Registrada')
      this.form.reset();
    },error => {
      this.loading = false;
      this.toastr.error('Opss.. ocurrio un error','Error')
      console.log(error)
    }   
    );
  }

  modificarTarjeta(id: string){
    const TARJETA: TarjetaCredito = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }
    // console.log(TARJETA);
    this._tarjetaService.editarTarjeta(id,TARJETA).then(()=>{
      this.loading = false;
      this.toastr.info('La tarjeta modifico con exito','Tarjeta Modificada')
      this.titulo = "Crear Tarjeta"
      this.form.reset();
    },error => {
      this.loading = false;
      this.titulo = "Crear Tarjeta"
      this.toastr.error('Opss.. ocurrio un error','Error')
      // console.log(error)
    }   
    );
  }

}

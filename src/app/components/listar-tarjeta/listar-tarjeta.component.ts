import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.css']
})
export class ListarTarjetaComponent implements OnInit {
  listTarjetas: TarjetaCredito[] = [];
  constructor(private _tarjetaservice: TarjetaService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this._tarjetaservice.obtenerTarjetas().subscribe(doc =>{
      this.listTarjetas = [];
      console.log(doc);
      doc.forEach((element: any) => {
        this.listTarjetas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.listTarjetas);
    })
  }

  eliminarTarjeta(id:any){
    this._tarjetaservice.eliminarTarjeta(id).then(() =>{
      this.toastr.success('Se elimino el registro correctamente','Registro Eliminado');
    },error => {
      this.toastr.error('Opss... no se pudo eliminar el registro','Error');
    }); 
  }

  editarTarjeta(tarjeta: TarjetaCredito){
      this._tarjetaservice.addTarjetaEdit(tarjeta);
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ContactosProvider } from '../../providers/contactos/contactos';
import { AlertController, LoadingController } from 'ionic-angular';

/**
 * Generated class for the SeguimientoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-seguimiento',
  templateUrl: 'seguimiento.html',
})
export class SeguimientoPage {
  datos:any;
  datosEnvio    :   any   = [];
  tipo          :   any;
  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams, 
      private storage: Storage, 
      private contactoProvider: ContactosProvider,
      public loadingCtrl: LoadingController,
      public alertCtrl: AlertController
  ) {
    this.datos = this.navParams.get('contacto');
    this.tipo = this.navParams.get('tipo');

    this.datosEnvio.mode = 'visit';
    if(this.tipo == 'c'){
      this.datosEnvio.f = 'A';
    }else{
      this.datosEnvio.f = 'B';
    }
    
    this.datosEnvio.name = this.datos.fullname;
    this.datosEnvio.folio = this.datos.visitid;
    this.datosEnvio.email = this.datos.email;
    this.datosEnvio.officename = this.datos.officename;
    this.datosEnvio.office = this.datos.office;
    this.datosEnvio.type = 'lead';
    this.storage.get('usuario').then(data=>{
      this.datosEnvio.userid = data;
    });
    this.storage.get('folio').then(data=>{
      
      this.datosEnvio.company = data;
    });

    

  }



  agregarSeguimiento(){
    const loader = this.loadingCtrl.create({
      dismissOnPageChange: false
    });
    loader.present();

    var UrlData = '';
    var datos = this.datosEnvio;
    Object.keys(datos).forEach(function(key){
      UrlData += '&' + key + '=' + datos[key];
    })

    
    var promise = this.contactoProvider.agregarComentario(UrlData);

    promise.subscribe(data=>{
      loader.dismiss();
      if(data.status == 200){
        const alerta = this.alertCtrl.create({
          title: 'AGREGADO',
          subTitle: 'El seguimiento fue agregado exitosamente',
          buttons: ['ok']
        });
        alerta.present();
        this.navCtrl.pop();
      }else{
        const alerta = this.alertCtrl.create({
          title: 'ERROR',
          subTitle: 'Hubo un error',
          buttons: ['ok']
        });
        alerta.present();
      }
    });


  }

}

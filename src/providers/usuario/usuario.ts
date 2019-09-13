import { ApiProvider } from '../api/api';
import { Http, Headers, RequestOptions, RequestMethod, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Header } from '../../../node_modules/ionic-angular/umd';
import { companyid } from '../../interfaces/datosContacto';
import { AlertController, Events,LoadingController } from 'ionic-angular';


// http://www.immosystem.com.mx/appImmov2/immoApp2.php?d=0&m=[eliminaresto]contact&folio=139&propertyid=16690&fullname=jair&email=asdasd@asdasda.com.mx&phone=998155881238&message=testeando&location=Av.%20Xpujil%20Sur%2039,%2015,%2077505%20Canc%C3%BAn,%20Q.R.,%20M%C3%A9xico&contacttype=1&latitude=21.1452964&longitude=-86.82968079999999&soldagentid=0

@Injectable()
export class UsuarioProvider {
  url:any = 'http://www.immosystem.com.mx/appImmov2/immoApp2.php';
  //body:any = 'mdvp=true&mode=user&f=G&email=jorge@immosystem.com.mx&password=Sysadmin32';
  companyid = 4;
  companyurl = 'http://crrivieramaya.com';
  companycontact;
  companyUser = 1671;
  companyOffice = 227;
  //-------------------------------------------------------------
  datos       : any = [];

  constructor(public http : Http, public apiProvider: ApiProvider,public alertCtrl: AlertController,private storage: Storage,public events: Events,public loadingCtrl: LoadingController) {
  }
  //------------------------------------------------------------------------------------------------------------
  //Login del usuario
  login(username:any, password:any) {
    const loader = this.loadingCtrl.create({
      dismissOnPageChange: false
    });
    loader.present();
    var body = 'm=login'+'&email='+username+'&password='+password;
    //---------------------------------------------//
    // Aquí hay que validar que el correo y pass   //
    // estén correctos antes de pasar al request   //
    //---------------------------------------------//
      this.apiProvider.post(body)
        .subscribe(data=>{
          var answerLogin = data.json().status;
          var dataLogin =  data.json().data;
          loader.dismiss();
          //Checar que pex con el .info que dice undefined
          if(answerLogin == 200 && dataLogin.info.companyid == this.companyid || dataLogin.info.companyid == 227 ){
            this.storage.set('usuario', data.json().data.info.userid);
            this.storage.set('data',data.json().data.info);
            this.storage.set('folio', data.json().data.info.companyid);
            this.datos.userid = data.json().data.userid;
            this.datos.officeid = data.json().data.officeid;
            this.datos.companyid = data.json().data.companyid;

            this.storage.set('assign', this.datos);

            this.events.publish('user:created', data.json().data.info, Date.now());
          }else{
            this.incorrectAlert();
          }
        })

  }

// metodo para la seccion de destino para cargar los destinos
  cargarDestino(){
    let body    : string  =   'm=developments&folio='+ companyid +'&states=1',
        header  : any     =   new Headers({'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}),
        options : any     =   new RequestOptions({headers: header});
    return this.http.post(this.url, body, options);
  }
// metodo para cargar la seccion de contactos

cargarContacto(id:any){
  let body    : string  =   'm=visits&user='+id,
      header  : any     =   new Headers({'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}),
      options : any     =   new RequestOptions({headers: header});
  return this.http.post(this.url, body, options);
}

cargarContactoReferidos(id:any){
  let body    : string  =   'm=visitsPreregister&user='+id,
      header  : any     =   new Headers({'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}),
      options : any     =   new RequestOptions({headers: header});
      return this.http.post(this.url, body, options);
}

cargarContactoPotencial(id:any){
  let body    : string  =   'm=potentialBuyers&folio='+ 4 +'&user='+id,
      header  : any     =   new Headers({'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}),
      options : any     =   new RequestOptions({headers: header});
      return this.http.post(this.url, body, options);
}

verContacto(id:any, idUsuario){
  let body    : string  = 'm=visit&user='+ idUsuario +'&visitid=' + id,
      header  : any     = new Headers({'content-type':  'application/x-www-form-urlencoded; charset=UTF-8'}),
      options : any     = new RequestOptions({headers: header});
  return this.http.post(this.url, body, options);
}

verContactoReferido(id:any, idUsuario){
  let body    : string  = 'm=visitPreregister&user='+ idUsuario +'&visitid=' + id,
      header  : any     = new Headers({'content-type':  'application/x-www-form-urlencoded; charset=UTF-8'}),
      options : any     = new RequestOptions({headers: header});
  return this.http.post(this.url, body, options);
}

// http://www.immosystem.com.mx/appImmov2/immoApp2.php?&d=0&m=notifications&property=17846&name=Jair&email=jorge.ascension@outlook.com&phone=6545&message=100

agregarPreregistro(datos:any){
  let body    : string  = 'm=addBuyerPreregister',
      header  : any     = new Headers({'content-type':  'application/x-www-form-urlencoded; charset=UTF-8'}),
      options : any     = new RequestOptions({headers: header});

      var UrlData = '';
      var datos = datos;
      Object.keys(datos).forEach(function(key){
        body += '&' + key + '=' + datos[key];
      })
  return this.http.post(this.url, body, options);
}

enviarPropiedadMail(datos:any){
  let body    : string  = 'm=notifications&property='+ datos.property +'&name=' + datos.name + '&email=' + datos.email + '&phone=' + datos.phone + '&message=' + datos.message+'&agent=true',
      header  : any     = new Headers({'content-type':  'application/x-www-form-urlencoded; charset=UTF-8'}),
      options : any     = new RequestOptions({headers: header});

  return this.http.post(this.url, body, options);
}


enviarDesarrolloMail(datos:any){
  let body    : string  = 'm=notifications&development='+ datos.development +'&name=' + datos.name + '&email=' + datos.email + '&phone=' + datos.phone + '&message=' + datos.message+'&agent=true',
      header  : any     = new Headers({'content-type':  'application/x-www-form-urlencoded; charset=UTF-8'}),
      options : any     = new RequestOptions({headers: header});

  return this.http.post(this.url, body, options);
}

// http://www.immosystem.com.mx/appImmov2/immoApp2.php?d=0&m=contact&folio=
guardarMailDB(datos:any){
  let body    :   string  =   'm=contact&fullname=' + datos.fullname + '&email=' + datos.email + '&phone=' + datos.phone + '&message=' + datos.message + '&contacttype=' + datos.contacttype + '&propertyid=' + datos.propertyid + '&folio=' + datos.folio + '&soldagentid=' + datos.soldagentid,
  header  :   any     =   new Headers({'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}),
  options :   any     =   new RequestOptions({headers: header});
  return this.http.post(this.url, body, options);
}

getTask(id){
  let body    :   string  =   'm=task&user=' + id,
  header  :   any     =   new Headers({'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}),
  options :   any     =   new RequestOptions({headers: header});
  return this.http.post(this.url, body, options);
}

addTask(data){
  let body    :   string  =   data,
  header  :   any     =   new Headers({'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}),
  options :   any     =   new RequestOptions({headers: header});
  return this.http.post(this.url, body, options);
}

getLeads(data){
  let body    :   string  =   'function=loadLocations' + data,
  header  :   any     =   new Headers({'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}),
  options :   any     =   new RequestOptions({headers: header});
  return this.http.post('http://www.immosystem.com.mx/appImmo/immoApp.php', body, options);
}
//---------------------------------------------------------------------------------------------------------------
//Alerta de Datos incorrectos
incorrectAlert(){
  let alert = this.alertCtrl.create({
    title: 'Datos incorrectos',
    message: 'Revisa bien los datos ingresados',
  });
  alert.present();
}



}

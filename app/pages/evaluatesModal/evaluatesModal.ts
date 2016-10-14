import { Component  } from '@angular/core';
import { NavParams, ViewController, AlertController, LoadingController, Storage, SqlStorage } from 'ionic-angular';
import { Places, Vote } from '../../model/models';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Globals } from '../../globals';


@Component({
  templateUrl: 'build/pages/evaluatesModal/evaluatesModal.html'
})

export class EvaluatesModal {
  place: Places;
  placeShare: any;
  tab1Root: any;
  tab2Root: any;
  numVotes: any;
  numComments: any;

  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.place = params.get("place");
    this.placeShare = { place: this.place };
    this.numComments = this.place.TotalComments;
    this.numVotes = this.place.TotalVotes;
    if (this.numComments == 0) this.numComments = "";
    if (this.numVotes == 0) this.numVotes = "";

    this.tab1Root = EvaluatesContent;
    this.tab2Root = EvaluatesComments;
    // tab3Root = Page3;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}



@Component({
  templateUrl: 'build/pages/evaluatesModal/evaluates.html'
})
export class EvaluatesContent {
  place: Places;
  storage: Storage;
  uuid: string;

  constructor(private navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController, private http: Http) {
    this.place = navParams.get("place");
    this.storage = new Storage(SqlStorage);

    this.storage.get("uuid").then((res) => {
      this.uuid = res;
    });
  }

  vote(place: Places, vote: Vote, choice: number, tentatives: number) {

    vote.MyVote = choice;

    this.http.post(Globals.urlApi + "/api/V2/Places/Vote",
      { PlaceId: place.PlacesId, AccessibilityId: vote.AccessibilityId, Vote: choice, Uuid: this.uuid }).map(res => res.json())
      .subscribe((resp) => {
      }, (err) => {
        console.log(err);
        if (tentatives == 3) {
          this.alertCtrl.create({
            title: "Erro",
            message: "Sem conexão"
          }).present();
        }


      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}



@Component({
  templateUrl: 'build/pages/evaluatesModal/comments.html'
})
export class EvaluatesComments {
  place: Places;
  storage: Storage;
  uuid: string;
  comment:any = {};

  constructor(private navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController, private loadingCtrl:LoadingController, private http: Http) {
    this.place = navParams.get("place");
    this.storage = new Storage(SqlStorage);

    this.storage.get("uuid").then((res) => {
      this.uuid = res;
    });
  }

  sendComment(){
    let load = this.loadingCtrl.create({
      content: "Aguarde...",
      duration: 4000
    })
    load.present();
    this.http.post(Globals.urlApi+"/api/V2/Comments/Send", 
    { Name: this.comment.name, Message: this.comment.message, PlaceId: this.place.PlacesId, Uuid: this.uuid })
    .map(res => res.json()).subscribe((res) => {
        load.dismiss();
        this.alertCtrl.create({
          title: "Sucesso!",
          message: "Muito obrigado pelo seu comentário, em breve, ele aparecerá aqui.",
          buttons: ["Ok"]
        }).present();
    }, (err) => {
      console.log(err);
        load.dismiss();
      this.alertCtrl.create({
          title: "Erro",
          message: "Ocorreu um erro ao enviar se comentário, por favor, tente novamente.",
          buttons: ["Ok"]
        }).present();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


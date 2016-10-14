import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { Globals } from '../../../globals';
import { Places } from '../../../model/models';
import { AlertService } from '../../../providers/alert/alert';
import { NavParams, ViewController, LoadingController, Storage, SqlStorage } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/evaluatesModal/comments/comments.html',
    providers: [AlertService]
})

export class EvaluatesComments {
    place: Places;
    storage: Storage;
    uuid: string;
    comment: any = {};

    constructor(private navParams: NavParams, private viewCtrl: ViewController,
        private alertCtrl: AlertService, private loadingCtrl: LoadingController, private http: Http) {
        this.place = navParams.get("place");
        this.storage = new Storage(SqlStorage);

        this.storage.get("uuid").then((res) => {
            this.uuid = res;
        });
    }

    sendComment() {
        let load = this.loadingCtrl.create({
            content: "Aguarde...",
            duration: 4000
        })
        load.present();
        this.http.post(Globals.urlApi + "/api/V2/Comments/Send",
            { Name: this.comment.name, Message: this.comment.message, PlaceId: this.place.PlacesId, Uuid: this.uuid })
            .map(res => res.json()).subscribe((res) => {
                load.dismiss();
                this.alertCtrl.presentAlert("Sucesso!", "Muito obrigado pelo seu comentário, em breve, ele aparecerá aqui.");
            }, (err) => {
                console.log(err);
                load.dismiss();
                this.alertCtrl.presentErrorAlert("Ocorreu um erro ao enviar se comentário, por favor, tente novamente.");
            });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
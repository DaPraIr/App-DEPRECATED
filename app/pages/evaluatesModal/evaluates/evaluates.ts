import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { Globals } from '../../../globals';
import { Places, Vote } from '../../../model/models';
import { AlertService } from '../../../providers/alert/alert';
import { NavParams, ViewController, LoadingController, Storage, SqlStorage } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/evaluatesModal/evaluates/evaluates.html',
    providers: [AlertService]
})

export class EvaluatesContent {
    place: Places;
    storage: Storage;
    uuid: string;

    constructor(private navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertService, private http: Http) {
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
                    this.alertCtrl.presentErrorAlert("Sem conexão");
                }
            });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
} 

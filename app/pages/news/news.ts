import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { Globals } from '../../globals';
import { Component } from '@angular/core';
import { AlertService } from '../../providers/alert/alert';
import { Device, SpinnerDialog, InAppBrowser, AdMob } from 'ionic-native';
import { NavController, ModalController, Tabs, LoadingController, Storage, SqlStorage } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/news/news.html',
    providers: [AlertService]
})

export class NewsPage {

    storage: Storage;

    evaluated: any = [];
    comments: any = [];
    news: any = [];
    facebook: any = {};

    feedback: any = {}
    device: String;

    constructor(public navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertService, private loadingController: LoadingController, private http: Http) {
        SpinnerDialog.show("Aguarde...");
        this.storage = new Storage(SqlStorage);
        this.getNewsData(0);
        this.storage.get("uuid").then((res) => {
            this.device = res;
        });
    }

    sendFeedback() {
        this.http.post(Globals.urlApi + "/api/V2/ReciveFeedback", {
            Name: this.feedback.name, Email: this.feedback.email,
            Message: this.feedback.message, Uuid: this.device
        }).map(res => res.json())
            .subscribe((res) => {
                this.alertCtrl.presentAlert("Obrigado!", "Sua mensagem foi enviada com sucesso! Obrigado!");
            }, (err) => {
                this.alertCtrl.presentErrorAlert("Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.");
                console.log(err);
            });
    }

    goFacebook() {
        InAppBrowser.open("https://www.facebook.com/AppDaPraIr", "_system");
    }

    getNewsData(attempts: number = 0) {

        this.http.get(Globals.urlApi + "/api/V2/App/Home").map(res => res.json()).subscribe(data => {
            this.news = data.News;
            this.facebook = data.Facebook;

            //this.loader.dismiss();
            SpinnerDialog.hide();
        }, (err) => {
            if (attempts == 0) {
                this.alertCtrl.presentErrorAlert("Aparentemente você está sem conexão com a internet. Por favor, verifique se seu Wifi ou dados móveis estão ativos.");
            }
            console.log(err);
            /*if(attempts < 5){
            attempts++;
            this.getNewsData(attempts);
            }*/
        });
    }
}

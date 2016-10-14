import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { Globals } from '../../globals';
import { Component } from '@angular/core';
import { UserLocation, Places } from '../../model/models';
import { AlertService } from '../../providers/alert/alert';
import { LaunchNavigator, Geolocation } from 'ionic-native';
import { AutocompletePage } from '../listPlaces/autocomplete';
import { EvaluatesModal } from '../evaluatesModal/evaluatesModal';
import { NavController, LoadingController, ModalController, Storage, SqlStorage } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/listPlaces/listPlaces.html',
    providers: [AlertService]
})
export class ListPlaces {
    storage: Storage;
    location: UserLocation;
    places: Array<Places>;
    uuid: any;
    loading: any;
    search: string;
    searchLat: any;
    searchLng: any;
    myAddress: string;
    google: any;

    map = new google.maps.Map(document.createElement('div'));
    details = new google.maps.places.PlacesService(this.map);

    constructor(public navCtrl: NavController, private http: Http, private alertCtrl: AlertService, private loadingCtrl: LoadingController, private modalCtrl: ModalController) {

        this.storage = new Storage(SqlStorage);
        this.search = "";
        this.myAddress = "";
        this.searchLat = null;
        this.searchLng = null;

        this.storage.get("uuid").then((res) => {
            this.uuid = res
        });;

        Geolocation.getCurrentPosition({ maximumAge: 350000, timeout: 5000 }).then((res) => {
            this.location = new UserLocation(res.coords.latitude, res.coords.longitude);
            this.getData(true);
        }, (err) => {
            this.alertCtrl.presentAlert("Erro no GPS", "Ainda não te localizamos! O GPS do seu despositivo está ativado?");
        });

        Geolocation.watchPosition({
            maximumAge: 350000,
            timeout: 5000
        }).subscribe((res) => {
            this.location = new UserLocation(res.coords.latitude, res.coords.longitude);
            this.getData(false);
        })
    }

    searchLocation() {
        console.log(this.myAddress);
    }

    showAddressModal() {
        let modal = this.modalCtrl.create(AutocompletePage);
        let me = this;
        modal.onDidDismiss(data => {
            this.myAddress = data.description;
            let loading = this.loadingCtrl.create({
                content: "Aguarde...",
                duration: 5000
            });
            loading.present();
            this.http.get("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + data.place_id + "&key=**REMOVED**")
                .map(res => res.json()).subscribe((res) => {
                    console.log(res);
                    this.searchLat = res.result.geometry.location.lat;
                    this.searchLng = res.result.geometry.location.lng;
                    loading.dismiss();
                })
        });
        modal.present();
    }

    getData(createLoading: boolean) {
        if (createLoading) {
            this.loading = this.loadingCtrl.create({
                content: "Por favor, aguarde..."
            });
        }
        this.loading.present();
        let url = Globals.urlApi + "/api/V2/Places/Around?uuid=" + this.uuid;
        if (this.search.length > 1) url += "&query=" + this.search
        if (this.searchLat == null || this.searchLng == null) {
            if (this.location == null || this.location.Latitude == null || this.location.Longitude == null) {
                this.location = new UserLocation(-23.5846785, -46.6511356);
            }
            url += "&lat=" + this.location.Latitude + "&lng=" + this.location.Longitude;
        } else {
            url += "&lat=" + this.searchLat + "&lng=" + this.searchLng;
        }

        this.http.get(url)
            .map(res => res.json()).subscribe((resp) => {
                this.loading.dismiss();
                this.places = resp;
            }, (err) => {
                this.alertCtrl.presentAlertWithCallback("Erro", "Ocorreu um erro ao acessar o servidor!").then((yes) => {
                    if (yes) {
                        this.getData(true);
                    }
                });
            });
    }

    navigate(latitude: number, longitude: number) {
        LaunchNavigator.navigate([latitude, longitude]).then((success) => {

        }, (err) => {
            this.alertCtrl.presentAlert("Ocorreu um erro...", "Por favor, verifique se seu aparelho tem algum aplicativo de mapas.");
        });
    }

    evaluates(place: Places) {
        this.modalCtrl.create(EvaluatesModal, { place: place }).present();
    }
}

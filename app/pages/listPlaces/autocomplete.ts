import { Component, NgZone } from '@angular/core';
import { ViewController, LoadingController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/listPlaces/autocomplete.html'
})

export class AutocompletePage {
    autocompleteItems;
    autocomplete;
    service = new google.maps.places.AutocompleteService();

    constructor(public viewCtrl: ViewController, private zone: NgZone, private loadingCtrl: LoadingController) {
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {
        this.viewCtrl.dismiss(item);
    }

    updateSearch() {
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let me = this;
        this.service.getPlacePredictions({ input: this.autocomplete.query }, function (predictions, status) {
            me.autocompleteItems = [];
            me.zone.run(function () {
                predictions.forEach(function (prediction) {
                    me.autocompleteItems.push(prediction);
                });
            });
        });
    }
}

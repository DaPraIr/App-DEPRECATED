import { Globals } from '../../globals';
import { Component } from '@angular/core';
import { Places, Vote } from '../../model/models';
import { EvaluatesComments } from './comments/comments';
import { EvaluatesContent } from './evaluates/evaluates';
import { NavParams, ViewController } from 'ionic-angular';

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

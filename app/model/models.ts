import { Injectable } from '@angular/core';
import { Storage, SqlStorage } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

export class Feedback {

}

export class UserLocation {
    public Latitude: number;
    public Longitude: number;

    constructor(latitude: number, longitude: number) {
        this.Latitude = latitude;
        this.Longitude = longitude;
    }
}

export class Places {
    PlacesId: string;
    Name: string;
    Address: string;
    Latitude: number;
    Longitude: number;
    Positives: number;
    Negatives: number;
    TotalComments: number;
    TotalVotes: number;
    Votes: Array<Vote>;
    Distance: number;
}

export class Vote {
    Name: string;
    AccessibilityId: number;
    Positive: number;
    Negative: number;
    MyVote: number;
}
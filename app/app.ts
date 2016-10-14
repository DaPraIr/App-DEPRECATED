import { Component } from '@angular/core';
import { TabsPage } from './pages/tabs/tabs';
import { StatusBar, Device, AdMob } from 'ionic-native';
import { Platform, ionicBootstrap, Storage, SqlStorage } from 'ionic-angular';

@Component({
    template: '<ion-nav [root]="rootPage"></ion-nav>'
})

export class MyApp {

    public rootPage: any;

    constructor(private platform: Platform) {
        this.rootPage = TabsPage;

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();

            let uuid: string = "";

            platform.ready().then(() => {
                let storage = new Storage(SqlStorage);

                // Store a id for device to control

                storage.get("uuid").then((res) => {
                    if (res == undefined || res == "") {
                        window['plugins'].uniqueDeviceID.get((u) => {
                            uuid = u;
                            if (uuid == undefined || uuid == null) {
                                if (Device.device.uuid != undefined) uuid = Device.device.uuid;
                                else if (Device.device.serial != undefined) uuid = Device.device.serial;
                                else uuid = "annonymous";

                            }
                            storage.set("uuid", uuid);
                        }, (err) => {
                            console.log(err);
                        });

                    }
                }, (err) => {
                    window['plugins'].uniqueDeviceID.get((u) => {
                        uuid = u;
                        if (uuid == undefined || uuid == null) {
                            if (Device.device.uuid != undefined) uuid = Device.device.uuid;
                            else if (Device.device.serial != undefined) uuid = Device.device.serial;
                            else uuid = "annonymous";

                        }
                        storage.set("uuid", uuid);
                    }, (err) => {
                        console.log(err);
                    });

                })

                //StatusBar.styleDefault();
                StatusBar.backgroundColorByName("blue");
                StatusBar.backgroundColorByHexString("#2196F3");
                StatusBar.overlaysWebView(false);

                storage.get("AdMob").then((res) => {
                    if (res == 1) {
                        AdMob.createBanner({
                            adId: "**REMOVED**",
                            autoShow: true
                        });
                    }
                })

                storage.set("AdMob", 1);
            });
        });
    }
}

ionicBootstrap(MyApp);

import { Component, SimpleChanges, OnChanges, OnInit } from "@angular/core";

@Component({
    selector: "LogoutButton",
    moduleId: module.id,
    templateUrl: "./logout-button.component.html",
    styleUrls: ["./logout-button.component.css"]
})
export class MyLogoutComponent implements OnInit, OnChanges {

    constructor() {

    }

    ngOnInit(): void {
    }
    ngOnChanges(changes: SimpleChanges): void {
    }

    showLoader() {

    }
}

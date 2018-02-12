import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'ns-linkedin-login',
    moduleId: module.id,
    templateUrl: './linkedin-login.component.html',
    styleUrls: ['./linkedin-login.component.css']
})
export class LinkedInLoginComponent implements OnInit, OnDestroy, AfterViewInit {

    // private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor() {

    }

    ngOnInit(): void {
        //
    }
    ngOnDestroy(): void {

    }
    ngAfterViewInit() {

    }
    backToLogin() {

    }
}

import { Component, OnInit, Input } from '@angular/core';

export interface IHeaderItem {
    action?: () => any,
    icon?: string,
    title?: string
}

@Component({
    selector: 'my-header',
    templateUrl: './my-header.component.html',
    styleUrls: ['./my-header.component.scss']
})
export class MyHeaderComponent implements OnInit {
    @Input() public title: string = 'Giddh';
    @Input() public leftSideItem: IHeaderItem;
    @Input() public rightSideItem: IHeaderItem;
    constructor() { }

    ngOnInit() { }
}

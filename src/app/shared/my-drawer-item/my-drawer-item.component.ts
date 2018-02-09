import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { MyDrawerItem } from "./my-drawer-item";
import { RouterService } from "../../services/router.service";

@Component({
    selector: "MyDrawerItem",
    moduleId: module.id,
    templateUrl: "./my-drawer-item.component.html",
    styleUrls: ["./my-drawer-item.component.css"]
})
export class MyDrawerItemComponent implements OnInit {
    @Input() mydraweritem: MyDrawerItem;
    @Input() icon: string;
    @Output() public itemSelected: EventEmitter<any> = new EventEmitter();

    constructor(private routerExtensions: RouterService) {

    }

    ngOnInit(): void {
    }
    onNavItemTap(): void {
        this.itemSelected.emit();
    }
}

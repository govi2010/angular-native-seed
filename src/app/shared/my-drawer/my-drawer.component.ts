import { Component, Input, OnInit, EventEmitter, Output, ContentChild, TemplateRef } from "@angular/core";
import { MyDrawerItem } from "../my-drawer-item/my-drawer-item";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";
import { UserDetails, VerifyEmailResponseModel } from "../../models/api-models/loginModels";
import { Observable } from "rxjs/Observable";
import { RouterService } from "../../services/router.service";
import { Subject } from "rxjs/Subject";

/* ***********************************************************
* Keep data that is displayed in your app drawer in the MyDrawer component class.
* Add new data objects that you want to display in the drawer here in the form of properties.
*************************************************************/
@Component({
    selector: "MyDrawer",
    moduleId: module.id,
    templateUrl: "./my-drawer.component.html",
    styleUrls: ["./my-drawer.component.scss"]
})
export class MyDrawerComponent implements OnInit {
    public user$: Observable<VerifyEmailResponseModel>;
    public isOpened: boolean = false;
    @Input() selectedPage: string;
    @Output() public itemSelected: EventEmitter<MyDrawerItem> = new EventEmitter();
    @Input() pages: MyDrawerItem[];

    @ContentChild('optionTemplate') public optionTemplate: TemplateRef<any>;

    constructor(private store: Store<AppState>, private routerExtensions: RouterService) {
        this.user$ = this.store.select(p => p.session.user);
    }

    ngOnInit(): void {
    }

    public toggle() {
        this.isOpened = !this.isOpened;
    }

    public onNavItemTap(item: MyDrawerItem) {
        if (item.router && item.router !== '') {
            this.routerExtensions.router.navigate([item.router]);
        } else {
            this.itemSelected.emit(item);
        }
    }

}

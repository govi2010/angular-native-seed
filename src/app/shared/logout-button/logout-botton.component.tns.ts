import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChange, SimpleChanges } from "@angular/core";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { LoginActions } from "../../actions/login/login.action";
import { RouterService } from "../../services/router.service";
import { ToasterService } from "../../services/toaster.service";

/* ***********************************************************
* Keep data that is displayed in your app drawer in the MyDrawer component class.
* Add new data objects that you want to display in the drawer here in the form of properties.
*************************************************************/
@Component({
    selector: "LogoutButton",
    moduleId: module.id,
    templateUrl: "./logout-button.component.html",
    styleUrls: ["./logout-button.component.css"]
})
export class MyLogoutComponent implements OnInit, OnChanges {

    constructor(private store: Store<AppState>, private routerExtensions: RouterService, private _loginActions: LoginActions,
        private _toaster: ToasterService) {
        this.store.select(p => p.session.user).subscribe((p) => {
            if (p) {
            } else {
                this.routerExtensions.router.navigateByUrl('/login', { clearHistory: true });

            }
        })
    }

    ngOnInit(): void {
    }
    ngOnChanges(changes: SimpleChanges): void {
    }

    showLoader() {

    }

    public logout() {

        this._toaster.confirm({
            title: 'Logout',
            message: 'Are you sure you want to logout?',
            okButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(r => {
            if (r) {
                this.store.dispatch(this._loginActions.logout());
                this.routerExtensions.router.navigateByUrl('/login', { clearHistory: true });
            }
        });
    }
}

import { Component, ViewChild } from '@angular/core';
import { MyDrawerItem } from '../../../shared/my-drawer-item/my-drawer-item';
import { Observable } from 'rxjs/Observable';
import { RadSideDrawerComponent } from 'nativescript-pro-ui/sidedrawer/angular';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { DrawerTransitionBase } from 'nativescript-pro-ui/sidedrawer';

@Component({
  selector: 'ns-create-currencies',
  moduleId: module.id,
  templateUrl: './create-currencies.component.html'
})

export class CreateCurrenciesComponent {

  public navItemObj$: Observable<MyDrawerItem[]>;
  @ViewChild("drawer") public drawerComponent: RadSideDrawerComponent;
  private _sideDrawerTransition: DrawerTransitionBase;
  constructor(private store: Store<AppState>) {
    this.navItemObj$ = this.store.select(p => p.general.navDrawerObj).map(p => {
      for (const iterator of p) {
        if (iterator.router) {
          if (iterator.router === '/settings') {
            iterator.isSelected = true;
          } else {
            iterator.isSelected = false;
          }
        }
      }
      return p;
    });
  }

  public get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  public onDrawerButtonTap(): void {
    this.drawerComponent.sideDrawer.showDrawer();
  }

}

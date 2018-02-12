import { Component } from '@angular/core';
import {RouterExtensions} from "nativescript-angular";

@Component({
  selector: 'ns-reports',
  moduleId: module.id,
  templateUrl: './reports.component.html',
})

export class ReportsComponent {
  public pageTitle: string = 'Profit And Loss';
  constructor(private _routerExtension: RouterExtensions) {

  }

  goBack() {
    this._routerExtension.navigate(['/home']);
  }

  pageChanged(args) {
    this.pageTitle = args.index === 0 ? 'Profit And Loss' : 'Balance Sheet';
  }
}

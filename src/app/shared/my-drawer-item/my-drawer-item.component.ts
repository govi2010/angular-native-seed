import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { MyDrawerItem } from "./my-drawer-item";

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

  constructor(private routerExtensions: RouterExtensions) {

  }

  ngOnInit(): void {
  }
  onNavItemTap(): void {
    this.itemSelected.emit();
  }
}

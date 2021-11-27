import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'dashboardtest.component.html',
  styleUrls: [ './dashboardtest.component.scss']
})
export class DashboardComponentTest implements OnInit {
  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  constructor() { }

  ngOnInit(): void {
  }
}

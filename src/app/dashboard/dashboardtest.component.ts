import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Carts } from '../models/cart';
import { DataService } from '../services/data.service';
import { RestApiService } from '../services/rest-api.service';

@Component({
  templateUrl: 'dashboardtest.component.html',
  styleUrls: [ './dashboardtest.component.scss']
})
export class DashboardComponentTest implements OnInit {
  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  oder1!: Carts[];
  count:number
  count1!: Carts;
  btnDisabled = false;
  url = 'http://localhost:3000/api/v1/admin/oder'
  url1 = 'http://localhost:3000/api/v1/admin/oder/count/confimed'
  deleteId!: string;
  confirmMessage = '';
  key = '';
  size = 5;
  sizes = 5;
  page = 1;
  pages = 1;
  total=0;
  constructor(private rest: RestApiService,
    private data: DataService,
    private modalService: NgbModal) {

  }
  search(keys: string) {
    if (keys !== '') {
      this.key = keys;
      this.ngOnInit();
    }
  }
  Loadpage(pages: number) {
    console.log(pages)
    if (pages > 0) {
      this.page = pages;
      this.pages = pages
      this.ngOnInit()
    }
  }
  Loadsize(sizes:number){
    console.log(sizes)
    if(sizes>4){
      this.size=sizes;
      this.sizes=sizes;
      this.ngOnInit();
    }
  }
  ngOnInit() {
    this.btnDisabled = true;
    this.rest.getOder(this.url, this.page, this.size, 'success').then(data => {
      this.oder1 = (data as { oder: Carts[] }).oder;
      for (let index = 0; index < this.oder1.length; index++) {
        const element = this.oder1[index];
        this.total += element.total
      }
      this.btnDisabled = false;
      console.log(this.oder1);
    })
    this.rest.get(this.url1).then(data => {
      let value = data as { count:number}
      this.count= value.count;
      this.btnDisabled = false;
      console.log(this.count);
      console.log(value);
    })
  }
}

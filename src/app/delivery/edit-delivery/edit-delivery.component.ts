
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { DataService } from 'src/app/services/data.service';
import { Oder } from 'src/app/models/oder';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-delivery',
  templateUrl: './edit-delivery.component.html',
  styleUrls: ['./edit-delivery.component.css']
})
export class EditDeliveryComponent implements OnInit {

  doing=false;
  oder: Oder;
  url1='http://localhost:3000/api/v1/admin/oder/edit'
  @Input("id")
  editId!: string;

  @Output()
  updateFinished: EventEmitter<string> = new EventEmitter<string>();

  constructor(private modelService: NgbModal,
    private rest:RestApiService,
    private data: DataService,
    private router: Router,) {
      this.oder= new Oder;

     }
     
  ngOnInit() {
    this.doing=true;
    this.rest.getOne(this.url1,this.editId)
      .then(data =>{
        this.doing=false;
        this.oder =(data as {oder: Oder}).oder;
      }).catch(error =>{
        this.doing =false;
        this.data.error(error['message'])
      });
  }
  open(content: TemplateRef<any>){
    this.modelService.open(content, {ariaDescribedBy: 'modal-basic-title'});
  }
  update(){
    this.doing=true;
    this.rest.put(this.url1,this.editId,this.oder)
      .then(data =>{
          this.doing=false;
          this.modelService.dismissAll();
          this.ngOnInit()
          this.router.navigate(['/dashboerd'])
        
      }).catch(error =>{
        this.doing =false;
        this.data.error(error['message'])
      });
     
    }

}

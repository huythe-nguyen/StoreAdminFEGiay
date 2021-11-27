import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from 'src/app/shared/image.service';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styles: []
})
export class ImageComponent implements OnInit {
  items: Observable<any[]>;
  id: string;
  url: []
  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  itemsRef: AngularFirestoreCollection;
  Caption = '';

  formTemplate = new FormGroup({
    caption: new FormControl('', Validators.required),
    category: new FormControl(''),
    imageUrl: new FormControl('', Validators.required)
  })

  constructor(private service: ImageService, private db: AngularFirestore, private storage: AngularFireStorage) {
    this.itemsRef = db.collection('items')
    this.items = this.itemsRef.valueChanges();
  }

  ngOnInit() {
    this.resetForm();
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      this.imgSrc = '/assets/img/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }
  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      var filePath = `${formValue.category}/${this.selectedImage.name.split('.').slice(1, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imageUrl'] = url;
            this.service.insertImageDetails(formValue);
            this.resetForm();
          })
        })
      ).subscribe();
      console.log(filePath)
      console.log(fileRef)
      console.log(finalize)
      this.itemsRef.add({
        title: this.Caption
      })
        .then( resp => {

          const imageUrl = this.uploadFile(resp.id, this.selectedImage)

          this.itemsRef.doc(resp.id).update({
            id: resp.id,
            imageUrl: [imageUrl] || null
          })
          this.id = resp.id;
          console.log(imageUrl)
          console.log(resp.id)
        }).catch(error => {
          console.log(error);
        })
    }
  }
  async uploadFile(id, file): Promise<any> {
    if (file && file.length) {
      try {
        const task = await this.storage.ref('images').child(id).put(file[0])
        return this.storage.ref(`images/${id}`).getDownloadURL().toPromise();
      } catch (error) {
        console.log(error);
      }
    }
  }
  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      caption: '',
      imageUrl: '',
      category: 'Animal'
    });
    this.imgSrc = '/assets/img/image_placeholder.jpg';
    this.selectedImage = null;
    this.isSubmitted = false;
  }

}

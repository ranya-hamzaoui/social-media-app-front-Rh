import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  @Output('newPost') newPost = new EventEmitter<Boolean>();

  fileToUpload: Array<File> = [];
  description : string = '';
  postPicture! : File ;


  constructor(private postService: PostService, private toastService:ToastrService) {}
  ngOnInit(): void {}

  HandleFile(event: any) {
    this.fileToUpload = <Array<File>>event.target.files;
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.postPicture = event.target.result;
      };
    }
  }
  savePostWithPicture() :void {
    if (!this.fileToUpload || !this.description) {
      this.toastService.error('Please provide a description and select a file.');
      return;
    }
    let formdata = new FormData();
    formdata.append('content', this.description);
    formdata.append('file', this.fileToUpload[0]);

    this.postService.createPost(formdata).subscribe(
      (res: any) => {
        this.toastService.success('Post Added with Succefuly')
        this.newPost.emit(true);
      },
      (err: any) => {
        console.error('Error creating post:', err);
        this.toastService.error('Fail to Add Post')
      }
    );
    this.description = '';
    this.fileToUpload = [];
  }

  savePost() : void {
    if (!this.description) {
      this.toastService.error('Please provide a description.');
      return;
    }
    let data = {description : this.description}
    this.postService.createPost(data).subscribe(
      (res: any) => {
        this.newPost.emit(true);
        this.toastService.success('Post added successfully.')
      },
      (err: any) => {
        this.toastService.error('Failed to add Post.')
      }
    );
  }

  private resetForm(): void {
    this.description = '';
    // this.fileToUpload = null;
    // this.postPicture = null;
  }
}

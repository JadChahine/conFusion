import { Component,  OnInit, Input, ViewChild } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dishIds: number[];
  prev: number;
  next: number;
  errMess: string;


  newComment = { author: '', comment: '', rating: 5 };
  dish: Dish;
  commentFormGroup: FormGroup;

  @ViewChild('commentForm') commentFormDirective;

  constructor(private dishservice: DishService,
             private route: ActivatedRoute,
             private location: Location,
             private fb: FormBuilder) { 
      this.createForm();
    }

  createForm(){
    this.commentFormGroup = this.fb.group(
      {
        author: [ this.newComment.author, [Validators.required, Validators.minLength(2)] ],
        comment: [ this.newComment.comment , Validators.required] ,
        rating : this.newComment.rating
      }
    )
    
    this.commentFormGroup.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }
  
  formErrors = {
    'author': '',
    'comment': '',
    'rating': 5
  };

  validationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.',
    },
    'comment': {
      'required':      'Comment is required.',
    }
  };

  ngOnInit() {

    this.dishservice.getDishIds()
    .subscribe(dishIds => this.dishIds = dishIds,
      errmess => this.errMess = <any>errmess);

    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(+params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId: number) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.newComment = this.commentFormGroup.value;
  
    this.addNewComment()

    this.commentFormDirective.resetForm();

    this.commentFormGroup.reset({
      author: '',
      comment: '',
      rating: 5
    });
  }

  addNewComment(){
    var cmnt = new Comment();
    cmnt.rating = this.newComment.rating;
    cmnt.comment = this.newComment.comment,
    cmnt.author = this.newComment.author,
    cmnt.date = new Date().toISOString()

    console.log("New comment submitted => " + cmnt)

    this.dish.comments.push(cmnt)
  }

  onValueChanged(data?: any) {
    if (!this.commentFormGroup) { return; }
    const form = this.commentFormGroup;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}

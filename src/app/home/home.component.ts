import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  
  errMess: string;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    /*this.dish = this.dishservice.getFeaturedDish();
    this.promotion = this.promotionservice.getFeaturedPromotion();
    this.leader = this.leaderService.getFeaturedLeader();*/

    /*
    this.dishservice.getFeaturedDish().then(dish => this.dish == dish);
    this.promotionservice.getFeaturedPromotion().then(promotion => this.promotion == promotion);
    this.leaderService.getFeaturedLeader().then(leader => this.leader == leader);
    */

    
   this.dishservice.getFeaturedDish()
   .subscribe(dish => this.dish = dish,
     errmess => this.errMess = <any>errmess);

    this.promotionservice.getFeaturedPromotion()
    .subscribe(promotion => this.promotion = promotion,
      errmess => this.errMess = <any>errmess);

    this.leaderService.getFeaturedLeader()
    .subscribe(leader => this.leader = leader,
      errmess => this.errMess = <any>errmess);
  }

}
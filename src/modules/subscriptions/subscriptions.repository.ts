import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "src/entities/Subscription.entity";
import { Repository } from "typeorm";

@Injectable()
export class SubscriptionsRepository {
  constructor(@InjectRepository(Subscription) private subscriptionsRepository: Repository<Subscription>) {}

}  
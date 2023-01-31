import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CreateItemRequestDTO } from 'src/item/dto/request/create-item-request.dto';
import { ItemEntity } from 'src/item/entity/item.entity';
import { ItemService } from 'src/item/item.service';

@Injectable()
export class DashboardItemService {

  constructor(private readonly itemService: ItemService) {}

  public async findItems(): Promise<ItemEntity[]> {
    return await this.itemService.findItems();
  }

  public async findItemByIDOrCry(id: number): Promise<ItemEntity> {
    return await this.itemService.findItemByIDOrCry(id);
  }

  public async createItem(createItemRequestDTO: CreateItemRequestDTO): Promise<void> {
    await validateOrReject(createItemRequestDTO);

    await this.itemService.createItem(createItemRequestDTO); 
  }

  public async deleteItem(itemId: number): Promise<void> {
    await this.itemService.deleteItem(itemId); 
  }

}

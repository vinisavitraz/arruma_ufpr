import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CreateItemRequestDTO } from 'src/item/dto/request/create-item-request.dto';
import { UpdateItemRequestDTO } from 'src/item/dto/request/update-item-request.dto';
import { ItemEntity } from 'src/item/entity/item.entity';
import { ItemService } from 'src/item/item.service';
import { LocationEntity } from 'src/location/entity/location.entity';
import { LocationService } from 'src/location/location.service';
import { ItemsPageContent } from '../content/items-page.content';
import { SearchItemsRequestDTO } from '../dto/request/search-items-request.dto';

@Injectable()
export class DashboardItemService {

  constructor(
    private readonly itemService: ItemService,
    private readonly locationService: LocationService,
  ) {}

  public async findTotalItems(): Promise<number> {
    return await this.itemService.findTotalItems();
  }

  public async findLocations(): Promise<LocationEntity[]> {
    return await this.locationService.findLocations();
  }

  public async findItems(): Promise<ItemEntity[]> {
    return await this.itemService.findItems();
  }

  public async searchItems(
    itemsPageContent: ItemsPageContent,
  ): Promise<ItemEntity[]> {
    return await this.itemService.searchItems(SearchItemsRequestDTO.fromPageContent(itemsPageContent));
  }

  public async findItemsByLocationID(locationId: number): Promise<ItemEntity[]> {
    return await this.itemService.findItemsByLocationID(locationId);
  }

  public async findItemByIDOrCry(id: number): Promise<ItemEntity> {
    return await this.itemService.findItemByIDOrCry(id);
  }

  public async createItem(createItemRequestDTO: CreateItemRequestDTO): Promise<void> {
    await validateOrReject(createItemRequestDTO);

    await this.itemService.createItem(createItemRequestDTO); 
  }

  public async updateItem(updateItemRequestDTO: UpdateItemRequestDTO): Promise<void> {
    await validateOrReject(updateItemRequestDTO);

    await this.itemService.updateItem(updateItemRequestDTO); 
  }

  public async deleteItem(itemId: number): Promise<void> {
    await this.itemService.deleteItem(itemId); 
  }

}

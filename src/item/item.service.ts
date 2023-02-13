import { HttpStatus, Injectable } from '@nestjs/common';
import { item, location } from '@prisma/client';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { SearchItemsRequestDTO } from 'src/dashboard/dto/request/search-items-request.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateItemRequestDTO } from './dto/request/create-item-request.dto';
import { UpdateItemRequestDTO } from './dto/request/update-item-request.dto';
import { ItemEntity } from './entity/item.entity';
import { ItemRepository } from './item.repository';

@Injectable()
export class ItemService {

  private repository: ItemRepository;

  constructor(private databaseService: DatabaseService) {
      this.repository = new ItemRepository(this.databaseService);
  }

  public async findItems(): Promise<ItemEntity[]> {
    const itemsDb: (item & { location: location })[] = await this.repository.findItems();

    return itemsDb.map((item: item & { location: location }) => {
      return ItemEntity.fromRepository(item);
    });
  }

  public async searchItems(searchItemsRequestDTO: SearchItemsRequestDTO): Promise<ItemEntity[]> {    
    const itemsDb: (item & { location: location })[] = await this.repository.searchItems(
      searchItemsRequestDTO
    );

    return itemsDb.map((item: item & { location: location }) => {
      return ItemEntity.fromRepository(item);
    });
  }

  public async findItemsByLocationID(locationId: number): Promise<ItemEntity[]> {
    const itemsDb: (item & { location: location })[] = await this.repository.findItemsByLocationID(locationId);

    return itemsDb.map((item: item & { location: location }) => {
      return ItemEntity.fromRepository(item);
    });
  }
  
  public async findItemByIDOrCry(id: number): Promise<ItemEntity> {
    const itemDb: item & { location: location } | null = await this.repository.findItemByID(id);

    if (!itemDb) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'Item with ID ' + id + ' not found on database.', 
        HttpOperationErrorCodes.LOCATION_NOT_FOUND,
      );
    }

    return ItemEntity.fromRepository(itemDb);
  }

  public async createItem(createItemRequestDTO: CreateItemRequestDTO): Promise<ItemEntity> {
    const itemDb: item & { location: location } = await this.repository.createItem(createItemRequestDTO);

    return ItemEntity.fromRepository(itemDb);
  }

  public async updateItem(updateItemRequestDTO: UpdateItemRequestDTO): Promise<ItemEntity> {
    await this.findItemByIDOrCry(updateItemRequestDTO.id);

    const itemDb: item & { location: location } = await this.repository.updateItem(updateItemRequestDTO);

    return ItemEntity.fromRepository(itemDb);
  }

  public async deleteItem(itemId: number): Promise<void> {
    const item: ItemEntity = await this.findItemByIDOrCry(itemId);

    await this.repository.deleteItem(item);
  }

  public async findTotalItems(): Promise<number> {
    return await this.repository.findTotalItems();
  }

}

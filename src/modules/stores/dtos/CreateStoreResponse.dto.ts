import { Admin } from 'src/entities/Admin.entity';

export class CreateStoreResponseDto {
  id: string;
  name: string;
  address: string;
  img_store: string;
  admin: Omit<Admin, 'password' | 'google_id' | 'created_at' | 'country' | "users" | "email" | "phone" | "stores">;

  constructor(store: any) {
    this.id = store.id;
    this.name = store.name;
    this.address = store.address;
    this.img_store = store.img_store;
    this.admin = {
      id: store.admin.id,
      name: store.admin.name,
      img_profile: store.admin.img_profile,
      status: store.admin.status,
      subscription: store.admin.subscription
    };
  }
}

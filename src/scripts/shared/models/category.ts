import { Entity } from './entity';

export class Category extends Entity {
    public name: string;

    constructor(
        id: string,
        name: string
    ) {
        super(id);
        this.name = name;
    }
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pessoa {
    @PrimaryGeneratedColumn("increment")
    "id": number;

    @Column()
    "nome": string;

    @Column()
    "idade": number;
}

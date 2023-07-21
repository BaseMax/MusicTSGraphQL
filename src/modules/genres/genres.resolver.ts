import { injectable } from "tsyringe";
import {
    Mutation,
    Root,
    Query,
    FieldResolver,
    Resolver,
    Arg,
    Authorized,
} from "type-graphql";
import { CurrentUser } from "../auth/current-user.decorator";
import { Role } from "../users/user.model";
import { CreateGenreInput } from "./dto/create-genre.input";
import { UpdateGenreInput } from "./dto/update-genre.input";
import { Genre } from "./genre.model";
import { GenresService } from "./genres.service";

@injectable()
@Resolver(() => Genre)
export class GenresResolver {
    constructor(private service: GenresService) {}
    @Query(() => [Genre])
    public genres() {
        return this.service.getAll();
    }

    @Query(() => Genre, { nullable: true })
    public genre(@Arg("id") id: string) {
        return this.service.getById(id);
    }

    @Authorized([Role.admin, Role.superadmin])
    @Mutation(() => Genre)
    public createGenre(@Arg("input") input: CreateGenreInput) {
        return this.service.create(input);
    }

    @Mutation(() => Genre)
    @Authorized([Role.admin, Role.superadmin])
    public updateGenre(@Arg("input") input: UpdateGenreInput) {
        return this.service.update(input);
    }

    @FieldResolver()
    musicCount(@Root() genre: Genre) {
        return this.service.countMusics(genre.id);
    }
}

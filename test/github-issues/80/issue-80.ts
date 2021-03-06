import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src/connection/Connection";
import {Post} from "./entity/Post";
import {expect} from "chai";

describe("github issues > #80 repository.persist fails when empty array is sent to the method", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchemaOnConnection: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should persist successfully and return persisted entity", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "Hello Post #1";
        const returnedPost = await connection.entityManager.persist(post);

        expect(returnedPost).not.to.be.empty;
        returnedPost.should.be.equal(post);
    })));

    it("should not fail if empty array is given to persist method", () => Promise.all(connections.map(async connection => {
        const posts: Post[] = [];
        const returnedPosts = await connection.entityManager.persist(posts);
        expect(returnedPosts).not.to.be.undefined;
        returnedPosts.should.be.equal(posts);
    })));

});

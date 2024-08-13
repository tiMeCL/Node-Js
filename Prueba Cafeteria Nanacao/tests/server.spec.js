const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {

    it ('GET /cafes - Retorna status 200 y el tipo de dato es array con al menos 1 objeto', async () => {
        const { body: cafes, statusCode } = await request(server).get("/cafes").send();

        expect(statusCode).toBe(200);
        expect(cafes).toBeInstanceOf(Array);
        expect(cafes[0]).toBeInstanceOf(Object);
        expect(cafes.length).toBeGreaterThan(0);
    });
    
    it('DELETE /cafes:id - Se obtiene 404 al intentar eliminar un cafe con un id que no existe', async () => {
        const jwt = "jsonwebtoken";
        const { statusCode } = await request(server).delete("/cafes/999").set("Authorization", jwt).send();

        expect(statusCode).toBe(404);
    });

    it('POST /cafes - Se obtiene 201 al agregar un cafe', async () => {
        const id = Math.floor(Math.random() * 999);
        const addCafe = { id, nombre: "Test cafe" };
        const { body: cafes, statusCode } = await request(server).post("/cafes").send(addCafe);

        expect(statusCode).toBe(201);
        expect(cafes).toContainEqual(addCafe);
    });

    it('PUT /cafes:id - Se obtiene status 400 al intentar actualizar un cafe enviando un id en los parámetros que sea diferente al id dentro del payload', async () => {
        const idParameters = 6;
        const idPayload = 7;
        const updateCafe = { id: idPayload, nombre: "Test update cafe" };
        const { statusCode } = await request(server).put(`/cafes/${idParameters}`).send(updateCafe);

        expect(statusCode).toBe(400);
    });

});

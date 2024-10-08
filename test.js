const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const server = require('../finalDrillingM6S8/index');

chai.use(chaiHttp);

describe('Esta es la descripción del caso de prueba: API de Animes', () => {

    describe('GET /anime', () => {
        it('debería obtener todos los animes', (done) => {
            chai.request(server)
                .get('/anime')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });

    it('debería obtener un anime por id', (done) => {
        const id = 'some-id'; // Reemplaza con un id válido
        chai.request(server)
            .get(`/anime?id=${id}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('debería obtener un anime por nombre', (done) => {
        const nombre = 'some-name'; // Reemplaza con un nombre válido
        chai.request(server)
            .get(`/anime?nombre=${nombre}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });
});

describe('POST /anime', () => {
    it('debería agregar un nuevo anime', (done) => {
        const nuevoAnime = {
            "nombre": "One Piece",
            "genero": "Shonen",
            "año": "1997",
            "autor": "Eiichiro Oda"
        };

        chai.request(server)
            .post('/anime')
            .send(nuevoAnime)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Anime agregado exitosamente');
                done();
            });
    });
});

    // Test para PUT /anime
    describe('PUT /anime', () => {
        it('debería actualizar un anime existente', (done) => {
            const id = 'some-id'; // Reemplaza con un id válido
            const datosActualizados = {
                nombre: 'Naruto Shippuden'
            };
            chai.request(server)
                .put(`/anime?id=${id}`)
                .send(datosActualizados)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Los datos han sido modificados exitosamente');
                    done();
                });
        });
    });

    // Test para DELETE /anime
    describe('DELETE /anime', () => {
        it('debería eliminar un anime existente', (done) => {
            const id = 'some-id'; // Reemplaza con un id válido
            chai.request(server)
                .delete(`/anime?id=${id}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('El anime ha sido eliminado exitosamente');
                    done();
                });
        });
    });
});




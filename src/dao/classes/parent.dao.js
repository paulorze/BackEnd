export default class Parent {
    constructor (model) {
        this.model = model;
    };

    create = async (object)=> {
        try {
            const result = await this.model.create(object);
            return result;
        } catch (error) {
            throw new Error ('500 INTERNAL SERVER ERROR: Error al guardar el objeto.');
        };
    };

    readAll = async() => {
        // ? MODIFICAR PARA QUE SEA PAGINATE???
        try {            
            const objectList = await this.model.find().lean();
            return objectList;
        } catch {
            throw new Error ('500 INTERNAL SERVER ERROR: Error al cargar los objetos.');
        };
    };

    readAllPaginated = async(limit, page)=>{
        if (isNaN(limit) || limit <= 0){
            throw new Error('Por favor, ingrese una cantidad a mostrar valida.');
        };
        if (isNaN(page) || page <= 0){
            throw new Error('Por favor, ingrese una pagina a mostrar valida.');
        };
        try {
            const objectList = await this.model.paginate({}, {limit, page, lean: true});
            return objectList;
        } catch {
            throw new Error ('500 INTERNAL SERVER ERROR: Error al cargar los objetos.');
        };
    };

    readByID = async(id)=> {
        try {
            const object = await this.model.findOne({_id: id}).lean();
            if (!object) {
                throw new Error(`404 NOT FOUND: El objeto con ID ${id} no existe.`)
            };
            return object;
        } catch {
            throw new Error ('500 INTERNAL SERVER ERROR: Error al cargar los objetos.');
        };
    };

    update = async (id, object) => {
        const result = await this.model.findOneAndUpdate({ _id: id }, object, { new: true });
        return result;
    };

    delete = async (id) => {
        try {
            const result = await this.model.deleteOne({_id: id});
            return result;
        } catch (error) {
            throw new Error ('500 INTERNAL SERVER ERROR: Error al eliminar el objeto.');
        };
    };
};
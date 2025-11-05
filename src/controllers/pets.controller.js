import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";

import EErrors from "../utils/errors/enum.js";
import CustomError from "../utils/errors/CustomError.js";
import { generatePetValidationCause } from "../utils/errors/info.js";
import mongoose from "mongoose";
import { logger } from "../config/logger.js"; // Importamos el logger

// helper local para validar llamadas a BD con datos invalidos return 400 (INVALID_TYPES_ERROR)
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * GET /api/pets
 */
const getAllPets = async (req, res, next) => {
  try {
    const pets = await petsService.getAll();
    logger.info(`[getAllPets] Número de mascotas retornadas: ${pets.length}`);
    res.send({ status: "success", payload: pets });
  } catch (error) {
    logger.error("[getAllPets] Error al obtener mascotas", { error });
    error.code ||= EErrors.DATABASE_ERROR;
    next(error);
  }
};

/**
 * POST /api/pets
 * Body requerido: { name, specie, birthDate }
 */
const createPet = async (req, res, next) => {
  try {
    const { name, specie, birthDate } = req.body || {};

    if (!name || !specie || !birthDate) {
      return next(
        CustomError.create({
          name: "PetValidationError",
          message: "Valores incompletos para crear mascota",
          cause: generatePetValidationCause(req.body || {}),
          code: EErrors.VALIDATION_ERROR,
        })
      );
    }

    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const result = await petsService.create(pet);
    logger.info(`[createPet] Mascota creada con ID ${result._id}`);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    logger.error("[createPet] Error al crear mascota", { error });
    error.code ||= EErrors.DATABASE_ERROR;
    next(error);
  }
};

/**
 * PUT /api/pets/:pid
 * Body: campos a actualizar (no vacío)
 */
const updatePet = async (req, res, next) => {
  try {
    const petId = req.params.pid;
    const petUpdateBody = req.body || {};

    if (!isValidObjectId(petId)) {
      return next(
        CustomError.create({
          name: "InvalidIdError",
          message: `Parametro 'pid' no es un ObjectId válido`,
          cause: `pid=${petId}`,
          code: EErrors.INVALID_TYPES_ERROR,
        })
      );
    }

    if (Object.keys(petUpdateBody).length === 0) {
      return next(
        CustomError.create({
          name: "EmptyUpdateError",
          message: "No se recibieron campos para actualizar",
          cause: `payload vacío`,
          code: EErrors.VALIDATION_ERROR,
        })
      );
    }

    const exists = await petsService.getBy({ _id: petId });
    if (!exists) {
      return next(
        CustomError.create({
          name: "PetNotFound",
          message: "Mascota no encontrada",
          cause: `pid=${petId}`,
          code: EErrors.NOT_FOUND_ERROR,
        })
      );
    }

    await petsService.update(petId, petUpdateBody);
    logger.info(`[updatePet] Mascota ${petId} actualizada`);
    res.send({ status: "success", message: "pet updated" });
  } catch (error) {
    logger.error(`[updatePet] Error al actualizar la mascota ${req.params.pid}`, {
      error,
    });
    error.code ||= EErrors.DATABASE_ERROR;
    next(error);
  }
};

/**
 * DELETE /api/pets/:pid
 */
const deletePet = async (req, res, next) => {
  try {
    const petId = req.params.pid;

    if (!isValidObjectId(petId)) {
      return next(
        CustomError.create({
          name: "InvalidIdError",
          message: `Parametro 'pid' no es un ObjectId válido`,
          cause: `pid=${petId}`,
          code: EErrors.INVALID_TYPES_ERROR,
        })
      );
    }

    const exists = await petsService.getBy({ _id: petId });
    if (!exists) {
      return next(
        CustomError.create({
          name: "PetNotFound",
          message: "Mascota no encontrada",
          cause: `pid=${petId}`,
          code: EErrors.NOT_FOUND_ERROR,
        })
      );
    }

    await petsService.delete(petId);
    logger.info(`[deletePet] Mascota ${petId} eliminada`);
    res.send({ status: "success", message: "pet deleted" });
  } catch (error) {
    logger.error(`[deletePet] Error al eliminar mascota ${req.params.pid}`, {
      error,
    });
    error.code ||= EErrors.DATABASE_ERROR;
    next(error);
  }
};

/**
 * POST /api/pets/withimage
 * FormData requerido: fields { name, specie, birthDate } + file 'image'
 */
const createPetWithImage = async (req, res, next) => {
  try {
    const file = req.file;
    const { name, specie, birthDate } = req.body || {};

    if (!name || !specie || !birthDate) {
      return next(
        CustomError.create({
          name: "PetValidationError",
          message: "Valores incompletos para crear mascota con imagen",
          cause: generatePetValidationCause(req.body || {}),
          code: EErrors.VALIDATION_ERROR,
        })
      );
    }

    if (!file) {
      return next(
        CustomError.create({
          name: "MissingFileError",
          message: "No se recibió archivo 'image' en el formulario",
          cause: "req.file undefined",
          code: EErrors.VALIDATION_ERROR,
        })
      );
    }

    const pet = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/img/${file.filename}`,
    });

    const result = await petsService.create(pet);
    logger.info(`[createPetWithImage] Mascota creada con ID ${result._id} y imagen ${file.filename}`);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    logger.error("[createPetWithImage] Error al crear mascota con imagen", {
      error,
    });
    error.code ||= EErrors.DATABASE_ERROR;
    next(error);
  }
};

export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};

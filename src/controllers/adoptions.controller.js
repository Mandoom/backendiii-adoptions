import { adoptionsService, petsService, usersService } from "../services/index.js";
import mongoose from 'mongoose';

const getAllAdoptions = async (req, res) => {
  const result = await adoptionsService.getAll();
  res.send({ status: "success", payload: result });
};

const getAdoption = async (req, res) => {
  const { aid } = req.params;
  // validar ID de adopción
  if (!mongoose.Types.ObjectId.isValid(aid)) {
    return res.status(400).send({ status: 'error', error: 'Invalid Adoption ID' });
  }
  const adoption = await adoptionsService.getBy({ _id: aid });
  if (!adoption) {
    return res.status(404).send({ status: 'error', error: 'Adoption not found' });
  }
  res.send({ status: 'success', payload: adoption });
};

const createAdoption = async (req, res) => {
  const { uid, pid } = req.params;
  // validar ids de usuario y mascota
  if (!mongoose.Types.ObjectId.isValid(uid) || !mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(404).send({ status: 'error', error: 'Invalid UID or PID' });
  }

  const user = await usersService.getUserById(uid);
  if (!user) {
    return res.status(404).send({ status: "error", error: "user Not found" });
  }

  const pet = await petsService.getBy({ _id: pid });
  if (!pet) {
    return res.status(404).send({ status: "error", error: "Pet not found" });
  }
  if (pet.adopted) {
    return res.status(400).send({ status: "error", error: "Pet is already adopted" });
  }

  // asignar mascota al usuario y marcar como adoptada
  user.pets.push(pet._id);
  await usersService.update(user._id, { pets: user.pets });
  await petsService.update(pet._id, { adopted: true, owner: user._id });

  // registrar la adopción
  await adoptionsService.create({ owner: user._id, pet: pet._id });
  res.send({ status: "success", message: "Pet adopted" });
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};

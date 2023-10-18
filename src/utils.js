// Esto es para poder acceder a los archivos por su ubicacion sin problemas
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Esto es para hashear las passwords
import bcrypt from 'bcrypt';

// Esto es para poder acceder a los archivos por su ubicacion sin problemas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

// Esto es para hashear las passwords
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user);


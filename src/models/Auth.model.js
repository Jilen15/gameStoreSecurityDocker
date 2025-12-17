import bcrypt from "bcrypt";

class AuthModel {

    static async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }

    static async comparePassword(password, hashed) {
        return bcrypt.compare(password, hashed);
    }
}

export default AuthModel;

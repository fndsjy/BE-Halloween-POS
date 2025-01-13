const ApplicationController = require("./ApplicationController");

class AuthenticationController extends ApplicationController {
  constructor({
    userModel,
    bcrypt,
    jwt,
  }) {
    super();
    this.userModel = userModel;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
  }

  handleRegister = async (req, res) => {
    try {
      const { nama_depan, nama_belakang, email, password, gender, tanggal_lahir } = req.body;

      // Cek apakah email sudah terdaftar
      const existingUser = await this.userModel.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Buat user baru
      const user = await this.userModel.create({
        nama_depan,
        nama_belakang,
        email,
        password,
        gender,
        tanggal_lahir,
      });

      res.status(201).json({
        status: 'OK',
        message: 'Registration successful',
        data: user,
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to register user', error: err.message });
    }
  };

  handleLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Cek apakah user ada
      const user = await this.userModel.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verifikasi password
      const isPasswordCorrect = this.verifyPassword(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Incorrect password' });
        console.log("Password Input:", password);
        console.log("Encrypted Password:", user.password);
        console.log("Password Match:", isPasswordCorrect);
      }
      
      // Buat token
      const token = this.jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SIGNATURE_KEY || 'secret',
        { expiresIn: '1d' }
      );

      res.status(200).json({
        status: 'OK',
        message: 'Login successful',
        accessToken: token,
      });
        console.log("Password Input:", password);
        console.log("Encrypted Password:", user.password);
        console.log("Password Match:", isPasswordCorrect);
    } catch (err) {
      res.status(500).json({ message: 'Login failed', error: err.message });
    }
  };

  // Middleware untuk autentikasi
  authorize = () => {
    return (req, res, next) => {
      try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
          return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }

        const token = bearerToken.split('Bearer ')[1];
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized - Invalid token format' });
        }

        // Remove the extra 'this'
        const payload = this.decodeToken(token);
        req.userId = payload.userId;
        next();
      } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ message: 'Invalid or expired token', error: err.message });
      }
    };
  };

  // Get all users
  handleGetAllUsers = async (req, res) => {
    try {
      const users = await this.userModel.findAll({
        attributes: ['userId', 'nama_depan', 'nama_belakang', 'email', 'gender', 'tanggal_lahir'],
      });

      res.status(200).json({
        status: 'OK',
        data: users,
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to get users data', error: err.message });
    }
  };

  // Get user data
  handleGetUser = async (req, res) => {
    try {
        console.log('req.user', req.userId);
      const user = await this.userModel.findByPk(req.userId, {
        attributes: ['userId', 'nama_depan', 'nama_belakang', 'email', 'gender', 'tanggal_lahir'],
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        status: 'OK',
        data: user,
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to get user data', error: err.message });
    }
  };

  decodeToken(token) {
    return this.jwt.verify(token, process.env.JWT_SIGNATURE_KEY || 'secret');
  }

  encryptPassword = (password) => {
    return this.bcrypt.hashSync(password, 10);
  }

  verifyPassword = (password, encryptedPassword) => {
        console.log("Password Input:", password);
        console.log("Encrypted Password:", encryptedPassword);
        const isMatch = this.bcrypt.compareSync(password, encryptedPassword);
        console.log("Password Match:", isMatch);
        return isMatch;
    // return this.bcrypt.compareSync(password, encryptedPassword)
  }
}

module.exports = AuthenticationController;
